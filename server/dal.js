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

function readOne(id, callback) {
    fs.readFile(FILE, (e, data) => {
        const fileData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        const singleObj = fileData.find((obj) => obj.id === id);
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