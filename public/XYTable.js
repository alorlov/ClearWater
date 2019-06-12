var XYTable = function( gov, startTId ) {
	this.ti = startTId || 0;
	this.gov = gov;
	this.tms = [];
	this.lines = [];
	
	this.colors = new PaintTM( this.gov );
	
	this.defaultLineA = 1; // abs line
	this.defaultLineQ = 2; // queue line
	this.defaultLineType = ["a", "a", "q", "h"];
	
	this.rw = 16; // min rect width
	this.rh = 16;
	this.brd = 1;
	this.padH = 0;
	
	// create line heads
	this.addLine( 0, 30, 10 );
	this.addLine( 1, 44, 15 );
	this.addLine( 2, 4, 59 );
	this.addLine( 3, 9, 1 );
}

XYTable.prototype = {
	
	tid : function() {
		return this.ti++;
	},
	
	addLine : function (i, w, x) {
		var type = this.defaultLineType[i],
			line = new XYLineHead(this, i, w, x, type);
		this.lines[i] = line;
		return line;
	},
	
	addTM : function ( h, edited, name, color, matrix, group ) {
		var id = this.tid(),
			colorObj = this.colors.add( id, color, matrix ); // object
		var tm = new XYTM( id, this, h, edited, name, colorObj, group );
		this.tms.push(tm);
		return tm;
	},
	
	addCloneTM : function ( tm0 ) {
		// clone TM
		var tm = this.addTM ( tm0.h, tm0.edited, tm0.name, tm0.c.color );
		this.tms.push(tm);
		// clone Clients
		tm.addCloneClients( tm0.clients )
		return tm;
	},
	
	getLine : function(l) {
		return this.lines[l];
	},
	
	htmlLineHeads: function() {
		var out = [];
		for ( var i=0, len=this.lines.length; i<len; i++) {
			out.push( this.lines[i].html() );
		}
		//return "<header id=_lineHeads>" + out.join('') + "</header>";
		return "<header id=_lineHeads>" + this.lines[this.defaultLineA].html() + "</header>";
	},
	
	css: function() {
		var css = [];
		
		for ( var i=0, len=this.lines.length; i<len; i++ ) {
			css.push( this.lines[i].css() );
		}
		
		for ( var i=0, len=this.tms.length; i<len; i++ ) {
			css.push( this.tms[i].css() );
		}
		return css.join('');
	},
}