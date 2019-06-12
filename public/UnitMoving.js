var UnitMoving = {
	cl: false,
	m: false,
	remove: function() {
		this.cl.tm.removeC( this.cl, this.m );
		this.cl = false;
		this.m = false;
	},
	
	has: function() {
		return this.cl;
	},
	
	changed: function( rect ) {
		return !( rect.x != this.cl.x || rect.y != this.cl.y );
	},
	
	validM: function( family ) {
		return ( family && family.l && family.m.isGroup() );
	},
	
	sameM: function( m ) {
		return m == this.m;
	},
	
	move: function( rect ) {
		var l = this.cl.line;
		l.unsettle( this.cl );
		l.settle( rect, this.cl );
		wv.css({
			"top": this.cl.y * l.rh,
			"left": this.cl.x * l.rw,
		});
		c.setEdited();
	},
	
	fit: function( rect ) {
		this.cl.line.isFit( rect, this.cl.w, this.cl.h, this.cl )
	},
	
	add: function( m2, l2, rect, c0, value ) {
		// add client style
		this.cl = l2.tm.addClient( c0.name, l2.i, c0.w, c0.h, rect.x, rect.y );
		this.cl.setEdited();
		// add worker
		this.m = m2;
		var w = this.m.updateW( this.m.cid(), this.cl.name, value );
		var visio = this.m.booker.gov.space.visio;
		visio.showCss( this.cl.css() );
		visio.insertW( this.cl, this.m, this.cl.html( w.id, this.cl.id, value ) );
	},
}