// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 800 - margin.left - margin.right,
    height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#tree_map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Read data
d3.csv("data/parcels_owner_using.csv").then(function(data) {

    data.forEach(function(d) {
        d.area = +d.area;
    });

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d) { return (d.ownership) }).keys()

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function(d) { return d; }) // text showed in the menu
        .attr("value", function(d) { return d; }); // corresponding value returned by the button

    function update(f) {

        var filtered = data.filter(function(d) { return d.ownership === f || d.category === f })

        console.log(filtered)

        // stratify the data: reformatting for d3.js
        var root = d3.stratify()
            .id(function(d) { return d.category; }) // Name of the entity (column name is name in csv)
            .parentId(function(d) { return d.ownership; }) // Name of the parent (column name is parent in csv)
            (filtered);
        root.sum(function(d) { return +d.area }) // Compute the numeric value for each entity

        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)

        console.log(root.leaves())
            // use this information to add rectangles:
            // ----------------
            // Create a tooltip
            // ----------------
        var tooltip = d3.select("#tree_map")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var showTooltip = function(d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 1)
            tooltip
                .html("<b>" + "Порушення: " + "</b>" + d.category + "<br>" + "<b>" + "Кількість порушень: " + "</b>" + d.area)
                .style("left", (d3.mouse(this)[0] + 90) + "px")
                .style("top", (d3.mouse(this)[1] - 90) + "px")
        }
        var moveTooltip = function(d) {
                tooltip
                    .style("left", (d3.mouse(this)[0] + 90) + "px")
                    .style("top", (d3.mouse(this)[1] - 90) + "px")
            }
            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 0)
        }


        var u = svg.selectAll("rect")
            .data(root.leaves());

        u
            .enter()
            .append("rect")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
            .attr('x', function(d) { return d.x0; })
            .attr('y', function(d) { return d.y0; })
            .attr('width', function(d) { return d.x1 - d.x0; })
            .attr('height', function(d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", "#69b3a2");
        u
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)

        // and to add the text labels


        var label = svg.selectAll("text")
            .data(root.leaves())

        label
            .enter()
            .append("text")
            .attr("x", function(d) { return d.x0 + 10 }) // +10 to adjust position (more right)
            .attr("y", function(d) { return d.y0 + 20 }) // +20 to adjust position (lower)
            .html(function(d) { return d.data.ownership + "/n" + d.data.area })
            .attr("font-size", "15px")
            .attr("fill", "white")
            /*.enter()
            .append("text")
            .attr("class", "bar-labels")
            .merge(label)
            .attr("y", function(d) { return y(d.category) + 10; })
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", function(d) { return x(d.area); })
            .attr("y", function(d) { return y(d.category) + 10; })
            .text(function(d) { return d.area; });*/

        label
            .exit()
            .remove()

    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
        update(selectedOption)
        console.log(selectedOption)
    })

})