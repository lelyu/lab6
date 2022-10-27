// @author Le Lyu
// @credit Sarah Oliver


function find_total(data) {
    const total_data = data.map(d => {
        let total = 0;
        const keys = Object.keys(d);
        keys.forEach((key, index) => {
            if (key == "date") {
                let next = 1;
            }
            else {
                total += d[key];
            }
        });
        d.total = total;
        return { d, total: total };
    });
    return total_data;
}


// input: selector for a chart container e.g., ".chart"
function AreaChart(container) {

    // initialization

    // creating svg and margin conventions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 640, height = 400;
    
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // create axes containers
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`);
    svg.append("g")
        .attr("class", "y-axis");

    // defind scales with ranges only
    let xScale = d3.scaleTime().rangeRound([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);


    // create a SINGLE PATH for the area and assign a class name so that you can select it in update
    let path = svg.append("path");
    path.attr("class", "path-class");


    function update(data) {
        data.forEach(element => {element.total = Object.values(element).slice(1).reduce((a, b) => a + b, 0)});
        // update domain of the the scales
        xScale.domain(d3.extent(data, d => d.date));

        yScale.domain([0, d3.max(data, d => d.total)]);

        // area
        area = d3.area()
        .x(d=>xScale(d.date))
        .y0(yScale(0))
        .y1(d=>yScale(d.total));

        // select path use its class name and set data to datum
        // d3.selectAll("path-class")
        // .datum(data)
        // .attr("d", area)
        //     .attr("fill", "black");


        svg.append("path")
            .datum(data)
            .attr("d", area)
            .attr("fill", "lightblue")
            .attr("stroke", "c70469")
            .attr("stroke-width", 2);

        // update the axes using updated scales
        const xAxis = d3.axisBottom(xScale);
        svg.select(".x-axis").call(xAxis);
    
        const yAxis = d3.axisLeft(yScale).ticks(4);
        svg.select(".y-axis").call(yAxis);
    }

    return {
        update // ES6 shorthand for "update": update
    };
}

// function StackedAreaChart(container) {
// 	// initialization
//     const margin = { top: 20, right: 30, bottom: 30, left: 40 };
//     const width = 640, height = 400;
    
//     const svg = d3.select(container)
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left}, ${margin.top})`);

//     // create axes containers
//     svg.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0, ${height})`);
//     svg.append("g")
//         .attr("class", "y-axis")
//         .attr("transform", `translate(0, ${width})`);

//     // defind scales with ranges only
//     let xScale = d3.scaleTime().rangeRound([0, width]).paddingInner(0.1);
//     let yScale = d3.scaleLinear().range([height, 0]);
//     let color = d3.scaleOrdinal(d3.schemeTableau10);

// 	function update(data){

// 	}

// 	return {
// 		update
// 	}
// }



d3.csv("unemployment.csv", d3.autoType).then(data => {
    // console.log(find_total(data));
    areachart1 = AreaChart(".chart");
    areachart1.update(data);
});