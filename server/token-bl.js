const dal = require('./dal');
const FILE = './db/tokens.json';

function registerUser(userToAdd, callback) {
    // needs to check if a user name already exist. if so, prompt a message for change user name
    dal.setDatabase(FILE);
    dal.createOne(userToAdd, (e, userToAdd, allUsers) => {
        if (e) {
            callback(e)
        } else {
            callback(null, userToAdd, allUsers)
        }
    })
}

function getUser(userToValidate, callback) {
    dal.setDatabase(FILE);
    dal.readOne(userToValidate.user, 'userName', (e, user) => {
        if (e) {
            callback('no user has been found');
        } else {
            callback(null, user);
        }
    })
}

module.exports = {
    registerUser: registerUser,
    getUser: getUser,
}