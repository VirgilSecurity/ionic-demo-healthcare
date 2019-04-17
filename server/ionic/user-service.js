const debug = require('../debug');

const GROUP_NAMES_TO_IDS = {
  'patients': '5cab158ce5a7320cf0fd0416',
  'physicians': '5cab15eb3053363b20fd03c5',
  'insurers': '5cab160c9c97e32f42fd0412'
};

class UserService {
  constructor(ionicClient) {
    this.client = ionicClient;
  }

  async getOrCreateUser({ email, groupName, firstName, lastName }) {
    const groupId = GROUP_NAMES_TO_IDS[groupName];
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