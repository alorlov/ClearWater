var Palette = function( space, gov, name ) {
	this.space = space;
	this.gov = gov;
	this.name = name;
	this.shown = false;
}
Palette.prototype = {
	
	show: function() {
		var el = $( "#q" + this.name );
		el.fadeIn(100);
		this.shown = true;
	},
	
	hide: function() {
		var el = $( "#q" + this.name );
		this.shown = false;
		el.fadeOut(100);
	},
	
	toggle: function() {
		( this.shown ) ? this.hide() : this.show();
	},
	
	insertM: function( m ) {
		var row = "<ul><li id=p" + m.id + " class='pal-clr-" + m.style.c.color + "'>" + m.style.name + "</li></ul>";
		$( "#q" + this.name ).append( row );
	},
	
	html: function( onlyGroups ) {
		var managers = this.gov.getB(0).sections.list(),
			out = [];
			
		out.push("<ul>");
		for ( var i = 0, len = managers.length; i < len; i++ ) {
			var m = managers[i];
			
			if ( !m.isGroup() ) {
				if ( !onlyGroups ) {
					var className = "pal-clr-" + m.style.c.color;
					out.push("<li id=p" + m.id + " class=" + className + ">" + m.style.name + "</li>");
				}
			} else {
				if ( m.isHead() ) {
					out.push( "<ul id=p" + m.id + ">" + m.style.name );
				} else {
					out.push("</ul>");
				}
			}
		}
		out.push("</ul>");
		
		return out.join('');
	},
	
	css: function() {
		var managers = this.gov.getB(0).sections.list(),
			colors = [];
			out = [];
		
		for ( var i = 0, len = managers.length; i < len; i++ ) {
			var m = managers[i];
			
			if ( m.isGroup() && !m.isHead() ) {
				continue;
			}
				tm = m.style,
				colors = tm.t.colors,
				color = tm.c.color;
			
			if ( !colors[color] ) {
				out.push(".pal-clr-" + color + " {" +
					"background: white;" +
					"color: " + colors.getColorNameTxt( tm.c ) + ";" +
					"}");
				colors[color] = true;
			}
		}
		return out.join('');
	},
}