var Colors = function(){

	this.colorsSet = [];
	this.unit = []; //[tm.id] = {color, index}
}
Colors.prototype = {
	
	add : function(id, color, matrix) {
		if ( !matrix ) {
			matrix = [1];
		}
		var index = this.takeColor(color, matrix),
			obj = { color : color, index : index };
		this.unit[id] = obj;
		return obj;
	},

	get : function(id) {
		return this.unit[id] || false;
	},
	
	createColorSet : function(color, matrix) {
		var out = [];
		for (var index in matrix) {
			out.push(matrix[index]);
		}
		return out;
	},
	
	takeColor : function(color, matrix) {
		var s = this.colorsSet;
		
		if (!s[color] || s[color].length == 0)
			this.colorsSet[color] = this.createColorSet(color, matrix);
		
		return this.colorsSet[color].shift();
	},
	
	
}