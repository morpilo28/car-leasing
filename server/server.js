const express = require('express');
const app = express();
const carsBl = require('./cars-bl');
const PORT = 3201;
const cors = require('cors');
app.use(cors());

app.get('/cars', (req, res) => {
    carsBl.getCars((e, carsData) => {
        return res.send(carsData);
    })
})

app.put('/cars/:id', (req, res) => {
    carsBl.updateCar(car, (e, car) => {
        return res.send(car);
    })
})

app.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT || PORT}!`),
);