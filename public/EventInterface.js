var EventInterface = function( event ) {
	this.event = event;
	this.ee = this.event.eventElement;
	this.space = this.event.space;
	
	this.p = this.event.process;
	this.o = {}; // data of process
	
	this.editor = new CellEditor();
}
EventInterface.prototype = {
	def: function() {
		var ee = this.ee,
			m = this.event.mouse,
			k = this.event.keyboard,
			type = ee.type,
			type2 = ee.type2,
			p = this.p;
		
		// Initialization
		if ( !p.on() ) {
			if ( m.click() ) {
				if ( type == "f" && type2 == "Palette" ) {
					var pal = this.space.getPal( $(ee.el).attr("data-pid") );
					pal.toggle();
				}
				else if ( type == "f" && type2 == "Folder" ) {
					$("#_folder").toggle();
				}
				else if ( type == "F" ) {
					var folder = this.space.folder;
					if ( type2 == "Folder" ) {
						folder.open( ee.el );
					} else if ( type2 == "Link" ) {
						if ( filename = folder.hasFile( ee.el, ".csv") ) {
							// save
							space.save();
							// remove
							space.remove(); // gov
							// create
							gov = space.createGov( filename );
							space.show( gov );
							// save in config lastGov
							space.setConfig( "lastGov", filename, true );
							// hide folders tree
							$("#_folder").hide();
						}
					}
				}
			}
		}
		
		// Processing
		else {
			switch( p.on() ) {
				case "move":
					
			}
		}
	},
}