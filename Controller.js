var http=require('http');
var io = require('socket.io');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    if (path=='/Login.html'){
        fs.readFile(__dirname + path, function(error, data){
            if (error){
                response.writeHead(404);
                response.write("opps this doesn't exist - 404");
                response.end();
            }
            else{
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
                response.end();
            }
        });
    };});
server.listen(3000);
var listener = io.listen(server);
listener.sockets.on('connection',function(socket){
    socket.emit('data',{'name':'message from socket io'});

    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
    });
});
