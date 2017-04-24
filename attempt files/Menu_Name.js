function MenuName(){
	var _dispatcher = d3.dispatch('menu:select');

	var exports = function(selection){
		var arr = selection.datum();

		var menuItem = selection.selectAll('li')
			.data(arr,function(d){return d.name});

		menuItem.enter().append('li')
			.append('a')
			.attr('href','#')
			.html(function(d){return d.name;})
			.on('click',function(d){
				d3.event.preventDefault();
				console.log(d);
				console.log('menu:select:'+d.name);
				_dispatcher.call('menu:select',this,d.name);
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
