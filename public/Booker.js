var Booker = function(gov, caseId, id)
{
	this.id = id;
	this.name = "book" + id;
	this.i = 0;
	this.gov = gov;
	this.managers = []; // <id, Manager>
	this.names = []; // <m.name, Manager>
	this.caseId = false;
	this.comp = new CompBase(this);
	this.tmpName = 0;
	this.sections = new Sections();
	
	this.groups = new Group();
	
	this.localStyles = []; // <m.id, XYTM>
}

Booker.prototype = {

	createId : function() {
		return this.i++;
	},
	
	setCase : function(caseId) {
		this.caseId = caseId;
	},
	
	addLocalStyle: function( m, style ) {
		if ( !style ) {
			style = this.gov.style.addTM( false, false );
		}
		m.style = style;
		m.rule = false;
		this.localStyles[ m.id ] = style;
	},
	
	removeLocalStyle: function( m ) {
		delete this.localStyles[ m.id ];
	},
	
	copyM: function( m0, clone, insertBeforeM ) {
		var localStyle;
		
		// add Manager
		var m = this.addM( m0.name, m0.style, insertBeforeM );
		// add Workers
		var cities = m0.cities;
		for ( var name in cities ) {
			m.addWorker( cities[name].humanValue(), name );
		}
		// refresh reference
		m.refreshReference();
		// check if local style
		if ( localStyle0 = m0.booker.localStyles[ m0.id ] ) {
			this.addLocalStyle( m, localStyle0 );
		}
		
		if ( clone ) {
			// get best rule
			var confirmRule = m.getConfirmRule();
			// clone local style if need
			if ( localStyle0 ) {
				localStyle = this.gov.style.addCloneTM( localStyle0 );
			}
			// set style
			m.setStyle( localStyle );
		} else {
			m.copyLinks( m0 );
		}
		return m;
	},
	
	copyG: function( m0, clone ) {
		var g0 = m0.group,
			b0 = m0.booker,
			managers0 = b0.managers,
			gSet0 = g0.getSet(),
			skipTo = false,
			m, ma,
			links = []; // [ ids of src mans ] = new M
		// clone managers
		links[g0.a.id] = m = ma = this.copyM( g0.a, clone );
		for ( var i in gSet0 ) {
			var mSet0 = gSet0[i],
				newM;
			
			if ( skipTo ) {
				if ( skipTo == mSet0 ) {
					skipTo = false;
				}
				continue;
			}
			// copy group
			if ( g = mSet0.isGroup() ) {
				newM = this.copyG( mSet0, clone );
				skipTo = g.b;
			// copy man
			} else {
				newM = this.copyM( mSet0, clone );
			}
			
			links[mSet0.id] = newM;
		}
		links[g0.b.id] = this.copyM( g0.b, clone )
		// clone groups
		var parent = this.groups;
		var g = parent.clone( g0, parent, links );
		// when copying, group's content is hidden
		g.hide();
		// clone links
		for ( var mid0 in links ) {
			//var mSet0 = links[mid0];
			var workers0 = managers0[mid0].cities;
			for ( var name in workers0 ) {
				var w0 = workers0[name],
					w = links[mid0].getW2( name );
				// clone each link to w from w0
				w.link.clone( w0.link, links );
			}
		}
		// refresh parent-child links
		m.group.checkParents();
		return m;
	},
	
	addM : function( name, style, m0, rule ) {
		if ( !name ) {
			name = "o";
		}
		
		if ( this.isM( name ) ) {
			name = this.getLastName( name );
		}
		
		if (!m0)
			var m0 = false;
		
		var id = this.createId();
		var man = new Manager( name, style, this, id, rule );
		this.sections.settle( man, m0 );
		this.managers[id] = man;
		this.names[name] = man;
		return man;
	},
	// searching in name51, name52 return name53
	getLastName: function( name ) {
		
		var num = 1,
			str = name;
		
		if ( str ) {
			var digit = str.length - 1;
			do {
				c = str.charAt( digit );
				if ( isNaN( +c ) ) {
					digit++;
					name = str.substring( 0, digit );
					num = +str.substring( digit ) + 1;
					break;
				}
				digit--;
			}
			while ( digit );
		}
		
		/*var res, num = 1;
		if ( res = /^(.*\D)([\d]+)$/.exec( name ) ) {
			name = res[1];
			num = +res[2] + 1;
		}*/
		
		do {
			if ( !this.isM( name + num ) ) {
				return name + num;
			}
			num++;
		}
		while ( 1 );
	},
	
	checkReference: function( m, newName ) {
		if ( m.name != newName ) {
			if ( this.isM( newName ) ) {
				var newName = this.getLastName( newName );
			}
			this.renameM( m.name, newName );
		}
		return newName;
	},
	
	renameM: function( n1, n2 ) {
		var m = this.names[n1];
		m.rename( n2 );
		delete this.names[n1];
		this.names[n2] = m;
	},
	
	moveM : function (m, m0) {
		this.sections.resettle(m, m0);
	},
	
	moveG : function ( g, m0 ) {
		this.sections.resettleSet( g.a, g.b, m0 );
		g.checkParents();
	},
	
	removeM: function( m ) {
		var toRemove = [];
		toRemove.push( m );
		// delete inner managers
		if ( g = m.isGroup() ) {
			var groupEnd = m == g.a ? g.b : g.a;
			toRemove = toRemove.concat( g.getSet(), groupEnd );
			g.remove();
		}
		
		for ( var i=toRemove.length; i--; ) {
			m = toRemove[i];
			this.sections.unsettle( m );
			delete this.managers[m.id];
			delete this.names[m.name];
			delete this.localStyles[m.id];
			this.gov.space.visio.removeM( m );
		}
	},
	
	isM : function(name) {
		return this.names[name] || false;
	},
	
	getM : function(id) {
		return this.managers[id];
	},
	
	getMPos : function(m) {
		return this.sections.sect(m);
	},
	
	getGroup : function(gname) {
		return this.comp.getGroup(gname);
	},
	// get styles from dictionary
	getIncomeStyles: function() {
		var out = [];
		for ( var i in this.managers ) {
			var m = this.managers[i];
			
			if ( ( ruleW = m.rule ) && ruleW.rule.isDic() ) {
				var style = m.style;
				if ( !out[style.id] ) {
					out[style.id] = style;
				}
			}
		}
		return out;
	},
	
	getMsByTM : function(tm) {
		var managers = [];
		
		for (var i in this.managers) {
			
			var m = this.managers[i];
			if (m.tmanager == tm) {
				
				managers.push(m);
			}
		}
		
		return managers;
	},
	
	sort: function( ar ) {
		return this.sections.sort( ar );
	},
	
	last: function() {
		return this.sections.last();
	},
	
	// after adding new Client
	addWorkers : function(cl) {
		
		var managers = this.getMsByTM(cl.tmanager);
		
		for (var i=managers.length; i--; ) {
			managers[i].addWorker("", cl, false);
		}
	},
	
	refreshLinks : function() {
		return false;
		for (var i=0, len=this.managers.length, m, man=[]; i < len; i++) {
		
			this.managers[i].createLinks();
		}
		
		// for comps
		this.comp.createLinks();
	},
	
	show : function() {
		this.gov.showBooker(this);
	},
	
	html: function() {
		var managers = this.sections.list(),
			ms = [];
		for ( var i in managers ) {
			ms.push( managers[i].html() );
			// manual limitation
			if ( ( i > 50 && managers[i].style.name == "End" ) || i > 100 ) break; 
		}
		return "<article id=b" + this.id + ">" + ms.join('') + "</article>";
	},
	
	style: function() {
		var managers = this.sections.list(),
			ms = [];
		for ( var i in managers ) {
			ms.push( managers[i].html() );
		}
	},
	
}