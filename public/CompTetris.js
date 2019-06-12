var CompTetris = {

	yShow : 4,
	
	calculate: function(array, screenW) {
		// create Cols
		var cols = [];
		for (var i=0, len=array.length; i<len; i++) {
			cols.push(this.createCol(array[i]));
		}
		
		if (cols.length > 1) {
			
			var high = this.findHigh(cols);
			var width = this.countWidth(cols);
			while (width > screenW) {
				
				
				cols = this.merge(cols, high, screenW);
				
				newWidth = this.countWidth(cols);
				if (newWidth == width)
					high *= 1.9;
				
				width = newWidth;
			}
		}
		
		return this.getCoords(cols);
	},
	
	findHigh : function(array) {
		var max = 0;
		for (var i=array.length; i--; ) {
			var value = array[i].h;
			if (value > max) 
				max = value;
		}
		return max;
	},
	
	countWidth : function(array) {
		var width = 0;
		for (var i=array.length; i--; ) {
		
			width += array[i].w;
		}
		return width;
	},
	
	createCol : function(obj) {
		return {
			groups : [obj],
			title : obj.title,
			w : obj.w,
			h : obj.h
		};
	},
	
	mergeCols : function(c1, c2) {
	
		for (var g=0, len=c2.groups.length; g<len; g++) 
		{
			var group = c2.groups[g];
			c1.groups.push(group);
			
			c1.h += group.h;
			if (group.w > c1.w) c1.w = group.w;
		}
		return c1;
	},
	
	getColsX : function(cols) {
		
		var coords = [];
		
		// get x
		cols[0].x = 0;
		for (var i=1, len=cols.length; i<len; i++ ) {
			
			cols[i].x = cols[i-1].w + cols[i-1].x;
		}
		return cols;
	},
	
	getCoords : function(cols) {
	
		cols = this.getColsX(cols);
		
		// get y
		var baseY = 1, // start Y-position
			res = [];
		
		for (var i=0, len=cols.length; i<len; i++) {
			
			var col = cols[i],
				y = baseY;
				
			for (var e=0, len2=col.groups.length; e<len2; e++) {
			
				var gg = col.groups[e],
					//deltaY = col.h - this.yShow,
					prevH = e != 0 ? col.groups[e-1].h : 0; // e - порядковый номер группы в столбце (снизу-вверх: 0, 1, ...)
				y += prevH; 
				gg.x = col.x;
				gg.y = y;
				gg.yMin = e+1; // +1 for positioning above scrollbar
				res.push(gg);
			}
		}
		return res;
	},
	
	// one iteration for cols-array
	merge : function(cols, high, screenW) {
	
		var nowWidth = this.countWidth(cols);
		var resCols = [];
		
		while (nowWidth > screenW) {
			
			var c1 = cols[0] || -1,
				c2 = cols[1] || -1;
			
			if (c1 < 0 || c2 < 0) 
				break;
				
			if (!c1.title && !c2.title && c1.h + c2.h <= high) {
				var big = c1.w >= c2.w ? c1 : c2,
					small = big == c2 ? c1 : c2;
				nowWidth -= small.w;
				
				// create new col
				resCols.push(this.mergeCols(big, small));
				
				// delete old col
				cols.splice(0, 2);
			}
			else {
				resCols.push(cols[0]);
				cols.splice(0, 1);
			}
		}
		
		if (cols.length > 0)
			resCols = resCols.concat(cols);
			
		return resCols;
	}
}