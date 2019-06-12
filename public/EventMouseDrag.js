var EventMouseDrag = {
	delta: 3,
	x: 0,
	y: 0,
	init: false, // if mouse down
	on: false, // if x0 - x > delta
	el: {},
	
	start: function( x, y, el ) {
		this.x = x;
		this.y = y;
		this.init = true;
		this.el = el;
	},
	
	remove: function() {
		this.init = false;
		this.on = false;
	},
	
	already: function( x, y ) {
		if ( this.init && !this.on && 
			( Math.abs(this.x - x) > this.delta || Math.abs(this.y - y) > this.delta ) ) {
				this.on = true;
		}
		return this.on;
	},
	
	is: function() {
		return this.on;
	}
}