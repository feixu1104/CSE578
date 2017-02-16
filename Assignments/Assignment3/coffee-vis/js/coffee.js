var chart;
var height = 200;
var width = 300;
//DEFINE YOUR VARIABLES UP HERE
var canvas;
var margin = {top: 0, right: 50, bottom: 40, left: 20};
var color = d3.scaleOrdinal(d3.schemeCategory10);

/*
Submission by: Nikhil Lohia (nlohia1@asu.edu)
ID: 1211168085
 */

//Gets called when the page is loaded.
function init() {
    chart = d3.select('#vis').append('svg');
    vis = chart.append('g');
    //PUT YOUR INIT CODE BELOW

    canvas = chart.attr("width", width)
        .attr("height", height);
}

//Called when the update button is clicked
function updateClicked() {

    d3.csv('data/CoffeeData.csv', update);
}

//Callback for when data is loaded
function update(rawdata) {

    vis.selectAll("g").remove();
    vis.selectAll("rect").remove();

    //PUT YOUR UPDATE CODE BELOW
    var xAxes;
    var yAxes;

    rawdata = d3.nest()
        .key(function (d) {
            return d[getXSelectedOption()];
        })
        .rollup(function (d) {
            return d3.sum(d, function (g) {
                return g[getYSelectedOption()];
            });
        }).entries(rawdata);

    console.log(rawdata[0]);

    xAxes = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1)
        .domain(rawdata.map(function (d) {
            return d.key;
        }));

    yAxes = d3.scaleLinear()
        .range([height - (margin.top + margin.bottom), 0])
        .domain([0, d3.max(rawdata, function (d) {
            return d.value;
        })]);

    vis.append("g")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(d3.axisBottom(xAxes));

    vis.append("g")
        .attr("transform", "translate(" + (width - margin.right) + ", 0)")
        .call(d3.axisRight(yAxes).ticks(4));

    vis.selectAll("rect")
        .data(rawdata)
        .enter().append("rect")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("x", function (d) {
            return xAxes(d.key);
        })
        .attr("width", xAxes.bandwidth())
        .attr("y", function (d) {
            return yAxes(d.value);
        })
        .attr("height", function (d) {
            return height - margin.top - margin.bottom - yAxes(d.value);
        });
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption() {

    var node = d3.select('#xdropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption() {

    var node = d3.select('#ydropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}
