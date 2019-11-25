//needs to limit table to 10 rows
//needs to program the whole authentication thing - and access to c.r.u.d only after authentication
//needs to check for duplicate code

const carsEndPoint = 'http://localhost:3201/cars';
const loginEndPoint = 'http://localhost:3201/login';
const registerEndPoint = 'http://localhost:3201/register';
const serviceEndPoint = 'http://localhost:3201/service';
const TOKEN_LOCAL_STORAGE_KEY = 'token';
var methods = {
    GET: 'GET',
    POST: 'POST',
    DELETE:'DELETE',
    PUT:'PUT'
}

navbarEventListeners();

function navbarEventListeners(e) {
    const links = document.querySelectorAll('#nav a[data-href]');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.target.dataset.href);
        })
    }
}

function navigate(url) {
    printToHtml('');
    switch (url) {
        case 'register':
            registerView();
            break;
        case 'login':
            loginView();
            break;
        case 'cars':
            jQuery('a.disable').css('pointer-events', 'all');
            getFullList();
            break;
    }
}

function getFullList() {
    getRequests(carsEndPoint, tableView);
}

function onMoreDetails(responseObj) {
    let html = `
            <div>
            <img width='50' src=""/>
            <br><br>
            name: ${responseObj.singleCarData.name}
            <br><br>
            price: ${responseObj.singleCarData.price}
            <br><br>
            monthly: ${responseObj.singleCarData.monthly}
            <br><br>
            currency: ${responseObj.singleCarData.currency}
            <br><br>
            doors: ${responseObj.singleCarData.doors}
            <br><br>
            seats: ${responseObj.singleCarData.seats}
            <br><br>
            <button id='returnToFullList'>Return To Full List</button>
            </div>
            `
    printToHtml(html);

    document.getElementById('returnToFullList').addEventListener('click', (e) => {
        e.preventDefault();
        tableView(responseObj.allCars);
    })
}

function addBtnEventListeners(carsArray) {
    document.getElementById('add').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addCarRow').attr('style', 'display: table-row');
    });

    document.getElementById('saveAddedCar').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addCarRow').attr('style', 'display: none');
        onSaveAddedCar(carsArray);
    });

    document.getElementById('hideAddField').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addCarRow').attr('style', 'display: none');
    });
    for (let i = 0; i < carsArray.length; i++) {
        const singleCarEndPoint = `http://localhost:3201/cars/${carsArray[i].id}`;

        $(document).on('click', `#edit${i}`, (e) => {
            e.preventDefault();
            const idx = event.target.id.slice(4);
            onEditCar(idx, singleCarEndPoint);
        });

        document.getElementById(`delete${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            const idx = event.target.id.slice(6);
            const id = { id: carsArray[idx].id };
            otherRequests(singleCarEndPoint, methods.DELETE, id);
        });

        document.getElementById(`details${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            getRequests(singleCarEndPoint, onMoreDetails);
        });
    }
}

function onEditCar(idx, singleCarEndPoint) {
    jQuery(`.editable${idx}`).attr('contenteditable', "true");
    jQuery(`#buttonCell${idx}`).empty().append(`
            <button id='saveChanges${idx}'>Save</button> <button id='cancelChanges${idx}'>Cancel</button>`);

    $(document).on('click', `#saveChanges${idx}`, (e) => {
        e.preventDefault();
        let editedObj = {
            name: jQuery(`#name${idx}`).html(),
            price: jQuery(`#price${idx}`).html(),
            monthly: jQuery(`#monthly${idx}`).html(),
            currency: jQuery(`#currency${idx}`).html(),
            doors: jQuery(`#doors${idx}`).html(),
            seats: jQuery(`#seats${idx}`).html(),
            image: jQuery(`#image${idx}`).html(),
        };
        changeBackToOriginalBtn(idx);
        otherRequests(singleCarEndPoint, methods.PUT, editedObj);
    });

    $(document).on('click', `#cancelChanges${idx}`, (e) => {
        e.preventDefault();
        changeBackToOriginalBtn(idx);
        getRequests(carsEndPoint, tableView);
    });
}

function changeBackToOriginalBtn(idx) {
    // when two rows or more are switched, the switching back occurs on all of them (instead of on only one)
    jQuery(`#buttonCell${idx}`).empty().append(`<button id='edit${idx}'>Edit</button>
                <button id='delete${idx}'>delete</button>
                <button id='details${idx}'>More Details</button>`);
    jQuery(`.editable${idx}`).attr('contenteditable', "false");
}

function onSaveAddedCar(carsArray) {
    const addedCarId = (carsArray[carsArray.length - 1].id) + 1;
    const carToAdd = {
        id: document.getElementById(`addedCarId${addedCarId}`).value,
        name: document.getElementById(`name${addedCarId}`).value,
        price: document.getElementById(`price${addedCarId}`).value,
        monthly: document.getElementById(`monthly${addedCarId}`).value,
        currency: document.getElementById(`currency${addedCarId}`).value,
        doors: document.getElementById(`doors${addedCarId}`).value,
        seats: document.getElementById(`seats${addedCarId}`).value,
        image: document.getElementById(`image${addedCarId}`).value
    };
    otherRequests(carsEndPoint, methods.POST, carToAdd);
}

