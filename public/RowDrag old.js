var RowDrag = function(gov) {
	
	this.gov = gov;
	this._lightM = false;
	this._lightB = false;
	
	this.m;
	this._m;
	this.srcM;
	this.dstM;
	this.action;
	
	var p = this;
	var visio = p.gov.visio;
	var frame = this.gov.frame;
	
	var src = $("#menuItems #items");
	var srcCopy = $("#" + this.gov.name + " #main");
	var srcNew = $("#buttonNewTM");
	var trg = $("#" + this.gov.name + " #main");
	
	// new move
	srcCopy.delegate(".move", "mousedown", function(e){
		
		var el = $(visio.getDom(e).m);
		
		if (el.prop("nodeName") != "NAV")
			return false;
		
		var x0 = e.originalEvent.clientX,
			y0 = e.originalEvent.clientY,
			trg = el.parent();
		
		drag = new Drag(el, x0, y0, trg, p.gov);
		drag.startMove();
		
		if (e.preventDefault) e.preventDefault;
			return false;
	});
	
	// new copy
	srcCopy.delegate(".copy", "mousedown", function(e){
		
		var el = $(visio.getDom(e).m);
		
		if (el.prop("nodeName") != "NAV")
			return false;
		
		var x0 = e.originalEvent.clientX,
			y0 = e.originalEvent.clientY,
			trg = el.parent();
			
				
		var copyEl = el.clone();
		copyEl.prop("id","m" + +new Date());
		copyEl.insertBefore(el);
	
		drag = new Drag(copyEl, x0, y0, trg);
		drag.startMove();
		
		if (e.preventDefault) e.preventDefault;
			return false;
	});
	
	// dic copy
	src.delegate("DIV", "mousedown", function(e){
		
		var el = $(this);
		var srcEl = $("#gov0 #main #b0 #m0");
		
		var x0 = e.originalEvent.clientX,
			y0 = e.originalEvent.clientY,
			trg = srcEl.parent();
			
		// new element
		var newEl = srcEl.clone();
		newEl.prop("id","m" + +new Date());
		// add newEl in the End
		trg.append(newEl);
		
		drag = new Drag(newEl, x0, y0, trg, p.gov);
		
		// created container with fix-position
		var copyCont = drag.createContainer(newEl, 3);
		copyCont.css({
			"top" : el.offset().top,
			"left" : el.offset().left,
			"position" : "fixed",
		})
		drag.startCopyOut(copyCont);
		
		if (e.preventDefault) e.preventDefault;
			return false;
	});
	
	// set draggable
	srcNew.attr("draggable","true");
	srcNew.bind("dragstart", function(e){
	
		p.action = "newTM";
	});
	
	// set draggable
	$("#menuItems #items div").attr("draggable","true");
	src.bind("dragstart", function(e){
	
		var m = $(e.target);
		var b = $(m).parent().parent();
		var mId = p.gov.visio.parseIdM(m.attr("id"));
		var bId = p.gov.visio.parseIdB(b.attr("id"));
		
		p.action = "copyDict";
		p.srcM = p.gov.book.getB(bId).getM(mId);
	});

	this.setDraggableCopyM();
	
	srcCopy.bind("dragstart", function(e){
		
		var el = visio.getDom(e).w;
		
		if (!el) 
			return;
		
		var a = $(el).attr("class");
		
		if (a == "copy")
			p.action = "copyM";
		else if (a == "move")
			p.action = "move";
		else if (a == "copyLink")
			p.action = "copyLink";
			
		p.srcM = p.gov.visio.getM(e);
	});
	
	// DROP //
	trg.bind("drop", function(e){
		
		setTimeout(function(){
			p.lightOff();
			p.lightBookOff();
		},100);
		
		var b0 = p.gov.visio.getB(e);

		if (p.action == "copyDict") {
			var m = p.copyM(p.srcM, p.dstM, "dict", b0);
			b0.sections.resettle(m, p.dstM);
		}
		else if (p.action == "copyM") {
			var m = p.copyM(p.srcM, p.dstM, "inBook", b0);
			b0.sections.resettle(m, p.dstM);
		}
		else if (p.action == "move") {
			var booker = p.srcM.booker;
			booker.moveM(p.srcM, p.dstM);
			p.srcM.refreshLinks();
			p.gov.visio.updateM(p.srcM);
		}
		else if (p.action == "copyLink") {
			p.srcM.setLinks(p.dstM);
			p.srcM.refreshLinks();
			p.gov.visio.updateM(p.srcM);
		}
		else if (p.action == "newTM") {
			var dic = p.gov.dict;
			var booker = p.dstM.booker;
			var win = frame.openTM();
			frame.onSubmit = function() {
				var tpl = frame.getValue().split("_"),
					_race = tpl[0],
					_nation = tpl[1];
				
				// race & nation
				var race = dic.getRace(_race);
				if (!race)
					race = dic.addRace(_race);
				
				var nation = race.getNation(_nation);
				if (!nation)
					nation = race.addNation(_nation);
				
				//copyM : function(md, m0, compMode, booker) {
				// tm & m
				var tm = p.gov.hasTM(nation);
			
				if (!tm) {
					tm = p.gov.addTM(nation);
					p.gov.visio.showTM(p.gov.visio.createTM(tm));
				}
				
				var m = booker.addM("m", tm, p.dstM);
				
				var html = visio.createM(m);	
				visio.showM(m, html, p.dstM);
				p.setDraggableCopyM(m);
				
				this.closeTM();
			};
			frame.onCancel = function() {
				this.closeTM();
			};
			/*win.children("#submit").click(function(){
				// add temporary TM in dict
				var tmpTM = p.srcM.booker.gov.addTM(p.srcM.tmanager.nation);
				// create new M with tmp TM
				var tmpM = 
				
				var m = p.copyM(p.srcM, p.dstM, "dict", b0);
				b0.sections.resettle(m, p.dstM);
			}*/
		}
		
		p.gov.window.refreshManagers();
		p.gov.header.refresh();
		p.gov.compScreen.refresh();
		
		if (e.preventDefault) e.preventDefault;
		return false;
	});

	trg.bind("dragenter", function(e){
		if (e.preventDefault) e.preventDefault;
		return false;
	});

	var leaveRefresh = false;
	trg.bind("dragleave", function(e){
		if (!leaveRefresh) {
			leaveRefresh = true;
			setTimeout(function() {
				leaveRefresh = false;
				p.lightOff();
				p.lightBookOff();
			}, 50);
		}
		if (e.preventDefault) e.preventDefault;
		return false;
	});
	
	var overRefresh = false;
	trg.bind("dragover", function(e){
		
		if (!overRefresh) {
			overRefresh = true;
			setTimeout(function() {
				overRefresh = false;
				
				var b = visio.getB(e);
				if (!b) return;
				
				var m = visio.getM(e);
				
				if (m) {
					var _m = visio.getDomM(m);
					
					var mouseTop = (e.originalEvent.pageY - $(_m).offset().top) < ($(_m).height() / 2) ? true : false;
					
					// copyLink
					if (p.action == "copyLink") {
						p.lightRefresh($(_m));
						p.dstM = m;
					}
					else if (mouseTop) {
						p.lightRefresh($(_m));
						p.dstM = m;
					}
					else {
						
						var nextM = b.sections.next(m);
						
						if (nextM) {
							var domM = visio.getDomM(nextM);
							p.lightRefresh($(domM));
							p.dstM = nextM;
						}
						// end of the booker
						else {
							p.dstM = false;
						}
					}
				}
				
				// booker is empty
				else if (b) {
					var domB = visio.getDomB(b);
					p.lightBookOn($(domB));
					p.dstM = false;
				}
			}, 50);
		}
		
		if (e.preventDefault) e.preventDefault;
		return false;
	});

	trg.bind("dragend", function(e){
		if (e.preventDefault) e.preventDefault;
		return false;
	});
	

}

