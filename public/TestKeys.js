var TestKeys = function( event ) {
	this.event = event;
	this.k = this.event.keyboard;
	
	this.p = this.event.process; // name of process
	this.o = {}; // data of process
}
TestKeys.prototype = {
	def: function() {
		var space = this.event.space,
			p = this.p,
			gov,
			k = this.k,
			m = this.event.mouse,
			ee = this.event.eventElement,
			s = this.event.styles,
			panels = this.event.panels;
		// Initialization
		if ( !p.on() ) {
			if ( k.keyUp() ) {	
				if ( k.pressed(["alt","s"]) ) {
					console.log( space.active.matrix.save() );
					console.log( space.active.style );
					showMessage( space.active.matrix.getFilename() + " is <b>saved</b>." , 2000);
				}
				
				// open book
				if ( k.pressed(["alt","z"]) ) {
					space.save();
					//space.refreshPalette();
					space.remove();
					space.show( space.book );
				}
				
				// open gov
				if ( k.pressed(["alt","x"]) ) {
					space.save();
					space.refreshPalettes();
					space.remove();
					gov = space.createGov( space.getConfig("lastGov") );
					space.show( gov );
				}
				
				// open palette
				if ( k.pressed(["alt","c"]) ) {
					space.save();
					//space.refreshPalette();
					space.remove();
					gov = space.createGov( space.path["groups"] );
					space.show( gov );
					space.refreshPalette( gov, "groups", true );
				}
				
				if ( k.pressed(["alt","n"]) ) {
					space.save();
					space.refreshPalettes();
					space.remove();
					var filename = space.path["root"] + "\\AO\\Matrix " + (new Date()).getMilliseconds() + ".csv";
					gov = space.createGov( filename );
					space.setConfig( "lastGov", filename, true );
					space.show( gov );
				}
			}
			if ( !k.empty() ) {
				// delete
				if ( k.press(["delete"]) && m.click() ) {
					var f = ee.f() || ee.f("m");
					// remove w
					if ( f.c ) {
						if ( f.w ) {
							f.m.removeW( f.w );
						}
						f.m.style.removeC( f.c, f.m );
						p.start( "remove", true );
					// remove man
					} else if ( f.m ) {
						f.b.removeM( f.m );
						p.start( "remove", true );
						panels.panels.closeAll();
						var win = space.active.window;
						//Timing.on("refreshManagers", win.refreshManagers, win);
					}
				}
			}
		}
	},
}

var GovSwitch = function( space ) {

}
GovSwitch.prototype = {
	//close
}