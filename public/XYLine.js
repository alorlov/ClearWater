var XYLine = function (tm, lineHead) {
	this.head = lineHead;
	this.i = this.head.i;
	this.type = this.head.type;
	this.tm = tm;
	this.cols = [];
	this.rows = [];
	this.rw = this.tm.t.rw; // min rect width
	this.rh = this.tm.t.rh;
}

XYLine.prototype = {
		
	rect : function ( x, y ) {
		var rx = Math.floor( x / this.rw );
		var ry = Math.floor( y / this.rh );
		return { x: rx, y: ry }
	},
	
	validRect: function( rect ) {
		var rx = rect.x, ry = rect.y;
		// if x is negative
		if ( rx < 0 ) {
			rx = 0;
		} else if ( rx > this.head.w ) {
			rx = this.head.w - 1;
		}
		// if y is negative
		if ( ry < 0 ) {
			ry = 0;
		} else if ( ry > this.tm.h ) {
			ry = this.tm.h - 1;
		}
		
		return { x: rx, y: ry }
	},
	
	validUnitRect: function( rect, w, h ) {
		var rx = rect.x, ry = rect.y;
		// if x is negative
		if ( rx < 0 ) {
			rx = 0;
		} else if ( rx + w > this.head.w ) {
			rx = this.head.w - w;
		}
		// if y is negative
		if ( ry < 0 ) {
			ry = 0;
		} else if ( ry + h > this.tm.h ) {
			ry = this.tm.h - h;
		}
		
		return { x: rx, y: ry }
	},
	
	closest: function( rect, w, h, self ) {
		var rect = this.validUnitRect( rect, w, h );
		
		// from mouseRect to currentRect
		var increase = rect.x < self.x ? true : false;
		
		var x = rect.x,
			x1 = increase ? self.x - 1 : rect.x,
			x2 = increase ? rect.x : self.x + 1,
			min = x1 < x2 ? x1 : x2,
			max = x1 < x2 ? x2 : x1;
			
		while ( min <= x && x <= max ) {
			// each rect inside width
			if ( this.isFit( { x: x, y: rect.y }, w, h, self ) ) {
				return { x: x, y: rect.y };
			}
			x = increase ? x + 1 : x - 1;
		}
		return rect;
	},
	
	resize: function( rect0, rect, self ) {
		// return x,y,w,h or false when resize not valid
		var r = {
			x: rect0.x <= rect.x ? rect0.x : rect.x,
			y: rect0.y <= rect.y ? rect0.y : rect.y,
			w: Math.abs( rect.x - rect0.x ) + 1,
			h: Math.abs( rect.y - rect0.y ) + 1,
		}
		if ( this.isFit( r, r.w, r.h, self ) ) {
			return r;
		}
		return false;
	},
	
	isFit : function( rect, w, h, self ) {
		// check bound's break
		if (!this.checkBounds(rect, w, h))
			return false;
		// check if rect is unsetteled
		for ( var i=rect.x, len=rect.x + w; i < len; i++ ) {
			for ( var j=rect.y, len2=rect.y + h; j < len2; j++ ) {
				if ( cl = this.getW( { x:i, y:j } ) ) {
					if (cl != self ) {
						return false;
					}
				}
			}
		}
		return true;
	},
	
	// get x-y-w-h object included "rect"
	getFit: function( rect ) {
		// for better times
	},
	
	rectActive : function( x, y ) {
		
		// rect abs xy	`
		var rect = this.rect(x, y),
			absW = rect.x * this.rw,
			absH = rect.y * this.rh;
		
		// middle of the rect
		var middleX = absW + this.rw / 2,
			middleY = absH + this.rh / 2;
		
		// a | b
		// -----
		// d | c
		
		if (y < middleY) {
			if (x < middleX) {} // a
			else rect.x++; // b
		}
		else {
			if (x < middleX) rect.y++; // d
			else {  // c
				rect.x++; 
				rect.y++; 
			}
		}
		
		return rect;
	},
	
	checkBounds : function( rect, w, h ) {
		if (this.head.w > 0 && (rect.x + w > this.head.w || rect.x < 0))
			return false;
			
		if (rect.y + h > this.tm.h || rect.y < 0)
			return false;
		
		return true;
	},

	getW : function( rect ) {
		
		var x = rect.x,
			y = rect.y;
		// get first right-to-left
		for (var i=rect.x; i >= 0; i-- ) {
			if (this.cols[i]) {
				var units = this.cols[i];
				for (var j=units.length; j--; ) {
					var u = units[j];
					if (u.y <= y && 
						u.y + u.h > y && 
						u.x + u.w > x )
						return u;
				}
			}
		}
		
		return false;
	},
	// get width
	w: function() {
		return this.head.w;
	},
	
	// first empty rect from left to right. "virtW" won't be break Line width
	rectForAppend: function( virtW ) {
		var y = 0;
		for ( var r in this.rows ) {
			var r = +r;
			var u = this.rows[r].length - 1,
				lastUnit = this.rows[r][u];
			
			if ( lastUnit.x + lastUnit.w + virtW <= this.w() ) {
				return { x: (lastUnit.x + lastUnit.w), y: r }
			} else {
				// create new row
				y = lastUnit.y + lastUnit.h;
			}
		}
		if ( y >= this.tm.h ) {
			this.tm.heightPlus();
		}
		return { x: 0, y: y }
	},
	
	settle : function( rect, unit ) {
		var x = rect.x, y = rect.y;
	
		// add row
		if (!this.rows[y])
			this.rows[y] = [];
			
		this.rows[y].push(unit);
		
		// add col
		if (!this.cols[x])
			this.cols[x] = [];
			
		this.cols[x].push(unit);
		
		// update worker
		unit.move( x, y );
		unit.checkLine( this );
	},
	
	unsettle : function( unit ) {
		
		var x = unit.x,
			y = unit.y;
		
		// delete row
		for (var i=this.rows[y].length; i--;) {
			if (this.rows[y][i] == unit) {
				this.rows[y].splice(i, 1);
				//delete this.rows[y][i];
								
				if ( !this.rows[y].length ) {
					delete this.rows[y];
				}
				break;
			}
		}
		
		// delete col
		for (var i=this.cols[x].length; i--;) {
			if (this.cols[x][i] == unit) {
				//delete this.cols[x][i];
				this.cols[x].splice(i, 1);
				
				if ( !this.cols[x].length ) {
					delete this.cols[x];
				}
				break;
			}
		}
	},
	
	isLineQ: function() {
		return this.type == "q";
	},
	
	createW : function(x, y, w, h) {
		return new XYClient(x, y, w, h);
	},
	
	html: function( html ) {
		var i = this.i;
		return "<aside id=j" + i + " class='j" + i + " L" + i + "'>" + 
					 //"<div id=J" + i + " class='lineHead bg" + this.tm.id + "'></div>" + 
					 "<aside id=l" + i + " class=l" + i + ">" + html + "</aside>" + 
				"</aside>";
	},
}