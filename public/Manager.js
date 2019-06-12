var TManager = function(XYTM, gov, id){
	this.id = id;
	this.clients = [];
	//this.nation = nation;
	this.gov = gov;
	this.style = XYTM;
	this.group = false;
	//this.floors = this.gov.floors;
	//this.comps = []; // clients who are components
	
	// settle TM
	//this.gov.sections.settle(this);
}
TManager.prototype = {
	addManager : function(man) {
		//this.managers.push(man);
	},
	
	createId : function() {
		return this.gov.createIdC();
	},
	
	addClient : function(city, XYClient) {
		var id = this.createId();
		client = new Client(this, city, false, id, XYClient);
		this.clients[city] = client;

		return client;
	},
	
	addG: function( g ) {
		this.group = g;
	},
	
	addDictionaryClients : function() {
		var capitals = this.nation.listCaps(),
			added = [];
		
		for (var capital in capitals) {
			added[capital] = this.addClient(capitals[capital]);
		}
		return added;
	},
	
	addComp : function(cl) {
		this.comps[cl.city.name] = cl;
	},
	
	getComps : function() {
		return this.comps;
	},
	
	hasC : function(city) {
		return this.clients[city] ? this.clients[city] : false; 
	},
	
	getOtherClients : function() {
		var cities = this.nation.listCaps();
		var out = [];
		for (var c in cities) {
			if (!this.clients[c])
				out[c] = cities[c];
		}
		return out;
	},
	

};

