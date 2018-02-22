var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

var clients = [];

io.on('connection',function(socket){

    var pass = null;

    var long_id = uuidv4();
    var id = long_id.split("-")
    console.log(id[0]);

    clients.push({"socket":socket.id,"pass":id[0]}); 

    socket.on('send_pass',function(data){
        pass = data;
        console.log("send pass="+pass);
    });

    socket.emit('newplayer',id[0]);
    
    socket.on('pos_chg',function(data){
        console.log(clients);
        console.log('click to '+data.x+', '+data.y);

        for(var i in clients){
            console.log(clients[i].pass)
            if(clients[i].pass == pass){
                if(io.sockets.connected[clients[i].socket] != null)
                io.sockets.connected[clients[i].socket].emit('move',{x:data.x, y:data.y});
            }
        }

        //io.sockets.connected[clients[pass].socket].emit('move',{x:data.x, y:data.y});
        //io.emit('move',{x:data.x, y:data.y});

    });

    socket.on('fire',function(){
        io.emit('launch');
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
