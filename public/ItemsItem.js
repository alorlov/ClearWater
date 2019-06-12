var ItemsItem = function(race, manager) {
	this.race = race;
	this.manager = manager;
}

ItemsItem.prototype = {
	
	html : function () {
		var name = this.manager.tmanager.nation.smartName;
		return this.race.visio.createItem(this.manager.id, name);
	}
}