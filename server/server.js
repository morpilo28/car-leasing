const express = require('express');
const app = express();
const carsBl = require('./cars-bl');
const PORT = 3201;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

app.get('/cars', (req, res) => {
    carsBl.getCars((e, carsData) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(carsData);
        }
    })
})

app.get('/cars/:id', (req, res) => {
    const id = Number(req.params.id);
    carsBl.getOneCar(id, (e, singleCarData, allCars) => {
        if (e) {
            return res.status(500).send();
        } else {
            const responseObj = {
                singleCarData: singleCarData,
                allCars: allCars
            }
            return res.send(responseObj);
        }
    })
})

app.post('/cars', (req, res) => {
    const carToAdd = req.body;
    carToAdd.id = Number(carToAdd.id);
    carsBl.createOneCar(carToAdd, (e, carAdded, carsData) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(carsData);
        }
    })
})

app.put('/cars/:id', (req, res) => {
    const editedCarData = req.body;
    editedCarData.id = Number(req.params.id);

    carsBl.updateCar(editedCarData, (e, allCars) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(allCars);
        }
    })
})

app.delete('/cars/:id', (req, res) => {
    const id = Number(req.body.id);
    carsBl.deleteOneCar(id, (e, allCars) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(allCars);
        }
    })
})

app.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT || PORT}!`),
);