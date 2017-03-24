/*//this is the pie chart
//pie chart data transformation
var nestedByType = d3.nest()
    .key(function(d){return d.type})
    .entries(data);

var arc = d3.arc()
    .startAngle(function(d){ return d.startAngle })
    .endAngle(function(d){ return d.endAngle })
    .innerRadius(10)
    .outerRadius(30);

//pie layout   -->  data transformation
var pie = d3.pie()
    .value(function(d){ return d.values.length });

//draw the slices
var slices = plot.selectAll('path')
    .data(pie(nestedByType))
    .enter()
    .append('path')
    .attr('d',arc)
    .attr('transform','translate('+w/2+','+h/2+')')
    .style('fill', function(d,i){return scaleColor(i);})*/
