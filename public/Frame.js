var Frame = function(gov) {
	this.gov = gov;
	this.self = $("#frame");
	this.action;
	this.newTM = this.self.children("#newTM");
	this.newClient = this.self.children("#newClient");
	
	var p = this;
	//$("#frame #submit").click(function() { p.onSubmit() });
	//$("#frame #cancel").click(function() { p.onCancel() });
}
Frame.prototype = {

	show : function() {
		this.self.show();
	},
	
	hide: function() {
		this.self.hide();
	},
	
	openTM : function() {
		this.action = "newTM";
		this.show();
		this.newTM.show();
		this.newTM.children("input").focus();
	},
	closeTM : function() {
		this.newTM.hide();
		this.cleanValue();
		this.hide();
	},
	
	openNewClient : function(cities) {
		this.action = "newClient";
		this.show();
		this.newClient.show();
		this.newClient.children("input").focus();
		
		// list of cities
		var html = [];
		for (var c in cities) {
			html.push("<div id='" + c + "'>" + c + "</div>");
		}
		this.newClient.children("#list").html(html.join());
	},
	closeNewClient : function() {
		this.newClient.hide();
		this.cleanValue();
		this.hide();
	},
	addClient : function(tm, cityName) {
		var city = tm.hasC(cityName);
				
		if (!city) {
			city = tm.nation.race.addCity(0, cityName, false);
			tm.nation.addCapital(city);
			
			var cl = tm.addClient(city);
			this.gov.visio.showC(cl, this.gov.visio.createC(cl));
			
			this.gov.addWorkers(cl);
			
			for (var j in this.gov.bookers) {
				var managers = this.gov.getB(j).getMsByTM(tm);
				for (var i=managers.length; i--; ) {
					var w = managers[i].getWC(cl);
					this.gov.visio.showW(w, this.gov.visio.createW(w));
				}
			}
		}
	},
	
	onSubmit : function() {
	},
	
	onCancel : function() {
	},
	
	getValue : function() {
		return $("#frame #" + this.action + " #value").val();
	},
	cleanValue : function() {
		$("#frame #" + this.action + " #value").val("");
	}
}