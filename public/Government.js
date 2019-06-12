var Government = function(id, matrixName, book, space) {
	this.iB = 0;
	this.iRuleW = 0;
	this.iTM = 0;
	this.iC = 0;
	
	this.id = id;
	this.path = matrixName;
	this.space = space;
	this.book = book || false;
	
	this.style = new XYTable( this, ( book ? book.style.ti : 0 ) );
	this.rule = new Rule(); this.rule.init( this, 0 );
	this.ruleG = new Rule(); this.ruleG.init( this, 0 );
	
	this.tmanagers = [];
	this.bookers = [];
	this.sectB = new Sections();
	this.floors = new Floors(this.book);
	this.floorsS = new Floors(this.book);
	this.paintTM = new PaintTM(this);
	//this.paintComp = new PaintComp(this);
	this.visio = this.space.visio;
	this.matrix = new Matrix(matrixName, this);
	//this.events = new Events(this);
	this.window = new Window(this);
	this.compScreen = new CompScreen(this);
	//this.manual = new Manual(this);
	//this.header = new Header(this);
	this.frame = new Frame(this);
	this.shown = false;
	this.events = this.space.events;
		
	// create bookers (the first Test Case has zero index)
	for (var caseId=0, len=this.matrix.count(); caseId < len; caseId++) 
	{
		var booker = this.createBooker(this, false);
		booker.setCase(caseId);
	}
	
	var cases = this.matrix.count();
	for (var i=0; i < cases; i++) {
		var booker = this.loadBooker(i);
	}
	
	//this.bookList = new BookList(this);
	//this.paintTM.init();
	//this.paintComp.init();
}
Government.prototype = {
	
	createIdB : function() {
		while (this.bookers[this.iB]) {
			this.iB++;
		}
		return this.iB;
	},
	
	createRuleWId : function() {
		return this.iRuleW++;
	},
	
	save : function() {
		this.matrix.save();
	},
	
	createBooker : function(gov, b0)
	{
		var id = this.createIdB();
		var booker = new Booker(gov, false, id);
		this.bookers[id] = booker;
		this.sectB.settle(booker, b0);
		return booker;
	},
	
	changeBookerId : function(b, id) {
		delete this.bookers[b.id];
		this.bookers[id] = b;
	},
	
	loadBooker : function(bookerId)
	{
		var booker = this.bookers[bookerId];
		this.matrix.parse(booker);
		//booker.refreshLinks();
		return booker;
	},
	
	delBooker : function (b) {
		var id = b.id;
		this.sectB.unsettle(b);
		var _b = this.visio.getDomB(b);
		$(_b).remove();
		delete this.bookers[id];
	},
	
	moveBooker : function (b, b0) {
		this.sectB.resettle(b, b0);
		this.visio.moveBooker(b, b0);
	},
	
	cloneBooker : function (bc, b0) {
		var b = this.createBooker(this, b0);
		
		//this.changeBookerId(b, bc.id);
		
		var managers0 = bc.sections.list();
		for (var i in managers0) {
			var m0 = managers0[i];
			var m = b.cloneM(m0, "copyBooker");
		}
		
		return b;
	},
	
	insert : function() {
		// add default clients
		var html = this.html();
		
		// show css for income styles
		var css = [], income = this.bookers[0].getIncomeStyles();
		for ( var i in income ) {
			css.push( income[i].css() );
		}
		this.visio.showCss( css.join('') );
		
		this.visio.showCss( this.style.css() );
		this.visio.insertB( this.bookers[0], html );
		
		//this.window.refreshManagers();
		
		// show header
		//this.header.refresh();

		this.shown = true;
	},
	
	show : function() {
		this.visio.showG( this );
	},
	
	hide : function() {
		this.visio.hideG( this );
	},
	
	// after adding new Client
	addWorkers : function(cl) {

		for (var i in this.bookers) {
			
			this.bookers[i].addWorkers(cl);
		}
	},
	
	getB : function(id) {
		return this.bookers[id];
	},
	
	createIdTM : function() {
		return this.iTM++;
	},
	
	getTM : function(id) {
		return this.tmanagers[id];
	},
	
	addTM : function(id, XYTM)
	{
		if (!id) {
			var id = this.tmanagers.length;
		}
		
		var tm = new TManager(XYTM, this, id);
		this.tmanagers[id] = tm;
		//this.paintTM.add(tm); // alias the new color to TM
		return tm;
	},

	hasTM : function (nation) 
	{
		for (var i=this.tmanagers.length; i--; ) {
			if (this.tmanagers[i].nation == nation) {
				return this.tmanagers[i];
			}
		}
		return false;
	},
	
	createIdC : function() {
		return this.iC++;
	},
	
	hasCitizen : function(city, itself) 
	{
		var cityName = city.name,
			tm;
		for (var i in this.tmanagers) {
		
			tm = this.tmanagers[i];
			if (tm == itself) 
				continue;
			
			if (tm.clients[cityName])
				return tm.clients[cityName];
		}
		
		return false;
	},
	
	listCitizens : function(city) {
		
		var citizens = [],
			cityName = city.name;
		for (var i in this.tmanagers) {
		
			tm = this.tmanagers[i];
			
			if (tm.clients[cityName])
				citizens.push(tm.clients[cityName]);
		}
	
		return citizens;
	},
	
	htmlNewWorkers : function(cl) {
		
		for (var j in this.bookers) {
			var managers = this.getB(j).getMsByTM(tm);
			for (var i=managers.length; i--; ) {
				var w = managers[i].getWC(cl);
				if (w) {
					html = this.visio.createW(w);
					this.visio.showW(w, html);
				}
			}
		}
	},
	
	html: function() {
		var bookers = this.sectB.list(),
			bs = [],
			lineHeads = this.style.htmlLineHeads();
		
		for ( var i in bookers ) {
			bs.push( bookers[i].html() );
		}
		return lineHeads + bs.join('');
	},
}