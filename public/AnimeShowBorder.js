var AnimeShowBorder = function( el, className ) {
	this.el = el;
	this.className = className;
}
AnimeShowBorder.prototype = {
	show: function( left, top, w0, h0, w, h, interval ) {
		this.el.css({
			"top": top,
			"left": left,
			"width": w0,
			"height": h0,
			"opacity": 1,
		});
		// cache out
		this.el.position();
		
		this.el.addClass( this.className );
		
		this.el.css({
			"width": w,
			"height": h,
		});
		
		var self = this;
		setTimeout(function(){
			self.el.css("opacity","0");
		}, interval / 2 );
		
		setTimeout(function(){
			self.remove();
		}, interval);
	},
	
	remove: function() {
		this.el.removeClass( this.className );
		this.el.css("left", "-9999px");
	},

}