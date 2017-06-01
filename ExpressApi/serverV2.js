var https = require('https');

https.get('https://reports.carahsoft.com/Top5/Data/2--3808206458194258921', function(res) { 
	var body = '';
	// console.log(res);
	res.setEncoding('utf8');
	
	console.log("headers \n" + JSON.stringify(res.headers));

	res.on('data', function(chunk) {
		body += chunk.toString();
		console.log(" \n chunk \n" + chunk.toString());
	});
	res.on('end', function() {
		console.log(" \n \n body \n" + body);
		console.log(' \n \n end');
	});
}).on('error', function(err) {
	console.log(err);
});
