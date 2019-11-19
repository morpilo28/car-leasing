const carsEndPoint = 'http://localhost:3201/cars';

getRequests(carsEndPoint, tableView);

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
                }

                changeBackToOriginalBtn(idx);
                otherRequests(singleCarEndPoint, 'PUT', editedObj);
            });

            $(document).on('click', `#cancelChanges${idx}`, (e) => {
                e.preventDefault();
                changeBackToOriginalBtn(idx);
                getRequests(carsEndPoint, tableView);
            });
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

function changeBackToOriginalBtn(idx) {
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

function tableView(carsArray) {
    console.log(carsArray);
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
                    <td>
                        <input value='${carsArray.length + 1}' disabled readonly'/>
                        <input id='addedCarId${addedCarId}' type='hidden' value='${addedCarId}'/>
                    </td>
                    <td><input id='name${addedCarId}' placeholder = 'name'></td>
                    <td><input type='number' min='0' id='price${addedCarId}' placeholder = 'price'></td>
                    <td><input type='number' min='0' id='monthly${addedCarId}' placeholder = 'monthly'></td>
                    <td><input id='currency${addedCarId}' placeholder = 'currency'></td>
                    <td><input type='number' min='0' id='doors${addedCarId}' placeholder = 'doors'></td>
                    <td><input type='number' min='0' id='seats${addedCarId}' placeholder = 'seats'></td>
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
                <td>${i + 1}
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
    document.getElementById('main').innerHTML = html;

    addBtnEventListeners(carsArray);
}
