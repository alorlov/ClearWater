var BookList = function(gov) {
	
	this.gov = gov;
	this.visio = this.gov.visio;
	this.domList = $("#" + this.gov.name + " #menuBookers section");
	
	this.create();
	
	this.src; // drag SRC
	this.dst; // drop SRC before DST
	this._light = false;
	
	this.action = false;
	this.events();
}

BookList.prototype = {

	create : function () {
		
		var bookers = this.gov.bookers;
		var html = "";
		
		for (var i=0, len=bookers.length; i<len; i++) {
			
			if (!bookers[i]) 
				continue;
			
			var b = bookers[i];
			html += this.div(b);
		}
		
		this.createHtml(html);
	},
	
	createHtml : function (html) {
		this.domList.html(html);
	},
	
	div : function (b) {
		return "<div id='" + this.visio.getIdB(b) + "'>" + b.id + "</div>";
	},
	
	dom : function (b) {
		return this.domList.children("div#" + this.visio.getIdB(b));
	},
	
	addHtml : function(b, b0) { // "b" will be before "b0"
		
		var html = this.div(b);
		
		if (b0 === false) {
			var b0 = this.gov.sectB.prev(b);
			_b0 = this.dom(b0);
			$(html).insertAfter(_b0);
		} else {
			_b0 = this.dom(b0);
			var eNew = $(html);
			this.visio.a.fadeInA(eNew);
				eNew.insertBefore(_b0);
			this.visio.a.fadeInB(eNew);
		}
	},
	
	delHtml : function (b) {
		this.dom(b).remove();
	},
	
	add : function (b0) {
		var b = this.gov.createBooker(this.gov, b0);
		this.addHtml(b, b0);
		return b;
	},
	
	del : function (b) {
		this.delHtml(b);
		this.gov.delBooker(b);
	},
	
	move : function (b, b0) {
		
		var _b = $(this.getDomB(b));
		
		if (b0) {
			var _b0 = $(this.getDomB(b0));
			_b.insertBefore(_b0);
		}
		else {
			this.domList.append(_b);
		}
	
		//this.delHtml(b);
		//this.addHtml(b, b0);
		
		this.gov.moveBooker(b, b0);
	},
	
	copy : function (bc, b0) {
		var b = this.gov.cloneBooker(bc, b0);
		var html = this.gov.visio.createBooker(b);
		this.gov.visio.showB(b, html, b0);
		
		this.addHtml(b, b0);
	},
	
	
	////////////////
	//// Events ////
	////////////////
	
	onMenu : function(e) {
		var el = e.target;
		var action = false;
		
		if (el.tagName == "DIV")
			action = $(el).attr("id");
			
		return action;
	},
	
	actionOn : function(a) {
		switch (a) {
			//case "new" : this.newOn(a); break;
			case "copy" : this.copyOn(a); break;
			case "move" : this.moveOn(a); break;
			//case "del" : this.delOn(a); break;
		}
	},
	
	actionOff : function(a) {
		switch (a) {
			//case "new" : this.newOff(a); break;
			case "copy" : this.copyOff(a); break;
			case "move" : this.moveOff(a); break;
			//case "del" : this.delOff(a); break;
		}
	},
	
	dragOn : function() {
		this.domList.children("div").attr("draggable","true");
	},
	
	dragOff : function() {
		this.domList.children("div").attr("draggable","false");
	},
	
	newOn : function () {
		this.getjH("new").addClass("new");
	},
	
	newOff : function () {
		this.getjH("new").removeClass("new");
	},
	
		
	moveOn : function () {
		this.getjH("move").addClass("new");
		this.dragOn();
	},
	
	moveOff : function () {
		this.getjH("move").removeClass("new");
		this.dragOff();
	},
	
	copyOn : function () {
		this.getjH("copy").addClass("new");
		this.dragOn();
	},
	
	copyOff : function () {
		this.getjH("copy").removeClass("new");
		this.dragOff();
	},
	
	getDom : function (e) {
		
		var o = {
			b : false
		};
		var el = e.target;
		
		//
		if (el.tagName == "DIV")
			o.b = el;
		
		return o;
	},
	
	getB : function(e) {
	
		var _b = this.getDom(e).b;
		
		if (!_b) return false;

		var bId = this.visio.parseIdB($(_b).attr("id"));
		
		if (b = this.gov.getB(bId))
			return b;
		
		return false;
	},
	
	getDomB : function(b) {
		
		var bId = this.visio.getIdB(b);
			
		return this.domList.children("div#" + bId).get(0);
	},
	
	getjH : function (a) {
		var _header = this.domList.parent().children("header");
		var el = _header.children("#" + a);
		return el ? el : false;
	},
	
	// onXXX
	events : function () {
		
		// Header
		
		var p = this;
		var _header = this.domList.parent().children("header");
		
		this.getjH("new").attr("draggable","true");
		this.getjH("del").attr("draggable","true");
		
		_header.click(function(e) {
			var a = p.onMenu(e);
			p.actionOff(p.action);
			if (a != p.action) {
				p.actionOn(a);
				p.action = a;
			}
			else
				p.action = false;
		});
		
		_header.bind("dragstart", function(e){
			p.action = p.onMenu(e);
		});
		
		
		// List
		
		var _list = this.domList;
		
		_list.bind("dragstart", function(e){
			
			p.src = p.getB(e);
			
		});
		
		_list.bind("drop", function(e){
			
			p.lightOff();
			
			if (p.action == "move") {
				if (p.src == p.dst)
					return;
				p.move(p.src, p.dst);
			}
			else if (p.action == "copy") {
				p.copy(p.src, p.dst);
			}
			else if (p.action == "new") {
				var b = p.add(p.dst);
				var html = p.gov.visio.createBooker(b);
				p.gov.visio.showB(b, html, p.dst);
				p.action = false;
			}
			if (p.action == "del") {
				p.del(p.dst);
				p.action = false;
			}
			
			p.gov.window.refreshManagers();
			p.gov.header.refresh();
			p.gov.compScreen.refresh();
			
			if (e.preventDefault) e.preventDefault;
			return false;
		});
		
		_list.bind("dragover", function(e){
		
			var b = p.getB(e);
			
			// del
			if (p.action == "del") {
				p.dst = b;
				var domB = p.getDomB(b);
				p.lightRefresh($(domB));
			}
			
			// new, copy, move
			else if (b) {
				var _b = p.getDomB(b);
				var mouseTop = (e.originalEvent.pageY - $(_b).offset().top) < ($(_b).height() / 2) ? true : false;
				
				if (mouseTop) {
					p.lightRefresh($(_b));
					p.dst = b;
				}
				else {
					
					var next = p.gov.sectB.next(b);
					
					if (next) {
						var domB = p.getDomB(next);
						p.lightRefresh($(domB));
						p.dst = next;
					}
					// end of the list
					else {
						
						//p.lightRefresh($(endEl));
						p.dst = false;
					}
				}
			}
			
			if (e.preventDefault) e.preventDefault;
			return false;
		});
		
		_list.bind("dragenter", function(e){
			if (e.preventDefault) e.preventDefault;
			return false;
		});
		
		_list.bind("dragleave", function(e){
			
			p.lightOff();

			if (e.preventDefault) e.preventDefault;
			return false;
		});
		
		_list.bind("dragend", function(e){
			if (e.preventDefault) e.preventDefault;
			return false;
		});
	},
	
	// Light
	
	isLightOn : function() {
		return this._light || false;
	},
	
	lightOn : function(el) {
		this._light = el;
		
		if (this.action == "del")
			this._light.addClass("del");
		else 
			this._light.css("border-top", "2px solid red");
	},
	
	lightOff : function() {
		if (this.isLightOn()) {
		
			if (this.action == "del") 
				this._light.removeClass("del");
			else
				this._light.css("border-top", "2px solid #333");
			
			this._light = false;
		}
	},
	
	lightRefresh : function(el) {
		this.lightOff();
		this.lightOn(el);
	},
}