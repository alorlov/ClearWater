var XYTM = function ( id, table, height, edited, name, color, group ) {
	this.id = id;
	this.name = name || "Style " + this.id;
	this.ci = 0;
	this.t = table;
	this.lines = [];
	this.clients = [];
	this.edited = edited; // true, if user has ever changed one of xyClients for this TM
	this.c = color;
	this.group = !group ? false : true;
	
	this.defW = 4; // default XYClient's width
	this.defH = 1;
	this.h = height ? height : this.defH;
	
	this.createLines();
}

XYTM.prototype = {
	
	cid : function() {
		return this.ci++;
	},
	
	addClient : function ( name, lineI, w, h, x, y ) {
		var line = this.lines[lineI],
			cl = new XYClient( name, this.cid(), this, line, w, h, x, y );

		line.settle( { x:x, y:y }, cl );
		this.clients[name] = cl;
		
		return cl;
	},
	
	addDefaultClient : function ( name ) {
		var lineI = this.t.defaultLineQ;
		if ( !this.edited && name != "#id" ) {
			lineI = this.t.defaultLineA;
		}
		var line = this.lines[lineI];
		
		var rect = this.edited ? { x:0, y:0 } : line.rectForAppend( this.defW ),
			cl = this.addClient( name, line.head.i, this.defW, this.defH, rect.x, rect.y );

		return cl;
	},
	
	addCloneClients: function( clients ) {
		for ( var name in clients ) {
			var c = clients[name],
				i = c.line.head.i;
				//colorObj = { color: c.c.color, index: c.c.index },
				//bgObj = { color: c.bg.color, index: c.bg.index };
			
			var cl = this.addClient( c.name, i, c.w, c.h, c.x, c.y );
			cl.setStyle( c.a, c.va, c.b, c.c.color, c.bg.color );
		}
	},
	
	renameClient: function( oldName, newName ) {
		var cl = this.clients[ oldName ];
		// remove old
		delete this.clients[ oldName ];
		// re-add TM
		this.clients[newName] = cl;
		// update Client
		cl.name = newName;
	},
	
	removeC: function( c, m ) {
		delete this.clients[ c.name ];
		c.line.unsettle( c );
		this.t.gov.space.visio.removeC( c, m );
	},
	
	createLines: function() {
		var linesH = this.t.lines;
		
		for ( var i in linesH ) {
			this.lines[i] = new XYLine( this, linesH[i] );
		}
	},
	
	setColor: function( color, index ) {
		if ( color ) this.c.color = color;
		if ( index ) this.c.index = index;
		return this.c;
	},
	
	// edited
	setEdited: function() {
		if ( !this.edited ) {
			this.edited = true;
		}
	},
	
	heightPlus: function() {
		return ++this.h;
	},
	
	heightMinus: function() {
		return this.h > 1 ? --this.h : this.h;
	},
	
	editName: function( name ) {
		this.name = name || "Style " + this.id;
	},
	
	getC: function( id ) {
		for ( var name in this.clients ) {
			if ( this.clients[name].id == id ) {
				return this.clients[name];
			}
		}
	},
	
	getC2: function( name ) {
		return this.clients[name];
	},
	
	empty: function() {
		return !Object.keys( this.clients ).length;
	},
	
	updateC: function( w ) {
		var cl = this.getC2( w.name ),
			visio = this.t.gov.space.visio;
		visio.removeW( w );
		visio.showCss( cl.css() );
		visio.insertW( cl, w.manager, cl.html( w.id, cl.id, w.humanValue(), w.hasLink() ) );
	},
	
	html: function( m, headers ) {
		var t = this.t,
			count = 0,
			workers = m.cities,
			lines = [],	_lines = [];
		// for mans and group-heads
		if ( !m.isGroup() || m.isHead() ) {
			// create empty arrays
			for ( var i=this.lines.length; i--; ) {
				lines[i] = [];
			}
			// create divs by style
			for ( var name in this.clients ) {
				var cl = this.clients[name], link;
				
				if ( w = workers[name] ) {
					value = w.humanValue();
					id = w.id;
					link = w.hasLink();
					count++;
				} else {
					value = "";
					id = m.cid(); // generate new worker id
				}
				
				if ( headers ) {
					value = name;
				}
				lines[cl.lineI].push( cl.html( id, cl.id, value, link ) );
			}
			// create divs by workers which style hasn't
			if ( count != Object.keys( workers ).length ) {
				var cl, w;
				for ( var name in workers ) {
					if ( !this.clients[name] ) {
						w = workers[name];
						cl = this.addDefaultClient( name );
						value = !headers ? w.humanValue() : name;
						link = w.hasLink();
						lines[cl.lineI].push( cl.html( w.id, cl.id, value, link ) );
					}
				}
			}
		}
		
		for ( var i in lines ) {
			_lines.push( this.lines[i].html( lines[i].join('') ) );
		}
		
		var name = "<div id=iName>" + this.name + "</div>",
			level = "";
		
		if ( g = m.isGroup() ) {
			var gLevel = m.group.level();
			level = m.isHead() ? " <b id=iVisible>" + gLevel + "</b>" : " _" + gLevel;
		}
		
		var defineClr = !g ? "" : " group";//level ? " clr_grey" + gLevel : "";
		var groupHide = g && !g.isShown() ? " group-hide" : "";
		var bg = g ? " bg" + this.id : "";
		
		return "<nav id=m" + m.id + " class='t" + this.id + defineClr + groupHide + "'>" +
					"<div class='line'></div>" +
					"<div id='iMove' class=iMove>M</div>" +
					( g ? "<div id='iVisible'>" + gLevel + "</div>" : "" ) +
					//"<div class='shadow'></div>" +
					"<div class='rowBody" + bg + "' data-panel='Prow' data-uniq='" + m.id + "'>" +
						name + 
						//" <span>" + level + "</span>" +
					"</div>" + 
					_lines.join('') + 
				"</nav>";
	},
	
	htmlOptions: function( m ) {
		return "" +
		"<div class=row-menu data-panel='Prow' data-uniq='" + m.id + "'>" +
			"<span id=iConfirm> " + m.confirmed() + " </span> " +
			"<span id=iCreateLocal>N</span> " +
			"<span id=iCopy>C</span> " +
			( !m.isGroup() ? "<span id=iNewGroup>G</span>" : "" ) +
			" <span id=iRowColor>RC</span>" +
			" <span id=iRowMinus><</span>" +
			"<span id=iRowPlus>></span>" +
		"</div>";
	},
	
	htmlEnd: function( m ) {
		var gLevel = m.group.level();
		var margin = 0;
		var bul = [];
		for ( var i=0; i<gLevel; i++ ) {
			bul.push("*");
		}
		return "<nav id=m" + m.id + " class='group-end bg" + this.id + "'>" +
					"<div class=buls>" + bul.join(' ') + "</div>" +
					"<div id=iMove></div>" +
				
				"</nav>";
	},
	
	height: function() {
		var brd = 0;
		return this.h * this.t.rh + brd;
	},
	
	css: function( c ) {
		var css = [],
			c = !c ? this.c : c;
		var tmColor = this.t.colors.getColor( c );
		// TM css
		css.push( ".t" + this.id + "{" +
				"height:" + this.height() + "px;" + 
				//"background-color: " + tmColor + ";" +
			"}" );
		css.push( ".bg" + this.id + "{" +
				"background-color: " + tmColor + ";" +
			"}" );
		css.push( ".clrTxt" + this.id + "{" +
				"color: " + tmColor + ";" +
			"}" );
		css.push( ".t" + this.id + " .rowBody {" +
				"color: " + this.t.colors.getColorNameTxt( c ) + ";" +
				//"background-color: " + this.t.colors.getColorNameBg( c ) + ";" +
			"}" );
		/*css.push( ".t" + this.id + " > aside > aside {" +
				"border-top: 1px solid " + tmColor + ";" +
			"}" );*/
		/*css.push( ".t" + this.id + " > aside {" +
				"border-top: 1px solid white;" +
				//"-webkit-box-shadow: -8px 2px 3px 0px " + tmColor + ";" +
			"}" );
		css.push( ".t" + this.id + " .lineHead{" +
				"background: " + tmColor + ";" +
			"}" );*/
		// clients css
		for ( var name in this.clients ) {
			css.push( this.clients[name].css() );
		}
		// lines css
		css.push( this.cssColor() );
		
		return css.join('');
	},
	
	cssColor: function( c ) {
		var css = [],
			colorObj = !c ? this.c : c,
			color = this.t.colors.getColor( colorObj );
		return ".clr" + this.id + "{" +
				"background: " + color +
			"}";
	},
	
	out: function() {
		var out = [],
			lineType = this.t.defaultLineType;
		
		if ( this.edited ) {
			for ( var name in this.clients ) {
				var cl = this.clients[name];
				
				if ( lineType[ cl.lineI ] != "q" ) {
					out.push( cl );
				}
			}
		}
		
		return out;
	},
}