const debug = require('../debug');
const PREDEFINED_GROUPS = require('../data/groups.json');

class UserService {
  constructor(ionicClient) {
    this.client = ionicClient;
  }

  async getOrCreateUser({ email, groupName, firstName, lastName }) {
    const groupId = PREDEFINED_GROUPS[groupName];
    if (!groupId) {
      throw new Error(`Unknown group name ${groupName}`);
    }

    debug('searching for existing user');
    const findUsersResponse = await this.client.scim.users.listUsers({
      limit: 1,
      attributes: ['emails', 'groups', 'name'],
      filter: { email }
    });

    let user;
    if (findUsersResponse.totalResults > 0) {
      debug('found existing user');
      user = findUsersResponse.Resources[0];
      const hasGroup = user.groups.some(g => g.value === groupId);
      if (!hasGroup) {
        throw new Error(
          `User "${email}" already exists, but is not a member of the group ${groupName}`
        );
      }
    } else {
      debug('creating new user');
      user = await this.client.scim.users.createUser({
        schemas: [this.client.scim.Schemas.Core, this.client.scim.Schemas.Ionic],
        name: {
            givenName: firstName,
            familyName: lastName,
            formatted: `${firstName} ${lastName}`
        },
        emails: [{ value: email }],
        [this.client.scim.Schemas.Ionic]: {
            domainUpn: email,
            sendEmail: false,
            groups: [{ type: 'group', value: groupId }]
        }
      });
    }
    return user;
  }
}

module.exports = UserService;
