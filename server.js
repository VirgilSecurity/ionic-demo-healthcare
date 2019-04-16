const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const buildResponse = require('./server/saml/build-response');
const getIonicAssertion = require('./server/get-ionic-assertion');
const debug = require('./server/debug');
const IonicClient = require('./server/ionic/client');

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, groupName } = req.body;

  const client = new IonicClient({
    baseUrl: process.env.IONIC_API_BASE_URL,
    tenantId: process.env.IONIC_TENANT_ID,
    authToken: process.env.IONIC_API_AUTH_TOKEN
  });

  debug('creating user');
  let user;
  try {
    user = await client.createUser({ firstName, lastName, email, groupName });
    debug('user created');
  } catch (err) {
    const message = typeof err.body === 'object' && 'message' in err.body ? err.body.message : err.message;
    res.status(400).json({ error: message });
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
    debug('Error sending SAML assertion: %o', err);
    res.status(500).json({ error: err.message });
    return;
  }

  debug('getting Ionic assertion');
  let ionicAssertion;
  try {
    ionicAssertion = await getIonicAssertion(process.env.ENROLLMENT_ENDPOINT, samlResponse);
    debug('got Ionic assertion');
  } catch(err) {
    debug('Error getting Ionic assertion: %o', err);
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(200).json({ assertion: ionicAssertion, user });
});

app.listen(8080);