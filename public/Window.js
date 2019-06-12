var Window = function (gov) {
	
	this.gov = gov;
	
	this.height = 0;
	this.width = 0;
	
	this.ofTop = 0;
	this.ofLeft = 0;
	
	this.lastTop = 0;
	this.lastLeft = 0;
	
	this.managers = [];
	this.shownManagers = [];
	
	this.update();
}

Window.prototype = {

	update : function(el) {
		if (!el) el = window;
		el = $(el);
		
		this.height = el.height();
		this.width = el.width();
		
		this.lastTop = this.ofTop;
		this.lastLeft = this.ofLeft;
		this.ofTop = el.scrollTop();
		this.ofLeft = el.scrollLeft();
	},
	
	isForward : function() {
		return this.ofTop >= this.lastTop ? true : false;
	},
	
	refreshManagers : function() {
		
		var gov = this.gov;
		var res = [];
		var p = this;
		
		// for collection
		$("#g" + gov.id + " article > nav").each(function(i, m){
			var m = $(m);
			
			if ( m.attr("data-cont") == 1 ) {
				return;
			}
			
			var b = m.parent();
			var mId = m.attr("id").substr(1);
			var bId = $(b).attr("id").substr(1);
			var el = gov.getB(bId).getM(mId);

			var ofTop = m.offset().top;// + p.ofTop;
			
			res[ofTop] = el;
		});
		
		this.managers = res;
		this.shownManagers = this.refreshShownManagers();
		
		return res;
	},
	
	refreshShownManagers : function() {
	
		var top = this.ofTop;
		var bottom = top + this.height;
		
		this.shownManagers = [];
		for (var h in this.managers) {
			if (h < top) continue;
			if (h > bottom) break;
			
			var m = this.managers[h];
			this.shownManagers.push(m);
		}
		
		return this.shownManagers;
	},
	
	getShownM : function() {
		return this.shownManagers;
	},
	
	getShownTM : function() {
		
		var res = [];
		
		for (var i=0, len=this.shownManagers.length; i<len; i++ ) {
			
			var tm = this.shownManagers[i].tmanager,
				id = tm.id;
				
			if (!res[id])
				res[id] = tm;
		}
		return res;
	},
	
	
}