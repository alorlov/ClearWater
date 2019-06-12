var VisioItem = function(name, visio) {
	this.visio = visio;
	this.doc = document;
	this.name = name;
	this.itemWidth = 50;
	this.itemHeight = 50;
	this.colWidth = this.itemWidth;
	this.css = [];
}

VisioItem.prototype = {
	
	addCss : function (str) {
		this.css.push(str);
	},
	
	buildCss : function () {
		this.visio.showCss(this.css);
		this.css = [];
	},
	
	createItem : function (id, name) {
		return "<div id='m" + id + "'>" + name + "</div>";
	},
	
	createCol : function (name, id, html) {
		this.addCss("." + name + " .col" + id + " { left: 0; top: -100%; z-index: " + (1000 - id) + " }");
		return "<nav class=col" + id + ">" + html + "</nav>";
	},
	
	createRace : function (id, name, html) {
		//this.addCss("." + name + " nav { margin-top: -100% }");
		return "<article id=b" + id + " class=" + name + ">" + html + "</article>";
	},
	
	buildItems : function (html) {
		this.buildCss();
		$("#" + this.name)[0].innerHTML += html;
	},
	
	showCol : function (raceName, id) {
		var left = id * this.colWidth;
		$("." + raceName + " .col" + id).css("left", left + "px");
	},
	
	hideCol : function (raceName, id) {
		$("." + raceName + " .col" + id).css("left", 0);
	},
	
	showRace : function (raceName) {
		$("." + raceName + " nav").css("top", 0);
	},
	
	hideRace : function (raceName) {
		$("." + raceName + " nav").css("top", "-100%");
	}
}