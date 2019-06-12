var Unit = function( event ) {
	this.event = event;
	this.ee = this.event.eventElement;
	this.space = this.event.space;
	
	this.p = this.event.process;
	this.o = {}; // data of process
	
	this.editor = new CellEditor( this.space );
}
Unit.prototype = {
	def: function() {
		var ee = this.ee,
			m = this.event.mouse,
			k = this.event.keyboard,
			type = ee.type,
			type2 = ee.type2,
			className = ee.className,
			p = this.p;
		
		// Initialization
		//console.log("process: "+p.on() + ", click: "+m.click());
		if ( !p.on() ) {			
			if ( k.empty() ) {

				// create new client
				if ( type == "l" && m.dbl() ) {
					if ( ee.f().l ) {
						p.start("createClient");
						this.newClientInit();
					}
				}

				// line up
				else if ( type == 'J' && m.mouseDown() ) {
					p.start("lineUp");
					var j = $( ee.clothest( ee.el, "j" ) );
					j.css("z-index", "1");
					this.o.j = j;
				}
				// confirm rule
				else if ( m.click() && type == "i" && type2 == "Confirm" ) {
					p.start("confirmRule", true);
					this.confirmInit();
				}
				
				// open row-colors set
				else if ( m.click() && type == "i" && type2 == "RowColor" ) {
					p.start("rowColor");
					this.o.f = p.o.f;
				}
				
				// confirm rule
				else if ( m.click() && type == "i" && type2 == "CreateLocal" ) {
					p.start("createLocalStyle", true);
					this.createLocalStyleInit();
				}

				// init link
				else if ( ( type == "w" || type == "W" ) && m.drag() ) {
					this.o = {
						f : ee.f( m.drag.el ),
						square: UnitMoving,
					}
					this.linkInit();
					p.start("link");
				
				// cell editor
				} else if ( m.click() && ( type == "w" || type == "W" ) ) {
					this.o = {
						f : ee.f(),
					}
					this.editorInit();
					p.start("editor");
				
				// cell styleName editor
				} else if ( m.click() && type == "i" && type2 == "Name" ) {
					this.o = {
						f : ee.f( "m" ),
						el: ee.el,
					}
					this.editorNameInit();
					p.start("editorName");
				
				// cell styleName editor
				} else if ( m.click() && type == "i" && type2 == "RowPlus" ) {
					m = p.o.f.m;
					m.style.heightPlus();
					m.refresh();
				
				// cell styleName editor
				} else if ( m.click() && type == "i" && type2 == "RowMinus" ) {
					m = p.o.f.m;
					m.style.heightMinus();
					m.refresh();
				
				// init move lineHead
				} else if ( type == "L" && m.mouseDown() ) {
					this.o = this.moveLineInit( type2 );
					p.start("moveLine");
				}
			// init move client
			} else if ( ( type == "w" || type == "W" ) && m.mouseDown() ) {
				if ( k.press(["ctrl","alt"]) ) {
					this.o = this.moveInit( "resize" );
					p.start("move");
				} else if ( k.press(["ctrl"]) ) {
					this.o = this.moveInit();
					p.start("move");
				}
			}
		}
		
		// Processing
		else {
			switch( p.on() ) {
				case "move":
					if ( m.mouseDown() ) {
						if ( !Timing.ready( p.on(), 10 ) ) return false;
						
						this.o.type = !k.has("alt") ? false : "resize";
						//Timing.on( p.on(), this.moveProcess, this );
						this.moveProcess();
					} else {
						this.moveRemove();
						p.end();
					}
					break;
				case "moveLine":
					if ( m.mouseDown() ) {
						this.moveLine();
					} else {
						this.moveLineRemove();
						p.end();
					}
					break;
				case "link":
					if ( m.mouseDown() ) {
						this.linkProcess();
					} else {
						this.linkRemove();
						p.end();
					}
					break;
				case "editor":
					var c = this.o.f.c;
					if ( this.o.waitKey ) {
						if ( code = k.keyUp() ) {
							var name = k.name( code );
							if ( name >= 0 && name <= 9 || name == "delete" ) {
								if ( name == "delete" ) {
									color = false;
								} else {
									color = this.o.f.g.matrix.meta.colorsList[name];
								}
								// set background color
								if ( type2 == "BG" ) {
									c.setBGColor( color, 2 );
								// set text color
								} else {
									c.setColor( color, 2 );
								}
								this.editor.finish();
							}
						}
					} else if ( m.click() ) {
						if ( type == "e" ) {
							switch ( type2 ) {
								case "Bold": c.b = c.b == 0 ? 1 : 0; break;
								case "AlignL": c.a = "left"; break;
								case "AlignC": c.a = "center"; break;
								case "AlignR": c.a = "right"; break;
								case "AlignR2": c.a = "right2"; break;
								case "AlignT": c.va = 0; break;
								case "AlignM": c.va = 1; break;
								case "AlignB": c.va = 2; break;
								case "BG":
									this.o.waitKey = true;
									break;
								case "Color":
									this.o.waitKey = true;
									break;
							}
							if ( !this.o.waitKey ) {
								this.editor.finish();
							}
						}
					}
					break;
				case "rowColor":
					if ( code = k.keyUp() ) {
						var name = k.name( code );
						if ( name >= 0 && name <= 9 ) {
							var m = this.o.f.m,
								color = this.o.f.g.matrix.meta.colorsList[name];
							m.style.setColor( color );
							m.refresh();
						}
						p.end();
					}
					break;
				case "lineUp":
					if ( !m.mouseDown() ) {
						this.o.j.css("z-index", "");
						p.end();
					}
			}
		}
	},
	
	// create client
	newClientInit: function() {	
		var f = this.ee.f(),
			visio = f.g.space.visio,
			l = f.l, tm = l.tm, cl, m, wv,
			rect = l.rect( this.ee.x0(), this.ee.y0() ),
			w = tm.defW, h = tm.defH;
		
		if ( !l.isLineQ() && !l.isFit( rect, w, h ) ) {
			w = 1; h = 1;
		}
		
		cl = l.tm.addClient( "c" + rect.x, l.i, w, h, rect.x, rect.y );
		cl.setEdited();
		m = f.m;
		visio.showCss( cl.css() );
		wv = visio.insertW( cl, m, cl.html( m.cid(), cl.id, "" ) );
		
		// open clientName's window
		var p = this;
		
		this.ee.eventSelection();
		this.editor.open( wv, "tag name" );
		
		this.editor.remove = this.space.events.freeze(function(){
			tm.renameClient( cl.name, p.editor.getText() );
			p.ee.preventSelection();
			p.p.end();
		}, this);
	},
	
	editorNameInit: function() {
		var p = this,
			o = this.o;
		
		this.ee.eventSelection();
		this.editor.open( $( this.o.el ), o.f.m.style.name );
		
		this.editor.remove = this.space.events.freeze( function() {
			var value = this.editor.getText();
			// gov update
			o.f.m.style.editName( value );
			// dom update
			$(o.el).text( value );
			this.ee.preventSelection();
			this.p.end();			
		}, this );
	},
	
	// editor
	editorInit: function() {
		var p = this,
			o = this.o,
			w = o.f.w,
			value = w ? w.realValue() : "";
		
		this.ee.eventSelection();
		this.editor.open( o.f.wv, value, o.f.c );
		
		this.editor.input.blur( function(e) {
			var el = p.ee.clothestDataId( p.ee.el, "editor", "E" );
			if ( !el ) {
				p.editor.finish();
			}
		});
		
		this.editor.remove = this.space.events.freeze( function() {
			var f = o.f,
				value = this.editor.getText();
			// if edit reference field
			if ( f.c.name == "#reference" ) {
				value = f.b.checkReference( f.m, value );
			}
			// gov update
			var w = f.m.updateW( f.wi, f.c.name, value );
			// dom update
			w.updateW();
			w.updateChilds();
			// check rules
			f.m.getConfirmRule();
			//f.m.refresh();
			this.ee.preventSelection();
			this.p.end();			
		}, this );
	},
	
	createLocalStyleInit: function() {
		var f = this.p.o.f, m = f.m;
		m.setStyle( f.g.style.addCloneTM( m.style ) );
		m.refresh();
	},	
	confirmInit: function() {
		var f = this.p.o.f;
		f.m.setConfirmRule();
		f.m.refresh();
	},
	// move
	moveInit: function( type ) {
		var f = this.ee.f();
		return {
			type: type,
			// relative el
			elX0: this.ee.elX0( f.wv ),
			elY0: this.ee.elY0( f.wv ),
			// relative mouse
			rx0: this.ee.x0( f.lv ),
			ry0: this.ee.y0( f.lv ),
			// abs mouse
			ax0: this.ee.x(),
			ay0: this.ee.y(),
			
			f: f,
			m: f.m,
			c: f.c,
			wv: f.wv,
			
			rect0: { x: f.c.x, y: f.c.y, w: f.c.w, h: f.c.h },
		}
	},
	
	moveProcess: function() {
		var o = this.o,
			type = o.type,
			c = o.c,
			l = c.line,
			ax = this.ee.x(),
			ay = this.ee.y(),
			f = this.ee.f,
			rx = this.ee.x0( f.wv ),
			ry = this.ee.y0( f.wv ),
			nowM = this.ee.f().m,
			nowL = this.ee.f().l,
			lenX = ax - o.ax0, // cursor's delta
			lenY = ay - o.ay0,
			elX = o.elX0 + lenX, // element's left-top corner delta
			elY = o.elY0 + lenY,
			rectActive = l.rectActive( elX, elY ),
			//rectValid = l.validRect( rectActive ); // stay inside the line-bounds
			rect = l.closest( rectActive, c.w, c.h, c ); 
			
		if ( !type ) {
			// check if line changed
			if ( o.m == nowM && nowL && l != nowL ) {
				var n = this.ee.elXyByMouseXy( o.rx0, o.ry0, o.elX0, o.elY0, rx, ry );
				var	rect = nowL.rectActive( n.x, n.y ),
					rect = nowL.validUnitRect( rect, c.w, c.h ); // stay inside the line-bounds
				if ( nowL.isFit( rect, c.w, c.h, c ) ) {
					moveL( rect, l, nowL, c, o.wv );
					o.wv.appendTo( this.ee.f().lv );
					// update init data
					this.o.elX0 = c.x * l.rw,
					this.o.elY0 = c.y * l.rh,
					this.o.rx0 = rx,
					this.o.ry0 = ry,
					this.o.ax0 = ax,
					this.o.ay0 = ay;
				}
			}
			else if ( l.isFit( rect, c.w, c.h, c ) ) {
				moveL( rect, l, l, c, o.wv );
			}
		
			function moveL( rect, l1, l2, c, wv ) {
				l1.unsettle( c );
				l2.settle( rect, c );
				wv.css({
					"top": c.y * l.rh,
					"left": c.x * l.rw,
				});
				c.setEdited();
			}
		} else if ( type == "resize" ) {
			// rect is top-left coords of el. Get bottom-right
			var rectValid = l.validRect({ 
				x: rectActive.x + this.o.rect0.w - 1, 
				y: rectActive.y + this.o.rect0.h - 1
			});
			this.resizeProcess( rectValid );
		}
	},
	
	moveRemove: function() {
		this.o.m.refresh();
	},
	
	resizeProcess: function( rect ) {
		var c = this.o.f.c,
			l = c.line,
			rect0 = this.o.rect0;
		if ( r = l.resize( rect0, rect, c ) ) {
			l.unsettle( c );
			l.settle( r, c );
			c.resize( r.w, r.h );
			this.o.wv.css({
				"top": c.y * l.rh,
				"left": c.x * l.rw,
				"width": c.w * l.rw,
				"height": c.h * l.rh,
			});
			c.setEdited();
		}
	},
	
	linkInit: function() {
		this.o.f = this.ee.f();
	},
	
	linkProcess: function() {
		var f1 = this.o.f,
			f2 = this.ee.f(),
			square = this.o.square,
			visio = this.space.visio;
		
		if ( square.validM( f2 ) ) {
			// get rx, ry
			var l2 = f2.l,
				c0 = f1.c,
				rx = this.ee.x0( f2.lv ),
				ry = this.ee.y0( f2.lv ),
				rect = l2.rect( rx, ry );
			
			if ( c = square.has() ) {
				// if manager is changed, remove old
				if ( !square.sameM( f2.m ) ) {
					square.remove();
				// if pos is changed
				} else if ( square.changed( rect ) && square.fit( rect ) ) {
					square.move( rect );
				}
			}
			
			if ( !square.has() && l2.isFit( rect, c0.w, c0.h, c0 ) ) {
				var value = f1.w ? f1.w.humanValue() : "";
				square.add( f2.m, l2, rect, c0, value );
			}
		}
	},
	
	linkRemove: function() {
		var f1 = this.o.f,
			f2 = this.ee.f(),
			square = this.o.square;
		
		if ( square.has() ) {
			f2.c = square.cl;
		}
		
		if ( f2.c && f2.w != f1.w ) {
			// gov update
			var w1 = f1.m.updateW( f1.wi, f1.c.name, "" ),
				w2 = f2.w ? f2.w : f2.m.updateW( f2.wi, f2.c.name, "" )
			w1.setLink( w2 );
			// dom update
			//w1.updateW();
			f1.m.refresh();
			w1.updateChilds();
			w2.updateW(); // if l
			//m.reStyle();
		}
	},
	
	moveLineInit: function( i ) {
		var el = $(this.ee.el),
			cont = el.parent();
		var o = {
			line: this.space.active.style.lines[i],
			el: el,
			cont: cont,
			stickX0: cont.offset().left,
			stick: $("#_stick"),
		}
		o.stick.css("left", o.stickX0 + o.line.ax() + "px");
		return o;
	},
	
	moveLine: function() {
		var line = this.o.line;
		line.setX( this.ee.x0( this.o.cont ) );
		this.o.el.css( "left", line.ax() + "px" );
		this.o.stick.css("left", this.o.stickX0 + line.ax() + "px");
	},
	
	moveLineRemove: function() {
		this.space.visio.showCss( this.o.line.cssPos() );
		this.o.stick.css("left", -9999 + "px");
	},
}