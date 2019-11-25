//need to write correct responses and maybe use them in client

const express = require('express');
const bodyParser = require('body-parser');
/* const path = require('path');
const atob = require('atob');*/
const jwt = require('jsonwebtoken');
const app = express();
const carsBl = require('./cars-bl');
const tokensBl = require('./token-bl');
const usersModel = require('./models/userModel');
const PORT = 3201;
const cors = require('cors');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';
/* app.use(express.static(path.join(__dirname, 'public'))); */
app.use(bodyParser.json());
app.use(cors());

/* app.use((req, res, next) => {

    console.log({
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        url: req.url
    })

    if (req.method === 'POST' && req.path === '/auth') {
        next();
    }else {
        try {
            const token = jwt.verify(splitCredentials(req.headers.authorization), 'shhhhh');
            next();
        } catch (ex) {
            console.log(ex);
            res.status(403).send();
        }
    }
}) */

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
    const userToAdd = new usersModel.Users(req.body.user, req.body.pass, token);
    tokensBl.isUserNameAlreadyExist(userToAdd, (e)=>{
        if(e){
            res.status(500).send(e);
        }else{
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

app.get('/service', function (req, res) {
    res.send(req.headers.authorization)
})

function splitCredentials(str) {
    const authHeader = str.split(' ');
    if (authHeader[0] === 'basic') {
        return {
            user: atob(authHeader[1]).split(':')[0],
            pass: atob(authHeader[1]).split(':')[1]
        }
    } else if (authHeader[0] === 'bearer') {
        return authHeader[1];
    }
}

app.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT || PORT}!`),
);