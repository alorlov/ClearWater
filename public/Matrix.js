var Matrix = function(fileName, gov) {
	
	this.gov = gov;
	this.meta = new Meta( this.gov );
	this.kv;
	this.dict = this.gov.dict;
	this.matrix = []; // csv's multi-array
	this.header = []; // csv's first line
	this.services = []; // sf's service fields
	this.servClients = []; // service objects by name
	this.nations = []; /* nation = Nation
						 tmanager = TManager
						 cities = [] // [NoPartyID] = City
						 clients = [] // [NoPartyID] = Client
						*/
	this.cases = []; // [caseNum] = [0 => startRow, 1 => endRow]
	this.compPrev = []; // cells with components and groups
	this.servicesCol = []; // array of service's cols
	this.citiesCol = []; // array of city's cols
	this.sep = ",";
	this.filename = fileName;
	
	String.prototype.splitCSV = function(sep) {
	  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
		if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
		  if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
			foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
		  } else if (x) {
			foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
		  } else foo = foo.shift().split(sep).concat(foo);
		} else foo[x].replace(/""/g, '"');
	  } return foo;
	};
	
	// read matrix in multi-array
	fileName = FileSystem.convertUriToLocalPath(fileName);
	//this.matrix = FileSystem.load(fileName).split("\r\n");
	var data = FileSystem.load(fileName);
	// create new
	if ( !data ) {
		FileSystem.save( fileName, this.gov.space.getConfig("defaultHeader") );
		data = FileSystem.load(fileName);
	}
	this.matrix = data.split("\n");
	
	// split all rows at the time!
	for (var i=this.matrix.length; i--; ) {
		this.matrix[i] = this.matrix[i].splitCSV(this.sep);
	}
	
	// parse meta
	var meta = this.findMeta( this.matrix );
	if ( meta.length ) {
		var r = meta[0],
			c = meta[1],
			metaStr = this.matrix[r][c];
		
		this.meta.parseMeta( metaStr );
		// clear row with meta
		this.matrix.splice(r, 1);
	}
	
	this.header = this.matrix[0];
	this.kv = new KeyValue( this.header );
	
	this.cases[0] = { 0:1, 1: this.matrix.length - 1 }
	
	/*
	// create naction's collection
	for (var r=1, 
				a = this.kv.getI( "#action" ), 
				action,
				tc=0,
				len=this.matrix.length; 
						r < len; r++) 
	{
		action = this.matrix[r][a];
		
		// create test case's start/end positions
		if (action == "test case start") { this.cases[tc] = []; this.cases[tc][0] = r; }
		if (action == "test case end") { this.cases[tc][1] = r; tc++; }
	}*/
}

