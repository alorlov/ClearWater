var Begun = function( event ) {
	this.event = event;
	this.ee = this.event.eventElement;
	
	this.p = this.event.process;
	this.o = {}; // data of process
}
Begun.prototype = {
	def: function() {
		var ee = this.ee,
			k = ee.k,
			type = ee.type,
			p = this.p;
		
		// Initialization
		if ( !p.on() ) {
			// create new client
			if ( k.press(["up"]) ) {
				console.log("__up ");
			}
			if ( k.press(["alt","up"]) ) {
				console.log("__alt + up: ");
			}
		}
	},
}