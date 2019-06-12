var EventProcess = function( event ) {
	this.event = event;
	this.p = false;
	this.remove = false; // remove after all processes is done
	
	this.o = {}; // process's vars
}
EventProcess.prototype = {
	on: function() {
		return this.p;
	},
	
	start: function( processName, removeAuto ) {
		this.p = processName;
		if ( removeAuto ) {
			this.remove = true;
		}
	},
	
	end: function( ) {
		this.p = false;
		this.remove = false;
	},
	
	toRemove: function() {
		return this.remove;
	},
}