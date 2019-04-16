const { readFileSync } = require('fs');
const { join } = require('path');
const { randomBytes } = require('crypto');
const { DOMParser } = require('xmldom');

const assertionTemplate = readFileSync(join(__dirname, 'assertion.template'), { encoding: 'utf8' });

const addDays = (moment, days) => {
  const result = new Date();
  result.setDate(moment.getDate() + days);
  return result;
}

const subtractDays = (moment, days) => addDays(moment, -days);

function buildAssertion({ issuer, inResponseTo, validDaysBefore, validDaysAfter, recipientUrl, userEmail, recipientName}) {
  const now = new Date();
  const doc = new DOMParser().parseFromString(assertionTemplate);
  doc.documentElement.setAttribute('ID', `_${randomBytes(16).toString('hex')}`);
  doc.documentElement.setAttribute('IssueInstant', now.toISOString());

  // issuer
  doc.documentElement.getElementsByTagName('saml2:Issuer')[0].textContent = issuer;

  // subject
  const confirmationData = doc.documentElement.getElementsByTagName('saml2:SubjectConfirmationData')[0];
  confirmationData.setAttribute('InResponseTo', inResponseTo);
  if (validDaysBefore) {
    confirmationData.setAttribute('NotBefore', subtractDays(now, validDaysBefore).toISOString());
  }
  if (validDaysAfter) {
    confirmationData.setAttribute('NotOnOrAfter', addDays(now, validDaysAfter).toISOString());
  }
  
  confirmationData.setAttribute('Recipient', recipientUrl);

  // conditions
  const conditions = doc.documentElement.getElementsByTagName('saml2:Conditions')[0];
  conditions.setAttribute('NotBefore', subtractDays(now, validDaysBefore).toISOString());
  conditions.setAttribute('NotOnOrAfter', addDays(now, validDaysAfter).toISOString());

  // audience
  const audienceEl = doc.documentElement.getElementsByTagName('saml2:Audience')[0];
  audienceEl.textContent = recipientName;

  // email
  const emailAttribute = doc.documentElement.getElementsByTagName('saml2:AttributeValue')[0];
  emailAttribute.textContent = userEmail;

  // authn
  const authnStatement = doc.documentElement.getElementsByTagName('saml2:AuthnStatement')[0];
  authnStatement.setAttribute('AuthnInstant', now.toISOString());

  return doc;
}

module.exports = buildAssertion;