const dal = require('./dal');

function getCars(callback) {
    dal.readAll((err, carsData) => {
        if (err) {
            callback(err);
        } else {
            callback(null, carsData);
        }
    })
}

function getOneCar(id, callback) {

    dal.readOne(id, (err, singleCarData, allCars) => {
        if (err) {
            callback(err);
        } else {
            callback(null, singleCarData, allCars);
        }
    })
}

function createOneCar(carToADD, callback) {
    dal.createOne(carToADD, (e, carAdded, allCars) => {
        if (e) {
            callback(e);
        } else {
            callback(null, carAdded, allCars)
        }
    })
}

function updateCar(editedCarData, callback) {
    editedCarData.price = editedCarData.price === '' || typeof editedCarData.price === 'string' ? 0 : Number(editedCarData.price);
    editedCarData.monthly = editedCarData.monthly === '' || typeof editedCarData.monthly === 'string' ? 0 : Number(editedCarData.monthly);
    editedCarData.doors = editedCarData.doors === '' || typeof editedCarData.doors === 'string' ? 0 : Number(editedCarData.doors);
    editedCarData.seats = editedCarData.seats === '' || typeof editedCarData.seats === 'string' ? 0 : Number(editedCarData.seats);
    dal.updateOne(editedCarData, (err, editedCarData, allCars) => {
        if (err) {
            callback(err);
        } else {
            callback(null, allCars);
        }
    })
}

function deleteOneCar(id, callback) {
    dal.deleteOne(id, (e, allCars) => {
        if (e) {
            callback(e);
        } else {
            callback(null, allCars);
        }
    })
}

module.exports = {
    getCars: getCars,
    getOneCar: getOneCar,
    createOneCar: createOneCar,
    updateCar: updateCar,
    deleteOneCar: deleteOneCar
}