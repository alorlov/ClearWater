var Sections = function(){
	this.sections = []; // tm by sect
}

Sections.prototype = {
	
	sect : function(m) {
		for (var i=this.sections.length; i--; ) {
			if (this.sections[i] == m)
				return i;
		}
	},
	
	list : function () {
		return this.sections;
	},
	
	next : function(m0) {
		
		var pos = this.sect(m0);
		var length = this.sections.length;
		do {
			var m = this.sections[++pos];
		}
		while (!m && pos < length);
		
		return m;
	},
	
	prev : function(m) {
	
		var pos = this.sect(m);
		do {
			var m = this.sections[--pos];
		}
		while (!m && pos > 0);
		
		return m;
	},
	
	first : function() {
		return this.sections[0];
	},
	
	last : function() {
		 return this.sections.length - 1;
	},
	
	settle : function(m, m0) { // settle m before m0
		
		if (m0) {
			var pos = this.sect(m0);
			this.sections.splice(pos, 0, m);
		}	
		else
			this.sections.push(m);
	},
	
	resettle : function(m, m0) { // settle m before m0
		
		this.unsettle(m);
		if (m0) {
			var pos = this.sect(m0);
			this.sections.splice(pos, 0, m);
		}	
		else
			this.sections.push(m);
	},
	
	unsettle : function(m) {
		var pos = this.sect(m);
		this.sections.splice(pos, 1);
	}
};

var Floors = function (){
	this.clientsX0 = 160;
	this.coords = [];
	this.tmanagers = []; // [][]: floorsC[tm.id] = ["floorNo" => c.id]
	this.clients = []; // floor by client's id
	this.workers = [];
	
	for (var i=0; i < 30; i++) {
		this.coords[i] = i * 51 + this.clientsX0;
	}
}
Floors.prototype = {
	getClientFloor : function(client){
		return this.clients[client.id];
	},
	
	getClient : function(tmId, floorNo) {
		var tmFloors = this.tmanagers[tmId];
		if (tmFloors)
			return tmFloors[floorNo];
		
		return false;
	},
	
	isEmpty : function(tmId, floorNo) {
	
		return !this.getClient(tmId, floorNo) ? true : false;
	},

	getFirstEmptyFloor : function(tmId){
		for (var i=0, len=this.lastEmptyFloor(tmId); i <= len; i++) { // "i <= len" for return unsettle position
			if (this.isEmpty(tmId, i)) {
				return i;
			}
		}
		return 0;
	},
	
	lastEmptyFloor : function(tmId){
	
		return this.tmanagers[tmId].length;
	},
	
	checkTM : function(tmId) {
		if(!this.tmanagers[tmId]) {
			this.tmanagers[tmId] = [];
		}
	},

	getX : function(client){
		var floor = this.getClientFloor(client);
		return (this.coords[floor]);
	},

	settle : function(client, floorNo){
		var tmId = client.tmanager.id;
		this.checkTM(tmId);
		if(floorNo === false){
			floorNo = this.getFirstEmptyFloor(tmId); // search first empty floor
		}
		this.clients[client.id] = floorNo;
		this.tmanagers[tmId][floorNo] = client;
	},
	
	unsettle : function(tmId, client) {
		
		var cId = client.id;
			floorNo = this.clients[cId];
		
		delete this.clients[cId];
		delete this.tmanagers[tmId][floorNo];
	},
	
	move : function(client, floorNo) {
	
		var tmId = client.tmanager.id;
		
		this.unsettle(tmId, client);
		
		this.clients[client.id] = floorNo;
		this.tmanagers[tmId][floorNo] = client;
	}
};
