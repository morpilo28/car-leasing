//needs to limit the table rows to 10
//maybe adding an opption of 'more details'

const carsEndPoint = 'http://localhost:3201/cars';

fetch(carsEndPoint).then(carsData => {
    carsData.json().then(tableView);
})

function tableView(carsArray) {
    let html = `<table>
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
            </tr>
        </thead>
        <tbody>`;
    for (let i = 0; i < carsArray.length; i++) {
        html += `
                <tr>
                    <td>${i+1}</td>
                    <td>${carsArray[i].name}</td>
                    <td>${carsArray[i].price}</td>
                    <td>${carsArray[i].monthly}</td>
                    <td>${carsArray[i].currency}</td>
                    <td>${carsArray[i].doors}</td>
                    <td>${carsArray[i].seats}</td>
                    <td>${carsArray[i].image}</td>
                </tr>`;
    }
    html += `</tbody>
    </table>
    <button id='prev'>Prev</button>
    <button id-'next'>Next</button>`;
    document.getElementById('main').innerHTML = html;
}

function isMoreThan10(carsArray) {

}