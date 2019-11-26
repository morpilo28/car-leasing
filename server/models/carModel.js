function Cars(id, name, price, monthly, currency, doors, seats, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.monthly = monthly;
    this.currency = currency;
    this.doors = doors;
    this.seats = seats;
    this.image = image;
}

module.exports = {
    Cars:Cars
}