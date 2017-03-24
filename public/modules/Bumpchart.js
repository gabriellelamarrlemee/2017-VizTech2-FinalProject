//ADD BUMP CHART CODE HERE

function Bumpchart(){
  //Set up a drawing environment
  var m = {t:50,r:50,b:50,l:50},
      w,
      h;

  //Scales etc.
  var scaleColor = d3.scaleOrdinal().range(d3.schemeCategory20);
  var _dispatcher = d3.dispatch()


// BEGINNING OF THE EXPORTS SECTION
  var exports = function(selection){
    var data = selection.datum();

    w = w || selection.node().clientWidth - m.l - m.r;
    h = h || selection.node().clientHeight - m.t - m.b;

    //scales for the bump chart
    var x = d3.scalePoint().range([0,w],.5),
        y = {};

    //line generator
    var line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground;

    //extract the list of dimensions and create a scale for each
    x.domain(dimensions = d3.keys(data[0]).filter(function(d){
      return d != 'name' && d != 'type' && d != 'rating' && d != 'probation_status' && d != 'grades' && (y[d] = d3.scaleLinear()
              .domain(d3.extent(data,function(p){ return +p[d]; }))
              .range([h,0]));
    }));

    //function to return the path for a given data point
    function path(d){ return line(dimensions.map(function(p){return [x(p),y[p](d[p])];})); }

    var svg = selection.selectAll('svg')
        .data([1]);

    var svgEnter = svg.enter().append('svg')
        .attr('width', w + m.l + m.r)
        .attr('height', h + m.t + m.b);

    svgEnter.append('g').attr('class','canvas');

    var plot = svgEnter.merge(svg)
        .select('.canvas')
        .attr('transform','translate('+ m.l+','+ m.t+')');

    var lines = plot.selectAll('g')
        .data(data);

    var linesEnter = lines.enter()
        .append('g')
        .attr('class','background');

    linesEnter.append('path').attr('class','line');

    var linesUpdate = lines.merge(linesEnter)
        .select('.line').attr('d',path);

    var linesExit = lines.exit().remove();

    //add a group element for each dimension
    var g = plot.selectAll('.dimension')
        .data(dimensions)
        .enter().append('g')
        .attr('class','dimension')
        .attr('transform',function(d){return 'translate(' + x(d) + ')';});

    //add axis and title
    g.append('g').attr('class','axis')
        .each(function(d){d3.select(this).call(axis.scale(y[d]));});
    g.append('text')
        .attr('text-anchor','middle')
        .attr('color','black')
        .attr('y',-9)
        .text(String);
  }
  console.log('Returning exports');
  return exports;
}