var Manager = function( name, style, booker, id, rule ){
	
	this.booker = booker;
	this.id = id;
	this.i = 0;
	this.name = name; // unique reference
	this.workers = [];
	this.cities = [];
	this.style = style; // XYTM
	this.rule = rule;
	this.confirmRule = rule;
	this.group;
}
Manager.prototype = {

	cid : function() {
		return this.i++;
	},
	// confirmRule is: 0 - same/ok, 1 - better, 2 - worse, 3 - mismatched, 4 - absence
	confirmed: function() {
		var income = this.confirmRule, // ruleW from dictionary
			cur = this.rule; // current ruleW
		
		if ( cur == income ) {
			return 0; // the same
		} else if ( !cur && income ) {
			return 1; // income is better
		} else if ( !income && cur ) {
			return 4; // income is absence
		} else if ( income && cur ) {
			// check rules & levels
			if ( income.level == cur.level ) {
				return 3;
			} else {
				return income.level > cur.level ? 1 : 2;
			}
		} else {
			//console.log("Rules mismatched by unknown reason.");
			return 5;
		}
	},
	
	getConfirmRule: function( kv ) {
		var gov = this.booker.gov,
			g = this.isGroup(),
			book = !g ? gov.book : gov.bookG,
			rule = !g ? gov.rule : gov.ruleG,
			bookRule;
			
		if ( book ) {
			bookRule = !g ? book.rule : book.ruleG;
		}
		
		if ( !kv ) {
			( kv = new KeyValue() ).setKeyValues( this.getKV() );
		}
		
		if ( bookRule ) {
			this.confirmRule = rule.matchAndCopy( kv, bookRule );
		} else {
			this.confirmRule = rule.matchOnly( kv ); // dic editing
		}
		return this.confirmRule;
	},
	
	setStyle: function( localStyle ) {
		if ( localStyle ) {
			this.booker.addLocalStyle( this, localStyle );
		
		// append global style
		} else if ( this.confirmRule ) {
			this.setConfirmRule();
		
		// create empty local style
		} else {
			this.booker.addLocalStyle( this, false );
		}
	},
	
	setConfirmRule: function() {
		// remove local style
		if ( this.style && !this.rule ) {
			this.booker.removeLocalStyle( this );
		}
		// set new style
		var confirmStyle = this.confirmRule.style;
		// clone new style from previous one when new style is empty
		if ( this.style && confirmStyle.empty() ) {
			this.confirmRule.style = confirmStyle = this.booker.gov.style.addCloneTM( this.style );
		}
		this.style = confirmStyle;
		this.rule = this.confirmRule;
		// style has assigned by someone
		if ( this.rule.virgin ) {
			this.rule.virgin = false;
		}
	},
	
	addWorker : function( value, name, id ) {
		if ( !id ) {
			id = this.cid();
		}
		var w = new Worker(value, name, this, id);
		this.workers[id] = w;
		this.cities[name] = w;
		return w;
	},
	
	deleteWorker : function( w ) {
		var name = w.name;
		var id = w.id;
		delete this.workers[id];
		delete this.cities[name];
	},
	
	createLinks : function() {
	
		for (var c in this.workers)
		{
			var w = this.workers[c];
			if (w.hasLinkValue())  // ${manName:cityName}
				w.setLink();
		}
	},
	
	refreshLinks : function() {
	
		for (var c in this.workers)
		{
			var w = this.workers[c];
			if (w.hasLinkValue()) { // ${manName:cityName}
				
				w.setLink();
				this.booker.gov.visio.updateW(w);
			}
			
			if (w.hasLink()) 
				w.updateLinks();
			
			if (w.hasChilds())
				w.updateChilds();

		}
	},
	
	setLinks : function (m0) {
		var workers = m0.workers;
		var name0 = m0.name;
		for (var c in workers)
		{
			var w = this.workers[c];
			if (w) {
				w.setValue("${" + name0 + "}");
				
				w.updateLinks();
			}
		}
	},
		
	refreshReference: function() {
		var w = this.cities["#reference"];
		if ( w ) {
			w.setValue( this.name );
			console.log( w.value + "=" + this.name );
		}
	},
	
	clothestUniqGroup: function() {
		var group = !this.group ? this.findGroup() : this.group;
		return group.uniq();
	},
	
	getPos: function() {
		return this.booker.sections.sect( this );
	},
	
	getW : function(id) {
		return this.workers[id];
	},
	
	getW2 : function( name ) {
		return this.cities[name] || false;
	},
	
	getWCity : function(cityName) {
		return this.cities[cityName] || false;
	},
	
	getC: function( id ) {
		return this.style.getC( id );
	},
	
	getC2: function( name ) {
		return this.style.getCCity( name );
	},
	
	getL : function( i ) {
		return this.style.lines[i];
	},
	
	getKV: function() {
		var out = [];
		for ( var name in this.cities ) {
			out[name] = this.cities[name].realValue();
		}
		return out;
	},
	// if manager is on screen
	isShown: function() {
		if ( g = this.isGroup() ) {
			if ( this.isHead() ) {
				return g.parent.isShown();
			} else {
				return g.isShown();
			}
		} else {
			return this.findGroup().isShown()
		}
	},
	
	addG: function( g ) {
		this.group = g;
	},
	
	isGroup: function() {
		return this.group;
	},
	
	isHead: function() {
		if ( this.isGroup() ) {
			return this.group.isHead( this );
		}
	},
	
	isEnd: function() {
		if ( this.isGroup() ) {
			return !this.group.isHead( this );
		}
	},
	
	findGroup: function() {
		return this.booker.groups.getParent( this );
	},
	
	updateW: function( id, name, value ) {
		
		if ( w = this.cities[name] ) {
			w.setValue( value );
		} else {
			w = this.addWorker( "", name, id );
			w.setValue( value );
		}
		return w;
	},
	
	next: function() {
		return this.booker.sections.next( this );
	},
	
	prev: function() {
		return this.booker.sections.prev( this );
	},
	
	rename: function( name ) {
		this.name = name;
	},
	
	removeW: function( w ) {
		delete this.workers[w.id];
		delete this.cities[w.name];
	},
	
	renameWorker: function( w, newName ) {
		var oldName = w.name;
		// remove old
		delete this.cities( oldName );
		// re-add M
		this.cities[newName] = w;
		// update W
		w.name = newName;
	},
	// copy links (inside of matrix)
	copyLinks: function( m0 ) {
		var workers = this.cities, w0;
		for ( var name in workers ) {
			if ( w0 = m0.getW2( name ) ) {
				if ( w0.hasLink() ) {
					workers[name].link.copy( w0.link );
				}
			}
		}
	},
	
	refresh: function() {
		if ( this.isShown() ) {
			var visio = this.booker.gov.visio,
				sections = this.booker.sections,
				m0;
			// if group hidden, m0 will be next after group.b
			if ( ( g = this.isGroup() ) && !g.isShown() ) {
				m0 = sections.next( g.b );
			} else {
				m0 = sections.next( this );
			}
			visio.removeM( this );
			visio.insertM( this, this.html(), m0 );
			visio.showCss( this.css() );
		}
	},
	
	height: function() {
		return !this.isEnd() ? this.style.height() : this.group.gEndHeight;
	},
	
	out: function() {
		
		var out = [];

		for ( var c in this.cities ) {
			out[c] = this.cities[c].realValue();
		}
		return out;
	},
	
	html: function( headers ) {
		if ( !this.isGroup() || this.isHead() ) {
			style = this.style;
			return style.html( this, headers );
		} else {
			return this.group.a.style.htmlEnd( this );
			return;
		}
	},
		
	css: function() {
		if ( !this.isGroup() || this.isHead() ) {
			// define group color by level
			var defineClr = !this.isGroup() ? false : 
					{ color: "group", index: this.group.level() + 1 };
					
			return this.style.css( defineClr );
		}
	},
	
	insert: function( m0 ) {
		var gov = this.booker.gov,
			m0 = !m0 ? this.booker.sections.next( this ) : m0,
			mv = gov.visio.insertM( this, this.html(), m0 );
		
		gov.visio.showCss( this.style.css() );
		return mv;
	},
};

