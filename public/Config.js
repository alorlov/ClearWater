var Config = function( space ) {
	this.space = space;
	this.filename = this.space.root + "\\cfg\\config.ini";
	this.opt = [];

	this.open();
}
Config.prototype = {
	open: function() {
		var rows = FileSystem.load( this.filename ).split("\n");
		for (var i=rows.length; i--; ) {
			var com = rows[i].split("=");
			if ( name = com[0] ) {
				this.opt[ name ] = com[1].trim();
			}
		}
	},

	save: function() {
		var out = [];
		for ( var com in this.opt ) {
			out.push( com + "=" + this.opt[com] );
		}
		FileSystem.save( this.filename, out.join("\n") );
	},

	get: function( name ) {
		return this.opt[name];
	},

	set: function( name, value, save ) {
		this.opt[name] = value;
		if ( save ) {
			this.save();
		}
	},

	remove: function( name ) {
		delete this.opt[name];
	},
}
