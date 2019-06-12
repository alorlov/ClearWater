var EventElement = function( event ) {
	this.event = event
	this.ids = this.event.ids;
	this.ev = this.event.myEvent;
	this.k = this.event.keyboard;
	this.m = this.event.mouse;
	this.el = {}; // highest el
	this.familyMain; // family of dom&gov objects ( main )
	this.familyPalette; // family of dom&gov objects ( palette )
	this.type; // first part of this.el.id
	this.type2; // second part of of the this.el.id
}
EventElement.prototype = {
	changeEl: function(e) {
		this.el = e.target;
		// clear family
		this.familyMain = false;
		this.familyPalette = false;
		// id
		var id = this.el.id,
			p = this.ids.parseId( id ),
			className = this.el.className;
		this.type = id ? p.type : false;
		this.type2 = id ? p.id : false;
		this.className = className ? className : false;
	},
	
	changed: function() {
		return this.ev.changeEl_;
	},
	
	elX0: function( el ) {
		var el = el ? el : $(this.el);
		return el.position().left;
	},

	elY0: function( el ) {
		var el = el ? el : $(this.el);
		return el.position().top;
	},
	
	elX: function( el ) {
		var el = el ? el : $(this.el);
		return el.offset().left;
	},

	elY: function( el ) {
		var el = el ? el : $(this.el);
		return el.offset().top;
	},
	
	h: function( el ) {
		var el = el ? el : $(this.el);
		return el.height();
	},
	
	w: function( el ) {
		var el = el ? el : $(this.el);
		return el.width();
	},
	
	x: function( c ) {
		return c ? this.ev.cx : this.ev.x;
	},

	y: function( c ) {
		return c ? this.ev.cy : this.ev.y;
	},
	
	// get relative x,y
	x0: function( el ) {
		var el = el ? el : $(this.el),
			offset = el.offset();
		return this.x() - offset.left;
	},
	
	y0: function( el ) {
		var el = el ? el : $(this.el),
			offset = el.offset();
		return this.y() - offset.top;
	},
	// get elx2 & ely2
	elXyByMouseXy: function( mx1, my1, elx1, ely1, mx2, my2 ) {
		var dx = mx1 - elx1,
			dy = my1 - ely1,
			elx2 = mx2 - dx,
			ely2 = my2 - dy;
		return { x: elx2, y: ely2 };
	},
	// get element with known id so that has known gov-hierarhy
	clothest: function( el, type0 ) {
		var parent = el;
		do {
			if ( attr = parent.id ) {
				// id="m25" => type=m, id=25
				if ( this.ids.parseId( attr ).type == type0 ) {
					return parent;
				}
			}
		}
		while ( parent = parent.parentNode );
	},
	
	clothestDataId: function( el, varName, type0 ) {
		var parent = el;
		do {
			if ( parent.dataset && ( attr = parent.dataset[varName] ) ) {
				// id="m25" => type=m, id=25
				if ( this.ids.parseId( attr ).type == type0 ) {
					return parent;
				}
			}
		}
		while ( parent = parent.parentNode );
	},
	
	f: function( startParent ) {
		if ( !this.familyMain ) {
			var el;
			if ( startParent ) {
				el = this.clothest( this.el, startParent );
				if ( !el ) {
					return false;
				}
			} else {
				el = this.el;
			}
			
			if ( family = this.ids.getFamilyMain( el ) ) {
				this.familyMain = family;
				// save initial element
				this.familyMain.el = this.el;
			}
		}
		return this.familyMain;
	},
	
	fp: function( el ) {
		if ( !this.familyPalette ) {
			this.familyPalette = this.ids.getFamilyPalette( el || this.el );
		}
		return this.familyPalette;
	},
	
	preventSelection: function( el ) {
		if ( !el ) {
			el = $(document.body);
		}
		el.css({
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-moz-user-select": "none",
			"user-select": "none",
		});
	},
	
	eventSelection: function( el ) {
		if ( !el ) {
			el = $(document.body);
		}
		el.css({
			"-webkit-touch-callout": "",
			"-webkit-user-select": "",
			"-moz-user-select": "",
			"user-select": "",
		});
	},
}