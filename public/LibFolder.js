var LibFolder = function(dir, parent) {
	this.parent = parent;
	this.dirname = dir;
	this.dirs = []
	this.files = []
	this.ejectedDirs = 0;
	this.ejectedFiles = 0;
	this.finishedDirs = [];
	this.full = false;
	
	this.createDirs();
}

LibFolder.prototype = {

	createDirs : function() {
	
		filename = FileSystem.convertUriToLocalPath(this.getFullDirname(false));
		var f = FileSystem.dir(filename);
		
		// get dirs and create self-same objects
		for (var i=0, len=f.dirs.length; i<len; i++) {
			this.dirs[i] = new LibFolder(f.dirs[i], this);
		}
		
		// get csv
		for (var i=0, len=f.files.length; i<len; i++) {
			var file = f.files[i];
			if (file.indexOf(".csv") < 0)
				continue;
			this.files.push(file);
		}
	},
	
	eject : function() {
		
		// 1. get csv if it's the first time
		if (this.ejectedFiles == 0 && this.files.length)
			return this.ejectNextFile();
		
		while (!this.isFinished()) {
			// if ejectedDirs full or finished
			if (this.isDirsEjected()) {
				
				// clean for new cycle
				if (!this.isDirsFinished())
					this.cleanEjectedDirs();
				
				// eject file which non-ejected
				if (!this.isFilesFinished()) 
					return this.ejectNextFile();
			}
			else {
				
				var dir = this.ejectedDirs++;
				
				// get child-csv
				if (!this.isDirFinished(dir)) {
				
					var fname = this.dirs[dir].eject();
					if (fname)
						return fname;
					else
						this.finishDir(dir);
				}
			}
		}
		
		return false;
	},
	
	ejectNextFile : function() {
		var fNum = this.ejectedFiles++;
		return this.getFullDirname(fNum);
	},
	
	finishDir : function(dNum) {
		this.finishedDirs[dNum] = true;
	},
	
	isDirsEjected : function() {
		return (this.ejectedDirs == this.dirs.length || !this.dirs.length) ? true : false;
	},
	
	isDirFinished : function(dNum) {
		return this.finishedDirs[dNum] ? true : false;
	},
	
	isDirsFinished : function() {
	
		if (!this.dirs.length)
			return true;
		
		for (var i=0, len = this.dirs.length; i<len; i++) {
			if (!this.isDirFinished(i))
				return false;
		}
		return true;
	},
	
	isFilesFinished : function() {
		return this.ejectedFiles == this.files.length ? true : false;
	},
	
	isFinished : function() {
	
		if (this.full)
			return true;
			
		if (this.isDirsFinished() && this.isFilesFinished()) {
			
			this.full = true;
			return true;
		}
		
		return false;
	},
	
	cleanEjectedDirs : function() {
		this.ejectedDirs = 0;
	},
	
	getFullDirname : function(fileNum) {
	
		var dirname = "";
		
		if (this.parent)
			dirname += this.parent.getFullDirname(false);
		
		dirname += this.parent != false ? "\\" + this.dirname
										: this.dirname;
		
		var fname = fileNum !== false ? "\\" + this.files[fileNum] : "";
		
		return dirname + fname;
	}
}