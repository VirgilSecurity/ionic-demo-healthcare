const got = require('got');
const searchParamsBuilderFactory = require('./search-params-builder');

const SCIM_SCHEMA_CORE = 'urn:scim:schemas:core:1.0';
const SCIM_SCHEMA_IONIC_EXT = 'urn:scim:schemas:extension:ionic:1.0';

const FILTER_OPERATORS = [
  '__contains', '__startswith', '__gte', '__lte', '__between', '__ne', '__empty', '__any', '__all'
];
const USER_SEARCH_PARAMS = [
  'domainUpn', 'email', 'enabled', 'externalId', 'groups', 'roles', 'createdTs', 'updatedTs'
];
const GROUP_SEARCH_PARAMS = ['externalId', 'name', 'description', 'createdTs', 'updatedTs'];

const buildUserSearchParams = searchParamsBuilderFactory(
  USER_SEARCH_PARAMS,
  FILTER_OPERATORS
);

const buildGroupSearchParams = searchParamsBuilderFactory(
  GROUP_SEARCH_PARAMS,
  FILTER_OPERATORS
);

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

  async createUser({ firstName, lastName, email, groupId }) {
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
      body: userData,
      json: true
    });
    return response.body;
  }

  async createGroup({ displayName, externalId, memberIds, description }) {
      const groupData = {
          schemas: [
              SCIM_SCHEMA_CORE,
              SCIM_SCHEMA_IONIC_EXT
          ],
          externalId,
          displayName,
          members: Array.isArray(memeberIds) ? memberIds.map(memberId => ({ value: memberId })) : undefined,
          [SCIM_SCHEMA_IONIC_EXT]: {
              description: description
          }
      }
      const url = this._getUrl('scim/Groups');
      const response = await this.client.post(url, {
          body: groupData,
          json: true
      });
      return response.body;
  }

  /**
   * Available attributes:
   * "domainUpn", "email", "enabled", "externalId", "groups", "roles", "createdTs", "updatedTs", "or"
   * Available operators:
   * "__contains", "__startswith", "__gte", "__lte", "__ne", "__empty", "__any", "__all"
   * @param {{ skip: number; limit: number; attributes: string[]; searchParams: Object }}} options
   */
  async findUsers(options = {}) {
    const searchParams = buildUserSearchParams(options);
    const url = this._getUrl('scim/Users');
    const response = await this.client.get(url, {
      query: searchParams,
      json: true
    });
    return response.body;
  }

  async findGroups(options = {}) {
    const searchParams = buildGroupSearchParams(options);
    const url = this._getUrl('scim/Groups');
    const response = await this.client.get(url, {
      query: searchParams,
      json: true
    });
    return response.body;
  }

  _getUrl(relative) {
    return `/v2/${this.tenantId}/${relative}`;
  }
}

module.exports = IonicClient;
