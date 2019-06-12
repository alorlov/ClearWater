var Sections = function(){
	this.sections = []; // tm by sect
	this.changed = false;
}

Sections.prototype = {
	
	sect : function(m) {
		for (var i=this.sections.length; i--; ) {
			if (this.sections[i] == m)
				return i;
		}
		return false;
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
		 return this.sections[ this.sections.length - 1 ];
	},
	// sort m by order
	sort: function( ar ) {
		var sort = [];
		for ( var i=ar.length; i--; ) {
			var m = ar[i], sect = this.sect( m );
			sort[sect] = m;
		}
		var out = [];
		for ( var i in sort ) {
			out.push( sort[i] );
		}
		return out;
	},
	
	settle : function(m, m0) { // settle m before m0
		
		if (m0) {
			var pos = this.sect(m0);
			this.sections.splice(pos, 0, m);
		}	
		else
			this.sections.push(m);
		
		this.changed = true;
	},
	
	unsettle : function(m) {
		var pos = this.sect(m);
		this.sections.splice(pos, 1);
		
		this.changed = true;
	},
	
	resettle : function(m, m0) { // settle m before m0
		
		this.unsettle( m );
		this.settle( m, m0 );
	},
	
	settleSet: function( set1, m0 ) {
		var pos0;
		
		if ( this.sect(m0) !== false ) {
			pos0 = this.sect(m0);
		} else {
			pos0 = this.sections.length;
		}
		var args = [pos0, 0].concat( set1 );
		this.sections.splice.apply(this.sections, args);
		
		this.changed = true;
	},
	
	unsettleSet: function( m1, m2 ) {
		var p1 = this.sect(m1),
			p2 = this.sect(m2),
			delCount = p2 - p1 + 1;
		this.sections.splice( p1, delCount );
		
		this.changed = true;
	},
	
	resettleSet : function( m1, m2, m0 ) { // settle m before m0
		var p1 = this.sect(m1),
			p2 = this.sect(m2),
			pArray = this.sections.slice( p1, p2 + 1 );

		this.unsettleSet( m1, m2 );
		this.settleSet( pArray, m0 );
	},
}
	
;

