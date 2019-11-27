const dal = require('./dal');
const FILE = './db/users.json';


function isUserNameAlreadyExist(registerUser, callback) {
    dal.setDatabase(FILE);
    //checking if a userName already exist in the db
    dal.readAll((e, allUserS) => {
        if (e) {
            callback(e);
        } else {
            let singleObj = allUserS.filter((obj) => obj.user === registerUser.user);
            if (singleObj.length > 0) {
                callback('user name taken.');
            } else {
                callback(null);
            }
        }
    })
}

function registerUser(userToAdd, callback) {
    dal.setDatabase(FILE);
    dal.createOne(userToAdd, (e, userToAdd, allUsers) => {
        if (e) {
            callback(e)
        } else {
            callback(null, userToAdd, allUsers)
        }
    })
}

function validateUser(userToValidate, callback) {
    dal.setDatabase(FILE);
    //checking if a user exist in the db
    dal.readAll((e, allUserS) => {
        if (e) {
            callback(e);
        } else {
            let singleObj = allUserS.filter((obj) => obj.user === userToValidate.user && obj.pass === userToValidate.pass);
            if (singleObj.length === 0) {
                callback('no user has been found');
            } else if (singleObj.length > 1) {
                console.log('there is more than one user under the same name');
            } else {
                callback(null, singleObj[0]);
            }
        }
    })
}

module.exports = {
    registerUser: registerUser,
    validateUser: validateUser,
    isUserNameAlreadyExist: isUserNameAlreadyExist
}
