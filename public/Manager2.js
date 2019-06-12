var TManager = function(nation, gov, id){
	this.id = id;
	this.clients = [];
	this.nation = nation;
	this.gov = gov;
	this.floors = this.gov.floors;
	this.comps = []; // clients who are components
	
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
	
	addClient : function(city) {
		var gov = this.gov,
			floors = gov.floors,
			client,
			existCitizen = gov.hasCitizen(city, this);
		
		// Step 1
		if (!existCitizen) 
			floorNo = false;
		else {
			// Step 2
			floorNo = floors.getClientFloor(existCitizen);
			
			if (!floors.isEmpty(this.id, floorNo)) {
				// Step 3
				var disturbCitizen = floors.getClient(this.id, floorNo);
				var secondDisturb = gov.hasCitizen(disturbCitizen.city, this);
				
				if (!secondDisturb) {
					floors.settle(disturbCitizen, false);
				} else {
					// Step 4
					
					// Look up citizens in all TMs
					var citizens = gov.listCitizens(existCitizen.city),
						floorNo = 0;
					
					// Find last empty floor completed for all
					floorNo = floors.lastEmptyFloor(this.id); // the first, search in thisSelf
					
					for (var c=0, len=citizens.length, lastFloor; c < len; c++) {
					
						lastFloor = floors.lastEmptyFloor(citizens[c].tmanager.id);
						if (lastFloor > floorNo)
							floorNo = lastFloor;
					}
					
					// Move citizens
					for (var c=citizens.length; c--; ) {
						floors.move(citizens[c], floorNo);
					}
				}
			}
		}
		var id = this.createId();
		client = new Client(this, city, floorNo, id);
		this.clients[city.name] = client;
		
		// component
		if (city.isComp()) 
			this.addComp(client);
		
		return client;
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
	}
};

var Manager = function(name, tmanager, booker, m0, id){
	
	this.id = id;
	this.i = 0;
	this.is = 0;
	this.name = name; // unique reference
	this.workers = [];
	this.cities = [];
	this.services = [];
	this.tmanager = tmanager;
	this.booker = booker;
	
	this.booker.sections.settle(this, m0);
}
Manager.prototype = {

	createId : function() {
		return this.i++;
	},
	
	createSId : function() {
		return this.is++;
	},
	
	addWorker : function(value, client, comp) {
		var id = this.createId();
		var w = new Worker(value, client, this, id, comp);
		this.workers[id] = w;
		this.cities[client.city.name] = w;
		return w;
	},
	
	deleteWorker : function(cl) {
		var name = cl.city.name;
		var id = this.cities[name].id;
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
	
	getW : function(id) {
		return this.workers[id];
	},
	
	getWC : function(cl) {
		return this.cities[cl.city.name] || false;
	},
	
	getWCity : function(cityName) {
		return this.cities[cityName] || false;
	},
	
	addService : function(name, value, client) {
		var id = this.createSId();
		var w = new Worker(value, client, this, id, false);
		this.services[name] = w;
		return w;
	},
};

var Client = function(tmanager, city, floorNo, id){
	
	this.id = id;
	this.tmanager = tmanager;
	this.city = city;
	this.tmanager.floors.settle(this, floorNo);
}
Client.prototype = {
};


var Worker = function(value, client, manager, id, comp){

	this.id = id;
	this.value = value;
	this.client = client;
	this.manager = manager;
	this.comp = comp;
	this.link = null; // parrent's object or null
	this.childs = []; // child workers who link on this
	
	this.reg = regular;
	this.reg2 = regular2;
}
Worker.prototype = {

	edit : function(value) {
	
	},
	
	humanValue : function() {
	
		if (this.hasLink()) 
			return this.hasLink().humanValue();
			
		else
			return this.realValue();
	},
	
	realValue : function() {
		return this.value;
	},
		
	hasChilds : function() {
		return this.childs || false;
	},
	
	hasLink : function() {
		return this.link || false;
	},
	
	setLink : function() {

		var res = this.reg.exec(this.value) || this.reg2.exec(this.value);
			
		if (!res)
			return;
		
		var manName = res[1];
		var cityName = res[2] ? res[2] : this.client.city.name;
		
		var mPar = this.manager.booker.names[manName];
		var wParent = mPar ? mPar.getWCity(cityName) : false;
		
		if (wParent) {
			this.link = wParent; // a parent for the child
			wParent.addChild(this); // add a child for the parent
		}
	},
	
	addChild : function (w) {
		for (var i in this.childs) {
			if (this.childs[i] == w)
				return;
		}
		
		this.childs.push(w);
	},
	
	deleteLink : function() {
		this.value = this.humanValue();
		this.link = null;
	},
	
	isBadLink : function() {
		
		var m = this.manager;
		var mAbove = this.link.manager;
		var b = m.booker;
		
		return b.getMPos(m) > b.getMPos(mAbove) ? false : true;
	},
	
	hasLinkValue : function() { // ${manName:cityName}
	
		return this.value.charAt(0) == "$" ? true : false;
	},
	
	hasChilds : function() {
		return this.childs || false;
	},
	
	updateChilds : function() {
	
		var visio = this.manager.booker.gov.visio;
		
		for (var i in this.childs) {
			
			var w = this.childs[i];
			
			w.updateLinks();
			
			if (w.hasChilds())
				w.updateChilds();
				
			visio.updateW(w);
		}
	},
	
	updateLinks : function() {
		
		// check bad link
		if (this.hasLink() && this.isBadLink())
			this.deleteLink();
	},
	
	setValue : function(value) {
		
		this.value = value;
		
		this.link = null;
		
		if (this.hasLinkValue())
			this.setLink();	
	},
	
	setComp : function(comp) {
		this.comp = comp;
	}
}

var STManager = function(nation, gov){
	this.id = 0;
	this.clients = [];
	this.nation = nation;
	this.gov = gov;
	this.floors = this.gov.floorsS;
	this.comps = []; // clients who are components
	
	// settle TM
	//this.gov.sections.settle(this);
}
STManager.prototype = {
	addManager : function(man) {
		//this.managers.push(man);
	},
	
	addClient : function(city, id) {
		var gov = this.gov,
			floors = gov.floorsS,
			floorNo = false, // each after each
			client;
		
		var floorNo = false;
		client = new Client(this, city, floorNo, id);
		this.clients[city.name] = client;
		
		return client;
	},
	
	addComp : function(cl) {
		this.comps[cl.city.name] = cl;
	},
	
	getComps : function() {
		return this.comps;
	}
};