var Client = function(tmanager, city, floorNo, id, XYClient){
	
	this.id = id;
	this.tmanager = tmanager;
	this.city = city;
	this.style = XYClient;
	//this.tmanager.floors.settle(this, floorNo);
}
Client.prototype = {
};


var Worker = function(value, name, manager, id){

	this.id = id;
	this.value = value;
	this.name = name;
	this.manager = manager;
	this.link = new Link( this, manager.isGroup() );
	
	this.reg = regular;
	this.reg2 = regular2;
}
Worker.prototype = {
	humanValue : function() {
		return this.link.human();
	},
	
	realValue : function() {
		return this.link.real();
	},
	
	setLink: function( w ) {
		this.link.setLink( w.link );
	},
	
	hasLink : function() {
		if ( link = this.link.has() ) {
			return link.w;
		}
	},
	
	parseLink : function( value, links ) {

		var res = this.reg.exec(value) || this.reg2.exec(value);
			
		if (!res)
			return;
		
		var mName0 = res[1];
		var wName0 = res[2] ? res[2] : this.name;
		
		var m0 = links[mName0];
		var w0 = m0 ? m0.getW2(wName0) : false;
		
		return w0;
	},
	
	hasLinkValue : function() { // ${manName:cityName}
		return this.value.charAt(0) == "$" ? true : false;
	},
	
	setValue : function(value) {
		var w0;
		this.value = value;
		
		// delete link
		if ( this.hasLink() ) {
			this.removeLink();
		}
		// check ${link}
		if ( this.hasLinkValue( this.value ) ) {
			if ( w0 = this.parseLink( this.value, this.manager.booker.names ) ) {
				this.setLink( w0 );
			}
		}
		this.updateChilds();
	},
	
	removeLink: function() {
		this.link.removeParent();
	},
	
	updateW : function() {
		this.manager.style.updateC( this );
		//this.manager.booker.gov.visio.updateW( this );
	},
	
	updateChilds : function() {
		var childs = this.link.getChildsW(),
			visio = this.manager.booker.gov.visio;
		
		for ( var i in childs ) {
			var w = childs[i];
			visio.updateW( w );
			w.updateChilds();
		}
	},
	
	insert: function() {
	
	},
	
	html: function() {
		return "<div id=w" + this.id + " class='c" + this.client.id + "'>" + this.humanValue() + "</div>";
	},
}