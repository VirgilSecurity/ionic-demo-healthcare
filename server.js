const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const { body: checkBody, validationResult, oneOf } = require('express-validator/check');
const buildResponse = require('./server/saml/build-response');
const getIonicAssertion = require('./server/get-ionic-assertion');
const debug = require('./server/debug');
const IonicClient = require('./server/ionic/client');
const UserService = require('./server/ionic/user-service');
const PREDEFINED_GROUPS = require('./server/ionic/predefined-groups');

dotenv.config();

const app = express();

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());

let state = {};

app.post(
  '/register',
  [
    checkBody('email').isEmail(),
    checkBody('groupName').isIn(Object.keys(PREDEFINED_GROUPS)),
    checkBody('firstName').isAlpha().isLength({ max: 256 }),
    checkBody('lastName').isAlpha().isLength({ max: 256 })
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid request body',
        errors: validationErrors.array().map(({ msg: message, param }) => ({ param, message }))
      });
    }

    const { firstName, lastName, email, groupName } = req.body;

    const userService = new UserService(
      new IonicClient({
        baseUrl: process.env.IONIC_API_BASE_URL,
        tenantId: process.env.IONIC_TENANT_ID,
        authToken: process.env.IONIC_API_AUTH_TOKEN
      })
    );

    debug('fetching user');
    let user;
    try {
      user = await userService.getOrCreateUser({ email, groupName, firstName, lastName });
      debug('user fetched');
    } catch (err) {
      debug('error fetching user %o', err);
      const message = typeof err.body === 'object' && 'message' in err.body ? err.body.message : err.message;
      res.status(500).json({ error: message });
      return;
    }

    debug('generating SAML assertion');
    let samlResponse;

    try {
      samlResponse = buildResponse({
        privateKey: process.env.PRIVATE_KEY,
        userEmail: email,
        recipientUrl: process.env.ENROLLMENT_ENDPOINT,
        recipientName: process.env.ASSERTION_CONSUMER_SERVICE,
        issuer: process.env.IDP_ENTITY_ID
      });
      debug('assertion generated');
    } catch (err) {
      debug('error sending SAML assertion: %o', err);
      res.status(500).json({ error: err.message });
      return;
    }

    debug('getting Ionic assertion');
    let ionicAssertion;
    try {
      ionicAssertion = await getIonicAssertion(process.env.ENROLLMENT_ENDPOINT, samlResponse);
      debug('got Ionic assertion');
    } catch(err) {
      debug('error getting Ionic assertion: %o', err);
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(200).json({ assertion: ionicAssertion, user });
  }
);

app.get('/state', (req, res) => {
  res.json(state);
});

app.put(
  '/state',
  [
    oneOf([
      checkBody('medical_history').not().isEmpty(),
      checkBody('office_visit_notes').not().isEmpty(),
      checkBody('prescription').not().isEmpty(),
      checkBody('insurer_reply').not().isEmpty(),
    ], 'At least one property to update must be specified')
  ],
  (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid request body',
        errors: validationErrors.array().map(({ msg: message, param }) => ({ param, message }))
      });
    }

    const { medical_history, office_visit_notes, prescription, insurer_reply } = req.body;
    const newState = { medical_history, office_visit_notes, prescription, insurer_reply };

    Object.keys(newState).forEach(key => {
      if (newState[key] !== undefined) {
        state[key] = newState[key];
      }
    });

    res.json(state);
  }
)
;
app.delete(
  '/state',
  (req, res) => {
    state = {
        medical_history: undefined,
        office_visit_notes: undefined,
        prescription: undefined,
        insurer_reply: undefined
      };

    res.json(state);
  }
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(8080);
