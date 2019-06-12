var Ev = {
	e : [],

	add : function(id, e) {
		this.e[id] = e;
	},
	
	get : function(id) {
		return this.e[id];
	},
}