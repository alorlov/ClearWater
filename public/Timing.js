var Timing = {
	
	queue : [],
	ids : [],
	calmList: [], // intervals of non-calling
	
	list : [],
	
	executing : false,
	interval : 100,
	
	ready : function (id, timeout) {
		var now = +new Date();
		//console.log(now + "," + (this.list[id] + timeout - now));
		if (!this.list[id] || this.list[id] + timeout < now) {
			this.list[id] = now;
			return true;
		}
		return false;
	},
	
	onCalm: function( interval, id, fn, context, params ) {
		// update time in calm
		if ( o = this.calmList[id] ) {
			this.updateCalm( id );
		// create calm
		} else {
			this.calmList[id] = {
				interval: interval,
				controlTime: +new Date() + interval,
			}
			this.on(id, fn, context, params);
		}
	},
	
	on : function (id, fn, context, params) {
		// check exist id in queue
		if (!this.hasId(id)) {
			// add in queue
			this.add(id, this.freez(fn, context, params));
			// exec if it's the single in queue
			if (!this.executing) {
				this.executing = true;
				this.execIn();
			}
		}
	},
	
	freez : function(fn, context, params) {
		return function() {
			fn.apply(context, params);
		};
	},
	
	exec : function() {
		// take out function
		var cur = this.get(),
			execute = false;
		// if calm
		if ( calm = this.hasCalm( cur.id ) ) {
			if ( execute = this.calmReady( cur.id ) ) {
				this.removeCalm( cur.id );
			}
		} else {
			execute = true;
		}
		// execute the first in queue
		if ( execute ) {
			cur.func();
		// take in the end (if calm)
		} else {
			this.add(cur.id, cur.func);
		}
		// if queue is empty
		if (!this.toExecute()) {
			this.executing = false;
			return false;
		}
		// go to next exec
		this.execIn();
	},
	
	execIn : function() {
		setTimeout("Timing.exec()", this.interval);
	},
	
	add : function(id, fn) {
		this.ids.push(id);
		this.queue.push(fn);
	},
	
	get : function() {
		return {
			func: this.queue.shift(),
			id: this.ids.shift(),
		}
	},
	
	hasId : function(id) {
		for (var i=this.ids.length; i--; ) {
			if (this.ids[i] == id)
				return true;
		}
		return false;
	},
	
	hasCalm: function(id) {
		return this.calmList[id];
	},
	
	calmReady: function( id ) {
		return +new Date() > this.calmList[id].controlTime;
	},
	
	updateCalm: function( id ) {
		var curTime = +new Date();
		// shift calm to new interval
		if ( curTime < o.controlTime ) {
			this.calmList[id].controlTime = curTime + o.interval;
		// clear calm item
		} else {
			this.removeCalm( id );
		}
	},
	
	removeCalm: function( id ) {
		delete this.calmList[id];
	},
	
	toExecute : function() {
		return this.queue.length > 0 ? true : false;
	},
}