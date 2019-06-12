var HeaderRow = function(m) {
	this.manager = m;
	this.pos;
	this.el = {};
}
HeaderRow.prototype = {
	remove : function() {
		this.el.remove();
	}
}

var Header = function(gov) {
	this.gov = gov;
	this.visio = gov.visio;
	this.list = []; // elements
	
	this.container = $("#" + this.gov.name + " #main header");
	

}
Header.prototype = {
	
	refresh : function () {
	return false;
		var win = this.gov.window;
		
		var onScreenM = win.getShownM();
		var onScreenTM = win.getShownTM();
		
		// create tm html-elements
		var htmlTM = [];
		for (var id in onScreenTM) {
			htmlTM[id] = this.visio.createTM(onScreenTM[id]);
		}
		
		// create m objects
		var list = [];
		for (var id in onScreenM) {
			var m = onScreenM[id];
			list[id] = new HeaderRow(m);
		}

		// get direction
		var down = win.isForward();
		
		// remove old
		for (var i in this.list) {
			this.list[i].remove();
			delete this.list[i];
		}
		
		// insert new
		var html = htmlTM.join();
		var cont = $("#" + this.gov.name + " #main header");
		down ? cont.append(html) : cont.prepend(html);
		
		this.list = list;
		
		this.calc();
	},
	
	calc : function () {
		var p = this;
		$("#" + this.gov.name + " #main header").children().each(function(i, m){
			var el = $(m);
			p.list[i].el = el;
			p.list[i].pos = el.position().top;
		});
	},
	
	scroll : function(m) {
		var row = this.getRow(m);
		
		//$("#" + this.gov.name + " #main header").scrollTop(row.pos);
		
		$("#" + this.gov.name + " #main header").animate({
			//scrollTop: row.pos,
		}, 0);
		$("#" + this.gov.name + " #main header").animate({
			scrollTop: row.pos,
		},200);
	},
	
	getRow : function(m) {
		for (var i in this.list) {
			if (this.list[i].manager == m)
				return this.list[i];
		}
	},
}