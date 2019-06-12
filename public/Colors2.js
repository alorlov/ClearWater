var Colors = function(gov){
	this.gov = gov;
	//this.matrix = [4, 6, 2, 5, 7, 3, 1, 8, 0];
	//this.matrix = [0, 1, 2, 3, 4];
	this.matrixSend = [1,2];
	this.matrixWait = [5,6];
	
	var setBG = { // color : index
		// red
		0 : ["#300B09", "#5A1511", "#851E19", "#AF2820", "#DF5B54", "#E7847F", "#EFADA9", "#F7D6D4"],
		//orange
		1 : ["#351805", "#652C08", "#95410C", "#C55610", "#F38844", "#F6A673", "#F9C3A2", "#FCE1D0"],
		//yellow
		2 : ["#35350B", "#636314", "#92921D", "#C1C127", "#F0F05A", "#F4F483", "#F7F7AD", "#FBFBD6"],
		//lime
		3 : ["#0A2E0D", "#125818", "#1A8124", "#23AB2F", "#56DA62", "#80E389", "#ABECB1", "#D5F6D8"],
		//cyan
		4 : ["#132C2C", "#235252", "#337979", "#43A0A0", "#76D0D0", "#98DCDC", "#BAE7D7", "#DDF3F3"],
		//sky
		5 : ["#0A1F2A", "#123B50", "#1B5776", "#23729B", "#57A4CB", "#81BAD8", "#ABD1E5", "#D5E8F2"],
		//violet
		//6 : ["#1C1224", "#342145", "#4C3165", "#654085", "#9673B6", "#B096C8", "#CBB9DA", "#E5DCED"],
	};
	var setTBG = {
		// red
		0 : ["#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4","#300B09","#300B09","#300B09","#300B09"],
		// orange
		1 : ["#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0","#351805","#351805","#351805","#351805"],
		// yellow
		2 : ["#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6","#35350B","#35350B","#35350B","#35350B"],
		// lime
		3 : ["#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8","#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D"],
		// cyan
		4 : ["#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3","#132C2C","#132C2C","#132C2C","#132C2C"],
		// sky
		5 : ["#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2","#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A"],
		// violet
		//6 : ["#E5DCED","#E5DCED","#E5DCED","#E5DCED","#1C1224","#1C1224","#1C1224","#1C1224"],
	};
	var set = {
		// red
		0 : ["#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4","#F7D6D4"],
		// orange
		1 : ["#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0","#FCE1D0"],
		// yellow
		2 : ["#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6","#FBFBD6"],
		// lime
		3 : ["#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8","#D5F6D8"],
		// cyan
		4 : ["#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3","#DDF3F3"],
		// sky
		5 : ["#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2","#D5E8F2"],
		// violet
		//6 : ["#E5DCED","#E5DCED","#E5DCED","#E5DCED","#1C1224","#1C1224","#1C1224","#1C1224"],
	};
	var set2 = {
		// red
		0 : ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
		// orange
		1 : ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
		// yellow
		2 : ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
		// lime
		3 : ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
		// cyan
		4 : ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
		// sky
		5 : ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"],
		// violet
		//6 : ["#E5DCED","#E5DCED","#E5DCED","#E5DCED","#1C1224","#1C1224","#1C1224","#1C1224"],
	};
	var setT = {
		// red
		0 : ["#300B09","#300B09","#300B09","#300B09","#300B09","#300B09","#300B09","#300B09"],
		// orange
		1 : ["#351805","#351805","#351805","#351805","#351805","#351805","#351805","#351805"],
		// yellow
		2 : ["#35350B","#35350B","#35350B","#35350B","#35350B","#35350B","#35350B","#35350B"],
		// lime
		3 : ["#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D","#0A2E0D"],
		// cyan
		4 : ["#132C2C","#132C2C","#132C2C","#132C2C","#132C2C","#132C2C","#132C2C","#132C2C"],
		// sky
		5 : ["#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A","#0A1F2A"],
		// violet
		//6 : ["#E5DCED","#E5DCED","#E5DCED","#E5DCED","#1C1224","#1C1224","#1C1224","#1C1224"],
	};
	
	/*this.colors = { // color : index
		// red
		1 : ["#300B09", "#5A1511", "#851E19", "#AF2820", "#D73229", "#DF5B54", "#E7847F", "#EFADA9", "#F7D6D4"],
		//orange
		2 : ["#351805", "#652C08", "#95410C", "#C55610", "#516A15", "#F38844", "#F6A673", "#F9C3A2", "#FCE1D0"],
		//yellow
		3 : ["#35350B", "#636314", "#92921D", "#C1C127", "#EDED31", "#F0F05A", "#F4F483", "#F7F7AD", "#FBFBD6"],
		//lime
		4 : ["#0A2E0D", "#125818", "#1A8124", "#23AB2F", "#2CD13B", "#56DA62", "#80E389", "#ABECB1", "#D5F6D8"],
		//cyan
		5 : ["#132C2C", "#235252", "#337979", "#43A0A0", "#54C4C4", "#76D0D0", "#98DCDC", "#BAE7D7", "#DDF3F3"],
		//sky
		6 : ["#0A1F2A", "#123B50", "#1B5776", "#23729B", "#2D8DBE", "#57A4CB", "#81BAD8", "#ABD1E5", "#D5E8F2"],
		//violet
		7 : ["#1C1224", "#342145", "#4C3165", "#654085", "#7C50A4", "#9673B6", "#B096C8", "#CBB9DA", "#E5DCED"],
	};*/
	var setT2 = { // color : index
		// red
		0 : ["#300B09", "#5A1511", "#851E19", "#AF2820", "#DF5B54", "#5A1511", "#851E19", "#F7D6D4"],
		//orange
		1 : ["#351805", "#652C08", "#95410C", "#C55610", "#F38844", "#652C08", "#95410C", "#FCE1D0"],
		//yellow
		2 : ["#35350B", "#636314", "#92921D", "#C1C127", "#F0F05A", "#636314", "#92921D", "#FBFBD6"],
		//lime
		3 : ["#0A2E0D", "#125818", "#1A8124", "#23AB2F", "#56DA62", "#125818", "#1A8124", "#D5F6D8"],
		//cyan
		4 : ["#132C2C", "#235252", "#337979", "#43A0A0", "#76D0D0", "#235252", "#337979", "#DDF3F3"],
		//sky
		5 : ["#0A1F2A", "#123B50", "#1B5776", "#23729B", "#57A4CB", "#123B50", "#1B5776", "#D5E8F2"],
		//violet
		//6 : ["#1C1224", "#342145", "#4C3165", "#654085", "#9673B6", "#B096C8", "#CBB9DA", "#E5DCED"],
	};

	this.colors = setBG;
	this.colorsT = setTBG;
	this.colorsDiv = setBG;
	this.colorsTDiv = setT2;
	
	this.colorsSet = {"Send" : [], "Wait": [],};
	this.tmColor = []; //[tm.id] = {color, index}
	
	this.lastColor = -1;
}
Colors.prototype = {
	
	init : function() {
		
		var tms = this.getTMByCount();
		var sort = this.sort(tms);
		
		for (var value in sort) {
			var tId = sort[value];
			var tm = this.gov.getTM(tId);
			this.addTM(tm);
		}
	},
	
	getColor : function(tm) {
		var c = this.tmColor[tm.id]
		return this.colorsDiv[c.color][c.index];
	},
	
	getColorT : function(tm) {
		var c = this.tmColor[tm.id];
		return this.colorsTDiv[c.color][c.index];
	},
	
	getColorBG : function(tm) {
		var c = this.tmColor[tm.id];
		return this.colors[c.color][c.index];
	},
	
	getColorTBG : function(tm) {
		var c = this.tmColor[tm.id];
		return this.colorsT[c.color][c.index];
	},
	
	addTM : function(tm) {
		//var color = tm.nation.getColor();
		
		// randomic colors
		var maxColors = Object.keys(this.colors).length - 1;
		var color = Math.floor(Math.random() * (maxColors - 0 + 1)) + 0;
		this.lastColor = this.lastColor >= maxColors ? 0 : this.lastColor + 1;
		//var color = this.lastColor;
		
		var isSend = tm.nation.isSend,
			matrix = isSend ? this.matrixSend : this.matrixWait,
			scheme = isSend ? "Send" : "Wait",
			index = this.takeColor(color, matrix, scheme);
		
		this.tmColor[tm.id] = {color : color, index : index}
	},
	
	createColorSet : function(color, matrix) {
		var out = [];
		for (var index in matrix) {
			out.push(matrix[index]);
		}
		return out;
	},
	
	takeColor : function(color, matrix, scheme) {
		var s = this.colorsSet[scheme];
		
		if (!s[color] || s[color].length == 0)
			s[color] = this.createColorSet(color, matrix);
		
		return s[color].shift();
	},
	
	getTMByCount : function() {
		
		var bookers = this.gov.bookers;
		var mCount = [];
		
		for (var bId in bookers) {
			var managers = bookers[bId].managers;
			
			for (var mId in managers) {
			
				var tId = managers[mId].tmanager.id;
				
				if (!mCount[tId])
					mCount[tId] = 1;
				else
					mCount[tId]++;
			}
		}
		return mCount;
	},
	
	sort : function(inp) {
		var out = [];
		
		for(var id in inp) {
			var value = inp[id];
			
			while (out[value]) {
				value += 0.0001;
			}
			out[value] = id;
		}
		return out;
	},
}