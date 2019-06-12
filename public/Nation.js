var Dictionary = function() {
	this.race = [];
}
Dictionary.prototype = 
{
	addRace : function(name) {
		var r = new Race(name)
		this.race[name] = r;
		return r;
	},
	
	// get Object by String
	getRace : function(name) {
		return this.race[name] || false;
	},
	getNation : function(race, name) {
		return race.nations[name] || false;
	}
};

var Race = function(name) {
	this.name = name;
	this.cities = [];
	this.nations = [];
}
Race.prototype = {
	addCity : function(id, name, comp) {
		var c = new City(id, name, this, comp);
		this.cities[name] = c;
		return c;
	},
	
	addNation : function(name) {
		var n = new Nation(this, name);
		this.nations[name] = n;
		return n;
	},
	
	getNation : function(name) {
		return this.nations[name] || false;
	},
	
	getCity : function(name) {
		return this.cities[name] || false;
	},
};

var Nation = function(race, name) {
	this.capitals = [];
	this.cities = [];
	this.name = name;
	this.race = race;
	this.isSend = this.isSend();
	this.smartName = this.getSmartName();
	this.cfg = {
		color : "grey"
	};
}
Nation.prototype = {
	addCity : function(city) {
		//this.cities[city.name] = city;
	},

	addCapital : function(city) {
		this.capitals[city.name] = city;
	},
	
	getCity : function(name) {
		//return this.cities[name] || false;
	},

	listCaps : function(){ return this.capitals	},
	
	getSmartName : function() {
		return this.isSend ? this.name.replace("Send", "") : this.name.replace("Wait", "");
	},
	
	isSend : function() {
		//var type = this.name.substr(0, 4);
		//return type == "Send";
		return this.name.indexOf("Send") == 0;
	},
	
	getColor : function() { return this.cfg.color },
	setColor : function(color) { this.cfg.color = color }
}

var City = function(id, name, race, isComp){
	this.id = id;
	this.name = name;
	this.race = race;
	this.comp = isComp ? true : false;
	this.realCompName = false;
}
City.prototype = {
	
	isComp : function() { 
		return this.comp;
	},
	
	setRealCompName : function(name) {
		this.realCompName = name;
	},
}



