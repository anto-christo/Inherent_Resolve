var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const db = require('./modules/db.js');



//********************Session Code Start*******************************//
//Copy from here
const environment = "production";  ///change it to "production" when the game is deployed on the teknack servers

const sessions = require("client-sessions");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionMiddleware = sessions({
    cookieName: 'sess',
    secret: 'dws9iu3r42mx1zvh6k5m',
    duration: 2 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 60
})

app.use(sessionMiddleware);

app.post("/setSession", function (req, res) {
    req.sess.username = req.body.username;    // username is stored in sess variable
    console.log(req.sess.username + " logged in");  // username can be accessed using req.sess.username
    res.sendStatus(200);
});

app.get("/unsetSession", function (req, res) {
    if (environment == "development") {
        req.sess.username = null;
        res.sendStatus(200);
    } else if (environment == "production") {
        res.sendStatus(400);
    }
});


app.use(function (req, res, next) {
    if (!req.sess.username) {
        let login = `<script>
        var username = prompt("Enter username");
        if (username) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    window.location = "/";
                }
            };
            xhttp.open("POST", "/setSession", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("username=" + username);
        }
    </script>`;
        if (environment == "development") {
            res.send(login);
        } else if (environment == "production") {
            res.redirect('https://teknack.in');
        }
    } else {
        next();
    }
});
//Copy till here
//********************Session Code End*******************************//

//If sockets are used
//Copy the following code to access username inside sockets

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/play',function(req,res){
    res.sendFile(__dirname+'/play.html');
});

app.get('/control',function(req,res){
    res.sendFile(__dirname+'/control.html');
});

server.listen(process.env.PORT || 3018,function(){
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
    socket.on('sendScore', function (score) {
        var username = socket.request.sess.username;
        console.log("username: "+username)
        var record = { name: username, score: score };
        db.insertScore(record);
    })
    socket.on('getHighScore', function () {
        console.log("in get high score")
        db.getScore(function (score) {
            socket.emit('sendHighScore', score);
        })
    })

    console.log(clients);

    socket.emit('newplayer',id[0]);

    socket.on('send_pass',function(data){
        pass = data;
        console.log("send pass="+pass);
    });
    
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

    socket.on('disconnect', function() {
        for(var name in clients) {
          if(clients[name].socket === socket.id) {
            delete clients[name];
            break;
          }
        } 
        socket.conn.close ();
    })

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
