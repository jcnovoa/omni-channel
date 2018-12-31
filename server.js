var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
http.createServer(function(req, res) {
  var pathName = url.parse(req.url).pathname;
  fs.readFile(__dirname + pathName, function(err, data){
    if(err){
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          });
          res.write('Page Not Found' + JSON.stringify(err));
          res.end();
       }else{
          res.writeHead(200);
          res.write(data);
          res.end();
       }
  });
}).listen(80);
console.log('Server ready');
