var XYLineHead = function( table, i, w, x, type ) {
	this.table = table;
	this.i = i;
	this.type = type;
	this.x = x; // in rects
	this.w = w; // in rects
}

XYLineHead.prototype = {
	// absolute x
	ax: function() {
		return this.x * this.table.rw;
	},
	// absolute width
	aw: function() {
		return this.w * this.table.rw;
	},
	// relative x
	rx: function( x ) {
		return Math.floor( x / this.table.rw );
	},
	// set relative x
	setX: function( ax ) {
		this.x = this.rx( ax );
	},
	
	html: function() {
		return "<div id=L" + this.i + " class=L" + this.i + ">" + this.i + "</div>";
	},
	
	cssPos: function() {
		return ".L" + this.i + " {" +
			"left:" + this.ax() + "px;" +
		"}"
	},
	
	css: function() {
		// aside J
		return "" +
		
		this.cssPos() +
			
		".j" + this.i + "{" +
			"width:" + this.aw() + "px;" +
			"height: 100%;" +
			//"top:" + ( this.type == "h" ? this.table.rh + "px;" : "0;" ) +
			"top:" + 0 + ";" +
			"position: absolute;" +
			//"border-left: 1px solid #fff;" +
		"}" +
		// aside L
		".l" + this.i + "{" +
			"width: 100%;" +
			"height: 100%;" +
			"position: relative;" +
		"}" +
		// aside div
		".l" + this.i + " div{" +
			"position:" + (this.type != "q" ? "absolute" : "static") + ";" +
			"float: left;" +
		"}";
	},
}