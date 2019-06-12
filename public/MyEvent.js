var MyEvent = function( event ){
	this.event = event;
	this.e = {};
	this.list = [];
	this.type;
	
	this.changeEl_ = false;
	
	// mouse events
	this.mouse = false;
	this.click = false;
	this.dbl = false;
	this.drag = EventMouseDrag;
	
	// keyboard events
	this.keys = [];
	this.keyDown = false;
	this.keyUp = false;
	
	// options
	this.dragAfter = 3; // drag if moving more than "dragAfter" pixels
}
MyEvent.prototype = {
	set: function( e, type ) {
		//console.log( this.type );
		//console.log("keys: " + this.keys.join(",") + ", ="+this.keyDown+ " " + +new Date() ); 
		this.e = e;
		this.type = type;
		
		if ( type == "mousemove" ) {
			this.x = e.pageX; this.y = e.pageY;
			this.cx = e.clientX; this.cy = e.clientY;
			//console.log( this.y + " " + this.cy);
		}
		
		if ( this.changeEl_ ) {
			this.changeEl_ = false;
		}
		
		if ( this.dbl ) {
			this.dbl = false;
		}
		
		if ( this.click ) {
			this.click = false;
		}
		
		if ( this.keyUp ) {
			this.keyUp = false;
		}

		if ( this.keyDown ) {
			this.keyDown = false;
		}
		
		this.drag.already( this.e.pageX, this.e.pageY )
	},
	
	def: function() {
		this.defBody();
		//Timing.onCalm( 100, "deffered", this.defBody, this);
	},
	
	defBody: function() {
		for ( var i in this.list) {
			this.list[i]();
		}
		// end process if needed
		var p = this.event.process;
		if ( p.toRemove() ) {
			p.end();
		}
	},
	
	add: function(fn, context, params) {
		this.list.push(function() {
			fn.apply(context, params);
		});
	},
	
	changeEl: function() {
		this.changeEl_ = true;
	},
	
	mouseDown: function( state ) {
		this.mouse = state;
		// mouse down
		if ( state ) {
			this.drag.start( this.e.pageX, this.e.pageY, this.e.target );
		// mouse up
		} else {
			this.drag.remove();
		}
		//console.log("mouse="+this.mouse);
	},
	
	mouseClick: function( count ) {
		if ( !count ) {
			this.click = true;
			if ( !this.drag.is() ) {
				this.click = true;
				console.log(this.drag.is() + ", my-click");
			}
		} else {
			this.dbl = true;
		}
	},
	
	setKeyUp: function( code ) {
		this.keyUp = code;
		this.keyRemove( this.keyUp );
	},
	
	setKeyDown: function( code ) {
		this.keyDown = code;
		this.keyAdd( this.keyDown );
	},
	
	keyAdd: function( code ) {
		for ( var i=this.keys.length; i--; ) {
			if ( this.keys[i] == code ) {
				return false;
			}
		}
		this.keys.push( code );
	},
	
	keyRemove: function( code ) {
		for ( var i=this.keys.length; i--; ) {
			if ( this.keys[i] == code ) {
				this.keys.splice( i, 1 );
			}
		}
	},
	
	clearKeys: function() {
		this.keys = [];
	},
}