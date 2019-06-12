var Drag = function (src, srcX0, srcY0, trg, gov) {
	
	var p = this;
	
	this.gov = gov;
	
	this.src = src; // Element under cursor
	this.srcCont; // container for this.src
	this.trg = trg;
	this.stub;
	
	this.heights = [];
	this.middles = [];
	this.objs = [];
	
	this.srcI;

	this.mouseX0 = srcX0;
	this.mouseY0 = srcY0;
	
	this.srcX0 = 0;
	this.srcY0 = 0;
	this.middle0 = 0;
	this.ofTop0 = 0;
	this.calcStartPos(this.src);
	
	this.interval = false;
	this.e;
	this.iterateY = 0;
	this.id = "moveRow";
	
	$(window).mousemove(function(e){
		if (!Timing.ready("govMoveRow", 10)) return false;
		
		p.moveSrc(e);
		Ev.add(p.id, e);
		
		var slow = Math.abs(p.iterateY - e.clientY) < 10 ? true : false;
		
		if (p.start)
			if (Timing.ready(p.id, 200))
				Timing.on(p.id, p.cycle, this, [slow]);

		p.iterateY = e.clientY;
	});
	
	$("#" + p.gov.name).scroll(function(e){
		console.log(p.gov.window.ofTop);
		var delta = p.gov.window.ofTop - p.ofTop0;
		p.calcAfterScroll(delta);
		
		//p.moveSrc(Ev.get(p.id));
	});
	
	$(window).mouseup(function(e){
		p.join();
		$(this).unbind("mouseup");
		$(this).unbind("mousemove");
		$(this).unbind("mousedown");
	});

}

Drag.prototype = {
	
	startMove : function() {
		this.calc();
		this.stub = this.cut(this.src);
		this.start = true;
	},
	
	startCopyOut : function(cont) {
	
		// newEl - element for getting stub in trg block
		this.stub = this.createStub(this.src);
		this.srcCont = cont;
		this.trg.append(this.srcCont);
		this.calcStartPos(this.srcCont);
		
		this.calc();
		
		this.insertStub(this.stub, this.getBefore(this.middle0));
		this.calc();
		this.start = true;
	},
	
	calcStartPos : function(el) {
		this.srcX0 = el.position().left;
		this.srcY0 = el.position().top;
		this.middle0 = el.position().top + el.height() / 2;
		this.ofTop0 = this.gov.window.ofTop;
		console.log(this.srcX0 + ","+this.srcY0+"=top:"+el.position().top);
	},
	
	calcAfterScroll : function(delta) {
		this.srcY0 += delta;
		this.middle0 += delta;
		this.ofTop0 += delta;
	},
	
	cycle : function(animate) {
		
		var e = Ev.get(p.id);
		
		if (!e) return;
		
		var mouse1 = e.clientY;
		var y = p.middle0 + (mouse1 - p.mouseY0);
		
		var newI = p.isMove(y);
		if (newI !== false) {
			p.move(p.objs[newI], p.stub, animate);
			p.recalc(p.srcI, newI);
		}
	},
	
	getBefore : function(y) {

		for (var beforeI=0, len=this.middles.length; beforeI<len; beforeI++) {
			if (this.middles[beforeI] > y)
				break;
		}
		
		return this.objs[beforeI];
	},
	
	calc : function() {
		var middles = [],
			heights = [],
			objs = [],
			srcI,
			srcId = this.src.attr("id");
			p = this;
		this.trg.children().each(function(i, m){
			var m = $(m),
				pos = m.position(),
				offset = m.offset(),
				height = m.height();
			//console.log(pos.top + ", offs:"+ off.top);
			middles[i] = pos.top + height / 2;
			middles2[i] = offset.top + height / 2;
			heights[i] = height;
			objs[i] = m;
			
			if(srcId == m.attr("id"))
				p.srcI = i;
		});
		this.heights = heights;
		this.middles = middles;
		this.objs = objs;
	},
	
	moveSrc : function (e) {
		var xDif = e.clientX - this.mouseX0,
			yDif = e.clientY - this.mouseY0;
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
		this.heights.splice(pos, 0, this.heights[i0]);
		this.objs.splice(pos, 0, this.objs[i0]);
		//console.log("RE2: srcI:"+this.srcI+", newI:" +i1 + " middles:" + this.middles.join(">") + ", pos:"+pos);// delete
		this.middles.splice(posDel, 1);
		this.heights.splice(posDel, 1);
		this.objs.splice(posDel, 1);
		
		this.srcI = i1;
	},
	
	isDown : function (y) {
		
		if (this.srcI == 0)
			return true;
		else if (this.srcI == this.middles.length - 1)
			return false;
		else {
			var srcMid = this.middles[this.srcI];
			if (y > srcMid)
				return true;
			else
				return false;
		}
	},
	
	move : function(el1, el2, animate) {
		
		var top1 = el1.position().top,
			top2 = el2.position().top;
		
		var hid1 = el1.clone();
		
		hid1.css("visibility", "hidden");
		
		hid1.insertAfter(el1);
		el2.insertAfter(hid1);
		
		var cont = this.createContainer(el1);
		this.trg.append(cont);
		
		cont.css("top", top1);
		
		if (animate) {
			cont.addClass("swim");
			setTimeout(function(){
				cont.css("top", top2);
			}, 50);
		}
		
		if (animate)
			setTimeout(endMove, 200);
		else
			endMove();
		
		function endMove() {
			el1.insertAfter(hid1);
			(top1 > top2) ? el2.insertAfter(el1) : el1.insertAfter(el2)

			hid1.remove();
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
		
		cont.append(el);
		
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
		
		var pos = this.stub.position();
		
		this.srcCont.addClass("swim");
		this.srcCont.css({
			"top" : pos.top,
			"left" : pos.left
		});
		var p = this;
		setTimeout(function(){
			p.src.insertAfter(p.stub);
			p.stub.remove();
			p.srcCont.remove();
		},100);
	}
}