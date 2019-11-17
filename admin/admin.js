const carsEndPoint = 'http://localhost:3201/cars';

fetch(carsEndPoint).then(carsData => {
    carsData.json().then(tableView);
})

function tableView(carsArray) {
    console.log(carsArray);
    let html = `
    <button>Add Car</button>
    <table>
        <thead>
            <tr>
                <th>name</th>
                <th>price</th>
                <th>monthly</th>
                <th>currency</th>
                <th>doors</th>
                <th>seats</th>
                <th>image</th>
            </tr>
        </thead>
        <tbody>`;
    for (let i = 0; i < carsArray.length; i++) {
        html += `
            <tr>
                <td class='carForEdit${i}' id='name${i}'>${carsArray[i].name}</td>
                <td class='carForEdit${i}' id=price${i}'>${carsArray[i].price}</td>
                <td class='carForEdit${i}' id='monthly${i}'>${carsArray[i].monthly}</td>
                <td class='carForEdit${i}' id='currency${i}'>${carsArray[i].currency}</td>
                <td class='carForEdit${i}' id='doors${i}'>${carsArray[i].doors}</td>
                <td class='carForEdit${i}' id='seats${i}'>${carsArray[i].seats}</td>
                <td class='carForEdit${i}' id='image${i}'>${carsArray[i].image}</td>
                <td>
                    <button id='edit${i}'>Edit</button>
                    <button id='delete${i}'>delete</button>
                </td>
            </tr>`;
    }
    html += `</tbody>
    </table>`;
    document.getElementById('main').innerHTML = html;

    for (let i = 0; i < carsArray.length; i++) {
        document.getElementById(`edit${i}`).addEventListener('click', (i) => {
            //problem from this point
            /* editCar(i); */
        });
    }
}

function editCar(idx) {
    jQuery(`.carForEdit${idx}`).attr('contentEditable',"true");
    // switch to empty inputs and a save btn
    //add events listener to a save btn and send it to saveEdit
    /* saveEdit(idx); */
}

function saveEdit(idx) {
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