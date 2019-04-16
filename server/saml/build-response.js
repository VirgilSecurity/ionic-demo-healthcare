const { readFileSync } = require('fs');
const { join } = require('path');
const { randomBytes } = require('crypto');
const { DOMParser } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const uuid = require('uuid');
const buildAssertion = require('./build-assertion');

const responseTemplate = readFileSync(join(__dirname, 'response.template'), { encoding: 'utf8' });

const removeWhitespace = xml => xml
    .replace(/[\n|\r\n]/g, '')
    .replace(/>(\s*)</g, '><')
    .trim();

const getDefaults = () => ({
  inResponseTo: uuid.v4(),
  validDaysBefore: 0,
  validDaysAfter: 1
})

function buildResponse(options) {
  const { 
    privateKey, 
    userEmail,
    recipientUrl,
    recipientName, 
    issuer, 
    inResponseTo, 
    validDaysBefore, 
    validDaysAfter
  } = { ...getDefaults(), ...options };

  const doc = new DOMParser().parseFromString(responseTemplate);
  doc.documentElement.setAttribute('ID', `_${randomBytes(16).toString('hex')}`);
  doc.documentElement.setAttribute('Destination', recipientName);
  doc.documentElement.setAttribute('InResponseTo', inResponseTo);
  doc.documentElement.setAttribute('IssueInstant', new Date().toISOString());

  const issuerEl = doc.documentElement.getElementsByTagName('saml2:Issuer')[0];
  issuerEl.textContent = issuer;

  const assertion = buildAssertion({
    issuer,
    recipientUrl,
    recipientName,
    inResponseTo,
    validDaysBefore,
    validDaysAfter,
    userEmail
  });

  doc.documentElement.appendChild(assertion);
  return signResponse(doc, privateKey);
}

function signResponse(doc, privateKey) {
  const signatureAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
  const digestAlg = 'http://www.w3.org/2001/04/xmlenc#sha256';
  const canonicalizationAlg = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments';
  const transfromAlgs = [ 'http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#' ];
  const sig = new SignedXml();
  sig.addReference(
    "//*[local-name(.)='Response']",
    transfromAlgs,
    digestAlg
  );
  sig.signingKey = privateKey;
  sig.signatureAlgorithm = signatureAlg;
  sig.canonicalizationAlgorithm = canonicalizationAlg;
  const opts = { 
    location: { 
      reference: "//*[local-name(.)='Issuer']", 
      action: 'after'
    },
    prefix: 'ds'
  };

  sig.computeSignature(removeWhitespace(doc.toString()), opts);

  return sig.getSignedXml();
}

module.exports = buildResponse;