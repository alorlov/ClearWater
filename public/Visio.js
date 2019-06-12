var Visio = function( space ){
	this.space = space;
	this.ids = Ids;
	this.doc = document;
	this.css = [];
	//this.comp = new VisioComp(this.id, this);
	this.a = new Animation();
	
	this.styles = []; // <style> objects
	
	//this.doc.querySelector("#g" + this.id).innerHTML = "<header class='headerAbs'></header>";
	//this.doc.querySelector("#g" + this.id).innerHTML += "<input type=text id=cellEditor>";
	//this.doc.querySelector("#g" + this.id + " #components").innerHTML = "<input type=text id=cellEditorComp>";
}
Visio.prototype = {

	// <tag id="">
	getIdTM : function(tm) { return "t" + tm.id },
	getIdM : function(m) { return "m" + m.id },
	getIdC : function(c) { return "c" + c.id },
	getIdB : function(b) { return "b" + b.id },
	getIdW : function(w) { return "w" + w.id },
	getIdS : function(s) { return "s" + s.id },
	
	parseIdW : function(id) { return id.substr(1); },
	parseIdM : function(id) { return id.substr(1); },
	parseIdB : function(id) { return id.substr(1); },
	parseIdType : function(id) { return id.charAt(0); },
	
	getClassTM : function(tm) { return "tm_" + tm.id },
	getClassC : function(tm, city) { return "cl_" + city.name },
	getClassCTM : function(tm, city) { return "cl_" + city.name + "_" + tm.id },
	
	// Css
	
	addCSSRule : function (selector, newRule) {
		var sheet = this.doc.styleSheets[0];
		if (sheet.addRule) {
			sheet.addRule(selector, newRule);
		} else {
			ruleIndex = sheet.cssRules.length;
			sheet.insertRule(selector + '{' + newRule + ';}', ruleIndex);
		} 
	},
	
	createClass : function(css) { 
		this.css.push(css);
	},

	showCss : function( css, num ) {
		var value = !css ? this.css.join('') : css,
			num = num ? num : 0;
		
		if ( cont = this.styles[num] ) {
		} else {
			cont = $("<style></style>"); $("head").append( cont );
			this.styles[num] = cont;
		}
		
		//this.doc.querySelector("style").innerHTML += value;
		cont[0].innerHTML += value;
		if (!css)
			this.css = [];
	},
	
	removeCss: function( num ) {
		if ( cont = this.styles[num] ) {
			cont.html("");
		}
	},
	
	//	
	showG : function( gov ) {
		this.doc.querySelector("#a" + gov.id).style.display = "block";
	},
	
	hideG : function( gov ) {
		this.doc.querySelector("#a" + gov.id).style.display = "none";
	},
	
	showGovName: function( g ) {
		$("#_govName").html( g.matrix.filename );
	},
	
	showHeader : function() {
		var gov = this.gov;
		var html = "";
		
		// create tmanagers
		for (var t in gov.tmanagers) 
		{
			var tm = gov.tmanagers[t];

			html += this.createTM(tm);
		}
		this.showCss();
		//this.showTM(html);
	},
	
	// Booker
	
	createBooker : function(booker) {
		
		var gov = booker.gov;
		var doc = document,
			article=[];
		
		// create workers
		for (var t in booker.managers) 
		{
			var m = booker.managers[t];
			article.push(this.createM(m));
		}
		
		return "<article id=" + this.getIdB(booker) + ">" + article.join('') + "</article>";
	},
	

	
	moveBooker : function(b, b0) {
		var _b = $(this.getDomB(b));
		
		if (b0) {
			var _b0 = $(this.getDomB(b0));
			_b.insertBefore(_b0);
		}
		else {
			$("#g" + this.id).append(_b);
		}
	},
	
	showB : function(b, html, b2) {
		
		if (b2 === false) 
			$("#g" + this.id).append(html);
		else {
			var _b2 = this.getDomB(b2);
			var eNew = $(html);
			
			this.a.fadeInA(eNew);
				eNew.insertBefore(_b2);
			this.a.fadeInB(eNew);
		}
	},
	
	// TM
	
	createTM : function(tm) {
		var row = [],
		gov = tm.gov;
		
		row.push("<div class=title>" + tm.id + "</div>");
		row.push("<div class=addCl>+</div>");
		
		/*var color = gov.paintTM.getColor(tm),
			colorT = gov.paintTM.getColorT(tm),
			colorBG = gov.paintTM.getColorBG(tm),
			colorTBG = gov.paintTM.getColorTBG(tm);
			
		
		// create tm css class
		this.createClass("." + this.getClassTM(tm) + " div.title { background: " + colorBG + ";  color: " + colorTBG + " }");
		
		this.createClass("." + this.getClassTM(tm) + " div { border: 1px solid " + colorTBG + ";  background: " + color + ";  color: " + colorTBG + " }");
		*/
		for (var c in tm.clients) 
		{
			var cl = tm.clients[c];
			row.push(this.createC(cl));
		}
		
		return "<nav id=" + this.getIdTM(tm) + " class=" + this.getClassTM(tm) + ">" + row.join('') + "</nav>";
	},
	
	showTM : function(html) {
		
		this.showCss();
		this.doc.querySelector("#g" + this.id + " header").innerHTML += html;
	},

	// Client
	
	createC : function(cl) {
		var city = cl.city,
			tm = cl.tmanager,
			gov = tm.gov;
		
		// create client css class
		var floor = gov.floors.getXY(cl),
			className = this.getClassC(tm, city),
			classNameTM = this.getClassCTM(tm, city),
			compBG = !city.comp ? "" : "background: " + gov.paintComp.getColorComp(city.realCompName) + "  !important";
		this.createClass("." + className + " { left: " + floor.x + "px; " + compBG + " }");
		this.createClass("." + classNameTM 
			+ " { top: " + floor.y 
			+ "%; height: " + floor.height 
			+ (floor.lineHeight ? "%; line-height: " + floor.lineHeight : "" )
			+ " }");
		
		// create client
		return "<div id=" + this.getIdC(cl) + " class='" + className + " " + classNameTM + "'>" + city.name + "</div>";
	},
	
	showC : function(cl, html) {
		
		this.showCss();
		this.doc.querySelector("#g" + this.id + " header nav#" + this.getIdTM(cl.tmanager)).innerHTML += html;
	},
	
	// Manager
	
	createM : function(m) {
		var tm = m.tmanager;
		var row = [];
		row.push("<div class=name>" + m.name + "</div>");
		row.push("<div class=title>" + m.tmanager.nation.smartName + "</div>");
		row.push("<div class=move>m</div>");
		row.push("<div class=copy>c</div>");
		row.push("<div class=copyLink>cl</div>");
		for (var c in m.workers)
		{
			var w = m.workers[c];
			
			row.push(this.createW(w));
		}
		var services = "";//this.createSM(m);
		return "<nav id=" + this.getIdM(m) + " class=" + this.getClassTM(tm) + ">" + services + row.join('') + "</nav>";
	},
	
	insertB : function( b, html, b0 ) {
		var jhtml = $(html),
			gv = this.ids.gv( b.gov );
		
		if (!b0) 
			gv.append(jhtml);
		else {
			jhtml.insertBefore( gv.children( "#b" + b0.id ) );
		}
		
		return jhtml;
	},
	
	insertM: function( m, html, m0 ) {
		var jhtml = $(html),
			bv = this.ids.bv( m.booker );
		
		if (!m0) 
			bv.append(jhtml);
		else {
			jhtml.insertBefore( bv.children( "#m" + m0.id ) );
		}
		console.log(m);
		return jhtml;
	},
	
	insertW: function( cl, m, html ) {
		var jhtml = $(html),
			lv = this.ids.lv( cl, m );
		lv.append( jhtml );
		return jhtml;
	},
	
	showM : function(m, html, m2) { // "m" will be before "m2"
		
		var booker = this.doc.querySelector("#g" + this.id + " article#" + this.getIdB(m.booker));
		
		if (m2 === false) 
			booker.innerHTML += html;
		else {
			var e2 = booker.querySelector("nav#" + this.getIdM(m2));
			var eNew = $(html);
			
			this.a.fadeInA(eNew);
				eNew.insertBefore(e2);
			this.a.fadeInB(eNew);
		}
	},
	
	moveM : function(m, m0) {
		var _m = $(this.getDomM(m));
		
		if (m0) {
			var _m0 = $(this.getDomM(m0));
			_m.insertBefore(_m0);
		}
		else {
			$("#g" + m.booker.gov.id + " article#" + this.getIdB(m)).append(_m);
		}
	},
	
	removeM : function( m ) {
		if ( mv = this.ids.mv( m ) ) {
			mv.remove();
		}
	},
	
	removeC : function( c, m ) {
		if ( cv = this.ids.cv( c, m ) ) {
			cv.remove();
		}
	},
		
	removeW : function( w ) {
		if ( wv = this.ids.wv( w ) ) {
			wv.remove();
		}
	},
	
	// Worker
	
	createW : function(w) {
		var tm = w.manager.tmanager,
			wClass = this.wHasLinkClass(w),
			city = w.client.city,
			className = this.getClassC(tm, city),
			classNameTM = this.getClassCTM(tm, city),
			linkClass = wClass ? " " + wClass : "";
		return "<div id=" + this.getIdW(w) + " class='" + className + " " + classNameTM  + linkClass + "'>" + this.createWValue(w) + "</div>";
	},
	
	createWValue : function(w) {
		
		var html = "",
			comp = w.comp;
			
		if (comp) {
			
			var groups = comp.getGroups();
			for (var g in groups) {
				var group = groups[g],
					colorClass = "groupColor_" + group.id;
				html += "<span class='group " + colorClass + "'>" + group.id + "</span> ";
			}
		}
		else 
			html = w.humanValue();
		
		return html;
	},
	
	wHasLinkClass : function(w) {
		return w.hasLink() ? "link" : "";
	},
	
	showW : function(w, html) {
		var m = w.manager;
		this.doc.querySelector("#g" + this.id + " article#" + this.getIdB(m.booker) + " nav#" + this.getIdM(m)).innerHTML += html;
	},
	
	updateM : function(m, dom) {
		var workers = m.workers;
		for (var i in workers) {
			
			this.updateW(workers[i]);
		}
	},
	
	updateW : function( w ) {
		var wv = this.ids.wv( w );
		$( wv ).html( w.humanValue() );
	},
	
	getDomW : function(w) {
		
		var m = w.manager,
			b = m.booker,
			wId = this.getIdW(w),
			mId = this.getIdM(m),
			bId = this.getIdB(b);
			
		return this.doc.querySelector("#g" + this.id + " article#" + bId + " nav#" + mId + " > div#" + wId);
	},
	
	getDomM : function(m) {
		var mId = this.getIdM(m),
			bId = this.getIdB(m.booker);
			
		return this.doc.querySelector("#g" + this.id + " article#" + bId + " nav#" + mId);
	},
		
	getDomB : function(b) {
		var bId = this.getIdB(b);
			
		return this.doc.querySelector("#g" + this.id + " #main article#" + bId);
	},
	
	getW : function(e) {
	
		var o = this.getDom(e);
		var _w = o.w;
		var _m = o.m;
		var _b = o.b;
		if (!_w || !_m || !_b) return false;
		if (!$(_w).attr("id")) return false;

		var wId = this.parseIdW($(_w).attr("id"));
		var mId = this.parseIdM($(_m).attr("id"));
		var bId = this.parseIdB($(_b).attr("id"));

		if (w = this.gov.getB(bId).getM(mId).getW(wId))
			return w;
		
		return false;
	},
	
	getM : function(e) {
	
		var o = this.getDom(e);
		var _m = o.m;
		var _b = o.b;
		if (!_m || !_b) return false;

		var mId = this.parseIdM($(_m).attr("id"));
		var bId = this.parseIdB($(_b).attr("id"));

		if (m = this.gov.getB(bId).getM(mId))
			return m;
		
		return false;
	},
	
	getB : function(e) {
	
		var _b = this.getDom(e).b;
		
		if (!_b) return false;

		var bId = this.parseIdB($(_b).attr("id"));
		
		if (b = this.gov.getB(bId))
			return b;
		
		return false;
	},
	
	getDom : function (e) {
	
		var o = {
			w : false,
			m : false,
			b : false
		};
		var el = e.target;
		
		//
		if (el.tagName == "DIV")
			o.w = el;
		
		else if (el.tagName == "NAV")
			o.m = el;
		
		else if (el.tagName == "ARTICLE")
			o.b = el;
		
		//
		if (o.w) {
			var m = $(el).parent().get(0);
			if (m.tagName == "NAV") {
				o.m = m;
				var b = $(m).parent().get(0);
				if (b.tagName == "ARTICLE") {
					o.b = b;
				}
			}
		}
		
		else if (o.m) {
			var b = $(o.m).parent().get(0);
			if (b.tagName == "ARTICLE") {
				o.b = b;
			}
		}
		
		return o;
	},
	
	createSM : function(m) {
		var row = [];
		for (var c in m.services)
		{
			var w = m.services[c];
			
			row.push(this.createW(w));
		}
		return "<side>" + row.join('') + "</side>";
	}
}


