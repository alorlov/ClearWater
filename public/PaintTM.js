var PaintTM = function(gov) {
	this.gov = gov;
	this.colors = new Colors();
	
	var set = { // color : index
		// red
		red : ["#300B09", "#5A1511", "#851E19", "#AF2820", "#D73229", "#DF5B54", "#E7847F", "#EFADA9", "#F7D6D4", "#FFFFFF"],
		//orange
		orange : ["#351805", "#652C08", "#95410C", "#C55610", "#E16A15", "#F38844", "#F6A673", "#F9C3A2", "#FCE1D0", "#FFFFFF"],
		//yellow
		yellow : ["#35350B", "#636314", "#92921D", "#C1C127", "#EDED31", "#F0F05A", "#F4F483", "#F7F7AD", "#FBFBD6", "#FFFFFF"],
		//lime
		lime : ["#0A2E0D", "#125818", "#1A8124", "#23AB2F", "#2CD13B", "#56DA62", "#80E389", "#ABECB1", "#D5F6D8", "#FFFFFF"],
		//cyan
		cyan : ["#132C2C", "#235252", "#337979", "#43A0A0", "#54C4C4", "#76D0D0", "#98DCDC", "#BAE7D7", "#DDF3F3", "#FFFFFF"],
		//sky
		sky : ["#0A1F2A", "#123B50", "#1B5776", "#23729B", "#2D8DBE", "#57A4CB", "#81BAD8", "#ABD1E5", "#D5E8F2", "#FFFFFF"],
		//violet
		violet : ["#1C1224", "#342145", "#4C3165", "#654085", "#7C50A4", "#9673B6", "#B096C8", "#CBB9DA", "#E5DCED", "#FFFFFF"],
		
		//group: ["#000", "#888", "#999", "#aaa", "#bbb", "#ccc", "#ddd", "#eee", "#fff", "#fff"],
		//group : ["#300B09", "#851E19", "#AF2820", "#D73229", "#DF5B54", "#E7847F", "#EFADA9", "#F7D6D4", "#FFFFFF", "#FFFFFF"],
		group : ["#94B9DC", "#94B9DC", "#94B9DC", "#94B9DC", "#94B9DC", "#94B9DC", "#94B9DC", "#94B9DC", "#FFFFFF", "#FFFFFF"],
		//group: ["#333", "#D73229", "#F38844", "#F0F05A", "#56DA62", "#bbb", "#aaa", "#999", "#888", "#000"],
		//group: ["#333", "#D73229", "#eee", "#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#000"],
		grey: ["#333", "#fff", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#fff"],
	};
	
	this.textMatrix = [9,9,9,9,9,0,0,0,0];

	this.set = set;
	
	this.ar = [];
	this.ar[0] = set;
}

PaintTM.prototype = {
	
	init : function() {
		
		var tms = this.getTMByCount();
		var sort = this.sort(tms);
		
		
		for (var value in sort) {
			var tId = sort[value];
			var tm = this.gov.getTM(tId);
			
			this.add(tm);
		}
	},
	
	add : function( id, color, matrix) {
		if ( !color ) {
			color = "grey";
		}
		return this.colors.add( id, color, matrix );
	},
	
	getColor : function( c ) {
		return this.set[c.color][c.index];
	},
	
	getColorT : function( c ) {
		var textIndex = this.textMatrix[c.index];
		return this.set[c.color][textIndex];
	},
	
	getColorCellBg : function( c ) {
		return this.set[c.color][7];
	},
	
	getColorCellTxt : function( c ) {
		return this.set[c.color][1];
	},
	
	getColorNameBg : function( c ) {
		return this.set[c.color][3];
	},
	
	getColorNameTxt : function( c ) {
		return this.set[c.color][2];
	},
	
	// count tmanagers
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
	
	// sort by value: array[id] = value
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