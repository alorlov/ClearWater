var CompScreen = function(gov) {
	this.gov = gov;
	this.onScreen = [];
	this.elToDel = [];
	this.on = false;
	this.mouseOn = false;
	
	this.events();
}
CompScreen.prototype = {
	
	events : function() {
	
		var p = this;
		$("#" + p.gov.name + " .pinComps").click(function() {
			p.on = p.on ? false : true;
			if (p.mouseOn) {
				p.on = true;
				p.mouseOn = false;
			}
			p.on ? p.open() : p.close();
		});
		
		/*$("#" + this.gov.name + " #components").mouseover(function() {
			if (p.on == false)
				if (p.mouseOn == false) {
					p.on = true;
					p.mouseOn = true;
					p.open();
				}
		});
		
		$("#" + this.gov.name + " #components").mouseout(function() {
				if (p.mouseOn == true) {
					p.on = false;
					p.mouseOn = false;
					p.close();
				}
		});*/
	},
	
	open : function() {
		this.refresh();
		$("#" + this.gov.name + " #components footer div:not(.title)").css("display", "block");
	},
	
	close : function() {
		this.refresh();
		$("#" + this.gov.name + " #components footer div:not(.title)").css("display", "none");
	},
	
	remove : function() {
		this.onScreen = [];
		this.elToDel = [];
		this.gov.visio.comp.removeAll();
	},
	
	refresh : function(remove, fast) {
		
		var window = this.gov.window;
		var visio = this.gov.visio.comp;
		
		if (remove) 
			this.remove();
		
		if (fast) 
			visio.fastOn();
		
		var onScreen = window.getShownGroups();
		var forward = window.isForward();
		
		if (!onScreen.length)
			return;
		
		/* Index array by Tags */
		
		var existTag = [];
		for (var b in this.onScreen) {
			
			existTag[b] = [];
			
			var oldBooker = this.onScreen[b];
			for (var g in oldBooker) {
			
				var group = oldBooker[g];
				
				if (existTag[b][group.tagName])
					continue;
				
				existTag[b][group.tagName] = true;
			}
		}
		
				
		/*
			visio.clean elToDel
		*/
		
		for (var b in this.elToDel) {
			
			var booker = this.elToDel[b];
			
			for (var g in booker) {
			
				var group = booker[g];
				var tagName = group.tagName;
				visio.removeGroup(group, false);
				
				if (existTag[b]) {
					// remove title
					if (!existTag[b][tagName])
						visio.removeGroup(group, true);
				} else {
					visio.removeBookTitle(group.base.booker);
					visio.removeGroup(group, true);
				}
			}
		}
		
		/* Get NEW, OLD and EXISTs groups */
		
		var onNew = [],
			onOld = [],
			onExist = [],
			newTagBooker = [];
		
		for (var b in onScreen) {
			
			onExist[b] = [];
			onOld[b] = [];
			onNew[b] = [];
			
			var newBooker = onScreen[b];
			var oldBooker = this.onScreen[b];
			
			if (!oldBooker) {
			
				onNew[b] = newBooker;
				newTagBooker[b] = true;
				continue;
			}
			/*
			alert(
				  "E: " + Object.keys(oldBooker).join(',')
				+ "\n"
				+ "N: " + Object.keys(newBooker).join(',')
				+ "\n"
				
				);*/
			for (var g in newBooker) {
			
				if (oldBooker[g]) {
				
					onExist[b][g] = oldBooker[g];
					
					// delete from oldBooker group has been added to onExist
					delete oldBooker[g];
				}
				else {
					
					onNew[b][g] = newBooker[g];
				}
			}
			
			// обрабатываем остатки
			for (var g in oldBooker) {
			
				onOld[b][g] = oldBooker[g];
			}
			
			delete this.onScreen[b];
		}
		
		// добавляем к старым целые кейсы
		if (this.onScreen) {
			for (var b in this.onScreen) {
				onOld[b] = this.onScreen[b];
			}
		}
		
		/* Merge in GG */
		
		this.onScreen = [],
			ggs = [];
		
		//onMerge = forward ? this.merge(onExist, onNew) : this.merge(onNew, onExist);
		this.onScreen = this.merge(this.onScreen, onExist);
		this.onScreen = this.merge(this.onScreen, onNew);
		
		for (var b in this.onScreen) {
		
			var width = [],
				height = [],
				groups = [];
			
			var booker = this.onScreen[b];
			var bookerObj = this.gov.getB(b);
			
			// count groups in tag
			for (var g in booker) {
			
				var group = booker[g];
				var name = group.tagName;
				if (!width[name]) {
					width[name] = 0;
					groups[name] = [];
				}
				width[name]++;
				groups[name][group.id] = group;
			}
			
			// count height for each tag
			for (var name in width) {
				var gId = Object.keys(groups[name])[0];
				height[name] = groups[name][gId].countNodes();
			}
			
			// Set Booker Title
			ggs.push({
				title : true,
				groups : false,
				booker : bookerObj,
				w : 1,
				h : 1
			});
			
			// fill result array with titles
			for (var name in width) {
			
				ggs.push({
					title : false,
					booker : bookerObj,
					name : name,
					groups : groups[name],
					w : width[name] + 1, // +1 for title's col
					h : height[name] + 1 // +1 for group's title-id
				});
			}
		}
		
		/* Calculate with model */
		
		var screenW = Math.floor(this.gov.window.width / this.gov.visio.comp.elW);
		ggs = CompTetris.calculate(ggs, screenW);
		
		/* Apply for onNew */
		
		var html = "";
		
		for (var b in onNew) {
			
			var booker = onNew[b];
			
			// create title for Booker
			if (newTagBooker[b]) {
				
				var bookerObj;
				for (var g in booker) {
				
					bookerObj = booker[g].base.booker;
					break;
				}
				html += visio.createBookTitle(bookerObj, forward);
			}
			
			for (var g in booker) {
			
				var group = booker[g];
				
				// create title for GG
				if (!existTag[group.tagName]) {
				
					html += visio.createGroupHead(group, forward);
				}
				
				html += visio.createGroup(group, forward);
			}
		}
		
		visio.showComp(html);
		
		/* Apply ggs array */
		
		for (var i=0, len=ggs.length; i<len; i++) {
		
			var gg = ggs[i];
			var groups = gg.groups;
			var y = this.on ? gg.y : gg.yMin;
			
			if (groups) {
				
				// set pos for title
				var gId = Object.keys(groups)[0];
				visio.setPosHead(groups[gId], gg.x, y);
				var z = 1;
				for (var g in groups) {
					
					var group = groups[g];
					var x = gg.x + (z++);
					visio.setPosGroup(group, x, y);
				}
			}
			else {
				
				visio.setPosBookTitle(gg.booker, gg.x, y);
			}
		}
		
		/* Index array by Tags */
		
		var existTag2 = [];
		for (var b in this.onScreen) {
			
			existTag2[b] = [];
			
			var oldBooker = this.onScreen[b];
			for (var g in oldBooker) {
			
				var group = oldBooker[g];
				
				if (existTag2[b][group.tagName])
					continue;
				
				existTag2[b][group.tagName] = true;
			}
		}
		
		// set for onOld
		for (var b in onOld) {
			
			var booker = onOld[b];
			
			for (var g in booker) {
			
				var group = booker[g];
				var tagName = group.tagName;
				
				if (!existTag2[b]) 
					visio.hideBookTitle(group.base.booker, forward);
				
				// remove title
				if (!existTag2[b] || !existTag2[b][tagName])
					visio.hideGroup(group, forward, true);
				
				visio.hideGroup(group, forward, false);
			}
		}
		
		visio.showCss();
		
		this.elToDel = onOld;
		
		if (fast) 
			visio.fastOff();
	},
	
	merge : function(a, b) {
    
		for (var i in b) {
			
			if (!a[i])
				a[i] = [];
			
			for (var j in b[i]) {
			
				if (!a[i][j])
					a[i][j] = b[i][j];
			}
		}
		return a;
	}
}