var http = require('http');

var options = {
  host: 'reports.carahsoft.com'
  , path: '/Top5/Data/2--3808206458194258921'
  , port: 443
  , method: 'GET'
}

console.log(JSON.stringify(options));

var request = http.request(options, function(response) {
  var body = "";
	response.setEncoding('utf8');
	console.log("response: "+response);
  response.on('data', function(data) {
    body += data.toString();
    console.log(data.toString());
  })
  response.on('end', function() {
    console.log(body);
  })

});

request.on('error', function(e) {
	console.log(e);
});

request.end();
