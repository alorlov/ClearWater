var Rule = function( type, name, defType, exValue ) {
	this.gov;
	this.level;
	this.type = type; // 1 - and; 2 - exception
	this.name = name;
	this.defType = defType; // 0 - each, 1 - any, 2 - exact
	this.exValue = exValue;
	this.define = false;
	
	this.ex = [];
	this.and = [];
	this.w = [];
	this.wAny; // if defType == 1 (any)
	
	this.fromDic;
	this.str;
	this.parent;
	this.child;
	
	return this;
}
Rule.prototype = {
	// for the first rule
	init: function( gov, level ) {
		this.gov = gov;
		this.level = level;
	},
	
	parse: function( str, gov ) {
		var r = str.split("+"),
			rule, prevValue, prevDefType;
		
		for (var j=0, lenJ=r.length; j<lenJ; j++) {
			var p = r[j].split("="),
				name = p[0],
				value = p[1],
				type,
				w = [];
			
			var defType = value == "EACH" ? 0 : ( value == "ANY" ? 1 : 2 );
			// type
			if ( j != 0 ) { // not the first
				if ( prevDefType != 2 ) {
					type = 1; // and
				} else {
					type = 2; // ex
				}
			} else {
				type = 1;
			}
			// exValue
			exValue = prevDefType != 2 ? false : prevValue;
			

			if ( j == 0 ) {
				rule = new Rule();
				rule.init( gov, 0 );
			}
			
			rule = rule.addChild( new Rule( type, name, defType, exValue ) );
			// for the next itaration
			prevValue = value;
			prevDefType = defType;
		}
		// add ruleW for type=EXACT
		if ( rule.defType == 2 ) {
			rule.addW( value, null );
		}
		// for the last child
		rule.define = true;
		
		return rule;
	},
	// match incoming rule's queue and create when need. Returns new defined rule.
	add: function( ruleQ ) {
		var rule,
			rq = ruleQ,
			ri = this;
		
		while ( r = rq.child ) {
			// check existing of the same rules
			if ( r.type == 1 ) {
				rule = ri.hasAnd( r.name );
			} else {
				rule = ri.hasEx( r.exValue, r.name );
			}
			// add
			if ( !rule ) {
				rule = new Rule( r.type, r.name, r.defType, r.exValue );
				if ( r.type == 1 ) {
					ri.addAnd( rule );
				} else {
					ri.addEx( rule );
				}
				rule.str = r.str;
				rule.fromDic = r.isDic();
			} else {
				// mismatching of defTypes
				if ( rule.defType != r.defType && !r.child ) {
					if ( rule.defType == 2 ) {
						// rewrite if only defType = EXACT
						//rule.defType = r.defType;
					}
				}
			}
			rq = r;
			ri = rule;
		}

		ri.define = true;
		
		return ri;
	},
	// create childs info in rule's hierarhy
	mark: function() {
		var rule = this;
		while ( rule.parent ) {
			rule.parent.child = rule;
			rule = rule.parent;
		}
	},
	
	match: function( row ) {
		var value = row.getValue( this.name ),
			wa = [], we = [], res = [];
		
		if ( !this.parent ) {
			// the first rule
			wa = this.matchAnd( row );
		} else {
			if ( this.hasEx( value, false ) ) {
				we = this.matchEx( row, value );
			}
			
			wa = this.matchAnd( row, value );
		}
		
		res = we.concat( wa );
		
		// default
		if ( !res.length && this.define ) {
			if ( this.defType != 1 ) {
				if ( defW = this.w[value] || this.getEmptyW( value ) ) {
					res.push( defW );
				}
			} else { // defType = ANY
				if ( value ) {
					res.push( this.wAny || this.getEmptyW( value ) );
				}
			}
		}
		
		return res;
	},
	
	matchEx : function( row, value ) {
		var rulesW = [], w,
			ex = this.ex[value];
		
		for ( var name in  ex ) {
			if ( row.hasName( name ) ) {
				if ( w = ex[name].match( row ) ) {
					rulesW = rulesW.concat( w );
				}
			}
		}
		
		return rulesW;
	},
	
	matchAnd : function( row ) {
		var rulesW = [], w;
		
		for ( var name in this.and ) {
			if ( row.hasName( name ) ) {
				if ( w = this.and[name].match( row ) ) {
					rulesW = rulesW.concat( w );
				}
			}
		}
		
		return rulesW;
	},
	
	matchOnly: function( row ) {
		var w1 = this.best( this.match( row ) ),
			ruleW = false;
		
		if ( w1 ) {
			if ( w1.empty() ) {
				// recreate ruleW
				ruleW = w1.rule.addW( w1.value, false, false );
			} else {
				ruleW = w1;
			}
		}
		return ruleW;
	},
	
	matchAndCopy: function( row, incoming ) {
		var w1 = this.best( this.match( row ) ), // RuleW by this Rule
			w2 = this.best( incoming.match( row ) ), // RuleW by incoming Rule
			level1 = w1 ? w1.level : 0,
			level2 = w2 ? w2.level : 0,
			ruleW = false;
		
		// income define
		if ( w2 ) {
			if ( !w2.virgin ) {
				ruleW = w2;
			} else {
				// hightlight for information
			}
		}
		/*
		// loc define
		} else if ( w1 && !w1.virgin ) {
			ruleW = w1;
		// both are virgin
		} else if ( w2 && w2.virgin && w1 && w1.virgin ) {
			ruleW = w1;
		// income virgin, loc not exists
		} else if ( w2 && w2.virgin ) {
			
		}
		// if found incoming level more than "this" level
		if ( w2 && level2 >= level1 ) {
			if ( w2.rule.isDic() && w2.virgin == false ) {
				ruleW = w2;
			// copy rule
			} else {
				// update this rule by the source rule
				w2.rule.mark();
				var ruleNew = this.add( w2.rule.first() );
				// create new style
				if ( !w2.style ) {
					style = false; // will be created by default
				// take from incoming
				} else {
					style = this.gov.style.addCloneTM( w2.style );
				}
				// add ruleW
				ruleW = ruleNew.addW( w2.value, style, false );
			}
		} else if ( w1 ) {
			if ( !w1.style ) {
				// recreate ruleW
				ruleW = w1.rule.addW( w1.value, false, false );
			} else {
				ruleW = w1;
			}
		}*/
		return ruleW; // return completed ruleW that's ready for work with style
	},
	
	best: function( rulesW ) {
		var bestW, bestLevel = 0;
		for ( var i=0, len=rulesW.length; i<len; i++ ) {
			// seek FIRST biggest
			if ( rulesW[i].level > bestLevel ) {
				bestW = rulesW[i];
				bestLevel = bestW.level;
			}
		}
		return bestW;
	},
	
	first: function() {
		var rule = this;
		while ( rule.parent ) {
			rule = rule.parent;
		}
		return rule;
	},
	
	addChild: function( child ) {
		this.child = child;
		//child.parent = this;
		this.inherit( child, this );
		return child;
	},
	
	inherit: function( child, parent ) {
		child.level = parent.level + 1;
		child.parent = parent;
		child.gov = parent.gov;
	},
	
	addEx : function( r ) {
		var exValue = r.exValue;
		
		if ( !this.ex[exValue] ) {
			this.ex[exValue] = [];
		}
		
		this.ex[exValue][r.name] = r;
		this.inherit( r, this );
	},
	
	addAnd : function( r ) {
		this.and[r.name] = r;
		this.inherit( r, this );
	},
	
	addW : function( value, XYTM, income ) {
		if ( XYTM === false ) {
			XYTM = this.gov.style.addTM( false, false );
		}
		
		var ruleW = new RuleW( this, value, XYTM, income );
		
		if ( this.defType != 1) {
			this.w[value] = ruleW;
		} else {
			this.wAny = ruleW;
		}
		
		return ruleW;
	},
	
	getEmptyW: function( value ) {
		return new RuleW( this, value, false );
	},
	
	hasEx : function( value, name ) {
		if ( rule = this.ex[value] ) {
			if ( name !== false ) {
				rule = rule[name];
			}
			return rule;
		}
	},	
	
	hasAnd : function( name ) {
		return this.and[name];
	},
	
	hasW : function( value ) {
		if ( value ) {
			return this.w[value];
		}
		
		if ( this.defType == 1 ) {
			return this.wAny;
		} else {
			return this.w;
		}
	},
	
	isDic: function() {
		return this.fromDic || !this.gov.book;
	},
	// return array[RID][RuleW]
	out: function() {
		var w = [], out = [], outEx = [], outAnd = [];
		
		if ( str = this.str ) {
			for ( var v in this.w ) {
				w.push( this.w[v] );
			}
			
			if ( this.wAny ) {
				w.push( this.wAny );
			}
			
			if ( w.length ) {
				out[0] = w;
			}
		}
		
		for ( var v in this.ex ) {
			var ex = this.ex[v];
			
			for ( var n in ex ) {
				outEx = ex[n].out();
			}
		}
	
		for ( var n in this.and ) {
			outAnd = outAnd.concat( this.and[n].out() );
		}
		
		return out.concat( outEx, outAnd );
	},
	// 
	allStrRules: function( o ) {
		var w = [], out = [], outEx = [], outAnd = [];
		
		if ( str = this.str ) {
			this.saveId = o.rI;
			out.push( o.meta.genRule( this, this.saveId ) );
			o.rI++;
		}
		
		for ( var v in this.ex ) {
			var ex = this.ex[v];
			
			for ( var n in ex ) {
				outEx = ex[n].allStrRules( o );
			}
		}
	
		for ( var n in this.and ) {
			outAnd = outAnd.concat( this.and[n].allStrRules( o ) );
		}
		
		return out.concat( outEx, outAnd );
	},
}

var RuleW = function( rule, value, XYTM, income ) {
	this.rule = rule;
	this.level = this.rule.level;
	//this.id = this.rule.gov.createRuleWId();
	this.value = value;
	this.style = XYTM;
	this.income = income;
	this.virgin = true; // not assigned by anyone
}
RuleW.prototype = {
	empty: function() {
		return !this.style;
	},
}