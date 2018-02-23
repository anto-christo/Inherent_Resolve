var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);


var Client = {};
Client.socket = io.connect();

var password = 'Generating password....';

Client.socket.on('newplayer',function(data){
    console.log("on new");
    
    password = data;
    console.log(password);
});

var gameState1 = function(){
    console.log("gameState1");
}

Client.socket.on('launch',function(){
    release();
});

Client.socket.on('move',function(data){
    movePlayer(data.x,data.y);
});

gameState1.prototype = {
    preload:preload,
    create:create,
    update:update,
};

var gameState2 = function(){
    console.log("gameState2");
}

gameState2.prototype = {
    preload : preload2,
    create : create2,
    update : update2,
    //render:render2,
};


var gameState3 = function(){
    console.log("gameState3");
}

gameState3.prototype = {
    preload : preload3,
    create : create3,
    update : update3,
};


var gameState4 = function(){
    console.log("gameState4");
}

gameState4.prototype = {
    preload : preload4,
    create : create4,
    update : update4,
};


game.state.add('gameState1',gameState1);
game.state.add('gameState2', gameState2);
game.state.add('gameState3', gameState3);
game.state.add('gameState4', gameState4);

game.state.start('gameState1');

//var password = 'Generating password.....';

function preload(){
    // game.load.image('button','assets/sprites/play.png');
    game.load.image('enter','assets/sprites/enter.png');
    game.load.image('control','assets/sprites/control.png');
    game.load.image('lp','assets/sprites/lp1.png');
}


function create(){

    // var height = window.innerHeight;
    // var width = window.innerWidth;

    // landing = game.add.tileSprite(0, 0,width,height, 'lp');

    enter = game.add.button(game.world.centerX, game.world.centerY+100, 'enter', play);
    // control = game.add.button(game.world.centerX, game.world.centerY+200, 'control', control);
    // //button2 = game.add.button(game.world.centerX, game.world.centerY-50, 'button', actionOnClick2);

    // logo = game.add.sprite(game.world.centerX,game.world.centerY-150,'logo');
    // logo.anchor.setTo(0.5,0.5);
    // logo.scale.setTo(0.3,0.3);

    // enter.anchor.setTo(0.5,0.5);
    // enter.scale.setTo(0.6,0.6);

    // control.anchor.setTo(0.5,0.5);
    // control.scale.setTo(0.6,0.6);

   

}

function update(){
    scoreText = game.add.text(30, 30, 'PAIR: ' + password, { fontSize: '30px', fill: '#FFFF00' });
}

function play(){
    console.log("1");
    game.scale.startFullScreen(false);
    game.state.start('gameState2');
}

function control(){
    console.log("2");
    game.state.start('gameState3');
}


function preload2(){
    console.log("pre1");
    game.load.spritesheet('heli','assets/sprites/heli.png',423,150);
    //game.load.image('plane','assets/sprites/jet.png');
    game.load.image('missile','assets/sprites/missile.png');
    game.load.image('ground','assets/sprites/desert.png');
    game.load.image('house','assets/sprites/tent.png');
    game.load.image('bullet','assets/sprites/bomb.png');
    game.load.image('bg','assets/sprites/back2.jpg');
    game.load.audio('rotor','assets/audio/rotor.wav');
    game.load.audio('jetmu','assets/audio/jet_music.mp3');
    game.load.audio('hit','assets/audio/hit.mp3');
    game.load.spritesheet('blast', 'assets/sprites/flame.png',64,64);
}

var heli;
//var plane;
var blast;
var ground;
var cursors;
var fireButton;
var weapon;
var missiles;
var score = 0;
var score_timer;
var houses;
var loop_hide;

