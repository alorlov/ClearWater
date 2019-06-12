var Mouse = function( event ) {
	this.event = event;
	this.ev = this.event.myEvent;
	this.drag_ = this.ev.drag;
}
Mouse.prototype = {
	justDown: function() {
		return this.ev.mouseDown;
	},
	
	justUp: function() {
		return this.ev.mouseUp;
	},
	
	mouseDown: function() {
		return this.ev.mouse;
	},
	
	click: function() {
		return this.ev.click;
	},
	
	dbl: function() {
		return this.ev.dbl;
	},
	
	drag: function() {
		return this.drag_.is();
	},
	
	dragEl: function() {
		return this.drag_.el;
	},
}