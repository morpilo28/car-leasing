const fs = require('fs');

function setDatabase(file) {
    FILE = file;
}

function readAll(callback) {
    fs.readFile(FILE, (e, data) => {
        const fileData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        if (e) {
            callback(e);
        } else {
            callback(null, fileData)
        }
    })
}

function readOne(value, key, callback) {
    fs.readFile(FILE, (e, data) => {
        let singleObj = {};
        const fileData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        if(key === 'id'){
            singleObj = fileData.find((obj) => obj.id === value);
        }else if(key === 'userName'){
            singleObj = fileData.find((obj) => obj.user === value);
            if(!singleObj){
                singleObj = 'no user has been found';
            }
        }
        if (e) {
            callback(e);
        } else {
            callback(null, singleObj, fileData)
        }
    })
}

function createOne(objToAdd, callback) {
    fs.readFile(FILE, (e, data) => {
        const fileData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        fileData.push(objToAdd);
        fs.writeFile(FILE, JSON.stringify(fileData), (e) => {
            if (e) {
                callback(e);
            } else {
                callback(null, objToAdd, fileData);
            }
        })
    })
}

function updateOne(editedObj, callback) {
    fs.readFile(FILE, (e, data) => {
        const fileData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        fileData.map((obj) => {
            if (obj.id === editedObj.id) {
                obj.name = editedObj.name,
                    obj.price = editedObj.price,
                    obj.monthly = editedObj.monthly,
                    obj.currency = editedObj.currency,
                    obj.doors = editedObj.doors,
                    obj.seats = editedObj.seats,
                    obj.image = editedObj.image
            }
        });

        fs.writeFile(FILE, JSON.stringify(fileData), (e) => {
            if (e) {
                callback(e);
            } else {
                callback(null, editedObj, fileData)
            }
        })
    })
}

function deleteOne(id, callback) {
    fs.readFile(FILE, (e, data) => {
        let fileData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        fileData = fileData.filter(car => car.id !== id);
        fs.writeFile(FILE, JSON.stringify(fileData), (e) => {
            if (e) {
                callback(e);
            } else {
                callback(null, fileData);
            }
        })
    })
}

module.exports = {
    setDatabase: setDatabase,
    readAll: readAll,
    readOne: readOne,
    createOne: createOne,
    updateOne: updateOne,
    deleteOne: deleteOne
}