function create2(){
    console.log("cre2");

    score = 0;

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //background = game.add.tileSprite(0, 0, window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio, 'bg');


    heli = game.add.sprite(100,100,'heli');

    //plane = game.add.sprite(game.world.width + 600, game.world.centerY, 'plane');
    //missile = game.add.sprite(game.world.width + 600, game.world.centerY + 100, 'missile');

    game.physics.arcade.enable(heli);

    heli.body.gravity.y = 800;

    heli.anchor.setTo(0.5,0.5);
    heli.body.setSize(350,150,0,0);
    heli.scale.setTo(0.35,0.35);
    heli.body.collideWorldBounds=true;

    weapon = game.add.weapon(1, 'bullet');

    //weapon.scale.setTo(0.3,0.3);
    weapon.bullets.setAll('scale.x', 0.1);
    weapon.bullets.setAll('scale.y', 0.06);
    weapon.bullets.setAll('body.setsize.x',50);
    weapon.bullets.setAll('body.setsize.y',6);


    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    weapon.bulletAngleOffset = 90;

    weapon.bulletSpeed = -600;
    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(heli, 0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    rotor = game.add.audio('rotor');
    jetmu = game.add.audio('jetmu');
    hit = game.add.audio('hit');
    rotor.loop = true;
    rotor.play();

    heli.animations.add('anim',[0,1,2,3],30,true);
    heli.animations.play('anim');

    missiles = game.add.group();
    missiles.enableBody = true;
    missiles.physicsBodyType = Phaser.Physics.ARCADE;

    var count = 0;

    var loop = setInterval(function(){
        count++;
        var ypos = game.rnd.integerInRange(10, game.world.height-150);

        var missile = missiles.create(game.world.width + 10, ypos, 'missile');
        missile.anchor.setTo(0.5,0.5);
        missile.body.setSize(2000,500,0,0);
        missile.scale.setTo(0.04,0.04);
        missile.checkWorldBounds = true;
        missile.events.onOutOfBounds.add(missileOut, this);
        missile.body.velocity.x = -600;

        if(count==8){
            clearInterval(loop);
        }

    },1000);

    blast = game.add.sprite(0,0,'blast');

    blast.visible=false;
    blast.animations.add('expl',[0,1,2,3,4,5,6,7,8],10,false);
    blast.scale.setTo(2,2);
    blast.anchor.setTo(0.5,0.5);

    ground = game.add.sprite(0,game.world.height - 70,'ground');
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;
    ground.scale.setTo(3,1);
    ground.enableBody = true;

    // tent = game.add.sprite(100,game.world.height - 100,'tent');
    // game.physics.arcade.enable(tent);
    // tent.body.immovable = true;
    // tent.scale.setTo(0.2,0.2);
    // tent.enableBody = true;

    houses = game.add.group();
    houses.enableBody = true;
    houses.physicsBodyType = Phaser.Physics.ARCADE;


    loop_hide = setInterval(function(){
        var xpos = game.rnd.integerInRange(game.world.width+10, game.world.width+50);

        var house = houses.create(xpos, game.world.height - 70, 'house');
        house.anchor.setTo(0.5,0.5);
        house.body.setSize(450,400,80,0);
        house.scale.setTo(0.3,0.3);
        house.body.velocity.x = -200;

    },3000);

    score_timer = setInterval(function(){
        inc_score();
    },1000);

    scoreText = game.add.text(30, 30, 'SCORE: ' + score, { fontSize: '15px', fill: '#FFFF00' });

}

function render2() {

    // game.debug.bodyInfo(heli, 32, 32);

    // game.debug.body(heli);
    // game.debug.physicsGroup(missiles); 
    // game.debug.physicsGroup(houses); 
    // game.debug.physicsGroup(weapon); 

}


// function render2() {    // call renderGroup on each of the alive members    
//     missiles.forEachAlive(renderGroup, this);
// }

function impact(heli, missile){

    console.log("impacct");

    hit.play();
  
    blast.x = heli.x;
    blast.y = heli.y;

    blast.visible = true;
    blast.animations.play('expl');

    heli.kill();
    missile.visible = false;

    setTimeout(function(){
        blast.visible = false;
    },1000);

    game.camera.shake(0.03, 1000);
    game.camera.shake(0.02, 1000);

    clearInterval(score_timer);
    rotor.stop();

    setTimeout(function(){
        game.state.start('gameState4');
    },1500);
}

function impact_g(heli, ground){

    console.log("impacct");

    hit.play();
  
    blast.x = heli.x;
    blast.y = heli.y;

    blast.visible = true;
    blast.animations.play('expl');

    setTimeout(function(){
        blast.visible = false;
    },1000);

    heli.kill();

    clearInterval(score_timer);
    rotor.stop();

    setTimeout(function(){
        game.state.start('gameState4');
    },1500);

}



function impact_h(weapon, house){

    console.log("impacct");

    hit.play();
  
    blast.x = house.x;
    blast.y = house.y;

    blast.visible = true;
    blast.animations.play('expl');

    house.visible = false;

    setTimeout(function(){
        blast.visible = false;
    },1000);

    score+=50;    
}


function missileOut(missile) {

    setTimeout(function(){
        var ypos = game.rnd.integerInRange(10, game.world.height-150)
        //  Move the alien to the top of the screen again
        missile.reset(game.world.width + 10, ypos);

        //  And give it a new random velocity
        missile.body.velocity.x = -600;
    },1000);

}

function update2(){

    // plane.x -= 20;

    //background.tilePosition.x -= 2;
    game.physics.arcade.overlap(heli, missiles, impact, null, this);
    game.physics.arcade.collide(heli, ground, impact_g, null, this);
    game.physics.arcade.collide(weapon.bullets, houses, impact_h, null, this);

    // if(plane.x == game.world.width+400)
    //     jetmu.play();

    ground.body.velocity.x = -200;

    if(ground.x < -50){
        ground.reset(0,game.world.height - 70);

        //  And give it a new random velocity
        ground.body.velocity.x = -200;
    }

}

function inc_score(){
    score += 10;
    scoreText.text = 'SCORE: ' + score;
}


function release(){
    weapon.fire();
}

function movePlayer(x,y){

        console.log("x="+x+":y="+y);

        if(y<0){
            heli.body.gravity.y = 0;
            heli.body.velocity.y = -300;
            heli.body.gravity.y = 800;
        }


        console.log(heli.x);
        console.log(heli.y);
}

function preload3(){

    game.load.image('up','assets/sprites/up.png');
    game.load.image('down','assets/sprites/down.png');
    game.load.image('left','assets/sprites/left.png');
    game.load.image('right','assets/sprites/right.png');
    game.load.image('fire','assets/sprites/fire.png');
}

function create3(){

    pass = prompt("Enter password");

    send_pass(pass);

    up = game.add.button(game.world.centerX + 200, game.world.centerY + 200 , 'up', up);
    fire = game.add.button(game.world.centerX - 200, game.world.centerY + 200, 'fire', fire);
    // down = game.add.button(game.world.centerX , game.world.centerY, 'down', down);
    // left = game.add.button(game.world.centerX - 200, game.world.centerY, 'left', left);
    // right = game.add.button(game.world.centerX + 200, game.world.centerY, 'right', right);

    console.log(game.input.pointer1);

    up.anchor.setTo(0.5,0.5);
    fire.anchor.setTo(0.5,0.5);

    // down.anchor.set(0.5);
    // left.anchor.set(0.5);
    // right.anchor.set(0.5);

    up.scale.setTo(3,3);
    fire.scale.setTo(1,1);
    // down.scale.setTo(2,2);
    // left.scale.setTo(2,2);
    // right.scale.setTo(2,2);
}

function up(){
    sendPos(0,-1);
}

function fire(){
    console.log("fire click");
    sendFire();
}

function update3(){

}

function preload4(){
    game.load.image('replay','assets/sprites/replay.png');
    game.load.image('home','assets/sprites/home.png');
    game.load.image('replay','assets/sprites/replay.png');
}

// function goHome(){
//     console.log("home");
//     game.state.start('gameState1');
// }

function goReplay(){
    console.log("replay");
    game.state.start('gameState2');
}

function create4(){

    clearInterval(loop_hide);
    game.scale.stopFullScreen();

    scoreTextf = game.add.text(game.world.centerX, game.world.centerY, 'Game Over! \n\n\t\tScore: '+score, { fontSize: '32px', fill: '#FFF'});
    scoreTextf.anchor.setTo(0.5,0.5);

    //var home = game.add.button(50, 50 , 'home', goHome);

    var replay = game.add.button(50, 200 , 'replay', goReplay);
    Client.socket.emit('sendScore',score);
    Client.socket.emit('getHighScore')
    Client.socket.on('sendHighScore', function(data){
        console.log(" in send high score data: "+data)
    });
    home.scale.setTo(0.4,0.4);
    replay.scale.setTo(0.1,0.1);

}

function update4(){

}
