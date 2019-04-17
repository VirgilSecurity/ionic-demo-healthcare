const debug = require('../debug');
const PREDEFINED_GROUPS = require('./predefined-groups');

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
    const findUsersResponse = await this.client.findUsers({
      limit: 1,
      attributes: ['emails', 'groups', 'name'],
      searchParams: { email }
    });

    let user;
    if (findUsersResponse.totalResults > 0) {
      debug('found existing user');
      user = findUsersResponse.Resources[0];
      // check if the user belong to the group
      const hasGroup = user.groups.some(g => g.value === groupId);
      if (!hasGroup) {
        throw new Error(
          `User "${email}" already exists, but is not a member of the group ${groupName}`
        );
      }
    } else {
      debug('creating new user');
      user = await this.client.createUser({ firstName, lastName, email, groupId });
    }
    return user;
  }
}

module.exports = UserService;