//need to write correct responses and maybe use them in client

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const carsBl = require('./cars-bl');
const tokensBl = require('./token-bl');
const userModel = require('./models/userModel');
const carModel = require('./models/carModel');
const PORT = 3201;
const cors = require('cors');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/register' || req.method === 'POST' && req.path === '/login') {
        next();
    } else {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                jwt.verify(token, SECRET_KEY_FOR_JWT);
                next()
            } catch (ex) {
                res.status(401).send();
            }
        } else {
            res.status(401).send();
        }
    }
     console.log({
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        url: req.url
    }) 
})

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
    const carToAddObj = req.body;
    carToAddObj.id = Number(carToAddObj.id);
    const carToAdd = new carModel.Cars(carToAddObj.id, carToAddObj.name, carToAddObj.price, carToAddObj.monthly, carToAddObj.currency, carToAddObj.doors, carToAddObj.seats, carToAddObj.image);
    carsBl.createOneCar(carToAdd, (e, carAdded, allCars) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(allCars);
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

app.post('/login', function (req, res) {
    const userToValidate = {
        user: req.body.user,
        pass: req.body.pass,
    }

    tokensBl.validateUser(userToValidate, (e, user) => {
        if (e) {
            return res.status(500).send('no user has been found');
        } else {
            return res.send(user.token);
        }
    })
});

app.post('/register', function (req, res) {
    const token = jwt.sign({
        user: req.body.user
    }, SECRET_KEY_FOR_JWT,
        {
            expiresIn: '365d'
        });
    const userToAdd = new userModel.Users(req.body.user, req.body.pass, token);
    tokensBl.isUserNameAlreadyExist(userToAdd, (e) => {
        if (e) {
            res.status(500).send(e);
        } else {
            tokensBl.registerUser(userToAdd, (e, user, allUsers) => {
                if (e) {
                    return res.status(500).send();
                } else {
                    return res.send();
                }
            })
        }
    })
});

app.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT || PORT}!`),
);