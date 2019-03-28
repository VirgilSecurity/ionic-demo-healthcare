const got = require('got');
const debug = require('./debug');

async function getIonicAssertion(enrollmentUrl, samlResponseXml) {
  debug(`Sending SAML response to enrollment URL ${enrollmentUrl}`);
  const enrollmentResponse = await got(enrollmentUrl, {
    method: 'POST',
    headers: {
      'expect': '100-continue'
    },
    form: true,
    body: { SAMLResponse: samlResponseXml }
  });

  debug(`Enrollment response status: ${enrollmentResponse.statusCode}`);

  const ionicAssertion = {
    'X-Ionic-Reg-Uidauth': enrollmentResponse.headers['x-ionic-reg-uidauth'],
    'X-Ionic-Reg-Stoken': enrollmentResponse.headers['x-ionic-reg-stoken'],
    'X-Ionic-Reg-Ionic-API-Urls': enrollmentResponse.headers['x-ionic-reg-ionic-url'],
    'X-Ionic-Reg-Enrollment-Tag': enrollmentResponse.headers['x-ionic-reg-enrollment-tag']
  };

  const rsaPubKeyUrl = enrollmentResponse.headers['x-ionic-reg-pubkey-url'];
  debug(`Fetching Enrollment server public key from ${rsaPubKeyUrl}`);
  const pubKeyResponse = await got(rsaPubKeyUrl);
  debug(`Public key response status: ${pubKeyResponse.statusCode}`);
  const rsaPubKey = pubKeyResponse.body.replace(/[\s|\n]/, '');

  ionicAssertion['X-Ionic-Reg-Pubkey'] = rsaPubKey;
  return ionicAssertion;
}

module.exports = getIonicAssertion;