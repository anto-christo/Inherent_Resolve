/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};


function sendPos(x,y){
    console.log("send pos");
  Client.socket.emit('pos_chg',{x:x,y:y});
};

function sendFire(){
    Client.socket.emit('fire');
};
    
Client.socket.on('move',function(data){
    movePlayer(data.x,data.y);
});

Client.socket.on('launch',function(){
    release();
});


//     Client.socket.on('remove',function(id){
//         Game.removePlayer(id);
//     });
// });


