// trim 7
String.prototype.trim = function() {
	var str = this.replace(/^\s+/, "");
	end = str.length - 1, 
	ws = /\s/;
	while (ws.test(str.charAt(end))) { 
		end--;
	}
	return str.slice(0, end + 1);
}

function showMessage(msg, time) {
	
	if (!time)
		time = 3000;
	
	var box = $("#_message");
	box.html(msg);
	box.fadeIn(150);
	setTimeout(function() {
		
		box.fadeOut();
	}, time);
}
function addCSSRule(selector, newRule) {
	document.querySelector("style").innerHTML += selector + " { " + newRule + "; }";
	return;
	var sheet = document.styleSheets[0];
	if (sheet.addRule) {
		sheet.addRule(selector, newRule);
	} else {
		ruleIndex = sheet.cssRules.length;
		sheet.insertRule(selector + '{' + newRule + ';}', ruleIndex);
	} 
}