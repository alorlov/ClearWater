	console.log("scripts load: " + (new Date() - time0));
	
	regular = /^\${([^\:]+):([^\:]+)}$/;
	regular2 = /^\${([^\:]+)}$/;

	var time1 = new Date();
	
	var book = new Government("panelDict", "D:\\Projects\\ClearWater\\CW\\cfg\\dictionary.csv", dict, false);
	
	var government1 = new Government("panelRight", "D:\\Projects\\ClearWater\\CW\\tests\\CR87_FIX.csv", dict, book);
	//var government1 = new Government("panelRight", "D:\\Projects\\ClearWater\\CW\\tests\\ETF_TS1_FIX_CINA.csv", dict, book);
	//var government1 = new Government("panelRight", "D:\\Projects\\ClearWater\\CW\\tests\\Cross_NAT_dirty.csv", dict);
	
	//var government1 = new Government("panelRight", "D:\\Downloads\\zxcv\\comma\\abc\\Instrument Management\\Instrument Protective Parameters\\MaxStopOrders=1\\MaxStopOrders=1.csv", dict);
	government1.show();
	
	//var book = new Government("panelDict", "D:\\Downloads\\zxcv\\comma\\abc\\Instrument Management\\Rules Book Paramater Tables\\CR 070_RB_Equity\\47_Nat.csv", dictLib);
	//book.show();
	
	/*$("#left").click(function(e){
		gov.hide();
		
		book.show();
	});*/
	
	/*
	//var libRoot = "D:\\Downloads\\zxcv\\comma\\BIT_Test Library_20121022",
	var libRoot = "D:\\Downloads\\zxcv\\comma\\abc",
		lib = new LibFolder(libRoot, false),
		dictLib = new Dictionary(),
		govs = [];
	for (var i=0; i<20; i++) {
		var fileFolder = lib.eject();
		console.log(fileFolder);
		govs[i] = new Government("panelDict" + i, fileFolder, dictLib);
	}
	*/
	
	var items = new Items("items", book);
	
	government1.createEvents();
	
	console.log("Script running: " + ((new Date()) - time1));
	
	$('#edit').click(function() {
		var filepath = document.location.href; // Get the current file
		filepath = $.twFile.convertUriToLocalPath(filepath); // Convert the path to a readable format
		var text = $.twFile.load(filepath);
		alert(text);
	});
			
	
	