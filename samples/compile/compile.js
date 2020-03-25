
var nelmo = require('../..');
var fs = require('fs');

var filename = process.argv[2];
var code = fs.readFileSync(filename).toString();
var dotpos = filename.lastIndexOf('.');
var outputname = filename.substring(0, dotpos) + '.js';

var jscode = nelmo.compile(code);

fs.writeFileSync(outputname, jscode);


