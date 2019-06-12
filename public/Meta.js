var Short = function() {
	this.outTagIn = [],
	this.outTagName = [],
	// get or set&get
	this.f = function( name ) {
		if ( i = this.outTagIn[name] ) {
			return i;
		} else {
			return this.outTagIn[name] = this.outTagName.push( name ) - 1;
		}
	}

	this.out = function() {
		var out = [];
		
		for ( var i=this.outTagName.length; i--; ) {
			out.push( i + ":" + this.outTagName[i] );
		}
		return out.join('^');
	}
}

var Meta = function(gov) {
	this.gov = gov;
	this.params = [];
	this.tags = []; // short tag names
	this.xyT = [];
	this.xyTMs = [];
	this.xyLines = [];
	this.xyClients = [];
	this.rules = [];
	this.localStyles = [];
	this.ownStyles = [];
	
	this.ids = []; // ids for inserting groups / matching outOfRule styles
	this.gRules = [];
	this.groups = [];
	
	this.sep = "|||";
	this.sep2 = "^";
	
	this.alignList = ["left", "center", "right", "right2"];
	this.alignList2 = { "left": 0, "center": 1, "right": 2, "right2": 3 };
	this.colorsList = ["red","orange","yellow","lime","cyan","sky","violet","grey","group"];
	this.colorsList2 = { "red": 0,"orange": 1, "yellow": 2, "lime": 3, "cyan": 4, "sky": 5, "violet": 6, "grey": 7, "group": 8 };
}

