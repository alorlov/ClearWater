var EventStyles = function( event ) {
	this.event = event;
	this.p = this.event.process; // name of process
	this.params = [];
	
	this.tooltip = $("#_tooltip");
	this.header = new Header( this.event );
}
EventStyles.prototype = {
	add: function( c ) {
		if ( !this.params[c] ) {
			this.params[c] = true;
			$("#Goverments").addClass( c );
		}
		return this;
	},
	
	remove: function( c ) {
		if ( this.params[c] ) {
			delete this.params[c];
			$("#Goverments").removeClass( c );
		}
		return this;
	},
	
	def: function() {
		var space = this.event.space,
			p = this.p,
			k = this.event.keyboard,
			m = this.event.mouse,
			ee = this.event.eventElement,
			type = ee.type,
			type2 = ee.type2;
		
		if ( !p.on() ) {
			if ( ee.changed() ) {
				if ( type == "W" || type == "w" || type == "l" || type == "m" ) {
					var self = this;
					Timing.onCalm( 100, "header", function(){
						var f = ee.f();
						if ( f.m ) {
							if ( self.header.change( f ) ) {
								self.header.refresh();
							}	
						}
					}, this);
				}
				
				if ( type == "w" || type == "W" ) {
					Timing.onCalm( 100, "headerActive", this.header.selectW, this.header );
				}
				
			}
		}
		
		if ( k.has( "delete", true ) ) {
			this.add("removeM").add("removeW");
		} else if ( k.keyUp("delete") ) {
			this.remove("removeM").remove("removeW");
		}
		
		if ( m.mouseDown() && p.on() == "link" ) {
			this.add("linkW")
		} else {
			this.remove("linkW");
		}
	},
	
	tooltipShow: function( f, ee ) {
		var	x = ee.elX(),
			y = ee.elY(),
			h = ee.h(),
			w = ee.w();
		var cx = x + w/2; // get x of el's center
		
		this.tooltip.text( f.c.name );
		var tw = this.tooltip.outerWidth(),
			th = this.tooltip.outerHeight(),
			tx = cx - tw/2,
			ty = y - th * 1;
		this.tooltip.css({
			"top": ty,
			"left": tx,
		});
	},
	
	tooltipHide: function() {
		this.tooltip.css("left","-4999px");
	},
}

var Header = function( event ) {
	this.event = event;
	this.f = {};
	this.cont = {}; // jquery nav
	this.curW = false;
	this.curW2 = false;
}
Header.prototype = {
	change: function( f ) {
		if ( !this.f.m || f.m.style != this.f.m.style ) {
			this.f = f;
			return true;
		}
	},
	
	refresh: function() {
		this.cont = this.f.gv.children("#Goverments #_clientNames");
		var	mv = $( this.f.m.html( true ) );
		mv.attr("data-cont", "header");
		mv.css("position", "absolute");
		mv.css("top", "0" );
		this.cont.html( mv );
		this.selectW( this.f.c );
	},
	
	selectW: function( c ) {
		var c = c ? c : this.event.eventElement.f().c;
		if ( c ) {
			var cur = $( "#Goverments #_clientNames .c" + c.id ),
				old = this.curW || cur;
			old.removeClass("headActive");
			cur.addClass("headActive");
			//var cur2 = this.event.eventElement.f().wv,
			//	old2 = this.curW2 || cur2;
			//old2.removeClass("cellActive");
			//cur2.addClass("cellActive");
			this.curW = cur;
			//this.curW2 = cur2;
		}
	},
}