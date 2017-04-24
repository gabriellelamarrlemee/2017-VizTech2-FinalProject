function MenuProbation(){
	var _dispatcher = d3.dispatch('menu:select');

	var exports = function(selection){
		var arr = selection.datum();

		var menuItem = selection.selectAll('li')
			.data(arr,function(d){return d.name});

		menuItem.enter().append('li')
			.append('a')
			.attr('href','#')
			.html(function(d){return d.probation_status;})
			.on('click',function(d){
				d3.event.preventDefault();
				console.log(d);
				console.log('menu:select:'+d.probation_status);
				_dispatcher.call('menu:select',this,d.probation_status);
			});

		menuItem.exit().remove();

		selection.insert('li','li')
			.datum(null)
			.append('a')
			.attr('href','#')
			.html('All schools')
			.on('click',function(d){
				d3.event.preventDefault();
				_dispatcher.call('menu:select',this,null);
			});
	}

	exports.on = function(){
		_dispatcher.on.apply(_dispatcher,arguments);
		return this
	}


	return exports;
}
