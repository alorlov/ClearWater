var CompBase = function(booker) {
	this.booker = booker;
	this.comps = [];
	this.groups = [];
	this.tags = []; // [NoSides][0] = Group
	this.sep = ",";
}
CompBase.prototype = {

	getAllGroups : function() {
		return this.tags;
	},
	
	getGroupsByTag : function(tagName) {
		return this.tags[tagName];
	},
	
	getComp : function(compName) {
		return this.comps[compName] || false;
	},
	
	getAnyGroup : function(tagName) {
		for (var id in this.tags[tagName]) {
			return this.tags[tagName][id];
		}
	},
	
	addComp : function(compName, comp) {
	
		// change name
		if (this.comps[compName]) {
			compName = this.createName(comp);
			comp.name = compName;
		}
		this.comps[compName] = comp;
	},
	
	removeComp : function (comp) {
		delete this.comps[comp.name];
	},
	
	getGroup : function(compGName) {
		return this.groups[compGName] || false;
	},
	
	addNode : function(tagName, nodeName) {
		var groups = this.tags[tagName];
		for (var id in groups) {
			var group = groups[id];
			group.addNode(nodeName,"", false);
		}
	},
	
	createGName : function(group) {
		return "group_" + group.tagName + "_" + group.id;
	},
	
	createName : function(tagName) {
		
		return "component_" + tagName + "_" + Object.keys(this.comps).length;
	},
	
	addGroup : function(compGName, group) {
	
		var tagName = group.tagName;
		
		if (!this.tags[tagName]) 
			this.tags[tagName] = [];
		
		var id = group.id;
		
		if (!id) {
			var id = this.tags[tagName].length;
			group.setId(id);
		}
		
		this.tags[tagName][id] = group;
		this.groups[compGName] = group;	
	},
	
	removeGroup : function(group) {
		
		delete this.groups[group.name];
		delete this.tags[group.tagName][group.id];
	},
	
	hasComp : function (comp) {
		var tag = comp.tagName;
		
		for (var c in this.comps) {
			
			if (this.comps[c].tagName == tag)
				return this.comps[c];
		}
		return false;
	},
	
	countGroups : function(tagName) {
		return Object.keys(this.tags[tagName]).length;
	},
	
	cloneComp : function(comp0, cloneGroups) {
	
		// copy comp
		var comp = new Comp(comp0.name, comp0.tagName, comp0.pseudoTag);
		
		// copy groups
		var groups = comp0.getGroups();
		for (var g in groups) {
		
			var group0 = groups[g];
			
			if (!cloneGroups)
				var group = this.getGroup(group0.name);
			
			if (!group) {
				var group = this.cloneGroup(group0);
				this.addGroup(group.name, group);
			}
			
			comp.addGroup(group.name, group);
		}
		
		this.addComp(comp.name, comp);
		return comp;
	},
	
	cloneGroup : function(group0) {
	
		var group = new CompGroup(group0.name, group0.tagName, this);
		group.setId(group0.id);
		
		// copy nodes
		var nodes = group0.getNodes();
		for (var n in nodes) {
			
			var node = nodes[n];
			var compInner = (node.comp == false) ? false : this.cloneComp(node.comp);
				
			group.addNode(node.name, node.getValue(), compInner);
		}
		
		return group;
	},
	
	isSimilarComp : function(comp0) {
	
		var groups0 = comp0.getGroups();
		
		for (var c in this.comps) {
			
			var comp = this.comps[c];
			
			// check tag
			if (comp.tagName != comp0.tagName)
				continue;
			
			// check groups
			var groups = comp.getGroups();
			for (var i=0, len=groups0.length; i<len; i++) {
				var group = groups[i];
				var group0 = groups0[i];
				if (!group 
					|| group.id != group0.id 
					|| group.tagName != group0.tagName
					)
					break;
				
				// if all groups are compared
				if (i + 1 == len)
					return comp;
			}
		}
		
		return false;
	},
	
	isSimilarGroup : function(group) {
		var nodes = group.getNodes();
		var tag = group.tagName;
		var groups0 = this.tags[tag];
		
		for (var g in groups0) {
			
			var similar = true;
			var group0 = groups0[g];
			var nodes0 = group0.getNodes();
			
			var length0 = Object.keys(nodes0).length;
			var length = Object.keys(nodes).length;
			
			if (length0 != length)
				continue;
			
			for (var n in nodes) {
				
				var node0 = nodes0[n];
				var node = nodes[n];
				
				if (!node0 || node0.getValue() != node.getValue()) {
				
					similar = false;
					break;
				}
			}
			
			if (similar)
				return group0;
		}
		
		return false;
	},
	
	createLinks : function() {
		for (var g in this.groups) {
			this.groups[g].createLinks();
		}
	},
	
	out : function() {
		
		var ref = "#reference",
			outC = [],
			outG = [];
		
		// Pick comps
		for (var name in this.comps) {
			
			var comp = this.comps[name],
				groups = comp.groups,
				groupsValue = [],
				tag = comp.tagName;
			
			if (!outC[tag]) outC[tag] = [];
			if (!outC[tag][name]) outC[tag][name] = [];
			
			outC[tag][name][ref] = name;
			
			// [group1,group2]
			for (var g in groups) {
				groupsValue.push(groups[g].name);
			}
			outC[tag][name][tag] = "[" + groupsValue.join(this.sep) + "]";
		}
		
		// Pick groups
		for (var name in this.groups) {
			
			var group = this.groups[name],
				nodes = group.nodes,
				groupsValue = [],
				tag = group.tagName;
			
			if (!outG[tag]) outG[tag] = [];
			if (!outG[tag][name]) outG[tag][name] = [];
			
			var o = [];
			o[ref] = name;
			
			// [group1,group2]
			for (var n in nodes) {
				var node = nodes[n];
				o[node.name] = node.realValue();
			}
			outG[tag][name] = o;
		}
		
		// Merge comp & groups by tag
		var i = 0,
			out = [];
		for (var tag in this.tags) {
				
				// groups
			var fieldsG = outG[tag];
			for (var name in fieldsG) {
				out[i++] = fieldsG[name];
			}
				
				// comps
			var fieldsC = outC[tag];
			for (var name in fieldsC) {
				out[i++] = fieldsC[name];
			}

			out[i++] = []; // empty row
		}
		
		return out;
	},
	
	renameNode : function (tagName, oldName, newName) {
		
		var groups = this.tags[tagName];
		for (var id in groups) {
			groups[id].renameNode(oldName, newName);
		}
	},
	
	renameGroup : function(oldName, newName) {
		if (oldName == newName)
			return false;
		this.groups[newName] = this.groups[oldName];
		this.groups[newName].name = newName;
		delete this.groups[oldName];
	},
	
	renameComp : function(oldName, newName) {
		if (oldName == newName)
			return false;
		this.comps[newName] = this.comps[oldName];
		this.comps[newName].name = newName;
		delete this.comps[oldName];
	},
}

