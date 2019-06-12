var Drag = function ( src, srcX0, srcY0, trg, m1, m2, gov ) {
	
	var p = this;
	
	this.gov = gov;
	this.ofTop0 = this.gov.window.ofTop;
	
	this.m1 = m1; // j obj
	this.m2 = m2;
	this.src = src; // Element under cursor
	this.srcCont; // container for this.src
	this.trg = trg;
	this.stub;
	
	this.heights = [];
	this.middles = [];
	this.middles2 = [];
	this.objs = [];
	
	this.srcI = 0;

	this.mouseX0 = srcX0;
	this.mouseY0 = srcY0;
	
	this.srcX0 = 0;
	this.srcY0 = 0;
	this.middle0 = 0;
	this.ofTop0 = 0;
	this.fixed = false;
	
	this.srcY = 0;
	
	this.interval = false;
	this.e;
	this.iterateY = 0;
	this.id = "moveRow";
	
	$(window).scroll(function(e){
		//console.log(p.gov.window.ofTop);
		var delta = p.gov.window.ofTop - p.ofTop0;
		p.calcAfterScroll(delta);
		
		//p.gov.window.refreshManagers();
		//p.moveSrc(Ev.get(p.id));
	});
}

Drag.prototype = {	
	// get element's dx & dy relative to mouse
	getMouseDelta: function( elX, elY, mX, mY ) {
		return {
			dx: mX - elX,
			dy: mY - elY,
		}
	},
	
	dragOutInit: function( x, y ) {
		// created container with fix-position
		var copyCont = this.createContainer( this.src, 3 );
		copyCont.css({
			"top" : y,
			"left" : x,
			"position" : "fixed",
		});
		this.fixed = true;
		return copyCont;
	},
	
	start: function( cont ) {
		if ( !cont ) {
			this.startDrag();
		} else {
			this.startDragOut( cont );
		}
		this.start = true;
	},
	
	startDrag : function() {
		this.calc();
		this.srcCont = this.createContainer(this.src, 3);
		this.trg.append(this.srcCont);
		this.contStartPos(this.srcCont);
		this.src.css("visibility", "hidden")
	},
	
	startDragOut : function( cont ) {
		this.calc();
		this.srcCont = cont; //this.createContainer(this.src, 3);
		// append to destination container
		this.trg.append(this.srcCont);
		console.log("1:"+this.srcCont.position().top);
		this.contStartPos(this.srcCont);
		this.src.css("visibility", "hidden");
		
		// count middle0
		var srcM0 = this.srcCont.offset().top + this.srcCont.height() / 2,
			midPos = this.middles[0],
			midOff = this.middles2[0];
		this.middle0 = midPos - (midOff - srcM0);
		
		// move src-stub manually
		var elTarget = this.objs[this.isMove(this.middle0)];
		this.src.insertBefore(elTarget);
	},
	
	contStartPos : function(el) {
		var pos = el.position();
		this.ofTop0 = this.gov.window.ofTop;
		this.srcX0 = pos.left;
		this.srcY0 = this.fixed ? ( pos.top - this.ofTop0 ) : pos.top;
		this.middle0 = this.srcY0 + el.height() / 2;
		console.log("Y0:"+this.srcY0+"=top:"+pos.top+" - ofTop0:"+this.ofTop0);
	},
	
	calcAfterScroll : function(delta) {
		this.srcY0 += delta;
		this.middle0 += delta;
		this.ofTop0 += delta;
		console.log(this.ofTop0 + " ("+delta+")");
	},
	
	cycle : function(animate) {
		var e = this.e;
		if (!e) return;
		
		var mouse1 = this.ofTop0 + e.clientY;
		var y = p.middle0 + (mouse1 - p.mouseY0);
		
		var newI = p.isMove(y);
		//console.log("Y:"+y+", newI:"+newI+"("+p.srcI+")");
		if (newI !== false) {
			var down = newI > p.srcI ? true : false;
			var animate = Math.abs(newI - p.srcI) == 1 ? true : false;
			var elNewPrev = down ? p.objs[newI-1] : p.objs[newI+1];
			p.move(p.objs[newI], p.src, down, animate, elNewPrev);
			p.recalc(p.srcI, newI);
		}
	},
	
	getBefore : function(y, offset) {

		var set = !offset ? this.middles : this.middles2;
		for (var beforeI=0, len=set.length; beforeI<len; beforeI++) {
			if (set[beforeI] > y)
				break;
		}
		return beforeI;
	},
	
	calc : function() {
		var middles = [],
			middles2 = [],
			heights = [],
			objs = [],
			srcI,
			srcId = this.src.attr("id");
			p = this,
			m1 = this.m1,
			m2id = this.m2.attr("id");
			
		var m = m1,
			i = 0;
		do {
			if ( m.attr("data-cont") ) {
				return;
			}
			
			if ( m.css("display") == "none" ) {
				continue;
			}
			
			var pos = m.position(),
				offset = m.offset(),
				height = m.height(),
				mId = m.attr("id");
			//console.log(pos.top + ", id:"+m.attr("id"));
			middles[i] = pos.top + height / 2;
			middles2[i] = offset.top + height / 2;
			heights[i] = height;
			objs[i] = m;
			
			if(srcId == mId)
				p.srcI = i;
			
			m = m.next();
			i++;
		} while ( m.attr("id") && mId != m2id );
		
		this.heights = heights;
		this.middles = middles;
		this.middles2 = middles2;
		this.objs = objs;
	},
	
	moveSrc : function (e) {
		var xDif = e.clientX - this.mouseX0,
			yDif = this.ofTop0 + e.clientY - this.mouseY0;
		this.srcCont.css("top", this.srcY0 + yDif);
		this.srcCont.css("left", this.srcX0 + xDif);
	},
	
	isMove : function (y) {
		
		var i = this.srcI,
			mid,
			newI = false,
			down = this.isDown(y),
			y = down ? y + this.heights[this.srcI]/3 : y - this.heights[this.srcI]/3;
			
		while(this.middles[i]) {

			mid = this.middles[i];
			if ((down && y > mid) || 
				(!down && y < mid))
				newI = i
			else
				break;
			
			i = down ? i+1 : i-1;
		}
		//console.log("isMove: newI="+newI+",srcI="+this.srcI+", y="+y);
		return (newI != this.srcI) ? newI : false;
	},
	
	
	
	recalc : function (i0, i1) {
		
		var down = i1 > i0 ? true : false,
			s1 = down ? i0 + 1 : i1,
			s2 = down ? i1 : i0 - 1;
			
		var height = this.objs[i1].height(),
			sumMiddles = 0;
		
		for (var i = s1; i <= s2; i++) {
			this.middles[i] = down ? this.middles[i] - this.heights[i0] : this.middles[i] + this.heights[i0];
			sumMiddles += this.heights[i];
		}
		
		this.middles[i0] = down ? this.middles[i0] + sumMiddles : this.middles[i0] - sumMiddles;
		
		var pos = down ? i1 + 1 : i1,
			posDel = down ? i0 : i0 + 1;
		
		//console.log("RE: srcI:"+this.srcI+", newI:" +i1 + " middles:" + this.middles.join(">") + ", pos:"+pos);
		
		// insert
		this.middles.splice(pos, 0, this.middles[i0]);
		this.middles2.splice(pos, 0, this.middles2[i0]);
		this.heights.splice(pos, 0, this.heights[i0]);
		this.objs.splice(pos, 0, this.objs[i0]);
		//console.log("RE2: srcI:"+this.srcI+", newI:" +i1 + " middles:" + this.middles.join(">") + ", pos:"+pos);// delete
		this.middles.splice(posDel, 1);
		this.middles2.splice(posDel, 1);
		this.heights.splice(posDel, 1);
		this.objs.splice(posDel, 1);
		
		this.srcI = i1;
	},
	
	isDown : function (yMid0) {
		
		if (this.srcI == 0)
			return true;
		else if (this.srcI == this.middles.length - 1)
			return false;
		else {
			var srcMid = this.middles[this.srcI];
			if (yMid0 > srcMid)
				return true;
			else
				return false;
		}
	},
	
	move : function(el1, el2, down, animate, el1Prev) {
		
		//console.log("id1:"+el1.attr("id")+", id2:"+el2.attr("id") + ", animate="+animate)
		if (animate) {
		
			var top1 = el1.position().top,
				top2 = (!down) ? el1Prev.position().top + el1Prev.height() - el1.height() :
								el1Prev.position().top,
				left1 = el1.position().left,
				left2 = el1Prev.position().left;
				
			console.log("top1:"+top1+", top2:"+top2 + ", down="+down)
			
			// create el1-stub
			//var copy1 = el1.clone();	
			//copy1.css("visibility", "hidden");
			//copy1.insertAfter(el1);
			
			var cont = this.createContainer(el1);
			this.trg.append(cont);
			
			el1.css("visibility", "hidden");
			
			//console.log(copy1.height());
			cont.css("top", top1);
			cont.css("left", left1);
			
			cont.addClass("swim");
			el1.position();
			(down) ? el2.insertAfter(el1) : el2.insertBefore(el1);
			//setTimeout(function(){
				cont.css("top", top2);
				cont.css("left", left2);
			//}, 50);
			setTimeout(endMove, 200);
		}
		else {
			(down) ? el2.insertAfter(el1) : el2.insertBefore(el1);
		}
		
		function endMove() {
			el1.css("visibility", "");
			//el1.insertAfter(copy1);
			
			//copy1.remove();
			cont.remove();
		}
	},
	
	createStub : function(el) {
		
		var stub = el.clone();
		//stub.html("");
		stub.css("visibility", "hidden");
		
		return stub;
	},
	
	insertStub : function(stub, el) {
		
		if (el)
			stub.insertAfter(el);
		else
			this.trg.append(stub);
	},
	
	createContainer : function(el, index) {
		
		var pos = el.position(),
			copy = el.clone(),
			cont = el.clone(),
			index = index ? index : 2;
		cont.html("");
		cont.css({
			"height" : el.height(),
			"width" : el.width(),
			"position" : "absolute",
			"z-index" : index,
			"top" : pos.top,
			"left" : pos.left,
		});
		cont.attr("data-cont", "1");
		cont.attr("id", "_container");
		copy.attr("id", "_inContainer");
		
		cont.append(copy);
		
		return cont;
	},
	
	cut : function(el) {
		
		var stub = this.createStub(el);
		var pos = el.position();

		this.insertStub(stub, el);
		
		// put original element in abs-container
		this.srcCont = this.createContainer(el, 3);
		this.trg.append(this.srcCont);

		return stub;
	},
	
	join : function() {
		
		var abs = this.srcCont.css("position") == "absolute";
			pos = abs ? this.src.position() : this.src.offset();
		
		this.srcCont.addClass("swim");
		this.srcCont.css({
			"top" : abs ? pos.top : pos.top - this.ofTop0,
			"left" : pos.left
		});
		var p = this;
		setTimeout(function(){
			p.src.css("visibility", "");
			p.srcCont.remove();
			p.remove();
		},150);
	},
	
	remove: function() {
		//
	},
	
	getNext: function() {
		if ( this.srcI != this.objs.length - 1 ) {
			return this.objs[this.srcI + 1];
		}
	},
}