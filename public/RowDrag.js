var RowDrag = function( event, space ) {
	this.event = event;
	this.ee = this.event.eventElement;
	this.space = this.event.space;
	
	this.p = this.event.process;
	this.o = {}; // data of process
	
	this.showBorder = new AnimeShowBorder( $("#_showBorder"), "swim3" );
}
RowDrag.prototype = {
	def: function() {
		var ee = this.ee,
			m = this.event.mouse,
			k = this.event.keyboard,
			type = ee.type,
			type2 = ee.type2,
			p = this.p;
		
		// Initialization
		if ( !p.on() ) {
			// drag init
			if ( m.mouseDown() ) {
				// new row
				if ( type == "d" && type2 == "NewRow" ) {
					p.start("copyDic");
					this.dragInit( "new" );
				}
				// copy row from dic
				if ( type == "p" ) {
					p.start("copyDic");
					this.o = {
						m: this.ee.fp().m,
						g: this.ee.fp().g,
						p: this.ee.fp().p,
					}
					this.dragInit( "dic" );
					// close palette
					if ( pal = this.o.p ) {
						pal.hide();
					}
				}
				// copy inside
				if ( type == "i" && type2 == "Copy" ) {
					this.o = {
						m: p.o.f.m,
					}
					
					if ( k.press(["shift"]) ) {
						this.o.clone = true;
						p.start( "copyToPal" );
						this.copyToPal( this.space.getPal("transfer") );
					} else {
						this.o.clone = false;
						p.start("copyDic");
						this.dragInit( "dic" );
					}
				}
				// move
				if ( type == "i" && type2 == "Move" ) {
					p.start("copyDic");
					this.o = {
						m: this.ee.f( "m" ).m,
						f: this.ee.f(),
						mv: this.ee.f().mv,
						clone: true,
					}
					this.dragInit( "move" );
				}
			}
			// click init
			if ( type == "i" && m.click() ) {
				// new group
				if ( type2 == "NewGroup" ) {
					this.o = {
						f: p.o.f,
						m: p.o.f.m,
					}
					this.o.g = this.o.m.group;
					this.createGroupInit();
				}
				// group hide
				if ( type2 == "Visible" ) {
					var f = this.ee.f("m");
					this.o = {
						f: f,
						m: f.m,
					}
					this.o.g = this.o.m.group;
					if ( this.o.g.isShown() ) {
						this.hideGroupInit();
					} else {
						this.showGroupInit();
					}
				}
			}
		
		}
		
		// Processing
		else {
			switch( p.on() ) {
				case "waitMouseUp":
					if ( !m.mouseDown() ) {
						p.end();
					}
					break
				case "copyDic":
					if ( m.mouseDown() ) {
						this.dragProcess();
					// finish
					} else {
						//// update gov
						var drag = this.o.drag,
							m_ = this.o.m,
							g,
							mv0 = drag.getNext(),
							m0 = mv0 ? this.ee.ids.getFamilyMain( mv0[0] ).m :
										this.o.m2.next();
						// if m0 == self
						if ( m0 == m_ ) {
							m0 = false;
						}
						// move set
						if ( g = m_.isGroup() ) {
							if ( m_.isHead() ) {
								m_.booker.moveG( g, m0 );
							// if move хвост
							} else {
								// get childs before
								var previousParents = [],
									previousChilds = [];
								for ( var i in g.childs ) {
									var gr = g.childs[i];
									previousParents[gr.a.id] = gr;
									previousChilds.push( gr.a );
								}
								m_.booker.moveM( m_, m0 );
								g.checkParents( m_.booker.sort( previousChilds ) );
								// get childs after
								for ( var i in g.childs ) {
									var gr = g.childs[i];
									previousParents[gr.a.id] = gr;
								}
								// referesh previous parents
								for ( var i in previousParents ) {
									var gr = previousParents[i];
									gr.a.refresh();
									gr.b.refresh();
								}
							}
						// move one row
						} else {
							m_.booker.moveM( m_, m0 );
						}
						drag.join();
						p.end();
					}
					break;
				case "copyToPal":
					if ( !m.mouseDown() ) {
						p.end();
					}
					break;
			}
		}
	},
	
	dragInit: function( type ) {
		var gov = this.space.active,
			b = gov.getB(0),
			m, mv;
			
		var ids = this.ee.ids, 
			mv1, mv2,
			m1, m2;
		// refresh shown managers
		this.space.active.window.refreshManagers();
		var shownManagers = gov.window.getShownM();
		// get dom element for moving
		switch ( type ) {
			case "move":
				mv = this.o.mv;
				m = this.o.m;
				// if move group
				if ( m.isGroup() ) {
					// if it's head - hide inner of group
					if ( m.isHead() ) {
						this.hideGroupInit();
					// if it's end - set up'n'down bounds for moving
					} else {
						var g = m.group,
							parent = g.parent;
						// highest
						m1 = g.a.next();
						mv1 = ids.mv ( m1 );
						// ... lowest
						if ( parent.b ) {
							m2 = parent.b.prev()
							mv2 = ids.mv ( m2 );
						}
					}
				}
				break;
			case "new":
				// create M
				var m = b.addM( false );
					m.setStyle();
					// insert
					mv = gov.visio.insertM( m, m.html(), shownManagers.last );
					gov.visio.showCss( m.style.css() );
					break;
			case "dic":
				var m0 = this.o.m,
					clone = this.o.clone;
				
				// copy man
				if ( !m0.isGroup() ) {
					m = b.copyM( m0, clone );
					
				// copy group
				} else {
					m = b.copyG( m0, clone );
				}
				console.log(parent);
				// insert
				mv = gov.visio.insertM( m, m.html(), shownManagers.last );
				gov.visio.showCss( m.style.css() );
				break;
		}
		
		// allowed bounds for moving
		if ( !shownManagers[0] ) {
			this.p.start("waitMouseUp");
			return;
		}
		if ( !m1 ) {
			m1 = shownManagers[0];
			mv1 = ids.mv( m1 );
		}
		if ( !m2 ) {
			m2 = shownManagers.last;
			mv2 = ids.mv( m2 );
		}
		
		var x0 = this.ee.x(),
			y0 = this.ee.y(),
			
			trg = mv.parent();
		
		drag = new Drag( mv, x0, y0, trg, mv1, mv2, this.space.active );
		
		if ( type == "dic" || type == "new" ) {
			var el = $(this.ee.el),
				cont = drag.dragOutInit( el.offset().left, this.ee.y(true) - this.ee.y0(el) );
				console.log( el );
				console.log("el.top:"+el.offset().top + 
				" clientY:" + this.ee.y(true) + 
				" pageY:" + this.ee.y() + 
				" y0:" + this.ee.y0(el) +"="+(this.ee.y(true) - this.ee.y0(el)));
			
			drag.start( cont );
		} else {
			drag.start();
		}
		
		this.o.drag = drag;
		this.o.m = m;
		this.o.m1 = m1;
		this.o.m2 = m2;
		
		// on Remove
		drag.remove = this.space.events.freeze( function() {
			m.refresh();
			// refresh window managers
			//Timing.on("refreshManagers", win.refreshManagers, win);
		}, this );
	},
	
	dragProcess: function() {
		var p = this.o.drag;
		if (!Timing.ready("govMoveRow", 10)) return false;
		
		p.e = e = this.ee.ev.e;
		p.moveSrc(e);
		//Ev.add(p.id, e);
		
		var slow = true; //Math.abs(p.iterateY - e.clientY) < 10 ? true : false;
		
		if (p.start && Timing.ready(p.id, 150) ) {
			Timing.on(p.id, p.cycle, p, [slow]);
		}

		p.iterateY = e.clientY;
	},
	
	// copy
	copyInit: function() {
		var gov = this.space.active,
			b = gov.getB(0),
			m0 = this.o.m,
		// create m1 and m2
			style = gov.style.addTM( false, false ),
			m1 = b.addM( false, style, m0 ),
			m2 = b.addM( false, style, m0.next() );
			b.addLocalStyle( m1 );
		// create group
		var parent = m0.findGroup(),
			g = new Group( m1, m2, parent );
		// insert html
		m1.insert();
		m2.insert()
	},
	
	copyToPal: function( pal ) {
		var gov = pal.gov,
			b = gov.getB(0),
			m0 = this.o.m,
			clone = this.o.clone,
			m, mv;
		
		if ( m0.isGroup() ) {
			m = b.copyG( m0, clone );
		} else {
			m = b.copyM( m0, clone );
		}
		pal.insertM( m );
	},

	// new Group
	createGroupInit: function() {
		var gov = this.space.active,
			b = gov.getB(0),
			m0 = this.o.m,
		// create m1 and m2
			style = gov.style.addTM( false, true, false, "group" ),
			m1 = b.addM( false, style, m0 ),
			m2 = b.addM( false, style, m0.next() );
			b.addLocalStyle( m1, style );
		// create group
		var parent = m0.findGroup(),
			g = new Group( m1, m2, parent );
		g.setColor();
		// insert html
		m1.insert();
		m2.insert();
	},
	
	hideGroupInit: function() {
		var f = this.o.f,
			g = this.o.m.group,
			m1 = g.a.next(),
			m2 = g.b,
			self = this;
		
		// show anime border
		var groupV = f.mv,
			w0 = this.ee.w( groupV ),
			left = groupV.offset().left - 10,
			top = groupV.offset().top - this.space.active.window.ofTop + g.a.height(),
			h = g.height( true ) - g.a.height();
		this.showBorder.show( left, top, w0, h, w0, 0, 500 );

		//setTimeout(function() {
			var mv = self.ee.ids.mv( m1 ),
				m2id = "m" + m2.id;
			do {
				var mId = mv.attr("id"),
					toRemove = mv;
				
				mv = mv.next();
				toRemove.remove();
			} while ( mId && mId != m2id )
				
			g.hide();
			groupV.addClass("group-hide");
		//}, 500);
	},
	
	showGroupInit: function() {
		var g = this.o.g,
			set1 = g.getSet(),
			
			gov = g.a.booker.gov,
			html = [], css = [], skipBefore;
		// add group-end
		set1.push( g.b );
		// insert group inner rows + group-end
		for ( var i in set1 ) {
			var m = set1[i];
			if ( skipBefore ) {
				if ( m == skipBefore ) {
					skipBefore = false;
				}
				continue;
			}
			html.push( m.html() );
			css.push( m.css() );
			// skip if group (head of group has already shown)
			if ( (innerG = m.isGroup()) && !innerG.isShown() ) {
				skipBefore = innerG.b;
			}
		}
		// show anime border
		var groupV = this.o.f.mv,
			w0 = this.ee.w( groupV ),
			left = groupV.offset().left,
			top = groupV.offset().top - this.space.active.window.ofTop + g.a.height(),
			h = g.height() - g.a.height();
		this.showBorder.show( left, top, w0, this.ee.h( groupV ), w0, h, 500 );
		
		// insert group-head
		//setTimeout(function() {
			gov.visio.insertM( g.a, html.join(''), g.b.next() );
			gov.visio.showCss( css.join('') );
			groupV.removeClass("group-hide");
		//}, 500);
		
		g.show();
	},
}