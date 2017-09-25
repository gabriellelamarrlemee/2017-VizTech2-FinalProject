var dispatcher = d3.dispatch('update');

//import data
d3.queue()
	.defer(d3.csv,'data/schools.csv',parseData)
	.await(dataLoaded);

	function dataLoaded(err, data){
		var cf = crossfilter(data);
		var schoolsByType = cf.dimension(function(d){return d.type});
		var schoolsByName = cf.dimension(function(d){return d.name});
		var schoolsByRating = cf.dimension(function(d){return d.rating});
		var schoolsByProbation = cf.dimension(function(d){return d.probation_status});
		var schoolsBySize = cf.dimension(function(d){return d.students_cat});
		var schoolsByGrades = cf.dimension(function(d){return d.grades_cat}, true);


		var cfData = schoolsByName.top(Infinity);

		//console.log(schoolsBySize.top(10));

		//benchmark numbers **TO DO: Add in a median line**
		var avgStudents = d3.mean(data,function(d) {return d.students}),
				medianStudents = d3.median(data,function(d){return d.students})
				// avgRating = /*fill with correct info*/,
				// avgProbationStatus = /*fill with correct info*/,
				;

		var bumpchart = Bumpchart();
		var plot1 = d3.select('#plot1');
		var controller = new ScrollMagic.Controller();

		$('#plot1').affix({
	    offset: {
				top: $('#plot1').offset().top
			}
		});

		//d3.select('#plot1').datum(cfData).call(bumpchart);

		var sceneA = new ScrollMagic.Scene({ triggerElement:'#trigger1', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0 }) // All races
				.on('start',function(){
					plot1.datum(cfData).call(bumpchart
							 .dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							 .Xdomain([0,1])
							 .setTickValues([0,0.25,0.5,0.75,1])
				);
				d3.select('.highlight').transition().style('background-color','transparent');
				d3.select('.intro').selectAll('p').transition().style('opacity',1);
		});

		// var sceneB = new ScrollMagic.Scene({ offset: 550, duration: 400 })
		// 		.on('start',function(){
		// 			plot1.datum(cfData).call(bumpchart
		// 					 .dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct_diff' || d == 'hispanic_pct_diff' || d == 'white_pct_diff');});})
		// 					 .Xdomain([0,3.5])
		// 					 //.formatPercent(function(x){return d3.format('+.0%')(x-1);})
		// 					 .setTickValues([0,3.5])
		// 				);
		// 		});

		var sceneB = new ScrollMagic.Scene({ triggerElement:'#trigger2', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true}) // All races - charter schools
				.on('start',function(){
					schoolsByGrades.filter(null);
					schoolsByGrades.filter(function(d){return d == 'elementary school' || d == 'middle school'});
					plot1.datum(schoolsByGrades.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.elementary').transition().style('background-color','#FFFF00');
					d3.select('.middle').transition().style('background-color','#FFFF00');
		});

		var sceneD = new ScrollMagic.Scene({ triggerElement:'#trigger4', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByGrades.filter(null); schoolsByType.filter(null);
					schoolsByGrades.filter('high school');
					plot1.datum(schoolsByGrades.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.high').transition().style('background-color','#FFFF00');
		});

		var sceneE = new ScrollMagic.Scene({ triggerElement:'#trigger5', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByGrades.filter(null); schoolsByType.filter(null);
					schoolsByType.filter(function(d){return d != 'Neighborhood'});
					plot1.datum(schoolsByType.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct' || d == 'low_income_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.non-neighborhood').transition().style('background-color','#FFFF00');
		});

		var sceneF = new ScrollMagic.Scene({ triggerElement:'#trigger6', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByType.filter(null);
					schoolsByRating.filter(null);
					schoolsByType.filter('Neighborhood');
					plot1.datum(schoolsByType.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct' || d == 'low_income_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.neighborhood').transition().style('background-color','#FFFF00');
		});
		var sceneG = new ScrollMagic.Scene({ triggerElement:'#trigger7', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByGrades.filter(null);
					schoolsByType.filter(null);
					schoolsByRating.filter(null);
					schoolsByRating.filter('Level 1+');
					plot1.datum(schoolsByRating.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.level1plus').transition().style('background-color','#FFFF00');
		});
		var sceneH = new ScrollMagic.Scene({ triggerElement:'#trigger8', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByRating.filter(null);
					schoolsByProbation.filter(null);
					schoolsByRating.filter('Level 2');
					//console.table(schoolsByRating.top(Infinity));
					plot1.datum(schoolsByRating.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.level2plus').transition().style('background-color','#FFFF00');
		});

		var sceneI = new ScrollMagic.Scene({ triggerElement:'#trigger9', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByRating.filter(null);
					schoolsByProbation.filter(null);
					schoolsByProbation.filter('Good Standing');
					plot1.datum(schoolsByProbation.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.good').transition().style('background-color','#FFFF00');
		});

		var sceneJ = new ScrollMagic.Scene({ triggerElement:'#trigger10', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByProbation.filter(null);
					schoolsBySize.filter(null);
					schoolsByProbation.filter('Intensive Support');
					plot1.datum(schoolsByProbation.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.intensive').transition().style('background-color','#FFFF00');
		});

		var sceneK = new ScrollMagic.Scene({ triggerElement:'#trigger11', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByProbation.filter(null);
					schoolsByName.filter(null);
					schoolsBySize.filter('extra-large');
					plot1.datum(schoolsBySize.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.XL').transition().style('background-color','#FFFF00');
		});

		var sceneL = new ScrollMagic.Scene({ triggerElement:'#trigger12', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsBySize.filter(null);
					schoolsByName.filter(function(d){return d == 'OGDEN HS' || d == 'JENNER'});
					plot1.datum(schoolsByName.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct' || d == 'low_income_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.distanceA').transition().style('background-color','#FFFF00');
		});

		var sceneM = new ScrollMagic.Scene({ triggerElement:'#trigger13', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByName.filter(null);
					schoolsByName.filter(function(d){return d == 'LINCOLN' || d == 'MANIERRE'});
					plot1.datum(schoolsByName.top(Infinity)).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct' || d == 'low_income_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
					d3.selectAll('.highlight').transition().style('background-color','transparent');
					d3.select('.distanceB').transition().style('background-color','#FFFF00');
		});


		var sceneO = new ScrollMagic.Scene({ triggerElement:'#trigger15', offset: -(document.documentElement.clientHeight/1.3), triggerHook: 0, reverse: true }) // All races - charter schools
				.on('start',function(){
					schoolsByName.filter(null);
					plot1.datum(cfData).call(bumpchart
							.dimensions(function(d){return d3.keys(d[0]).filter(function(d){
								return (d == 'black_pct' || d == 'hispanic_pct' || d == 'white_pct' || d == 'low_income_pct' || d == 'diverse_learners_pct' || d == 'limited_english_pct' || d == 'mobility_rate_pct');});})
							.Xdomain([0,1])
							.setTickValues([0,0.25,0.5,0.75,1])
					);
		});

		controller.addScene([sceneA, sceneB, sceneD, sceneE, sceneF, sceneG, sceneH, sceneI, sceneJ, sceneK, sceneL, sceneM, sceneO]);


		var buttons = d3.selectAll('.btn-group');
		//.buttons.select('.school-type-btn').datum(schoolsByType).call(TypeButton);

		buttons.selectAll('.school-type-btn').on('click',function(){
			console.log(this);
			var type = d3.select(this).select('div')._groups[0];
			console.log(type[0].id);
			if(!d3.select(this).classed('active')){
				console.log('checked'); schoolsByType.filter(type[0].id);} else{
					console.log('not checked'); schoolsByType.filter(null);};
			dispatcher.call('update');
		});

		buttons.selectAll('.grade-level-btn').on('click',function(){
			console.log(this);
			var type = d3.select(this).select('div')._groups[0];
			console.log(type[0].id);
			if(!d3.select(this).classed('active')){
				console.log('checked'); schoolsByGrades.filter(type[0].id);} else{
					console.log('not checked'); schoolsByGrades.filter(null);};
			dispatcher.call('update');
		});

		buttons.selectAll('.school-rating-btn').on('click',function(){
			console.log(this);
			var type = d3.select(this).select('div')._groups[0];
			console.log(type[0].id);
			if(!d3.select(this).classed('active')){
				console.log('checked'); schoolsByRating.filter(type[0].id);} else{
					console.log('not checked'); schoolsByRating.filter(null);};
			dispatcher.call('update');
		});

		buttons.selectAll('.probation-status-btn').on('click',function(){
			console.log(this);
			var type = d3.select(this).select('div')._groups[0];
			console.log(type[0].id);
			if(!d3.select(this).classed('active')){
				console.log('checked'); schoolsByProbation.filter(type[0].id);} else{
					console.log('not checked'); schoolsByProbation.filter(null);};
			dispatcher.call('update');
		});

		buttons.selectAll('.school-size-btn').on('click',function(){
			console.log(this);
			var type = d3.select(this).select('div')._groups[0];
			console.log(type[0].id);
			if(!d3.select(this).classed('active')){
				console.log('checked'); schoolsBySize.filter(type[0].id);} else{
					console.log('not checked'); schoolsBySize.filter(null);};
			dispatcher.call('update');
		});


		//Listen to global dispatcher events
		dispatcher.on('update',update);

		function update(){
			d3.select('#plot1').datum(schoolsByType.top(Infinity))
				.call(bumpchart);
		}

	}


function parseData(d){
	return {
		name:d.name,
		//street_address:d.street_address,
		//city:d.city,
		//state:d.state,
		//zip:d.zip,
		//id:d.id?d.id:undefined,
		grades:d.grades,
		type:d.type,
		students:+d.students,
		rating:d.rating,
		probation_status:d.probation_status,
		asian_pct:d.asian?+d.asian:undefined,
		black_pct:d.black?+d.black:undefined,
		hispanic_pct:d.hispanic?+d.hispanic:undefined,
		white_pct:d.white?+d.white:undefined,
		other_pct:d.other?+d.other:undefined,
		low_income_pct:d.low_income?+d.low_income:undefined,
		diverse_learners_pct:d.diverse_learners?+d.diverse_learners:undefined,
		limited_english_pct:d.limited_english?+d.limited_english:undefined,
		mobility_rate_pct:d.mobility_rate?+d.mobility_rate:undefined,
		students_cat:d.students_cat,
		grades_cat:(d.grades_cat).split(',')
		//chronic_truancy_pct:+d.chronic_truancy

	}
}
