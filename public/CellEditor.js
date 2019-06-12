var CellEditor = function( space ){
	
	this.maxWidth = 400;
	this.minW = 50;
	this.minH = 25;
	this.paddingV = 3;
	this.paddingH = 7;
	this.el;
	this.tab;
	this.el2;
	this.editor = $("#_editor");
	this.input = this.editor.children("#_editorInput");
	this.opened = false;
	
	this.space = space;
	
	this.ruler = {
		right : function(point) {
			var win = $(window).width();
			return win - point;
		},
		
		left : function(point) {
			return point;
		},
	}
	// on end
	var p = this;
	
	this.editor.keypress(function(event) {
		if ( event.which == 13 ) {
			p.finish();
		}
	});
}
CellEditor.prototype = {
	
	open: function( el, defaultValue, cl ) {
		this.opened = true;
		
		var p = this,
			trg = el,
			pos = trg.offset(),
			w0 = trg.width(),
			txtWidth = defaultValue.length * 6,
			h0 = trg.height(),
			align = !cl || !cl.a ? "left" : ( cl.a == "right2" ? "right" : cl.a );
		// get input width
		var width = ( txtWidth > w0 && w0 < 1000 ) ? txtWidth : w0;
		this.input.val( defaultValue );
		this.input.select();
		this.editor.css({
			//"position" : "absolute",
			//"z-index" : 1,
			"top" : pos.top - this.space.active.window.ofTop,
			"left" : pos.left,
			"width" : width,
		});
		this.input.css({
			"height" : ( h0 - 2 ) + "px",
			"width" : "100%",
			"text-align" : ( align ),
		});
		// if value width > el width
		/*if (alignXX == "right") {
			//setTimeout(function(){
				//p.editor.css("left", p.calcLeft(trg, p.editor));
			//}, 200);
		}*/
	},
	
	remove: function() {
	
	},
	
	finish: function() {
		if ( this.opened ) {
			this.opened = false;
			this.editor.css("left", "-4999px");
			//this.tab.remove();
			this.remove();
		}
	},
	
	calcLeft : function(anchorRight, anchorWidth) {
		var winWidth = $(window).width(),
			right = winWidth - (anchorRight.offset().left + anchorRight.width());
			var width = anchorWidth.width();
			
		return winWidth - (right + width);
	},
	
	setSelection : function(target) {
		//var target = document.getElementById('ex5');
		var rng, sel;
		if ( document.createRange ) {
			rng = document.createRange();
			rng.selectNode( target )
			sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange( rng );
		} else {
			var rng = document.body.createTextRange();
			rng.moveToElementText( target );
			rng.select();
		}
	},
	
	getText: function() {
		var value = this.input.val();
		return value.replace('\n','');
	},
	
	getPosByCenter: function( x0, y0, w0, h0, w, h ) {
		// get center 0
		var xc = x0 + w0 / 2,
			yc = y0 + h0 / 2,
		// get pos
			xp = xc - w / 2,
			yp = yc - h / 2;
		return { x: xp, y: yp }
	},
}