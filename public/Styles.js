var Styles = {
	params: [],

	add: function( c ) {
		if ( !this.params[c] ) {
			this.params[c] = true;
			$("#Goverments").addClass( c );
		}
		return this;
	},
	
	remove: function( c ) {
		if ( this.params[c] ) {
			delete this.params[c];
			$("#Goverments").removeClass( c );
		}
		return this;
	}
}