var Comp = function(name, tagName, pseudoTag) {
	
	this.base = false;
	this.name = name; // Comp_NoSides
	this.tagName = tagName;
	this.groups = []; // NoSide, NoSide, ...
	this.pseudoTag = pseudoTag;
}
Comp.prototype = {
	
	setPseudoTag : function(pseudoTag) {
		this.pseudoTag = pseudoTag;
	},
	
	addGroup : function(name, group) {
		
		if (group == 'undefined')
			var group = new CompGroup(name);
			
		this.groups.push(group);
		
		if (!this.base)
			this.base = group.base;
			
		return group;
	},
	
	getGroups : function() {
		return this.groups;
	},
	
	removeGroups : function() {
		this.groups = [];
	}
}

var CompGroup = function(name, tagName, base) {

	this.id = false;
	this.base = base;
	this.name = name;
	this.tagName = tagName;
	this.nodes = []; // Side, NoPartyIDs, ...
}
CompGroup.prototype = {

	addNode : function(name, value, comp) {
		
		var node = new CompWorker(name, value, comp, this);
		this.nodes[name] = node;
	},
	
	renameNode : function(oldName, newName) {
		if (oldName == newName)
			return false;
		this.nodes[newName] = this.nodes[oldName];
		this.nodes[newName].name = newName;
		delete this.nodes[oldName]
	},
	
	getNodes : function() {
		return this.nodes;
	},
	
	countNodes : function() {
		return Object.keys(this.nodes).length;
	},
	
	setId : function(id) {
		this.id = id;
	},
	
	getW : function(name) {
		var nodes = this.getNodes();
		for (var n in nodes) {
			if (nodes[n].name == name)
				return nodes[n];
		}
	},
	
	createLinks : function() {
		var nodes = this.getNodes();
		for (var n in nodes)
		{
			var w = nodes[n];
			if (w.hasLinkValue())  // ${manName:cityName}
				w.setLink();
		}
	},
	
	getAnyNode : function() {
		for (var id in this.nodes) {
			return this.nodes[id];
		}
	},
}

var CompWorker = function(name, value, comp, group) {
	this.group = group;
	this.name = name;
	this.comp = comp;
	this.value = value;
	this.link = null; // parrent's object or null
		
	this.reg = regular;
	this.reg2 = regular2;
}
CompWorker.prototype = {

	getValue : function() {
		return this.value;
	},
	
	setValue : function(value) {
		this.value = value;
		
		this.link = null;
		
		if (this.hasLinkValue())
			this.setLink();	
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
	
	hasLink : function() {
		return this.link || false;
	},
	
	hasLinkValue : function() { // ${manName:cityName}
		return this.value.charAt(0) == "$" ? true : false;
	},
		
	setLink : function() {

		var res = this.reg.exec(this.value) || this.reg2.exec(this.value);
			
		if (!res || !res[2])
			return;
		
		var manName = res[1];
		var cityName = res[2];
		
		var mPar = this.group.base.booker.names[manName];
		var wParent = mPar ? mPar.getWCity(cityName) : false;
		
		if (wParent) {
			this.link = wParent; // a parent for the child
			wParent.addChild(this); // add a child for the parent
		}
	},
	
	updateLinks : function() {
		
		// check bad link
		
	},
	
	hasChilds : function() {
		return false;
	},
	
	updateW : function() {
		this.group.base.booker.gov.visio.comp.updateW(this);
	},
}