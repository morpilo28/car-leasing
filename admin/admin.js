const carsEndPoint = 'http://localhost:3201/cars';

getRequests(carsEndPoint, reducedTable);

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
    document.getElementById('main').innerHTML = html;

    document.getElementById('returnToFullList').addEventListener('click', (e) => {
        e.preventDefault();
        reducedTable(responseObj.allCars);
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
        document.getElementById(`edit${i}`).addEventListener('click', (e, i) => {
            e.preventDefault();
            //problem from this point
            /* editCar(i); */
        });

        document.getElementById(`delete${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            const idx = event.target.id.slice(6);
            const id = { id: carsArray[idx].id };
            otherRequests(singleCarEndPoint, 'DELETE', id);
        });

        document.getElementById(`details${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            getRequests(singleCarEndPoint, onMoreDetails);
        });
    }
}

function onSaveAddedCar(carsArray) {
    const addedCarId = carsArray[carsArray.length - 1].id + 1;
    const carToAdd = {
        id: document.getElementById(`id${addedCarId}`).value,
        name: document.getElementById(`name${addedCarId}`).value,
        price: document.getElementById(`price${addedCarId}`).value,
        monthly: document.getElementById(`monthly${addedCarId}`).value,
        currency: document.getElementById(`currency${addedCarId}`).value,
        doors: document.getElementById(`doors${addedCarId}`).value,
        seats: document.getElementById(`seats${addedCarId}`).value,
        image: document.getElementById(`image${addedCarId}`).value
    };
    otherRequests(carsEndPoint, 'POST', carToAdd);
}

function onEditCar(idx) {
    jQuery(`.carForEdit${idx}`).attr('contentEditable', "true");
    // switch to empty inputs and a save btn
    //add events listener to a save btn and send it to saveEdit
    /* saveEdit(idx); */
}

function OnSaveEdit(idx) {
    const reqBody = {
        name: document.getElementById(`name${idx}`).value,
        price: document.getElementById(`price${idx}`).value,
        monthly: document.getElementById(`monthly${idx}`).value,
        currency: document.getElementById(`currency${idx}`).value,
        doors: document.getElementById(`doors${idx}`).value,
        seats: document.getElementById(`seats${idx}`).value,
        image: document.getElementById(`image${idx}`).value
    }

    fetch(carsEndPoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    }).then(responseData => {

    }).catch(err => {
        alert('not inserted');
    });
}

function getRequests(endPoint, whenResponse) {
    fetch(endPoint).then(carsData => {
        carsData.json().then(whenResponse);
    })
}

function otherRequests(endPoint, httpVerb, reqBody) {
    fetch(endPoint, {
        method: httpVerb,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    }).then(responseData => {
        responseData.json().then(reducedTable);
    }).catch(err => {
        alert('not inserted');
    });
}

function reducedTable(carsArray) {
    const addedCarId = carsArray[carsArray.length - 1].id + 1;
    let html = `
        <button id='add'>Add Car</button>
        <table>
            <thead>
                <tr>
                    <th>row</th>
                    <th>name</th>
                    <th>price</th>
                </tr>
            </thead>
            <tbody id='carsTableBody'>
                <tr id='addCarRow' class="addCarRow">
                    <td><input id='id${addedCarId}' value='${addedCarId}' disabled readonly'></td>
                    <td><input id='name${addedCarId}' placeholder = 'name'></td>
                    <td><input id='price${addedCarId}' placeholder = 'price'></td>
                    <td><input id='monthly${addedCarId}' placeholder = 'monthly'></td>
                    <td><input id='currency${addedCarId}' placeholder = 'currency'></td>
                    <td><input id='doors${addedCarId}' placeholder = 'doors'></td>
                    <td><input id='seats${addedCarId}' placeholder = 'seats'></td>
                    <td><input id='image${addedCarId}' placeholder = 'image'></td>
                    <td>
                        <button id='saveAddedCar'>Save</button>
                        <button id='hideAddField'>Hide Add Field</button>
                    </td>
                </tr>`;
    for (let i = 0; i < carsArray.length; i++) {
        const id = carsArray[i].id;
        html += `
            <tr>
                <td>${id}</td>
                <td class='carForEdit${i}' id='name${i}'>${carsArray[i].name}</td>
                <td class='carForEdit${i}' id=price${i}'>${carsArray[i].price}</td>
                <td>
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
    document.getElementById('main').innerHTML = html;

    addBtnEventListeners(carsArray);
}