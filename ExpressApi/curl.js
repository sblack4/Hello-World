// #!/Program Files/nodejs node

var sys = require('sys');
var exec = require('child_process').exec;

function gets() {
	var arg= '';
	for (var i = 2; i < process.argv.length; i++) {
		arg += process.argv[i].toString() + " ";
	}
	return arg;
}
var arg = gets();

console.log(arg);

function puts(err, stdout, stderr){ 
	if ( err ) console.log("err" + err);
	console.log(JSON.stringify(stdout)) 
	console.log('stderr', stderr);
}
exec(arg, puts);
