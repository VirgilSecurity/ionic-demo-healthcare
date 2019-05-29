const got = require('got');
const debug = require('./debug');

async function getIonicAssertion(enrollmentUrl, samlResponseXml) {
  debug(`sending SAML response to enrollment URL ${enrollmentUrl}`);
  const enrollmentResponse = await got(enrollmentUrl, {
    method: 'POST',
    headers: {
      'expect': '100-continue'
    },
    form: true,
    body: { SAMLResponse: samlResponseXml }
  });

  debug(`enrollment response status: ${enrollmentResponse.statusCode}`);

  const ionicAssertion = {
    'X-Ionic-Reg-Uidauth': enrollmentResponse.headers['x-ionic-reg-uidauth'],
    'X-Ionic-Reg-Stoken': enrollmentResponse.headers['x-ionic-reg-stoken'],
    'X-Ionic-Reg-Ionic-API-Urls': enrollmentResponse.headers['x-ionic-reg-ionic-url'],
    'X-Ionic-Reg-Enrollment-Tag': enrollmentResponse.headers['x-ionic-reg-enrollment-tag'],
    'X-Ionic-Reg-Pubkey':  enrollmentResponse.headers['x-ionic-reg-pubkey']
  };
  return ionicAssertion;
}

module.exports = getIonicAssertion;
