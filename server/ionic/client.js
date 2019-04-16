const got = require('got');

const GROUP_NAMES_TO_IDS = {
  'patients': '5cab158ce5a7320cf0fd0416',
  'physicians': '5cab15eb3053363b20fd03c5',
  'insurers': '5cab160c9c97e32f42fd0412'
};

const SCIM_SCHEMA_CORE = 'urn:scim:schemas:core:1.0';
const SCIM_SCHEMA_IONIC_EXT = 'urn:scim:schemas:extension:ionic:1.0';

class IonicClient {
  constructor({ authToken, tenantId, baseUrl }) {
    this.tenantId = tenantId;
    this.client = got.extend({
      baseUrl,
      headers: {
        'authorization': `Bearer ${authToken}`
      }
    });
  }

  async createUser({ firstName, lastName, email, groupName }) {
    const groupId = GROUP_NAMES_TO_IDS[groupName];
    if (!groupId) {
      throw new Error(`Unknown group name ${groupName}`);
    }

    const userData = {
      schemas: [
        SCIM_SCHEMA_CORE,
        SCIM_SCHEMA_IONIC_EXT
      ],
      name: {
        givenName: firstName,
        familyName: lastName,
        formatted: `${firstName} ${lastName}`
      },
      emails: [{ value: email }],
      [SCIM_SCHEMA_IONIC_EXT]: {
        domainUpn: email,
        sendEmail: false,
        groups: [{ type: 'group', value: groupId }]
      }
    };

    const url = this._getUrl('scim/Users');
    const response = await this.client.post(url, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(userData),
      responseType: 'json'
    });
    return response.body;
  }

  async listGroups() {
    const url = this._getUrl('scim/Groups');
    const response = await this.client.get(url, {
      responseType: 'json'
    });
    return response.body;
  }

  _getUrl(relative) {
    return `/v2/${this.tenantId}/${relative}`;
  }
}

module.exports = IonicClient;