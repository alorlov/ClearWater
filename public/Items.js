var Items = function(name, gov) {
	this.gov = gov;
	this.races = [];
	this.visio = new VisioItem(name, gov.visio);
	
	// create races
	var bookers = gov.bookers,
		html = [];
		
	for (var i=0, len=bookers.length; i<len; i++) {
		
		var booker = bookers[i],
			race = this.add(booker);

		html.push (race.html());
	}
	this.visio.buildItems(html.join(''));
	
	// active default
	var race0Name = Object.keys(this.races)[0];
	this.raceActive = this.getRace(race0Name);
	this.raceActive.show();
	
	this.createHeads();
	
	this.events();
}

Items.prototype = {
	
	add : function (booker) {
		var race = new ItemsRace(booker, this);
		this.races[race.name] = race;
		return race;
	},
	
	getRace : function (name) {
		return this.races[name];
	},

	createHeads : function () {
		var html = [],
			activeName = this.raceActive.name;
		
		html.push("<nav id=cont1>");
		html.push("<div id=" + activeName + ">" + activeName + "</div>");
		html.push("</nav>");
		
		html.push("<nav id='cont2'>");
		for (var i in this.races) {
			var race = this.races[i];
			
			if (race == this.raceActive)
				continue;
				
			html.push("<div id=" + race.name + ">" + race.name + "</div>");
		}
		html.push("</nav>");
		
		this.visio.doc.querySelector("#menuItems #itemHeads").innerHTML = html.join('');
	},
	
	events : function () {

		var p = this;
		$("#menuItems #cont2").click(function(e){
			var el = e.target;
			var elId = $(el).attr("id");
			var elCont1 = $("#menuItems #itemHeads #cont1 div");
			
			$("#menuItems #itemHeads #cont1").append(el);
			$("#menuItems #itemHeads #cont2").prepend(elCont1);
	
			p.evChangeRace(p.raceActive, p.getRace(elId));
		});
		
		$("#menuItems #itemHeads").mouseover(function(){
			$("#menuItems #itemHeads #cont2").show();
		});
		$("#menuItems #itemHeads").mouseout(function(){
			$("#menuItems #itemHeads #cont2").hide();
		});
		$("#menuItems #items nav").mouseover(function(){
			p.raceActive.showSecond();
		});
		$("#menuItems #items nav").mouseout(function(){
			p.raceActive.hideSecond();
		});
		
		$("#menuItems #items nav").click(function(e){
			var el = e.target;
			var elId = $(el).html();
			console.log(elId);
		});
	},
	
	evChangeRace : function (race1, race2) {
		
		// hide race 1
		for (var i=0, len=race1.cols.length; i<len; i++) {
			
			race1.cols[i].hide();
		}
		setTimeout(function() {
			race1.hide()
		}, 300);
		
		// show race 2
		setTimeout(function() {
			race2.show()
		}, 500);
		setTimeout(function(){
			for (var i=0, len=race2.cols.length; i<len; i++) {
				race2.cols[i].show();
			}
		}, 800);
		
		// change active race
		this.raceActive = race2;
	}
}