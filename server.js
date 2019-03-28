const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const buildResponse = require('./server/saml/build-response');
const getIonicAssertion = require('./server/get-ionic-assertion');
const debug = require('./server/debug');

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/assertion', async (req, res) => {
  debug('generating SAML assertion');
  let samlResponse;

  try {
    samlResponse = buildResponse({
      privateKey: process.env.PRIVATE_KEY, 
      userEmail: 'virgil_fakeuser_247@mailinator.com',
      recipientUrl: process.env.ENROLLMENT_ENDPOINT,
      recipientName: process.env.ASSERTION_CONSUMER_SERVICE,
      issuer: process.env.IDP_ENTITY_ID
    });
    debug('assertion generated');
  } catch (err) {
    console.error('Error sending SAML assertion', err);
    res.status(500).json({ error: err.message });
    return;
  }

  let ionicAssertion;
  try {
    ionicAssertion = await getIonicAssertion(process.env.ENROLLMENT_ENDPOINT, samlResponse);
  } catch(err) {
    console.error('Error getting Ionic assertion', err);
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(200).json(ionicAssertion);
});

app.listen(8080);