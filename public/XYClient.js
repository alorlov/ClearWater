var XYClient = function( name, id, tm, line, w, h, x, y ) {
	this.id = id;
	this.name = name;
	this.tm = tm;
	this.line = line;
	this.lineI = this.line.head.i;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.a = false; // text-align
	this.va = 0; // vertical-align
	this.b = 0;
	this.c = { color: false, index: false }
	this.bg = { color: false, index: false }
}

XYClient.prototype = {
	move: function( x, y ) {
		if ( this.x != x || this.y != y ) {
			this.x = x; this.y = y;
		}
	},
	
	resize: function( w, h ) {
		if ( this.w != w || this.h != h ) {
			this.w = w; this.h = h;
		}
	},
	
	setStyle: function( a, va, b, c, bg ) {
		this.a = a;
		this.va = va;
		this.b = b;
		
		if ( c ) this.setColor( c, 2 );
		if ( bg ) this.setBGColor( bg, 2 );
	},
	
	setColor: function( color, index ) {
		if ( color || color === false ) this.c.color = color;
		if ( typeof index === 'number' ) this.c.index = index;
		return this.c;
	},
	
	setBGColor: function( color, index ) {
		if ( color || color === false ) this.bg.color = color;
		if ( typeof index === 'number' ) this.bg.index = index;
		return this.bg;
	},
	
	checkLine: function( line ) {
		if ( this.line != line ) {
			this.line = line;
			this.lineI = this.line.head.i;
			return true;
		}
	},
	
	setEdited: function() {
		this.tm.setEdited();
	},
	
	html: function( wi, ci, value, link ) {
		if ( this.a == "right2" ) {
			value = "<span id=W_>" + value + "</span>";
		}
		link = link ? " link" : "";
		return "<div id=w" + wi + " class='c" + ci + link + "'>" + value + "</div>";
	},
	
	css: function() {
		var t = this.tm.t,
			rw = t.rw,
			rh = t.rh,
			brd = t.brd,
			padH = t.padH,
			bg = "",
			color = "";
			
		if ( this.c.color ) {
			//bg = "background: " + t.colors.getColor( this.bg ) + ";";
			color = "color: " + t.colors.getColor( this.c ) + ";"		
		} else if ( this.bg.color ) {
			bg = "background: " + t.colors.getColorCellBg( this.bg ) + ";";
			color = "color: " + t.colors.getColorCellTxt( this.bg ) + ";"
		}
		return ".t" + this.tm.id +" .c" + this.id + "{" +
			"width:" + ( this.w * rw - brd - padH ) + "px;" +
			"height:" + ( this.h * rh - brd ) + "px;" +
			"top:" + ( this.y * rh ) + "px;" +
			"left:" + ( this.x * rw ) + "px;" +
			color +
			( bg ? "border-radius: 3px;" : "" ) +
			bg +
			( ( this.a == "center" || this.a == "right" ) ? "text-align:" + this.a + ";" : "" ) +
			( this.a == "center" ? "text-indent: 0px;" : "" ) +
			"font-weight:" + ( this.b ? "bold" : "normal" ) + ";" +
			( this.h > 1 ? "white-space: normal;" : "" ) +
			//"border-color: " + this.tm.t.colors.getColor( this.tm.c ) + ";" +
		"}";
	},
}