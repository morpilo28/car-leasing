const fs = require('fs');
const FILE = './db/cars.json';

function readAll(callback) {
    fs.readFile(FILE, (e,data)=>{
        const carsData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        if(e){
            callback(e);
        }else{
            callback(null, carsData)
        }
    })
}

function updateOne(car, callback) {
    fs.readFile(FILE, (e,data)=>{
        const carsData = data && data.length > 0 ? JSON.parse(data.toString()) : [];
        if(e){
            callback(e);
        }else{
            callback(null, car)
        }
    })
}

module.exports = {
    readAll:readAll,
    updateOne:updateOne
}