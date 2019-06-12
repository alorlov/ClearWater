var Animation = function() {

	this.on = true;
}
Animation.prototype = {
	
	switchOn : function() { this.on = true },
	
	switchOff : function() { this.on = false },
	
	fadeInA : function(el) { 
		if (this.on)
			el.hide();
	},
	
	fadeInB : function(el) {
		if (this.on)
			el.fadeIn();
	}
}