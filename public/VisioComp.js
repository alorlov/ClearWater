var VisioComp = function(id, visio){

	this.visio = visio;
	this.doc = document;
	this.id = id;
	this.css = [];
	this.elW = 80;
	this.elH = 20;
}
VisioComp.prototype = {

	// Css
	showCss : function() {
		this.visio.showCss(this.css);
		this.css = [];
	},
	
	show : function() {
		var el = this.doc.querySelector("#" + this.id + " footer");
		if (el) {
			el.style.zIndex = "1000";
			el.style.display = "block";
		}
	},
	
	hide : function() {
		this.doc.querySelector("#" + this.id + " footer").style.display = "none";
	},
	
	getIdGroupHead : function(g) {
		return "cmp-" + g.base.booker.id + "-head-" + g.tagName;
	},
	
	getIdGroup : function(g) {
		return "cmp-" + g.base.booker.id + "-group-" + g.name;
	},
	
	getIdBookTitle : function(b) {
		return "cmp-" + b.id;
	},
	
	getIdNode : function(node) {
		return node.name;
	},
		
	parseBookId : function(id) {
		var ar = id.split("-"),
			id = ar[1];
		
		return id;
	},
	parseIdGroupHead : function(id) {
		var ar = id.split("-"),
			type = ar[2],
			id = ar[3];
		
		return type == "head" ? id : false;
	},	
	parseIdGroup : function(id) {
		var ar = id.split("-"),
			type = ar[2],
			id = ar[3];
		
		return type == "group" ? id : false;
	},
	parseIdNode : function(id) {
		return id;	
	},
	
	setPos : function(idName, x, y) {
		
		this.css.push("#" + this.id + " #" + idName + "{ bottom: " + y + " ; left: " + x + " }");
	},
	
	setPosGroup : function(g, x, y, title, forward) {
		
		var idName = !title ? this.getIdGroup(g) : this.getIdGroupHead(g),
			xx = x * this.elW,
			yy = y * this.elH;
		this.setPos(idName, xx + "px", yy + "px");
	},
	
	setPosHead : function(g, x, y) {
		this.setPosGroup(g, x, y, true);
	},
	
	setPosBookTitle : function(b, x, y) {
		var idName = this.getIdBookTitle(b);
		xx = x * this.elW,
		yy = y * this.elH;
		this.setPos(idName, xx + "px", yy + "px");
	},
	
	hideBookTitle : function(b, forward) {
		var idName = this.getIdBookTitle(b);
		var x = forward ? -this.elW + "px" : "100%";
		this.setPos(idName, x, 1);
	},
	
	hideGroup : function(g, forward, title) {
		var idName = !title ? this.getIdGroup(g) : this.getIdGroupHead(g),
			x = forward ? -this.elW + "px" : "100%";
		this.setPos(idName, x, 1);
	},
	
	createGroup : function(g, forward, title) {
		var row = [],
			nodes = g.getNodes(),
			gov = this.visio.gov;
		
		var t = title ? true : false,
			idName = !t? this.getIdGroup(g) : this.getIdGroupHead(g),
			newNode = "<span class=newNode data-gname='" + idName + "'>+</span>",
			title = !t? this.createGroupTitle(g) : g.tagName + " " + newNode,
			tStyle = !t ? 
			"background: " + gov.paintComp.getColorGroup(g) + "; color: " + gov.paintComp.getColorGroupT(g)
			: "background: " + gov.paintComp.getColorComp(g.tagName) + "; color: " + gov.paintComp.getColorCompT(g.tagName);
		
		row.push("<div class=title style='" + tStyle + "'>" + title + "</div>");
		
		if (!t)
			tStyle = "";
			
		// Workers
		for (var n in nodes)
		{
			var node = nodes[n];
			var value = !t? this.visio.createWValue(node) : node.name;
			var minClass = gov.compScreen.on ? "" : " hide";
			row.push("<div id='" + this.getIdNode(node) + "' class='" + minClass + "' style='" + tStyle + "'>" + value + "</div>");
		}
		
		// css
		var x = !forward ? -this.elW + "px" : "100%";
		this.setPos(idName, x, 1);
		
		return "<footer id=" + idName + ">" + row.join('') + "</footer>";
	},
	
	createGroupHead : function(g, forward) {
		return this.createGroup(g, forward, true);
	},
	
	createBookTitle : function(b, forward) {
		return "<footer id=" + this.getIdBookTitle(b) + ">" + b.id + "</footer>";
	},
	
	createGroupTitle : function(g) {
		return g.id + ":" + g.name;
	},
	
	showComp : function(html) {
	
		this.showCss();
		this.doc.querySelector("#" + this.id + " #components").innerHTML += html;
	},
	
	removeGroup : function(g, title) {
		var id = idName = !title? this.getIdGroup(g) : this.getIdGroupHead(g);
		$("#" + this.id + " #components #" + id).remove();
	},
	
	removeBookTitle : function(b) {
		var id = this.getIdBookTitle(b);
		$("#" + this.id + " #components #" + id).remove();
	},
	
	removeAll : function() {
		$("#" + this.id + " #components footer").remove();
	},
	
	changeNodeId : function(g, oldName, newName) {

		var groups = g.base.tags[g.tagName];
		for (var i in groups) {
			
			$("#" + this.id + " #components footer#" + this.getIdGroup(groups[i]) + " #" + oldName)
			.attr("id", newName);
		}
		// in title
		$("#" + this.id + " #components footer#" + this.getIdGroupHead(g) + " #" + oldName)
			.attr("id", newName);
	},
	
	refreshNodeTitle : function(g, nodeName) {
		$("#" + this.id + " #components footer#" + this.getIdGroupHead(g) + " #" + nodeName)
			.html(nodeName);
	},
	
	changeGroupId : function(oldName, newName) {
		$("#" + this.id + " #components footer#" + oldName)
			.attr("id", newName);
	},
	
	refreshGroupTitle : function(g) {
		$("#" + this.id + " #components footer#" + this.getIdGroup(g) + " #title")
			.html(this.createGroupTitle(g));
	},
	updateW : function(w, dom) {
		
		if (!dom)
			dom = this.getDomW(w);
		
		var el = $(dom);
		var html = this.visio.createWValue(w);
		el.html(html);
		
		// link's class
		/*var wClass = this.wHasLinkClass(w);
		if (wClass) 
			el.addClass("link");
		else
			el.removeClass("link");*/
	},
	
	fastOn : function() {
		$("style")[0].innerHTML += "footer { transition-duration: .0s }";
	},
	
	fastOff : function(time) {
		time = !time ? 0 : time;
		setTimeout(function() {
			$("style")[0].innerHTML += "footer { transition-duration: .4s }";
		}, time);
	},
	
	
	// EVENTS //
	
	defineCompCell : function(e) {
	
		var type = false;
		
		var o = this.getDom(e);
		var _w = o.w;
		var _m = o.m;
		if (!_w || !_m) return false;
		
		if (gName = this.parseIdGroup($(_m).attr("id"))) {
			var type = $(_w).attr("class") == "title" ? "gTitle" : "w",
			gId = gName, // groupName OR tagName
			wId = type == "w" ? this.parseIdNode($(_w).attr("id")) : false;
		}
		else if (gNameHead = this.parseIdGroupHead($(_m).attr("id"))) {
			var type = $(_w).attr("class") == "title" ? false : "wTitle",
			gId = gNameHead,
			wId = type == "wTitle" ? this.parseIdNode($(_w).attr("id")) : false;
		}
		
		var bId = this.parseBookId($(_m).attr("id"));
		
		return {
			type : type,
			bId : bId,
			gId : gId,
			wId : wId,
		};
	},
	
	getW : function(e) {
	
		var o = this.getDom(e);
		var _w = o.w;
		var _m = o.m;
		if (!_w || !_m) return false;
		
		var gName = this.parseIdGroup($(_m).attr("id"));
		var wName = this.parseIdNode($(_w).attr("id"));
		var bId = this.parseBookId($(_m).attr("id"));

		if (w = this.visio.gov.getB(bId).getGroup(gName).getW(wName))
			return w;
		
		return false;
	},
	
	getG : function(e) {
	
		var o = this.getDom(e);
		var _m = o.m;
		if (!_m) return false;
		
		var gName = this.parseIdGroup($(_m).attr("id"));
		var bId = this.parseBookId($(_m).attr("id"));

		if (g = this.visio.gov.getB(bId).getGroup(gName))
			return g;
		
		return false;
	},
	
	getDomW : function(w) {
		
		var g = w.group,
			wId = this.getIdNode(w),
			gId = this.getIdGroup(g);
			
		return this.doc.querySelector("#" + this.id + " footer#" + gId + " #" + wId);
	},
		
	getDomG : function(g) {
		return this.doc.querySelector("#" + this.id + " footer#" + this.getIdGroup(g));
	},
		
	getDomGHead : function(g) {
		return this.doc.querySelector("#" + this.id + " footer#" + this.getIdGroupHead(g));
	},
	
	getDom : function (e) {
	
		var o = {
			w : false,
			m : false
		};
		var el = e.target;
		
		//
		if (el.tagName == "DIV")
			o.w = el;
		
		else if (el.tagName == "FOOTER")
			o.m = el;
		
		//
		if (o.w) {
			var m = $(el).parent().get(0);
			if (m.tagName == "FOOTER") {
				o.m = m;
			}
		}
		
		return o;
	},
	
}


