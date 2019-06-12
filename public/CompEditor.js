var CompEditor = function(gov) {
	this.gov = gov;
	this.obj = $("#" + this.gov.name + " #compEditor");
	
	this.comp = {};
	this.worker = {};
	this.array = [];
	
	// states
	this.removeG = false;
	
	var p = this;
	$(this.obj).click(function(e){
	
		var el = e.target,
			id = $(el).attr("id"),
			isG = $(el).attr("class") == "g" ? true : false;
		
		// add exist group
		if (el.tagName == "DIV" && isG) {
		
			p.arrayPlus(id);
			p.createGroupsLine();
		}
		// add new group
		else if (el.id == "newG") {
		
			var groups = p.comp.getGroups(),
				firstG = Object.keys(groups)[0],
				group0 = groups[firstG];
				
			var base = p.comp.base;
			
			var group = base.cloneGroup(group0);
			group.id = base.tags[group.tagName].length;
			group.name = base.createGName(group);
			base.addGroup(group.name, group);
			
			p.createGroupsList();
		}
		// switch on deleting
		else if (el.id == "removeG") {
			
			p.removeG = true;
			p.obj.children("section").children(".g").addClass("removeG");
		}
		// delete group
		else if (p.removeG == true) {
			
			var group = p.comp.base.getGroupsByTag(p.comp.tagName)[id];
			p.comp.base.removeGroup(group);
			
			p.arrayMinusId(id);
			p.createGroupsLine();
			p.createGroupsList();
			
			p.removeG = false;
			p.obj.children("section").children(".g").removeClass("removeG");
		}
		// delete group only from line
		else if (el.id == "remove") {
			p.arrayMinus(id);
			p.createGroupsLine();
		}
		// new comp
		else if (el.id == "newComp") {
			
			p.newComp();
			p.hide();
			p.gov.compScreen.refresh();
		}
		// edit comp and html
		else if (el.id == "editComp") {
			
			p.editComp();
			p.hide();
			p.gov.compScreen.refresh();
		}
	});
}

CompEditor.prototype = {

	open : function (worker) {
		
		this.worker = worker;
		this.comp = this.worker.comp;
		
		var tagName = this.comp.tagName;
		
		this.createGroupsArray();
		this.createGroupsLine();
		this.createGroupsList();
		this.show();
	},
	
	createGroupsArray : function() {
		
		var groups = this.comp.getGroups();
		
		this.array = [];
		for (var g in groups) {
			
			var group = groups[g];
			this.array.push(group.id);
		}
	},
	
	createGroupsLine : function() {
		
		var html = "";
		
		for (var i in this.array) {
			
			var gId = this.array[i];
			
			html += "<span id='" + gId + "'>" + gId + "</span> ";
		}
		
		$(this.obj).children("header").html(html);
	},
	
	createGroupsList : function() {
	
		var groups = this.comp.base.getGroupsByTag(this.comp.tagName),
			html = "";
		
		for (var g in groups) {
			
			html += "<div id='" + g + "' class=g>" + g + "<br>" + groups[g].name.replace("_", " _") + "</div>";
		}
		html += "<div id='newG'> + </div>";
		html += "<button id='removeG'> - </button>";
		
		$(this.obj).children("section").html(html);
	},
	
	show : function() {
		$(this.obj).show();
	},
	
	hide : function() {
		$(this.obj).hide();
	},
	
	arrayPlus : function(val) {
		this.array.push(val);
	},
	
	arrayMinus : function() {
		this.array.pop();
	},
	
	arrayMinusId : function(id) {
		for (var i in this.array) {
			if (this.array[i] == id) {	
				delete this.array[i];
				return true;
			}
		}
	},
	
	newComp : function () {
		
		var base = this.comp.base;
		var tagName = this.comp.tagName;
		var name = base.createName(tagName);
		
		var comp = new Comp(name, tagName, this.comp.pseudoTag);
		// add groups
		var groups = base.getGroupsByTag(tagName);
		for (var i in this.array) {
			
			var id = this.array[i];
			var group = groups[id];
			comp.addGroup("tmp to delete this arg", group);
		}
		
		var hasComp = base.isSimilarComp(comp);
		
		if (hasComp) {
			showMessage("The component already exists.");
			this.worker.comp = hasComp;
		}
		else {
			base.addComp(name, comp);
			this.worker.comp = comp;
		}
		
		this.worker.updateW();
	},
	
	editComp : function() {
		
		var base = this.comp.base;
		var booker = base.booker;
		var tagName = this.comp.tagName;
		var name = base.createName(tagName);
		
		// clean old groups' sequence
		this.comp.removeGroups();
		
		// add new groups' sequence
		var groups = base.getGroupsByTag(tagName);
		for (var i in this.array) {
			
			var id = this.array[i];
			var group = groups[id];
			this.comp.addGroup("tmp to delete this arg2", group);
		}
		
		////
		
		var cityName = this.comp.pseudoTag,
			managers = booker.managers,
			groups = base.groups;
		
		// Update Managers
		for (var i=0, len = managers.length; i<len; i++) {
			
			var w = managers[i].getWCity(cityName);
			if (w) 
				if (w.comp == this.comp)
					w.updateW();
		}
		
		// Update Groups
		for (var g in groups) {
			var group = groups[g];
			w = group.getW(cityName);
			if (w) 
				if (w.comp == this.comp)
					w.updateW();
		}
	}
}