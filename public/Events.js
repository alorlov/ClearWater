var Events = function( space ) {
	this.space = space;
	this.ids = Ids;
	this.myEvent = new MyEvent( this );
	this.keyboard = new Keyboard( this );
	this.mouse = new Mouse( this );
	this.eventElement = new EventElement( this ),
	this.process = new EventProcess( this ),
	this.unit = new Unit( this ),
	this.begun = new Begun( this ),
	this.rowDrag = new RowDrag( this ),
	this.keys = new TestKeys( this );
	this.styles = new EventStyles( this );
	this.face = new EventInterface( this );
	this.panels = new EventPanels( this );
	
	var p = this,
		ev = this.myEvent,
		ee = this.eventElement,
		el = $(document.body);
	
	ev.add( this.keys.def, this.keys );
	ev.add( this.panels.def, this.panels );
	ev.add( this.unit.def, this.unit );
	ev.add( this.rowDrag.def, this.rowDrag );
	ev.add( this.begun.def, this.begun );
	ev.add( this.styles.def, this.styles );
	ev.add( this.face.def, this.face );
	
	ee.preventSelection( el );
	// mouse events
	el.dblclick(function(e){
		ev.set(e, "dbl");
		ev.mouseClick(2);
		ev.def();
	});
	el.click(function(e){
		ev.set(e,"click");
		ev.mouseClick();
		ev.def();
	});
	el.mousedown(function(e){
		ev.set(e,"mousedown");
		ev.mouseDown( true );
		ev.def();
	});
	el.mouseup(function(e){
		ev.set( e, "mouseup" );
		ev.mouseDown( false );
		ev.def();
	});
	el.mouseover(function(e){
		ev.set( e, "mouseover" );
		ev.changeEl();
		ee.changeEl(e);
		ev.def();
	});
	el.mousemove(function(e){
		ev.set( e, "mousemove" );
		ev.def();
	});
	// keyboard events
	el.keydown(function(e) {
		//console.log("down:" + e.which);
		ev.set(e, "keydown");
		ev.setKeyDown( e.which );
		ev.def();
		//p.stopPropagation(e);
		//return false;
	});
	el.keyup(function(e) {
		console.log("up:" + e.which);
		ev.set(e, "keyup");
		ev.setKeyUp( e.which );
		ev.def();
		//p.stopPropagation(e);
		//return false;
	});
	
	var compUpdateTimer = false;
	$(window).scroll(function(e) {
		var gov = p.space.active,
			w = gov.window;
		w.update(this);
		
		/*sc += 10;
		console.log( $(this).scrollTop() );
		$(this).scrollTop(sc);
		p.stopPropagation(e);*/
		
		// remove timer
		clearTimeout(compUpdateTimer);
		// add timer
		compUpdateTimer = setTimeout(function() {
			
			Timing.on("scrollTop", function() {
				// clear all hung keys
				p.myEvent.clearKeys();
				// close panels
				p.panels.panels.closeAll();

				//gov.window.refreshManagers();
				//gov.window.refreshShownManagers();
				
				// header
				//gov.header.refresh();
			}, this);
		}, 1000);
	});
	
		
	$(window).resize(function(){
		var w = p.space.active.window;
		w.update();
		//w.refreshManagers();
		//console.log(p.gov.window.height +","+ p.gov.window.width + "="+p.gov.window.ofTop +","+ p.gov.window.ofLeft);
	});
	
}
Events.prototype = {
	stopPropagation: function(e) {
		e.cancelBubble = true;
		e.returnValue = false;
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		}
	},
	
	freeze: function(fn, context, params) {
		return function() {
			fn.apply(context, params);
		};
	},
}