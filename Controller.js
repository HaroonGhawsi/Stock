var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(5000);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/login.html');
});

io.on('connection', function(socket){
    socket.emit(username,{hello: 'world'});
    socket.on(pass, function(userdetails){
        console.log(userdetails);
    });
});