Matrix.prototype = {
	
	joinCSV : function (table, replacer) {
		replacer = replacer || function(r, c, v) { return v; };
		var csv = '', c, cc, r, rr = table.length, cell;
		for (r = 0; r < rr; ++r) {
			if (r) { csv += '\r\n'; }
			for (c = 0, cc = table[r].length; c < cc; ++c) {
				if (c) { csv += ','; }
				cell = replacer(r, c, table[r][c]);
				if (/[,\r\n"]/.test(cell)) { cell = '"' + cell.replace(/"/g, '""') + '"'; }
				csv += (cell || 0 === cell) ? cell : '';
			}
		}
		return csv;
	},
	
	getFilename: function() {
		var ind = this.filename.lastIndexOf("\\");
		return this.filename.substr(ind + 1);
	},
	
	count : function() {
		return this.cases.length;
	},
		
	findMeta: function( matrix ) {
		var reg = /^META/;
		for ( var r = matrix.length, len = r-3; r>len; r-- ) {
			if ( row = matrix[r] ) {
				for ( i = row.length; i--; ) {
					if ( row[i] ) {
						if ( reg.exec( row[i] ) ) {
							return [r, i];
						}
					}
				}
			}
		}
		return [];
	},
	
	save : function() {
		// index = name
		var headers = this.kv.setIndexes( this.header ),
			metaI = this.header.length,
			idsField = this.kv.getI( "#id" );
		
		if ( idsField === undefined ) {
			idsField = this.header.push( "#id" ) - 1;
			headers[name] = idsField;
		}
		
		var r = 0,
			bookers = this.gov.sectB.list(),
			matrix = [];

		matrix[r++] = this.header; // first row
		
		for (var b in bookers) {
			var booker = bookers[b];
			// Managers
			var managers = booker.sections.list();
			
			for (var i=0, len=managers.length; i<len; i++) {
				var m = managers[i],
					row = m.out();
				
				if ( m.isGroup() ) {
					continue;
				}
				matrix[r] = [];
				
				for ( var name in row ) {
					var index = headers[name];
					// if new tag in the matrix
					if ( index == undefined ) {
						var index = this.header.push( name ) - 1;
						headers[name] = index;
					}
					var value = row[name];
					matrix[r][index] = value;
				}
				
				matrix[r][idsField] = i;
				r++;
			}
		}
		matrix[r] = [];
		matrix[r][metaI] = this.meta.genAll();
		
		var out = this.joinCSV(matrix);
		FileSystem.save( this.filename, out );
		//FileSystem.save(this.filename+ +new Date(), matrix);
		return out;
	},
	
	parse: function( booker ) 
	{
		var caseId = booker.caseId,
			ids = this.meta.ids,
			localStyles = this.meta.localStyles,
			ownStyles = this.meta.ownStyles,
			
			tcStart = this.cases[caseId][0],
			tcEnd = this.cases[caseId][1],
			
			rule = this.gov.rule,
			book = this.gov.book,
			t = this.gov.style,
			
			references = [],
			refChanged = [],
			
			tms = []; //this.gov.tmanagers;

		for (var r=tcStart; r < tcEnd; r++) {
			var row = this.matrix[r], ruleW, localStyle, confirmRule, w;
			// get row
			this.kv.setValues( row );
			var metaId = this.kv.getValue( "#id" );
			var ref = this.kv.getValue( "#reference" );
			
			man = booker.addM( ref );
			// update ref-array
			references[ref] = man;
			
			// add matrix id for Meta-purposes
			ids[ metaId ] = man;
			// Add workers
			for (var i=0, len=row.length; i<len; i++) {
				if ( v = row[i] ) {
					w = man.addWorker(v, this.header[i]);
					// check ${link}
					if ( w.hasLinkValue( v ) ) {
						if ( w0 = w.parseLink( v, references ) ) {
							w.setLink( w0 );
							if ( !refChanged[w0.manager.id] ) {
								refChanged[w0.manager.id] = w0.manager;
							}
						}
					}
				}
			}
			// get best rule
			var confirmRule = man.getConfirmRule( this.kv );
			// set style
			man.setStyle( localStyles[ metaId ] );
		}
		// refresh reference field
		if ( refChanged.length ) {
			for ( var i in refChanged ) {
				refChanged[i].refreshReference();
			}
		}
		
		// parse groups
		if ( this.meta.params["GValues"] ) {
			this.meta.groups = this.meta.parseGValues( this.meta.params["GValues"], booker );
		}
		// insert groups	
		var groups = this.meta.groups,
			rule = this.gov.ruleG;
		for ( var i=1, len=groups.length; i<len; i++ ) { // skip group[0] (global parent)
			var g = groups[i],
				style,
				cities = g.cities,
				metaId = g.a,
				m01 = this.meta.getManAfter( g.a ),
				m02 = this.meta.getManAfter( g.b );
			// add M
			var man1 = booker.addM( "ga", false, m01 ),
				man2 = booker.addM( "gb", false, m02 );
			man1.addG( g );
			man2.addG( g );
			// add matrix ids
			ids[g.a] = man1;
			ids[g.b] = man2;
			
			// add Workers
			for ( var name in cities ) {
				man1.addWorker( cities[name], name );
			}
			g.setParent( groups[g.parentI] ).recreate( man1, man2 );
			
			// Get rule for the first manager
			this.kv.setKeyValues( cities );
			// get best rule
			var confirmRule = man1.getConfirmRule( this.kv );
			// set style
			man1.setStyle( localStyles[ metaId ] );
			// update color by level
			g.setColor();
		}
		
		// parse links
		if ( this.meta.params["Links"] ) {
			this.meta.parseLinks( this.meta.params["Links"] );
		}
	}
}