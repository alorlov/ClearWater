var Folder = function() {

}
Folder.prototype = {
	open: function( el ) {
		var sect = $(el).next()[0];
		if(sect && sect.nodeName == "SECTION") {
			$(sect).toggleClass("hide");
		} else {
			var name = $(el).html();
			var root = $(el).attr('data-root');
			
			filename = FileSystem.convertUriToLocalPath(root + "\\" + name);
			var f = FileSystem.dir(filename);
			//console.log(f.dirs.join(', ') + " FILES: " + f.files.join(', '));

			var sect = $("<SECTION></SECTION>");
			for (var d in f.dirs) {
				sect.append("<header id=FFolder data-root='" + filename + "'>"+ f.dirs[d] + "</header>");
			}
			for (var d in f.files) {
				sect.append("<a id=FLink href='#' data-root='" + filename + "'>"+f.files[d] + "</a><br>");
			}
			$(el).after(sect);
		}
	},
	
	hasFile: function( el, type ) {
		var name = $(el).html(),
			root = $(el).attr('data-root');
		
		if ( name.indexOf( type ) >= 0 ) {
			return root + "\\" + name;
		}
		return false;
	},
}