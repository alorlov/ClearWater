var Panels = function( event ) {
	this.event = event;
	this.items = [];
}
Panels.prototype = {
	init: function( id, el, x1, x2, y1, y2, calm,
							 el_, x1_, x2_, y1_, y2_, calm_, byUniq ) {
							 
		this.items[id] = new PanelsItem( this, id, el, x1, x2, y1, y2, calm,
											 el_, x1_, x2_, y1_, y2_, calm_, byUniq );
	},

	initOpen: function( id, fn ) {
		this.items[id].open = fn;
	},
	
	initClose: function( id, fn ) {
		this.items[id].close = fn;
	},
	
	check: function( x, y, id, notOpen, uniq ) {
		for ( var name in this.items ) {
			var item = this.items[name],
				trigger = false;
				
			// try to open panel
			if ( !item.on && !notOpen ) {
				// 1. check coords xy
				if ( item.x1 !== false && ( item.checkX( x ) && item.checkY( y ) ) ) {
					trigger = true;
				}
				// 2. check mouse under particular element
				if ( item.el !== false && item.checkEl( id ) ) {
					trigger = true;
				}
				// open panel
				if ( !trigger ) {
					if ( item.hasTimein() ) {
						item.clearTimein();
					}
				} else {
					if ( !item.hasTimein() ) {
						item.setTimein();
						if ( item.byUniq ) {
							item.setUniq( uniq );
						}
					}
				}
			// try to close panel
			} else {
				// 1. check coords xy
				if ( item.x1_ !== false && ( item.checkX_( x ) && item.checkY_( y ) ) ) {
					trigger = true;
				}
				// 2. check mouse under particular element
				if ( item.el_ !== false && item.checkEl( id, true ) ) {
					trigger = true;
				}
				// close panel
				if ( !trigger ) {
					// check timeout
					if ( item.hasTimeout() ) {
						item.updateTimeout();
					} else {
						item.setTimeout();
					}
				} else {
					if ( item.byUniq && !item.sameUniq( uniq ) ) {
						if ( !notOpen ) {
							item.setTimeout();
							item.setTimein();
							item.setUniq( uniq );
						}
					} else {
						item.clearTimeout();
					}
				}
			}
		}
	},
	
	closeAll: function() {
		for ( var name in this.items ) {
			if ( this.items[name].on ) {
				this.items[name].remove();
			}
		}
		$("#_rowMenu").html();
	},
}

var PanelsItem = function( parent, id, el, x1, x2, y1, y2, calm,
								el_, x1_, x2_, y1_, y2_, calm_, byUniq ) {
	this.id = id;
	this.on = false;
	this.parent = parent;
	
	this.el = el;
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.el = el;
	this.calm = calm;

	this.el_ = el;
	this.x1_ = x1_;
	this.x2_ = x2_;
	this.y1_ = y1_;
	this.y2_ = y2_;
	this.el_ = el_;
	this.calm_ = calm_;
	
	this.byUniq = byUniq;
	this.uniq = false;
	
	this.timein = false;
	this.timeout = false;
}
PanelsItem.prototype = {
	init: function() {
		this.parent.closeAll();
		this.open();
		this.on = true;
	},
	
	remove: function() {
		this.close();
		this.on = false;
		this.clearTimeout();
	},
	
	open: function() {
	
	},
	
	close: function() {
	
	},
	
	checkX: function( x ) {
		return ( this.x1 <= x && x <= this.x2 );
	},
	
	checkY: function( y ) {
		return ( this.y1 <= y && y <= this.y2 );
	},

	checkX_: function( x ) {
		return ( this.x1_ <= x && x <= this.x2_ );
	},
	
	checkY_: function( y ) {
		return ( this.y1_ <= y && y <= this.y2_ );
	},
	
	checkEl: function( id, out ) {
		var el = out ? this.el_ : this.el;
		for ( var i=el.length; i--; ) {
			if ( el[i] == id ) {
				return true;
			}
		}
	},
	
	setUniq: function( uniq ) {
		this.uniq = uniq;
	},
	
	sameUniq: function( uniq ) {
		return this.uniq == uniq;
	},
	
	setTimein: function() {
		var self = this;
		this.timein = setTimeout( function(){
			self.init();
		}, this.calm );
	},
		
	setTimeout: function() {
		var self = this;
		this.timeout = setTimeout( function(){
			self.remove();
		}, this.calm_ );
	},
	
	hasTimein: function() {
		return this.timein;
	},
	
	hasTimeout: function() {
		return this.timeout;
	},
	
	/*timeIsIn: function() {
		return ( this.timein + this.calm < +new Date() );
	},
	
	timeIsOut: function() {
		return ( this.timeout + this.calm_ < +new Date() );
	},*/
	updateTimeout: function() {
		this.clearTimeout();
		this.setTimeout();
	},
	
	clearTimein: function() {
		clearTimeout( this.timein );
		this.timein = false;
	},
	
	clearTimeout: function() {
		clearTimeout( this.timeout );
		this.timeout = false;
	},
}