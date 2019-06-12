var Keyboard = function( event ) {
	this.event = event;
	this.ev = this.event.myEvent;
	this.codes = {
		"backspace": 8,
		"enter": 13,
		
		"shift": 16, "ctrl": 17, "alt": 18,
		
		"left": 37,"up": 38, "right": 39, "down": 40,
		
		"delete": 46,
		
		"0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, 	"9": 57,
		
		"a": 65, "b": 66, "c": 67, "d":68, "e":69, "f":70, "g":71, "h":72, "i":73, "j":74, "k":75, "l":76, "m":77, "n":78,
		"s": 83,
		"v": 86,
		"x": 88,
		"z": 90,
	}
}
Keyboard.prototype = {
	keyUp: function( key ) {
		// true, if key has just pressed up
		if ( k = this.ev.keyUp ) {
			if ( key ) {
				if ( k == this.codes[key] ) {
					return this.codes[key];
				}
			} else {
				return k;
			}
		}
	},
	
	keyDown: function( key ) {
		// true, if key has just pressed down
		if ( key ) {
			return ( ( k = this.ev.keyDown ) && k == this.codes[key] );
		} else {
			return this.ev.keyDown;
		}
	},
	
	pressed: function( comb ) {
		// last key should be pressed up and doesn't behave to ev.keys array.
		if ( this.keyUp( comb.splice(-1,1) ) ) {
			// check without last element;
			return this.press( comb );
		}
	},
	
	press: function( comb ) {
		var evKeys = this.ev.keys;
		if ( evKeys.length == comb.length ) {
			for ( var i=0, len=comb.length; i<len; i++ ) {
				if ( !this.has( comb[i] ) ) {
					return false;
				}
			}
			return true;
		}
	},
	// seek key code
	has: function( key, single ) {
		var keys = this.ev.keys,
			count = keys.length;
		if ( count ) {
			var keyCode = this.codes[key];
			for ( var i = count; i--; ) {
				if ( keys[i] == keyCode ) {
					// check if single param is defined
					if ( single && count != 1 ) {
						return false;
					}
					return true;
				}
			}
		}
		return false;
	},
	
	name: function( code ) {
		for ( var name in this.codes ) {
			if ( this.codes[name] == code ) {
				return name;
			}
		}
	},
	
	empty: function() {
		return !this.ev.keys.length;
	},
}