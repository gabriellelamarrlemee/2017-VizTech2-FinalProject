function Treemap(){
  //Set up a drawing environment
  var m = {t:50,r:50,b:50,l:50},
      w,
      h;

  var _dispatcher = d3.dispatch();
  var treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([w,h])
      .round(true)
      .paddingInner(1)

// BEGINNING OF THE EXPORTS SECTION
  var exports = function(selection){
    var data = selection.datum();

    w = w || selection.node().clientWidth - m.l - m.r;
    h = h || selection.node().clientHeight - m.t - m.b;

    var root = d3.hierarchy(data)
        .eachBefore(function(d){
          d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
        })
        .sum(sumBySize)
        .sort(function(a,b){
          return b.height - a.height || b.value - a.value;
        });

        treemap(root);

    var cell = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('transform',function(d){
          return 'translate('+d.x0+','+d.y0+')';
        });

    cell.append('rect')
        .

    // var nodes = treemap.nodes(data);
    // div.selectAll('.node').data(nodes).enter()
    //    .append('div')
    //    .style('position', 'absolute')
    //    .style('left', function(d){return d.x + margin * d.depth})
    //    .style('top', function(d){return d.y + margin * d.depth})
    //    .style('width', function(d) { return d.dx - 2 * margin * d.depth } )
    //    .style('height', function(d) { return d.dy - 2 * margin * d.depth } )
    //    .style('background-color', function(d) {
    //        return $c.rgb2hex(200, 200, 200 - 50 * d.depth)
    //    })
    //    .style('border', '1px solid black')
    //    .text(function(d) { return d.t; });

  }

  console.log('Returning exports');
  return exports;
}
