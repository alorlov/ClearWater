var ItemsCol = function(race, size, num) {
	this.race = race;
	this.num = num;
	this.size = size;
	this.items = [];
}

ItemsCol.prototype = {
	
	add : function(item) {
		
		this.items.push(item);
	},
	
	isFull : function() {
		return this.items.length >= this.size;
	},
	
	html : function() {
		var html = [];
		
		for (var i=0, len=this.items.length; i<len; i++) {
			var item = this.items[i];
			
			html.push (item.html());
		}
		return this.race.visio.createCol(this.race.name, this.num, html.join(''));
	},
	
	show : function() {
		this.race.visio.showCol(this.race.name, this.num);
	},
	
	hide : function() {
		this.race.visio.hideCol(this.race.name, this.num);
	}
}