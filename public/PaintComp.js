var PaintComp = function(gov) {
	this.gov = gov;
	this.colors = new Colors();
	
	this.matrix = [3,4,5,6,7,0,1,2];
	
	var setBG = { // color : index
		red 
		: ["#300B09", "#5A1511", "#851E19", "#AF2820", "#DF5B54", "#E7847F", "#EFADA9", "#F7D6D4"],
		orange
		: ["#351805", "#652C08", "#95410C", "#C55610", "#F38844", "#F6A673", "#F9C3A2", "#FCE1D0"],
		yellow
		: ["#35350B", "#636314", "#92921D", "#C1C127", "#F0F05A", "#F4F483", "#F7F7AD", "#FBFBD6"],
		lime
		: ["#0A2E0D", "#125818", "#1A8124", "#23AB2F", "#56DA62", "#80E389", "#ABECB1", "#D5F6D8"],
		cyan
		: ["#132C2C", "#235252", "#337979", "#43A0A0", "#76D0D0", "#98DCDC", "#BAE7D7", "#DDF3F3"],
		sky
		: ["#0A1F2A", "#123B50", "#1B5776", "#23729B", "#57A4CB", "#81BAD8", "#ABD1E5", "#D5E8F2"],
		violet
		: ["#1C1224", "#342145", "#4C3165", "#654085", "#9673B6", "#B096C8", "#CBB9DA", "#E5DCED"],
	};
	var setTBG = {
		red
		: ["#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4","#300B09","#300B09","#300B09","#300B09"],
		orange
		: ["#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0","#351805","#351805","#351805","#351805"],
		yellow
		: ["#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6","#35350B","#35350B","#35350B","#35350B"],
		lime
		: ["#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8","#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D"],
		cyan
		: ["#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3","#132C2C","#132C2C","#132C2C","#132C2C"],
		sky
		: ["#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2","#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A"],
		violet
		: ["#E5DCED","#E5DCED","#E5DCED","#E5DCED","#1C1224","#1C1224","#1C1224","#1C1224"],
	};
	
	this.setGroup = ["#ffffff", "#E7847F", "#F6A673", "#F4F483", "#80E389", "#98DCDC", "#81BAD8", "#B096C8"];
	this.setGroupT = ["#000000", "#300B09", "#351805", "#35350B", "#0A2E0D", "#132C2C", "#0A1F2A", "#1C1224"];

	this.set = setBG;
	this.setT = setTBG;
}

PaintComp.prototype = {
	
	init : function() {
		
		var tms = this.gov.tmanagers;
		// get all comp tags
		for (var i in tms) {
			var tm = tms[i];
			var clients = tm.getComps();
			
			if (!clients)
				continue;
			
			for (var c in clients) {
				var client = clients[c];
				var tagName = client.city.realCompName;
				
				if (this.colors.get(tagName))
					continue;
				
				// add
				var colorsList = ["red","orange","yellow","lime","cyan","sky","violet"];
				var maxColors = colorsList.length - 1;
				var i = Math.floor(Math.random() * (maxColors - 0 + 1)) + 0;
				var color = colorsList[i];
				
				this.colors.add(tagName, color, this.matrix);				
			}
		}
		
	},
	
	getColorComp : function(tagName) {
		var c = this.colors.get(tagName);
		return this.set[c.color][c.index];
	},
	
	getColorCompT : function(tagName) {
		var c = this.colors.get(tagName);
		return this.setT[c.color][c.index];
	},
	
	getColorGroup : function(group) {
		
		// if first
		if (group.id == 0)
			return this.getColorComp(group.tagName);
		
		return this.setGroup[group.id];
	},
	
	getColorGroupT : function(group) {
		return this.setGroupT[group.id];
	},
	
}