var Floors = function (rowWrap){
	this.clientsX0 = 160;
	this.coords = [];
	//this.tmanagers = []; // [][]: floorsC[tm.id] = ["floorNo" => c.id]
	this.clients = []; // floor by client's id
	
	this.clientsX = []; // [tmId][cId]
	this.clientsY = [];
	
	this.tmanagers = []; // [tmId][row][x] = Client
	this.maxFloorY = 0;
	
	this.lengthR = rowWrap ? 13 : 100;
	
	for (var i=0; i < 30; i++) {
		this.coords[i] = i * 51 + this.clientsX0;
	}
}
Floors.prototype = {

	getClientFloor : function(client){
		var tmId = client.tmanager.id,
			cId = client.id;
		return {
			x : this.clientsX[tmId][cId],
			y : this.clientsY[tmId][cId]
		}
	},
	
	getClient : function(tmId, f) {
		var client = this.tmanagers[tmId][f.y][f.x];
		
		return client || false;
	},
	
	getYByEmptyX : function(tmId, x) {
		
		for (var y=0; y <= this.maxFloorY; y++) {
			if (this.isEmpty(tmId, x, y))
				return y;
			else
				if (this.getFirstEmptyX(tmId, y, true)) 
					return false;
		}
		return this.maxFloorY + 1;
	},
	
	isEmpty : function(tmId, x, y) {
		var tm = this.tmanagers[tmId];
		
		if (!tm) 
			tm = this.checkTM(tmId);
		
		var row = tm[y];
		return (row && row[x]) ? false : true;
	},

	getFirstEmptyX : function (tmId, y, fromStart) {
		
		// ASC
		if (fromStart) {
			for (var i=0; i < this.lengthR; i++) {
				if (this.isEmpty(tmId, i, y)) {
					return {
						x: i,
						y: y
					}
				}
			}
		}
		// DESC
		else
		{
			for (var i=this.lengthR; i--;) {
				if (this.isEmpty(tmId, i, y)) {
					return {
						x: i,
						y: y
					}
				}
			}
		}
		return false;
	},
	
	getFirstEmptyFloor : function(tmId){
		
		var fromStart = true,
			floorCount = this.tmanagers[tmId].length,
			floorY = 0;
		
		for (var y=floorY; y < floorCount; y++) {
		
			var floorNo = this.getFirstEmptyX(tmId, y, fromStart);
			fromStart = !fromStart;
			
			if (floorNo)
				break;
		}
		
		return floorNo ? floorNo :
		{
			x: fromStart ? 0 : this.lengthR - 1,
			y: floorCount
		}
	},
	
	getLastEmptyFloor : function(tmId){
		
		var floorNo = this.getFirstEmptyX(tmId, 1, true);
		if (!floorNo)
			var floorNo = this.getFirstEmptyX(tmId, 0, false);
		
		return floorNo;
	},
	
	settle : function(client, floorNo){
	
		var tmId = client.tmanager.id,
			cId = client.id;
			
		this.checkTM(tmId);
		
		if(floorNo === false)
			floorNo = this.getFirstEmptyFloor(tmId);
		
		var x = floorNo.x,
			y = floorNo.y;
		this.clientsX[tmId][cId] = x;
		this.clientsY[tmId][cId] = y;
		
		this.checkY(tmId, y);
		
		this.tmanagers[tmId][y][x] = client;
	},
	
	unsettle : function(tmId, client) {
		
		var cId = client.id,
			tmId = client.tmanager.id,
			x = this.clientsX[tmId][cId],
			y = this.clientsY[tmId][cId];
		
		delete this.clientsX[tmId][cId];
		delete this.clientsY[tmId][cId];
		delete this.tmanagers[tmId][y][x];
	},
	
	move : function(client, floorNo) {
	
		var tmId = client.tmanager.id;
		
		this.unsettle(tmId, client);
		this.settle(client, floorNo);
	},
	
	sort : function(client) {
		var tmId = client.tmanager.id,
			floor = this.getClientFloor(client),
			tm = this.tmanagers[tmId];
		
		var clients = this.getClientsByX(tmId, floor.x);
		
		for (var y=0, len=tm.length; y<len; y++) {
			if (this.isEmpty(tmId, floor.x, y))
				this.move( clients.shift(), {x: floor.x, y: y});
			else
				clients.shift();
			
			if (!clients.length)
				break;
		}
	},
	
	// get all tmanager's clients with X
	getClientsByX : function(tmId, x) {
		var tm = this.tmanagers[tmId];
		
		var clients = [];
		for (var y=0, len=tm.length; y<len; y++) {
			if (!this.isEmpty(tmId, x, y))
				clients.push( this.getClient(tmId, {x: x, y: y}) )
		}
		
		return clients;
	},
	
	checkTM : function(tmId) {
		if(!this.tmanagers[tmId]) {
			
			this.tmanagers[tmId] = [];
			this.clientsX[tmId] = [];
			this.clientsY[tmId] = [];
			
			return this.tmanagers[tmId];
		}
	},
	
	checkY : function (tmId, y) {
		
		if(!this.tmanagers[tmId][y]) 
			this.tmanagers[tmId][y] = [];
		
		if (y > this.maxFloorY) 
			this.maxFloorY = y;
	},

	getXY : function(client) {
	
		var html = {},
			floor = this.getClientFloor(client),
			tmId = client.tmanager.id,
			clients = this.getClientsByX(tmId, floor.x),
			sum = clients.length;
		
		html.height = 100 / sum;
		html.lineHeight = sum == 1 ? "3em" : "";
		html.x = this.coords[floor.x];
		html.y = (100 / sum) * floor.y;
		
		return html;
	},

};
