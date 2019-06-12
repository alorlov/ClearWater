var Link = function( worker ) {
	this.w = worker;
	this.parent;
	this.childs = [];
	
	this.pseudo = false;
	// options
	this.onlyBelow = true;
	this.formatLink = true;
}
Link.prototype = {
	// clone parent
	clone: function( link0, links ) {
		if ( parent = link0.parent ) {
			var mid0 = parent.w.manager.id;
			
			if ( m = links[mid0] ) {
				var w = m.getW2( parent.w.name );
				// "this" is target link, "link0" is src
				this.setLink( w.link );
			}
		}
	},
	
	copy: function( link ) {
		this.setLink( link.highest() );
	},
	
	setLink: function( link ) {
		if ( link == this ) {
			return false;
		}
		if ( this.w.manager.clothestUniqGroup() == link.w.manager.clothestUniqGroup() ) {
			this.setParent( link );
		} else {
			this.w.setValue( link.human() );
		}
	},
	
	highest: function() {
		if ( this.parent ) {
			return this.parent.highest();
		} else {
			return this;
		}
	},
	
	human: function() {
		return this.highest().w.value;
	},

	real: function() {
		if ( this.parent && ( closest = this.parent.nonPseudo() ) ) {
			if ( this.formatLink && ( this.onlyBelow && this.isBelow( closest ) ) ) {
				return this.genByFormat( closest );
			}
		}
		return this.human();
	},
	
	nonPseudo: function() {
		if ( this.pseudo === false ) {
			return this;
		} else if ( this.parent ) {
			return this.parent.nonPseudo();
		}
		return false;
	},
	// if it's a link
	has: function() {
		return this.parent;
	},
	
	isBelow: function( link0 ) {
		var pos = this.w.manager.getPos(),
			pos0 = link0.w.manager.getPos();
		
		return pos > pos0;
	},
	
	genByFormat: function( parent ) {
		var w = parent.w,
			parentName = w.name;
		
		if ( parentName == this.w.name ) {
			return "${" + w.manager.name + "}";
		} else {
			return "${" + w.manager.name + ":" + parentName + "}";
		}
	},
	
	removeLink: function() {
		if ( this.parent ) {
			this.parent = false;
		}
	},
	
	findSelf: function( link ) {
		var parent = link;
		while( parent = parent.parent ) {
			if ( parent == this ) {
				return true;
			}
		}
	},
	
	setParent: function( newParent ) {
		// if new parent it has link to "this"
		if ( this.findSelf( newParent ) ) {
		//if ( newParent.parent == this ) {
			newParent.removeParent();
		}
		// update parent-child links
		if ( this.parent && this.parent != newParent ) {
			// remove child from previous parent
			this.parent.removeChild( this );
		}
		this.parent = newParent;
		newParent.addChild( this );
		return this;
	},
	
	removeParent: function() {
		this.parent.removeChild( this );
		this.parent = false;
	},
	
	addChild: function( child ) {
		this.childs.push( child );
	},
	
	removeChild: function( child ) {
		for( var i=this.childs.length; i--; ) {
			if ( this.childs[i] == child ) {
				delete this.childs[i];
				return true;
			}
		}
	},
	
	getChildsW: function() {
		var out = [];
		for ( var i in this.childs ) {
			out.push( this.childs[i].w );
		}
		return out;
	},
}