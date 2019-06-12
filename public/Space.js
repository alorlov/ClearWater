var Space = function(sitePath) {
	this.i = 0;

	this.govs = [];
	this.book = false;
	this.palettes = [];

	this.active = false;
	this.path = [];
	this.tpl = new Templates();

	this.root = sitePath;

	// load after library's readyness
	this.events;
	this.visio;
	this.folder;
}
Space.prototype = {

	ready : function() {
		this.events = new Events( this );
		this.visio = new Visio( this );
		this.folder = new Folder();
		this.config = new Config( this );
	},

	setConfig: function( name, value, save ) {
		this.config.set( name, value, save );
	},

	getConfig: function( name ) {
		return this.config.get( name );
	},

	removeConfig: function( name ) {
		return this.config.remove( name );
	},

	createId : function() {
		return this.i++;
	},

	getGId : function (id) {
		return "g" + id;
	},

	getG: function( id ) {
		return this.govs[id];
	},

	hasGov : function (path) {

		for (var id in this.govs) {
			var gov = this.govs[id];
			if (path == gov.path)
				return gov;
		}

		return false;
	},

	insert: function( jhtml ) {
		jhtml.appendTo( $("#Goverments") );
	},

	createDic : function () {
		var id = this.createId();

 		this.book = new Government(id, this.path["dic"], false, this);
		this.govs[id] = this.book;
		return this.book;
	},

	createGov : function ( filename ) {
		var id = this.createId();

 		var gov = new Government(id, filename, this.book, this);
		this.govs[id] = gov;
		return gov;
	},

	getPal: function( id ) {
		return this.palettes[id];
	},

	getPalByGov: function( gov ) {
		for ( var name in this.palettes ) {
			if ( this.palettes[name].gov == gov ) {
				return this.palettes[name];
			}
		}
	},

	addPalette : function ( gov, name, onlyGroups ) {
		// add in palettes set
		var pal = new Palette( this, gov, name );
		this.palettes[name] = pal;
		// add on page
		this.tpl.addPalette( name, pal.html( onlyGroups ) );
		this.visio.showCss( pal.css(), name );
		return pal;
	},

	removePalette: function( name ) {
		// remove from html
		this.tpl.removePalette( name );
		// remove from palettes set
		delete this.palettes[name];
		this.visio.removeCss( name );
	},

	refreshPalette: function( gov, name, onlyGroups ) {
		this.removePalette( name );
		return this.addPalette( gov, name, onlyGroups );
	},

	save: function( gov ) {
		if ( !gov ) {
			gov = this.active;
		}

		gov.save();
	},

	refreshPalettes: function( gov ) {
		if ( !gov ) {
			gov = this.active;
		}
		// refresh book
		if ( gov == this.book ) {
			space.remove( gov );
			space.createDic();
			space.refreshPalette( gov, "book" );
		}
		// refresh palette
		else if ( pal = this.getPalByGov( gov ) ) {
			space.refreshPalette( gov, pal.name, true );
		}
	},

	remove: function( gov ) {
		if ( !gov ) {
			gov = this.active;
		}

		var id = gov.id;

		delete this.govs[id];
		$( "#a" + id ).remove();
		this.visio.removeCss( 0 );
	},

	show: function ( gov ) {
		this.active = gov;

		if ( !this.active.shown ) {
			// create tpl
			this.insert( this.tpl.getGov( this.active.id ) );
			this.active.insert();
		}

		this.active.show();
		//
		this.visio.showGovName( this.active );
	},

	hide : function ( gov ) {
		if ( !gov ) {
			gov = this.active;
		}
		gov.hide();
	},
	/*
	showBook : function () {
		var items = new Items("items", this.book);
	},

	clean : function () {
		for (var id in this.govs) {
			this.delG(this.govs[id]);
		}

		this.govs = [];
	},*/
}

var Templates = function() {
}
Templates.prototype = {

	getGov : function( id ) {
		var gov = $("#_tplRight").clone();
		gov.attr("id", "a" + id);
		gov.attr("class", "panel");
		gov.children("#_main").attr("id", "g" + id);

		return gov;
	},

	getDic : function( id ) {
		var gov = $("#_tplDic").clone();
		gov.attr("id", "a" + id);
		gov.attr("class", "panel");
		gov.children("#_main").attr("id", "g" + id);

		return gov;
	},

	addPalette : function( id, html ) {
		var home = $("#_palette"),
			homeBut = $("#_paletteHead"),
			palette = $("<div id=q" + id + " data-panel='P" + id + "'></div>"),
			button = $("<div id=fPalette data-pid='" + id + "'></div>");

		// add palette
		palette.append( $(html) );
		home.append( palette );
		// add button
		//homeBut.append( button );

		return palette;
	},

	removePalette: function( id ) {
		$("#q" + id).remove();
		$("#fPalette[data-pid='" + id + "']").remove();
	},
}
