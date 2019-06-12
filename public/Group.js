var Group = function( a, b, parent ) {
	this.a = a;
	this.b = b;
	this.parent;
	this.childs = [];
	
	// tmp fields
	this.parentI;
	this.cities = [];
	this.style = [];
	
	this.shown = true;
	this.unique = false;
	this.gEndHeight = 10;
	
	if ( parent ) {
		this.setParent( parent );
	}
	// add groups to managers
	if ( this.a && this.b ) {
		this.a.addG( this );
		this.b.addG( this );
	}
}
Group.prototype = {
	
	remove: function() {
		this.parent.removeChild( this );
	},
	
	recreate: function( a, b ) {
		this.a = a;
		this.b = b;
		// remove tmp fields
		delete this.cities;
		delete this.style;
		delete this.parentI;
		
		return this;
	},
	
	addChild: function( g ) {
		this.childs.push( g );
	},
	
	removeChild: function( g ) {
		for( var i=this.childs.length; i--; ) {
			if ( this.childs[i] == g ) {
				delete this.childs[i];
				return true;
			}
		}
	},
	
	hasChild: function( g ) {
		for( var i=this.childs.length; i--; ) {
			if ( this.childs[i] == g ) {
				return this.childs[i];
			}
		}
		return false;
	},
	
	setParent: function( g ) {
		// update parent-child links
		if ( this.parent && this.parent != g ) {
			this.parent.removeChild( this );
		}
		this.parent = g;
		if ( !g.hasChild( this ) ) {
			g.addChild( this );
		}
		return this;
	},
	
	// get parent group
	getParent: function( m ) {
		if ( m.isGroup() ) {
			return m.group.parent;
		} else {
			var sections = m.booker.sections,
				m0 = m;
			// down searching
			while ( m0 = sections.next( m0 ) ) {
				if ( m0.isGroup() ) {
					if ( m0.isHead() ) {
						return m0.group.parent;
					} else {
						return m0.group;
					}
				}
			}
			// if end
			return m.booker.groups;
		}
	},
	
	checkParent: function() {
		// search down from end group
		if ( sibling = this.b.next() ) {
			// parent by group
			if ( g = sibling.isGroup() ) {
				parent = sibling.isHead() ? g.parent : g;
			// parent by manager
			} else {
				parent = this.getParent( sibling )
			}
		// parent is the first group
		} else {
			parent = this.first();
		}
		
		if ( parent != this.parent && parent != this ) {
			this.setParent( parent );
		}
	},
	
	// update parents for childs and self
	checkParents: function( set ) {
		if ( !set || !set.length ) {
			// check self
			this.checkParent();
			set = this.getSet();
		}
		
		for ( var i=set.length; i--; ) {
			var m = set[i], g;
			if ( ( g = m.isGroup() ) && g.isHead( m ) ) {
				g.checkParent();
			}
		}
	},
	
	setColor: function() {
		this.a.style.setColor( "group", this.level() );
	},
	
	first: function() {
		var parent = this;
		while ( parent.parent ) {
			parent = parent.parent;
		}
		return parent;
	},
	
	move: function( m0 ) {
		var sections = a.manager.booker.sections;
		sections.resettle( this.a, this.b, m0 );
	},
	
	isHead: function( m ) {
		return m == this.a;
	},
	
	getSet: function() {
		var out = [],
			m = this.a;
		while ( ( m = m.next()) && m != this.b ) {
			out.push( m );
		}
		return out;
	},
	
	level: function() {
		var level = 1;
		parent = this.parent;
		while ( parent = parent.parent ) {
			level++;
		}
		return level;
	},
	// height in px from gHead.y0 to gEnd.y0 + gEnd.height
	height: function( onlyShown ) {
		var set = this.getSet(),
			res = this.a.height();
			
		for ( var i=set.length; i--; ) {
			if ( onlyShown && !set[i].isShown() ) {
				continue;
			}
			res += set[i].height();
		}
		// height of group-end
		res += this.gEndHeight;
		
		return res;
	},
	
	hide: function() {
		this.shown = false;
	},
	
	show: function() {
		this.shown = true;
	},
	// if inner of group is on screen ( head of group may be on screen )
	isShown: function() {
		return this.shown;
	},
	
	uniq: function() {
		if ( this.unique ) {
			return this;
		} else if ( this.parent ) {
			return this.parent.uniq();
		}
		return false;
	},
	
	clone: function( g0, parent, links ) {
		// links[mid0] = m
		var a = links[g0.a.id],
			b = links[g0.b.id],
			g = new Group( a, b, parent );
		
		/*for ( var i in g0.childs ) {
			g.clone( g0.childs[i], g, links );
		}*/
		return g;
	},
	
	out: function( o, parentI ) {
		var out = [], outChilds = [], thisI = parentI;
		
		// gen this group
		if ( this.parent ) {
			var thisI = ++o.gI, // generate new id
				sections = o.sections,
				cities = this.a.out(),
				id1 = sections.sect( this.a ),
				id2 = sections.sect( this.b ),
				tmI = o.outLocalStyles[id1];
			
			out.push( o.meta.genGroup( id1, id2, tmI, thisI, parentI, cities ) );
		}
		// gen childs
		for ( var i in this.childs ) {
			outChilds = outChilds.concat( this.childs[i].out( o, thisI ) );
		}
		
		return out.concat( outChilds );
	},
}