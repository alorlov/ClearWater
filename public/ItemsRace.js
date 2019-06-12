var ItemsRace = function(booker, parent) {
	this.parent = parent;
	this.booker = booker;
	this.name = booker.name;
	this.cols = [];
	this.items = [];
	this.visio = parent.visio;
	
	var managers = booker.managers;
	for (var i=0, len=managers.length; i<len; i++) {
		
		var manager = managers[i];
		this.add(manager);
	}
	
	this.update(parent.gov.window.height);
}

ItemsRace.prototype = {
	
	add : function(manager) {
		this.items.push(new ItemsItem(this, manager));
	},
	
	html : function () {
	
		var html = [];
		
		for (var i=0, len=this.cols.length; i<len; i++) {
			var col = this.cols[i];
			
			html.push (col.html());
		}
		return this.visio.createRace(this.booker.id, this.name, html.join(''));
	},
	
	// create cols
	update : function(height) {
		
		this.cols = [];
		
		var size = Math.floor(height / this.visio.itemHeight),
			num = 0;
			
		this.cols[num] = new ItemsCol(this, size, num);
		var col = this.cols[num];
		
		for (var i=0, len=this.items.length; i<len; i++) {
			
			var item = this.items[i];
			
			if (!col.isFull()) 
			{
				col.add(item);
			} 
			else {
				this.cols[++num] = new ItemsCol(this, size, num);
				col = this.cols[num];
				col.add(item);
			}
		}
	},
	
	show : function() {
		this.visio.showRace(this.name);
	},
	
	hide : function() {
		this.visio.hideRace(this.name);
	},
	
	showSecond : function() {
		
		for (var i=0, len=this.cols.length; i<len; i++) {
		
			this.visio.showCol(this.name, i);
		}
	},
	
	hideSecond : function() {
		
		for (var i=0, len=this.cols.length; i<len; i++) {
		
			this.visio.hideCol(this.name, i);
		}
	},
}