RowDrag.prototype = {
	
	isLightOn : function() {
		return this._lightM || false;
	},
	
	isLightBookOn : function() {
		return this._lightB || false;
	},
	
	lightOn : function(el) {
		this._lightM = el;
		if (this.action == "copyLink")
			this._lightM.addClass("active");
		else
			this._lightM.css("border-top", "2px solid red");
	},
	
	lightOff : function() {
		if (this.isLightOn()) {
			if (this.action == "copyLink")
				this._lightM.removeClass("active");
			else {
				this._lightM.css("border-top", "2px solid transparent");
				this._lightM = false;
			}
		}
	},
	
	lightRefresh : function(el) {
		this.lightOff();
		this.lightOn(el);
	},
	
	lightBookOn : function(el) {
		this._lightB = el;
		this._lightB.css("border", "1px solid white");
	},
	
	lightBookOff : function() {
		if (this.isLightBookOn()) {
			this._lightB.css("border", "1px solid grey");
			this._lightB = false;
		}
	},
	
	setDraggableCopyM : function(m) {
		if (m) {
			var _m = this.gov.visio.getDomM(m);
			$(_m).children(".move").attr("draggable","true");
			$(_m).children(".copy").attr("draggable","true");
			$(_m).children(".copyLink").attr("draggable","true");
		}
		else {
			$("#" + this.gov.name + " #main article div.move").attr("draggable","true");
			$("#" + this.gov.name + " #main article div.copy").attr("draggable","true");
			$("#" + this.gov.name + " #main article div.copyLink").attr("draggable","true");
		}
	},
	
	// Manager
	copyM : function(md, m0, compMode, booker) {
		
		var m = booker.cloneM(md, compMode);
		booker.sections.resettle(m, m0);
		
		var visio = this.gov.visio;
		var html = visio.createM(m);	
		visio.showM(m, html, m0);
		this.setDraggableCopyM(m);
		
		return m;
	},
}