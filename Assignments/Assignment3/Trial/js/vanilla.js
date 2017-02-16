console.log("HELLO JS");
var myNumber = 5;
var myString = "Let us ";
var combined = myNumber + myString;
console.log(combined);
var stringNumber = "15";
var parsedNumber = +stringNumber;
console.log(myNumber + parsedNumber);

function square(x) {
    return x * x;
}

console.log(square(25));

d3.csv("./CoffeeData.csv", type, function (myArrayOfObjects) {
    myArrayOfObjects.forEach(function (d) {
        console.log(d.date + " " + d.profit);
    });
});

function type(d) {
    d.sales = parseFloat(d.sales);
    d.profit = parseFloat(d.profit);
    return d;
}