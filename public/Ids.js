var Ids = {
	space: {},
	familyMain: { W: true, w: true, l: true, m: true, b: true, g: true },
	familyPalette: { p: true, q: true },
	
	gv: function( g ) {
		return $("#g" + g.id);
	},
	
	bv: function( b ) {
		var g = b.gov;
		return $("#g" + g.id + " #b" + b.id);
	},
	
	mv: function( m ) {
		var b = m.booker,
			g = b.gov;
		return $("#g" + g.id + " #b" + b.id + " #m" + m.id);
	},
	
	lv: function( cl, m ) {
		var i = cl.lineI,
			b = m.booker,
			g = b.gov;
		return $("#g" + g.id + " #b" + b.id + " #m" + m.id + " #l" + i);
	},
	
	wv: function( w ) {
		var m = w.manager,
			b = m.booker,
			g = b.gov;
		
		return $("#g" + g.id + " #b" + b.id + " #m" + m.id + " #w" + w.id);
	},
	
	// get worker-dom by client
	cv: function( c, m ) {
		var b = m.booker,
			g = b.gov;
		
		if ( w = m.getWCity( c.name ) ) {
			return $("#g" + g.id + " #b" + b.id + " #m" + m.id + " #w" + w.id);
		} else {
			return $("#g" + g.id + " #b" + b.id + " #m" + m.id + " .c" + c.id);
		}
	},
	
	parseId: function( id ) {
		return { type: id.charAt(0), id: id.substr(1) }
	},
	
	parseClass: function( c ) {
		return c.split(" ");
	},
	
	hasFamily: function( args, type ) {
		return args[type];
	},
	
	getFamilyMain: function( el ) {
		var p = this.parseId( el.id );
		
		if ( !this.hasFamily( this.familyMain, p.type ) ) {
			return false;
		}
		
		var jel = $( el );
			o = {};
		// create defaults
		o.gv = o.bv = o.mv = o.lv = o.wv = o.Wv = jel;
		o.gi = o.bi = o.mi = o.li = o.wi = o.Wi = p.id;
		// get dom objects
		switch ( p.type ) {
			case "W":
				o.wv = o.Wv.parent();
			case "w":
				o.lv = o.wv.parent();
			case "l":
				o.mv = o.lv.parent().parent();
			case "m":
				o.bv = o.mv.parent();
			case "b":
				o.gv = o.bv.parent();
			case "g":
		}
		// get ids
		switch ( p.type ) {
			case "W":
				o.Wi = this.parseId( o.Wv[0].id ).id;
			case "w":
				o.wi = this.parseId( o.wv[0].id ).id;
			case "l":
				o.li = this.parseId( o.lv[0].id ).id;
			case "m":
				o.mi = this.parseId( o.mv[0].id ).id;
			case "b":
				o.bi = this.parseId( o.bv[0].id ).id;
			case "g":
				o.gi = this.parseId( o.gv[0].id ).id;
		}
		// get government objects
		switch ( p.type ) {
			case "W":
			case "w":
				o.w = this.space.getG(o.gi).getB(o.bi).getM(o.mi).getW(o.wi);
				var c1 = this.parseClass( o.wv[0].className)[0];
				var pc = this.parseId( c1 );
				o.c = this.space.getG(o.gi).getB(o.bi).getM(o.mi).getC(pc.id);
			case "l":
				o.l = this.space.getG(o.gi).getB(o.bi).getM(o.mi).getL(o.li);
			case "m":
				o.m = this.space.getG(o.gi).getB(o.bi).getM(o.mi);
			case "b":
				o.b = this.space.getG(o.gi).getB(o.bi)
			case "g":
				o.g = this.space.getG(o.gi);
		}
		return o;
	},
	
	// Palette ids
	getFamilyPalette: function( el ) {
		var p = this.parseId( el.id );
		
		if ( !this.hasFamily( this.familyPalette, p.type ) ) {
			return {};
		}
		
		var jel = $( el );
			o = {};
		// create defaults
		o.gv = o.mv = jel;
		o.gi = o.mi = p.id;
		// get dom objects
		switch ( p.type ) {
			case "p":
				parent = o.mv;
				while ( parent = parent.parent() ) {
					var p2 = this.parseId( parent[0].id );
					if ( p2.type == "q" ) {
						o.gv = parent;
						break;
					}
				}
			case "q":
		}
		// get ids
		switch ( p.type ) {
			case "p":
				o.mi = this.parseId( o.mv[0].id ).id;
			case "q":
				o.p = this.space.getPal( this.parseId( o.gv[0].id ).id );
				o.g = o.p.gov;
				o.gi = o.g.id;
		}
		// get government objects
		switch ( p.type ) {
			case "p":
				o.m = o.g.getB(0).getM(o.mi);
			case "q":
				//o.g = this.space.getG(o.gi);
		}
		return o;
	},
}