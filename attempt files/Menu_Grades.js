function MenuGrades(){
	var _dispatcher = d3.dispatch('menu:select');

	var exports = function(selection){
		var arr = selection.datum();

		var menuItem = selection.selectAll('li')
			.data(arr,function(d){return d.name});

		menuItem.enter().append('li')
			.append('a')
			.attr('href','#')
			.html(function(d){return d.grades_cat;})
			.on('click',function(d){
				d3.event.preventDefault();
				console.log(d);
				console.log('menu:select:'+d.grades_cat);
				_dispatcher.call('menu:select',this,d.grades_cat);
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