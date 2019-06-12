var EventPanels = function( event ) {
	this.event = event;
	this.space = this.event.space;
	this.p = this.event.process;
	this.ee = this.event.eventElement;
	this.panels = new Panels();
	
	// init panels
	var self = this,
		folder = $("#_folder"),
		rowHead = $("#_rowMenu");
	// template:
	// this.panels.init( id, el, x1, x2, y1, y2, interval );
	
	// Book
	this.panels.init( "book", false, 0, 1, 100, 199, 500,
					  ["book"], 0, 1, 100, 199, 100 );
	this.panels.initOpen ( "book", this.event.freeze( function() {
		self.space.getPal( "book" ).show();
	}, this ) );
	this.panels.initClose( "book", this.event.freeze( function() {
		self.space.getPal( "book" ).hide();
	}, this ) );
	
	// Groups
	this.panels.init( "groups", false, 0, 1, 200, 299, 500,
					  ["groups"], 0, 1, 200, 299, 100 );
	this.panels.initOpen ( "groups", this.event.freeze( function() {
		self.space.getPal( "groups" ).show();
	}, this ) );
	this.panels.initClose( "groups", this.event.freeze( function() {
		self.space.getPal( "groups" ).hide();
	}, this ) );

	// Transfer
	this.panels.init( "transfer", false, 0, 1, 300, 399, 500,
					  ["transfer"], 0, 1, 300, 399, 100 );
	this.panels.initOpen ( "transfer", this.event.freeze( function() {
		self.space.getPal( "transfer" ).show();
	}, this ) );
	this.panels.initClose( "transfer", this.event.freeze( function() {
		self.space.getPal( "transfer" ).hide();
	}, this ) );

	// Folder
	this.panels.init( "folder", false, 0, 1, 0, 99, 500,
					  ["folder"], 0, 1, 0, 99, 100 );
	this.panels.initOpen ( "folder", this.event.freeze( function() {
		folder.fadeIn(150);
	}, this ) );
	this.panels.initClose( "folder", this.event.freeze( function() {
		folder.fadeOut(150);
	}, this ) );

	// Rows Header
	this.panels.init( "row", ["row"], false, false, false, false, 200,
					  ["row"], false, false, false, false, 100, "byUniq" );
	this.panels.initOpen ( "row", this.event.freeze( function() {
		var ee = self.ee,
			f = ee.f("m");
		
		if ( !f || f.m.isEnd() ) {
			return;
		}
		
		m = f.m;
		//var pos = f.mv.position();
		rowHead.html( m.style.htmlOptions( m ) );
		rowHead.css({
			"top": ( ee.y( true ) - ee.y0( f.mv ) + 16 ) + "px",
			"left": ( ee.x( true ) - ee.x0( f.mv ) + 100 ) + "px",
		});
		rowHead.show();
		// save family
		self.p.o.f = f;
	}, this ) );
	this.panels.initClose( "row", this.event.freeze( function() {
		rowHead.hide();
	}, this ) );
}
EventPanels.prototype = {
	def: function() {
		var ee = this.event.eventElement,
			m = this.event.mouse,
			k = this.event.keyboard,
			type = ee.type,
			type2 = ee.type2,
			className = ee.className,
			p = this.p;
		
		// Initialization
		var x = ee.x( true ),
			y = ee.y( true ),
			el = ee.clothestDataId( ee.el, "panel", "P" ),
			id = el ? ee.ids.parseId( el.dataset.panel ).id : false;
			data = el ? el.dataset : false,
			uniq = data && data.uniq ? el.dataset.uniq : false;
		
		this.panels.check( x, y, id, p.on(), uniq );
	},
}