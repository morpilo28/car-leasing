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
    carToADD.id = Number(carToADD.id);
    carToADD.price = Number(carToADD.price);
    carToADD.monthly = Number(carToADD.monthly);
    carToADD.doors = Number(carToADD.doors);
    carToADD.seats = Number(carToADD.seats);

    dal.createOne(carToADD, (e, carAdded, allCars) => {
        if (e) {
            callback(e);
        } else {
            callback(null, carAdded, allCars)
        }
    })
}

function updateCar(car, callback) {
    dal.readAll((err, car) => {
        if (err) {
            callback(err);
        } else {
            callback(null, car);
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