self.onmessage = function(event) {
	self.postMessage("worker_sum=" + sum());
}
function sum() {
	var time1 = new Date();
	var x = 0;
	for (var i=200000000; i--; ) {
		x += 8888888 * 7777777;
	}
	return (new Date() - time1) + ", res=" + x;
}