function tableView(carsArray) {
    const addedCarId = carsArray[carsArray.length - 1].id + 1;
    let html = `
        <button id='add'>Add Car</button>
        <table>
            <thead>
                <tr>
                    <th>row</th>
                    <th>name</th>
                    <th>price</th>
                    <th>monthly</th>
                    <th>currency</th>
                    <th>doors</th>
                    <th>seats</th>
                    <th>image</th>
                    <th>options</th>
                </tr>
            </thead>
            <tbody id='carsTableBody'>
                <tr id='addCarRow' class="addCarRow">
                    <td class='addCarCells'>
                        <input value='${carsArray.length + 1}' disabled readonly'/>
                        <input id='addedCarId${addedCarId}' type='hidden' value='${addedCarId}'/>
                    </td>
                    <td class='addCarCells'><input id='name${addedCarId}' placeholder = 'name'></td>
                    <td class='addCarCells'><input type='number' min='0' id='price${addedCarId}' placeholder = 'price'></td>
                    <td class='addCarCells'><input type='number' min='0' id='monthly${addedCarId}' placeholder = 'monthly'></td>
                    <td class='addCarCells'><input id='currency${addedCarId}' placeholder = 'currency'></td>
                    <td class='addCarCells'><input type='number' min='0' id='doors${addedCarId}' placeholder = 'doors'></td>
                    <td class='addCarCells'><input type='number' min='0' id='seats${addedCarId}' placeholder = 'seats'></td>
                    <td class='addCarCells'><input id='image${addedCarId}' placeholder = 'image'></td>
                    <td class='addCarCells'>
                        <button id='saveAddedCar'>Save</button>
                        <button id='hideAddField'>Hide Add Field</button>
                    </td>
                </tr>`;
    for (let i = 0; i < carsArray.length; i++) {
        const id = carsArray[i].id;
        html += `
            <tr>
                <td><b>${i + 1}</b>
                    <input id='id${i}' value='${id}' type='hidden'/>
                </td>
                <td class='editable${i}' id='name${i}'>${carsArray[i].name}</td>
                <td class='editable${i}' id='price${i}'>${carsArray[i].price}</td>
                <td class='editable${i}' id='monthly${i}'>${carsArray[i].monthly}</td>
                <td class='editable${i}' id='currency${i}'>${carsArray[i].currency}</td>
                <td class='editable${i}' id='doors${i}'>${carsArray[i].doors}</td>
                <td class='editable${i}' id='seats${i}'>${carsArray[i].seats}</td>
                <td class='editable${i}' id='image${i}'>${carsArray[i].image}</td>
                <td id='buttonCell${i}'>
                    <button id='edit${i}'>Edit</button>
                    <button id='delete${i}'>delete</button>
                    <button id='details${i}'>More Details</button>
                </td>
            </tr>`;
    }
    html += `
                </tbody>
            </table>
            <button id='prev'>Prev</button>
            <button id-'next'>Next</button>`;
    printToHtml(html);

    addBtnEventListeners(carsArray);
}

function getRequests(endPoint, whenResponse) {
    fetch(endPoint).then(data => {
        data.json().then(whenResponse);
    })
}

function otherRequests(endPoint, httpVerb, reqBody, whenResponse) {
    whenResponse = whenResponse === onEditCar ? onEditCar : tableView;
    fetch(endPoint, {
        method: httpVerb,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    }).then(responseData => {
        responseData.json().then(whenResponse);
    }).catch(err => {
        alert('not inserted');
    });
}

function loginView(note) {
    note = note ? note : '';
    const html = `
    <div>
    <h2>Login</h2>
    <p>${note}</p>
        <label>user: <input id='user'></label>
        <label>password: <input id='pass' type='password'></label>
        <button id='login'>Login</button>
    </div>
    `
    printToHtml(html);
    document.getElementById('login').addEventListener('click', loginValidation);
}

function registerView(note) {
    note = note ? note : '';
    const html = `
    <h2>Register</h2>
    <p>${note}</p>
    <div>
        <label>user: <input id='user'></label>
        <label>password: <input id='pass' type='password'></label>
        <button id='register'>Register</button>
    </div>
    `
    printToHtml(html);
    document.getElementById('register').addEventListener('click', register);
}

function register() {
    const params = {
        user: document.getElementById('user').value,
        pass: document.getElementById('pass').value
    };

    fetch(registerEndPoint, {
        method: methods.POST,
        body: JSON.stringify({
            user: params.user,
            pass: params.pass
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
        document.getElementById('user').value = '';
        document.getElementById('pass').value = '';
        if (res.status === 500) {
            registerView('user name taken. please select a different name');
        } else {
            registerView('registration succeeded');
        }
    })
}

function loginValidation() {
    const params = {
        user: document.getElementById('user').value,
        pass: document.getElementById('pass').value
    };
    fetch(loginEndPoint, {
        method: methods.POST,
        body: JSON.stringify({
            user: params.user,
            pass: params.pass
        }),
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': 'basic ' + btoa(params.user + ':' + params.pass)
        },
    }).then(res => {
        document.getElementById('user').value = '';
        document.getElementById('pass').value = '';
        if (res.status === 500) {
            loginView('User Not Found');
        } else {
            navigate('cars');
        }
        res.text().then(token => {
            localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);
        })
    })
}

function printToHtml(html) {
    document.getElementById('main').innerHTML = html;
}