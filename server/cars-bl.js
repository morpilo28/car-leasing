const dal = require('./dal');

function updateCar(callback) {
    dal.readAll((err, carsData) => {
        if (err) {
            callback(err);
        } else {
            callback(null, carsData);
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

module.exports = {
    getCars: updateCar,
    updateCar:updateCar
}