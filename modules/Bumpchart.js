function Bumpchart(){
  //Set up a drawing environment
  var m = {t:50,r:50,b:50,l:50},
      w,
      h,
      dragging = {},
      Xdomain = [0,1],
      formatPercent = d3.format('.0%'),
      setTickValues = [0,.25,.5,.75,1],
      dimensions = function(d){return d3.keys(d[0]).filter(function(d){return (d == 'asian_pct' || d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});};

  //Scales etc.
  var scaleColor = d3.scaleOrdinal().range(['#c1a64f','#598dc1','#7bcab3','#8c5ea7']);
  var _dispatcher = d3.dispatch();


// BEGINNING OF THE EXPORTS SECTION
  var exports = function(selection){
    var data = selection.datum();


    w = w || selection.node().clientWidth - m.l - m.r;
    h = h || selection.node().clientHeight - m.t - m.b;

    //scales for the bump chart
    var y = d3.scalePoint().range([0,h]);
        x = d3.scaleLinear().domain(Xdomain).range([70,w]);

    scaleColor.domain(['small','medium','large','extra-large']);

    //line generator
    var line = d3.line(),
        axisX = d3.axisTop(),
        background,
        foreground,
        school_average = [],
        city_average = [{ asian_pct:.055, black_pct:.33, hispanic_pct:.29, white_pct:.32, other_pct:.05 }],
        country_average = [{ asian_pct:.055, black_pct:.133, hispanic_pct:.176, white_pct:.616, other_pct:.014 }];

    city_average[0].asian_pct_diff = (city_average[0].asian_pct/city_average[0].asian_pct);
    city_average[0].black_pct_diff = (city_average[0].black_pct/city_average[0].black_pct);
    city_average[0].hispanic_pct_diff = (city_average[0].hispanic_pct/city_average[0].hispanic_pct);
    city_average[0].white_pct_diff = (city_average[0].white_pct/city_average[0].white_pct);
    country_average[0].asian_pct_diff = (country_average[0].asian_pct/city_average[0].asian_pct);
    country_average[0].black_pct_diff = (country_average[0].black_pct/city_average[0].black_pct);
    country_average[0].hispanic_pct_diff = (country_average[0].hispanic_pct/city_average[0].hispanic_pct);
    country_average[0].white_pct_diff = (country_average[0].white_pct/city_average[0].white_pct);

    var avgAsian = d3.mean(data,function(d){return d.asian_pct}),
        avgBlack = d3.mean(data,function(d) { return d.black_pct}),
        avgHispanic = d3.mean(data,function(d) { return d.hispanic_pct}),
        avgWhite = d3.mean(data,function(d) { return d.white_pct}),
        avgOther = d3.mean(data,function(d) { return d.other_pct}),
        avgLowIncome = d3.mean(data,function(d) { return d.low_income_pct}),
        avgDiverseLearners = d3.mean(data,function(d) { return d.diverse_learners_pct}),
        avgLimitedEnglish = d3.mean(data,function(d) { return d.limited_english_pct}),
        avgMobilityRate = d3.mean(data,function(d) { return d.mobility_rate_pct});

    for(i=0;i<data.length;i++){
      data[i].asian_pct_diff = data[i].asian_pct/city_average[0].asian_pct;
      data[i].black_pct_diff = data[i].black_pct/city_average[0].black_pct;
      data[i].hispanic_pct_diff = data[i].hispanic_pct/city_average[0].hispanic_pct;
      data[i].white_pct_diff = data[i].white_pct/city_average[0].white_pct;
      //console.log(data[i].asian_pct_diff,data[i].black_pct_diff,data[i].hispanic_pct_diff,data[i].white_pct_diff);
    };

    var extentAsianDifference = d3.extent(data, function(d){return d.asian_pct_diff;});
    var extentBlackDifference = d3.extent(data, function(d){return d.black_pct_diff;});
    var extentHispanicDifference = d3.extent(data, function(d){return d.hispanic_pct_diff;});
    var extentWhiteDifference = d3.extent(data, function(d){return d.white_pct_diff;});

    school_average.push({
      asian_pct:avgAsian,
      asian_pct_diff:school_average.asian_pct/city_average[0].asian_pct,
      black_pct:avgBlack,
      black_pct_diff:school_average.black_pct/city_average[0].black_pct,
      hispanic_pct:avgHispanic,
      hispanic_pct_diff:school_average.hispanic_pct/city_average[0].hispanic_pct,
      white_pct:avgWhite,
      white_pct_diff:school_average.white_pct/city_average[0].white_pct,
      other_pct:avgOther,
      low_income_pct:avgLowIncome,
      diverse_learners_pct:avgDiverseLearners,
      limited_english_pct:avgLimitedEnglish,
      mobility_rate_pct:avgMobilityRate
    });

    dimensionsData = dimensions(data);
    y.domain(dimensionsData);

    //function to return the path for a given data point
    function path(d){ return line(dimensionsData.map(function(p){ return [ x(d[p]),y(p) ]; })); }

    //add the school lines
    var svg = selection.selectAll('svg')
        .data([1]);
    var svgEnter = svg.enter().append('svg')
        .attr('width', w + m.l + m.r)
        .attr('height', h + m.t + m.b);
    svgEnter.append('g').attr('class','canvas');
    var plot = svgEnter.merge(svg)
        .select('.canvas')
        .attr('transform','translate('+ m.l+','+ m.t+')');

    //background lines
    var lines = plot.selectAll('.background').data(data);
    var linesEnter = lines.enter().append('g').attr('class','background');
    linesEnter.append('path').attr('class','background-line');
    var linesUpdate = lines.merge(linesEnter).select('.background-line').attr('d',path).style('stroke','#d1d3d4');
    var linesExit = lines.exit().remove();

    //foreground lines
    var topLines = plot.selectAll('.foreground').data(data);
    var topLinesEnter = topLines.enter().append('g').attr('class','foreground');
    topLinesEnter.append('path').attr('class','foreground-line')
        .style('stroke-opacity',0)
        .transition()
        .delay(function(d,i){return i*2})
        .style('stroke-opacity',.3);
    var topLinesUpdate = topLines.merge(topLinesEnter)
        .select('.foreground-line').attr('d',path)
        .style('stroke',function(d){return scaleColor(d.students_cat)})
        .style('stroke-width',1);
    var topLinesExit = topLines.exit().transition().delay(function(d,i){return i*2}).remove();


    //add school line hover effect
    d3.selectAll('.foreground-line')
    .on('mouseover',function(d){
      var select = d3.select(this);
      select.style('stroke-opacity',1).style('stroke-width',5);

      var tooltip = d3.select('.custom-tooltip');
      tooltip.selectAll('p').style('color','black');
      tooltip.select('.name').text(d.name);
      tooltip.select('.grades').text(d.grades_cat);
      tooltip.select('.type').text(d.type);
      tooltip.select('.rating').text(d.rating);
      tooltip.select('.probation').text(d.probation_status);
      tooltip.select('.black').text('Black Students: '+Math.round((d.black_pct*100))+'%');
      tooltip.select('.hispanic').text('Hispanic Students: '+Math.round((d.hispanic_pct*100))+'%');
      tooltip.select('.white').text('White Students: '+Math.round((d.white_pct*100))+'%');
      tooltip.select('.other_pcts').text('Low Income Students: '+Math.round((d.low_income_pct*100))+'%');
      tooltip.style('background-color','white').transition().style('opacity',1);
      tooltip.transition().style('opacity',1);
    })
    .on('mousemove',function(d){
        console.log(this);
        var tooltip = d3.select('.custom-tooltip');
        var x = event.pageX;
        var y = event.pageY;
        tooltip
            .style('left',x+10+'px')
            .style('top',y+10+'px');
    })
    .on('mouseout',function(d){
      var select = d3.select(this);
      select.style('stroke-opacity',.3).style('stroke-width',1);
      var tooltip = d3.select('.custom-tooltip');
      tooltip.transition().style('opacity',0);
    });

    // School mean line
    var avgSchoolLine = plot.selectAll('.school_average').data(school_average);
    var avgSchoolEnter = avgSchoolLine.enter()
        .append('g')
        .attr('class','school_average average');
    avgSchoolEnter.append('path').attr('class','school_average-line');
    var avgSchoolUpdate = avgSchoolLine.merge(avgSchoolEnter)
        .select('.school_average-line').attr('d',path)
        .style('stroke','black').style('stroke-width','2px')
        .style("stroke-dasharray", ("2, 2"));


    // Citywide mean line
    var avgCityLine = plot.selectAll('.city_average').data(city_average);
    var avgCityEnter = avgCityLine.enter()
        .append('g')
        .attr('class','city_average average');
    avgCityEnter.append('path').attr('class','city_average-line');
    var avgCityUpdate = avgCityLine.merge(avgCityEnter)
        .select('.city_average-line').attr('d',path)
        .style('stroke','black').style('stroke-width','2px')
        .style("stroke-dasharray", ("4, 4"));

    //add school and city hover effect
    d3.selectAll('.city_average-line')
    .on('mouseover',function(d){
      console.log('mouseover');
      var select = d3.select(this);
      console.log(this);
      select.style('stroke-width','4px');
      var tooltip = d3.select('.custom-tooltip');
      tooltip.selectAll('p').style('color','white');
      tooltip.select('.name').text('CITY-WIDE DEMOGRAPHICS');
      tooltip.select('.black').text('Black: '+Math.round((d.black_pct*100))+'%');
      tooltip.select('.hispanic').text('Hispanic: '+Math.round((d.hispanic_pct*100))+'%');
      tooltip.select('.white').text('White: '+Math.round((d.white_pct*100))+'%');
      tooltip.style('background-color','black').transition().style('opacity',1);
    })
    .on('mousemove',function(d){
        console.log(this);
        var tooltip = d3.select('.custom-tooltip');
        var x = event.pageX;
        var y = event.pageY;
        tooltip
            .style('left',x+10+'px')
            .style('top',y+10+'px');
    })
    .on('mouseout',function(d){
      var select = d3.select(this);
      select.style('stroke-width',2);
      var tooltip = d3.select('.custom-tooltip');
      tooltip.transition().style('opacity',0);
    });

    //add a group element for each dimension
    var g = plot.selectAll('.dimension')
        .data(dimensionsData);
    var gEnter = g.enter().append('g')
        .attr('class','dimension');
    var rowHeader = gEnter.append('text').attr('class','rowHeader');
    var gUpdate = g.merge(gEnter)
        .attr('transform',function(d){return 'translate('+ 0 + ',' + y(d) + ')';})
        .call(d3.drag().subject(function(d){ return { y:y(d) }; })
        .on('start',dragstarted)
        .on('drag',dragged)
        .on('end',dragend));
    var gExit = g.exit().remove();

    rowHeader.attr('text-anchor','end')
        .attr('color','black').attr('y',5).attr('x',55)
        .text(function(d){
          if(d=='asian_pct'){return 'Asian Students'}
          else if (d=='black_pct'){return 'Black Students'}
          else if (d=='hispanic_pct'){return 'Hispanic Students'}
          else if (d=='white_pct'){return 'White Students'}
          else if (d=='low_income_pct'){return 'Low Income'}
          else if (d=='diverse_learners_pct'){return 'Diverse Learners'}
          else if (d=='limited_english_pct'){return 'Limited English'}
          else if (d=='mobility_rate_pct'){return 'Mobility Rate'}
          else {return String}});


    gUpdate.call(d3.drag().subject(function(d){ return { y:y(d) }; })
        .on('start',dragstarted).on('drag',dragged).on('end',dragend));

    function dragstarted(d){
      dragging[d] = y(d);
      lines.attr('visibility','hidden');
      console.log(dragging[d]);
    }

    function dragged(d){
      dragging[d] = Math.min(h,Math.max(0,d3.event.y));
      topLines.attr('d',path);
      dimensionsData.sort(function(a,b){return position(a) - position(b);});
      y.domain(dimensionsData);
      gUpdate.attr('transform', function(d){return 'translate('+ 0 + ',' + position(d) + ')';});
    }

    function dragend(d){
      delete dragging[d];
      transition(d3.select(this)).attr('transform','translate('+ 0 + ',' + y(d) + ')');
      transition(d3.selectAll('.foreground-line')).attr('d',path);
      d3.selectAll('.background-line').attr('d',path)
        .transition()
        .delay(500)
        .duration(0)
        .attr('visibility',null);
    }

    function position(d){
      var v = dragging[d];
      return v == null ? y(d) : v;
    }

    function transition(d){
      return d.transition().duration(500);
    }

    // add axis and title
    var axis = gEnter.selectAll('.axis').data([0]);
    var axisEnter = axis.enter().append('g').attr('class','axis');
    var axisUpdate = axis.merge(axisEnter)
        .each(function(d){d3.select(this).call(axisX.scale(x).tickValues(setTickValues).tickFormat(formatPercent));});
    var axisRemove = axis.exit().remove();


    var brush = d3.brushX().on('brush',brush);

    // Add and store a brush for each axis
    g.append('g')
        .each(function(d){
          d3.select(this).attr('class', 'brush '+d).call(brush.extent([[70,-8],[w,10]])); })
        .selectAll('rect')
        .style('background-color','red');

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var thisBrush = d3.select(this.parentNode);
      var thisDimension = thisBrush.select('text').data()[0];
      var actives = dimensionsData.filter(function(d){ console.log(d); return d == thisDimension;}),
          extents = actives.map(function(p) { return d3.event.selection; });

      d3.selectAll('.foreground-line').style('display',function(d){
        return actives.every(function(p,i){
          return extents[i][0] <= x(d[p]) && x(d[p]) <= extents[i][1];
        }) ? null:'none';
      });
    }



  }

  exports.dimensions = function(_arr){
    if(!arguments.length) return dimensions;
    dimensions = _arr;
    return this;
  }

  exports.Xdomain = function(_arr){
    if(!arguments.length) return Xdomain;
    Xdomain = _arr;
    return this;
  }

  exports.formatPercent = function(_arr){
    if(!arguments.length) return formatPercent;
    formatPercent = _arr;
    return this;
  }

  exports.setTickValues = function(_arr){
    if(!arguments.length) return setTickValues;
    setTickValues = _arr;
    return this;
  }

  return exports;
}