Meta.prototype = {

	parseMeta : function(str) {
	
		var array = str.split( this.sep ),
			params = [];
			
		for (var i=0, len=array.length; i < len; i+=2) {
			params[array[i]] = array[i+1];
		}
		
		if ( params["META"] != "1984" ) {
			return false;
		}

		if ( params["TagShort"] ) this.parseTagShort( params["TagShort"] );
		if ( params["XYLineHead"] ) this.parseXYLine( params["XYLineHead"] );
		if ( params["XYTM"] ) this.parseXYTM( params["XYTM"] );
		if ( params["XYClients"] ) this.parseXYClients( params["XYClients"] );
		if ( params["Rules"] ) this.rules = this.parseRules( this.gov.rule, params["Rules"] );
		if ( params["RulesW"] ) this.parseRulesW( params["RulesW"], this.rules, this.xyTMs );
		if ( params["GRules"] ) this.gRules = this.parseRules( this.gov.ruleG, params["GRules"] );
		if ( params["GRulesW"] ) this.parseRulesW( params["GRulesW"], this.gRules, this.xyTMs );
		if ( params["LocalStyles"] ) this.parseLocalStyles( params["LocalStyles"], this.localStyles, this.ownStyles );
		
		this.params = params;
		
		return true;
	},
	
	getManAfter: function( id ) {
		var len = this.ids.length;
		
		do {
			var resMan = this.ids[ ++id ];
		}
		while( !resMan && id < len )
		
		return resMan || false;
	},
	
	// GValues // ^^G1:G2:XYTM:GID:ParentID^1:New^21:1000^^
	parseGValues: function( str, b ) {
		var groups = str.split("^^"),
			out = [];
		// the first group
		out[0] = b.groups;
		// each group
		for (var i=0, len=groups.length; i<len; i++) {
			var o = new Group();
			var tags = groups[i].split("^");
			// first slice is ids
			var t = tags[0].split(":"),
				gId = t[3];
			
			o.a = t[0];
			o.b = t[1];
			//o.style = t[2] ? this.xyTMs[t[2]] : false;
			o.parentI = t[4] != "" ? t[4] : false;
			// each tag
			for (var j=1, len2=tags.length; j<len2; j++) {
				var t = tags[j].split("=");
				o.cities[ this.tags[ t[0] ] ] = t[1];
			}
			
			out[gId] = o;
		}
		
		return out;
	},
	
	//TagShort|||0:#id^1#action^2:Price^3:Qty|||
	parseTagShort : function( str ) {
		var params = str.split("^"),
			out = [];
		
		for (var i=0, len=params.length; i<len; i++) {
			var p = params[i].split(":");
			out[p[0]] = p[1];
		}
		
		this.tags = out;
	},

	// XYTM|||id:h:color^name
	parseXYTM : function( strTMs ) {
		var t = this.gov.style,
			tms = [];
			
		// parse TMs
		var p = strTMs.split("^");
		for (var i=0, len=p.length; i<len; i+=2) {
			var pp = p[i].split(":"),
				name = p[i+1];
			tms[pp[0]] = t.addTM( +pp[1], true, name, this.colorsList[ pp[2] ], [2] );
		}
		
		this.xyT = t;
		this.xyTMs = tms;
	},

	// XYLineHead|||i:w:x
	parseXYLine : function( strLines ) {
		var t = this.gov.style,
			lines = [];
		// parse Lines
		var array = strLines.split("^");
		for (var i=0, len=array.length; i<len; i++) {
			var p = array[i].split(":");
			lines[p[0]] = t.addLine(+p[0], +p[1], +p[2]);
		}
		
		this.xyLines = lines;
	},
	
	// XYClients|||xytm:tag:line:w:h:x:y :a:va:b:color:bgColor^
	parseXYClients : function( strClients ) {
		var t = this.gov.style,
			clients = [];
		// parse Clients
		var array = strClients.split("^");
		for (var i=0, len=array.length, tm, tmI = -1; i<len; i++) {
			var p = array[i].split(":");
			
			// refresh TM if need
			if (tmI != +p[0]) {
				tmI = +p[0];
				tm = this.xyTMs[tmI];
			}
			
			var cl = tm.addClient(this.tags[+p[1]], +p[2], +p[3], +p[4], +p[5], +p[6]),
				a = p[7] !== "" ? this.alignList[ +p[7] ] : false,
				c = p[10] !== "" ? this.colorsList[ +p[10] ] : false,
				bg = p[11] !== "" ? this.colorsList[ +p[11] ] : false;
			cl.setStyle(
				a, // align
				+p[8]	|| 0, // vAlign
				+p[9]	|| 0, // bold
				c, // color
				bg // bgColor
			)
		}

		this.xyClients = clients;
	},
	
	//Rules|||0^action=EACH^1^action=ExecutionReport+ExecType=8
	//Rules|||RID^name=defType^
	/*
		Example for:
			
			Action=EACH
			
			Action=ExecutionReport + ExecType=8
			1:Action:0 + 2:ExecType:2:ExecutionReport:8
			
			Action=ExecutionReport + OrdStatus=8
	*/
	parseRules : function( first, strRules ) {
		var rules = [];
		var array = strRules.split("^");
		// rules rows
		for (var i=0, len=array.length; i<len; i+=2) {
			var r = array[i+1],
					ruleId = array[i],
					ruleQueueChild,
					ruleNew;
			// parse str
			ruleQueueChild = first.parse( r, this.gov );
			// add to Gov.rule
			ruleNew = first.add( ruleQueueChild.first() );
			ruleNew.str = r;
			rules[ruleId] = ruleNew;
		}
		
		return rules;
	},

	//RulesW|||RID:value:tmId
	parseRulesW : function( strRulesW, rules, tms ) {
		// parse RulesW
		var array = strRulesW.split("^");
		for (var i=0, len=array.length; i<len; i++) {
			var p = array[i].split(":"),
				rid = p[0];
				// value = p[1]
				// tmId = p[2]
			rules[rid].addW( p[1], this.xyTMs[p[2]] );
		}
	},
	
	// m1:tag1:m2:tag2^
	parseLinks: function( str ) {
		var links = str.split("^");
		for (var j=0, lenJ=links.length; j<lenJ; j++) {
			var p = links[j].split(":"),
				m1 = this.ids[ p[0] ],
				name1 = this.tags[ p[1] ], // src w name
				m2 = this.ids[ p[2] ],
				name2 = this.tags[ p[3] ]; // trg w name
				
				var w1 = m1.getWCity( name1 );
				// if src is group
				if ( !w1 && m1.isGroup() ) {
					w1 = m1.addWorker( "", name1 );
				}
				
				var w2 = m2.getWCity( name2 );
				// if trg is group
				if ( !w2 && m2.isGroup() ) {
					w2 = m2.addWorker( w1.humanValue(), name1 );
				}
			
			if ( !w1.hasLink() ) {
				w1.setLink( w2 );
			}
		}
	},
	//Styles|||IDS=XYTM=RuleTrueFalse^
	parseLocalStyles: function( str, localStyles, ownStyles ) {
		var p = str.split("^");
		
		for (var i=0, len=p.length; i<len; i++) {
			var pp = p[i].split("="),
				mId = pp[0];
			
			localStyles[mId] = this.xyTMs[ pp[1] ];
			ownStyles[mId] = pp[2] ? true : false;
		}
	},
	
	// Generate
	genAll: function() {
		var hasBook = saveLocalRule = this.gov.book,
			hasBookG = saveLocalRuleG = this.gov.bookG,
			first = this.gov.rule,
			firstG = this.gov.ruleG,
			t = this.gov.style,
			bookers = this.gov.bookers;
			
			out = [],
			tagShort = [],
			outRules = first.allStrRules({ rI: 0, meta: this }), // get str + gen save ids
			outRulesW = [],
			outGRules = firstG.allStrRules({ rI: 0, meta: this }),
			outGRulesW = [],
			outTM = [],
			outClients = [],
			outLocalStyles = [],
			outGroups = [],
			outLines = [],
			outLinks = [],
			
			o = { tmI: 0 };
		// new Tag Short object
		this.short = new Short();
		// get styles in using
		var stylesUsing = []
		for ( var b in bookers ) {
			var managers = bookers[b].names;
			
			for ( var i in managers ) {
				var style = managers[i].style;
				
				if ( !stylesUsing[style.id] ) {
					stylesUsing[style.id] = style;
				}
			}
		}
		if ( saveLocalRule ) outRules = [];
		if ( saveLocalRuleG ) outGRules = [];
		// gen tms, clients, rules, rulesW
		this.genByRules( first.out(), o, outTM, outClients, outRules, outRulesW, stylesUsing, saveLocalRule );
		this.genByRules( firstG.out(), o, outTM, outClients, outGRules, outGRulesW, stylesUsing, saveLocalRuleG );
		
		// add LineHead
		var lines = t.lines;
		for ( var i in lines ) {
			outLines.push( this.genLine( lines[i], i ) );
		}
		// add LocalStyles
		for ( var b in bookers ) {
			var localStyles = bookers[b].localStyles;
			
			this.genByLocalStyles( o, bookers[b], localStyles, outLocalStyles, outTM, outClients );
		}
		// add Groups
		for ( var i in bookers ) {
			var	b = bookers[i],
				groups = b.groups,
				o = {
					meta: this,
					gI: 0,
					outGroups: outGroups,
					outLocalStyles: outLocalStyles,
					sections: b.sections,
				}

			outGroups = groups.out( o, 0 );
		}
		// add Links
		for ( var i in bookers ) {
			var managers = bookers[i].sections.list();
			
			for ( var i in managers ) {
				var workers = managers[i].workers;
				
				for ( var j in workers ) {
					var w = workers[j];
					
					if ( w2 = w.hasLink() ) {
						outLinks.push( this.genLink( w, w2 ) );
					}
				}
			}
		}
		// join all
		out.push( "META" );
		out.push( 1984 );
		out.push( "TagShort" );
		out.push( this.short.out() );
		out.push( "XYTM" );
		out.push( outTM.join(this.sep2) );
		out.push( "XYClients" );
		out.push( outClients.join(this.sep2) );
		out.push( "XYLineHead" );
		out.push( outLines.join(this.sep2) );
		out.push( "Rules" );
		out.push( outRules.join(this.sep2) );
		out.push( "RulesW" );
		out.push( outRulesW.join(this.sep2) );
		out.push( "GRules" );
		out.push( outGRules.join(this.sep2) );
		out.push( "GRulesW" );
		out.push( outGRulesW.join(this.sep2) );
		out.push( "GValues" );
		out.push( outGroups.join( this.sep2 + this.sep2 ) );
		out.push( "LocalStyles" );
		out.push( outLocalStyles.join(this.sep2) );
		out.push( "Links" );
		out.push( outLinks.join(this.sep2) );
		
		return out.join( this.sep );
	},
	
	genByRules: function( first, o, outTM, outClients, outRules, outRulesW, stylesUsing, saveLocalRule ) {
		var tmI = o.tmI;
			//rI = 0;
		// each Rule
		for ( var r=0, len=first.length; r<len; r++ ) {
			var rulesW = first[r];
			var rule = rulesW[0].rule,
				genRule = false;
			// each RuleW & TM
			for ( var w=0, len2=rulesW.length; w<len2; w++ ) {
				var ruleW = rulesW[w];
				var tm = ruleW.style;
				var clients = tm.out();
				
				if ( stylesUsing[tm.id] && clients.length && 
						!ruleW.income && !ruleW.virgin ) {
					// add TM
					outTM[tmI] = this.genTM( tm, tmI );
					// add Client
					for ( var i in clients ) {
						var c = clients[i];
						outClients.push( this.genClient( c, tmI, this.short.f( c.name ) ) );
					}
					// add RuleW
					outRulesW.push( this.genRuleW( ruleW, rule.saveId, tmI ) );
					tmI++;
					genRule = true;
				}
			}
			
			if ( genRule && saveLocalRule ) {
				outRules.push( this.genRule( rule, rule.saveId ) );
				//rI++;
			}
		}
		// save i
		o.tmI = tmI;
	},
	
	genByLocalStyles: function( o, b, localStyles, outLocalStyles, outTM, outClients ) {
		var tmI = o.tmI,
			sections = b.sections,
			savedTM = [];
		
		for ( var mid in localStyles ) {
			var m = b.getM( mid ),
				group = m.isGroup(),
				idsM = sections.sect( m ),
				tm = m.style,
				tmIstr = savedTM[tm.id],
				ownStyle = m.ownStyle ? 1 : "",
				clients = tm.out();
			
			if ( tmIstr === undefined && ( group || clients.length ) ) {
				// add TM
				outTM[tmI] = this.genTM( tm, tmI );
				savedTM[tm.id] = tmI;
				// add Client
					for ( var i in clients ) {
						var c = clients[i];
						outClients.push( this.genClient( c, tmI, this.short.f( c.name ) ) );
				}
				tmIstr = tmI;
				tmI++;
			}
			outLocalStyles.push( this.genLocalStyle( idsM, tmIstr, ownStyle ) );
		}
		// save i
		o.tmI = tmI;
	},

	genTM: function( tm, i ) {
		var p = [ 
			i, 
			tm.h,
			this.colorsList2[tm.c.color]
		].join(':');
		
		return [
			p,
			tm.name
		].join( this.sep2 );
	},

	genClient: function( cl, tmI, nameShort ) {
		var align = cl.a ? this.alignList2[cl.a] : "";
			bg = cl.bg.color ? this.colorsList2[cl.bg.color] : "",
			color = cl.c.color ? this.colorsList2[cl.c.color] : "";
		return [ 
			tmI, 
			nameShort,
			cl.lineI,
			cl.w,
			cl.h,
			cl.x,
			cl.y,
			align,
			cl.va,
			cl.b,
			color,
			bg
		].join(':');
	},
		
	genLine: function( line, i ) {
		return [ 
			i, 
			line.w,
			line.x
		].join(':');
	},
	
	genRule: function( rule, i ) {
		return [ 
			i, 
			rule.str
		].join('^');
	},
	
	genRuleW: function( ruleW, rI, tmI ) {
		return [ 
			rI, 
			ruleW.value,
			tmI
		].join(':');
	},

	genLocalStyle: function( mI, tmI, ownStyle ) {
		return [ 
			mI, 
			tmI,
			ownStyle
		].join('=');
	},
	
	genGroup: function( id1, id2, tmI, gI, parentI, cities ) {
		var out = [[
			id1,
			id2,
			"",
			gI,
			parentI,
		].join(':')];
		
		for ( var name in cities ) {
			out.push( this.short.f( name ) + "=" + cities[name] );
		}
		
		return out.join("^");
	},
	
	genLink: function( w1, w2 ) {
		var sections = w1.manager.booker.sections;
		return [ 
			sections.sect( w1.manager ),
			this.short.f( w1.name ),
			sections.sect( w2.manager ),
			this.short.f( w2.name ),			
		].join(':');
	},
	
// GValues // ^^G1:G2:XYTM:GID:ParentID^1:New^21:1000^^
//TagShort|||0:#id^1#action^2:Price^3:Qty|||
// XYTM|||id:h:name
// XYLineHead|||i:w:x
// XYClients|||xytm:tag:line:w:h:x:y^
//Rules|||0^action=EACH^1^action=ExecutionReport+ExecType=8
//Rules|||RID^name=defType^
//RulesW|||RID:value:tmId
//Links||| m1:tag1:m2:tag2^
	
	
	
}