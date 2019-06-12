var KeyValue = function( names, values ) {
	this.indexes = names ? this.setIndexes( names ) : [];
	this.values = values || [];
	
	this.key = false; // if true - getValue seek just by Name
	
	// options
	this.onFieldAbsence = false; // a,B,c => if B is absence, return boolean
	this.onFieldEmpty = false; // 123,,10 => if B == "", return boolean
	return this;
}
KeyValue.prototype = {
	
	hasName: function ( name ) {
		if ( field = this.values[this.k( name )] ) {
			return true;
		} else if ( field === "" ) {
			return this.onFieldEmpty;
		} else if ( field === undefined ) {
			return this.onFieldAbsence;
		}
	},
	
	k: function( name ) {
		if ( !this.key ) {
			return this.indexes[name];
		} else {
			return name;
		}		
	},
	
	getValue : function ( name ) {
		var value = this.values[this.k( name )];
		return value != undefined ? value : "";
	},

	getI : function ( name ) {
		return this.indexes[ name ];
	},
	
	setIndexes: function( names ) {
		// Get indexes of headers by indexes
		var indexes = [];
		for ( var i=names.length; i--; ) {
			indexes[ names[i] ] = i;
		}
		return this.indexes = indexes;
	},
	
	setValues: function( values ) {
		this.values = values;
		this.key = false;
	},
	
	setKeyValues: function( array ) {
		this.values = this.indexes = array;
		this.key = true;
	},
}