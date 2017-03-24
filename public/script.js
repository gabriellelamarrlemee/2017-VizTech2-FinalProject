
var dispatcher = d3.dispatch('update');

//import data
d3.queue()
	.defer(d3.csv,'./data/SchoolData_050717.csv',parseData)
	.await(dataLoaded);

	function dataLoaded(err, data){
		var cf = crossfilter(data);
		var schoolsByType = cf.dimension(function(d){return d.type});
		var schoolsByName = cf.dimension(function(d){return d.name});
		var schoolsByRating = cf.dimension(function(d){return d.rating});
		var schoolsByProbation = cf.dimension(function(d){return d.probation_status});

		var cfData = schoolsByName.top(Infinity);
		console.log(schoolsByType.top(Infinity));

		//benchmark numbers **TO DO: Add in a median line**
		var avgStudents = d3.mean(data,function(d) { return d.students}),
				medianStudents = d3.median(data,function(d){return d.students}),
				// avgRating = /*fill with correct info*/,
				// avgProbationStatus = /*fill with correct info*/,
				avgAsian = d3.mean(data,function(d) { return d.asian_pct}),
				avgBlack = d3.mean(data,function(d) { return d.black_pct}),
				avgHispanic = d3.mean(data,function(d) { return d.hispanic_pct}),
				avgWhite = d3.mean(data,function(d) { return d.white_pct}),
				avgOther = d3.mean(data,function(d) { return d.other_pct}),
				avgLowIncome = d3.mean(data,function(d) { return d.low_income_pct}),
				avgDiverseLearners = d3.mean(data,function(d) { return d.diverse_learners_pct}),
				avgLimitedEnglish = d3.mean(data,function(d) { return d.limited_english_pct}),
				avgMobilityRate = d3.mean(data,function(d) { return d.mobility_rate_pct}),
				avgChronicTruancy = d3.mean(data,function(d) { return d.chronic_truancy_pct});

		var bumpchart = Bumpchart();
		d3.select('#plot1').datum(cfData).call(bumpchart);

		var schoolTypeList = Menu()
				.on('menu:select',function(id){
					console.log('App:start menu:select')
					console.log(id);
					schoolsByType.filter(id);
					console.log(schoolsByType.top(Infinity));
					dispatcher.call('update');
				});

		d3.select('#school-type').datum(data).call(schoolTypeList);

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
		asian_pct:+d.asian,
		black_pct:+d.black,
		hispanic_pct:+d.hispanic,
		white_pct:+d.white,
		other_pct:+d.other,
		low_income_pct:+d.low_income,
		diverse_learners_pct:+d.diverse_learners,
		limited_english_pct:+d.limited_english,
		mobility_rate_pct:+d.mobility_rate
		//chronic_truancy_pct:+d.chronic_truancy
	}
}
