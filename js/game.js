var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

var keyboard = 0;
var mobile = 0;

var Client = {};
Client.socket = io.connect();

var password = null;

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

function preload(){
    game.load.image('enter','assets/sprites/enter.png');
    game.load.image('key','assets/sprites/key.png');
    game.load.image('mobile','assets/sprites/mobile.png');
    game.load.image('play','assets/sprites/play.png');
    game.load.image('control','assets/sprites/control.png');
    game.load.image('lp','assets/sprites/lp1.png');
}


function create(){

    key = game.add.button(game.world.centerX-300, game.world.centerY-200, 'key', with_key);
    mobile = game.add.button(game.world.centerX+300, game.world.centerY-200, 'mobile', with_mobile);
    key_play = game.add.button(game.world.centerX-300, game.world.centerY+150, 'play', with_key);
    mobile_play = game.add.button(game.world.centerX+300, game.world.centerY+150, 'play', with_mobile);

    key.anchor.setTo(0.5,0.5);
    mobile.anchor.setTo(0.5,0.5);
    key_play.anchor.setTo(0.5,0.5);
    mobile_play.anchor.setTo(0.5,0.5);

    key.scale.setTo(0.25,0.25);
    mobile.scale.setTo(0.15,0.15);
}

function with_key(){
    keyboard = 1;
    game.scale.startFullScreen(false);
    game.state.start('gameState2');
}

function with_mobile(){
    mobile = 1;
    game.scale.startFullScreen(false);
    game.state.start('gameState2');
}

function update(){

    var style = { font: "25px Arial", fill: "#ffffff" };

    text1 = game.add.text(game.world.centerX-300, game.world.centerY-50, 'Play using keyboard', style);
    text2 = game.add.text(game.world.centerX-300, game.world.centerY, 'CTRL -> Drop Bomb on Tents:', style);
    text3 = game.add.text(game.world.centerX-300, game.world.centerY+50, 'SPACE -> UP',style);
    text1.anchor.setTo(0.5,0.5);
    text2.anchor.setTo(0.5,0.5);
    text3.anchor.setTo(0.5,0.5);

    text1 = game.add.text(game.world.centerX+300, game.world.centerY-50, 'Visit ir.teknack.in/control in your mobile device.', style);
    text2 = game.add.text(game.world.centerX+300, game.world.centerY, 'Enter Password :' + password,style);
    text3 = game.add.text(game.world.centerX+300, game.world.centerY+50, 'Final score + 20% if controlled with mobile',style);
    text1.anchor.setTo(0.5,0.5);
    text2.anchor.setTo(0.5,0.5);
    text3.anchor.setTo(0.5,0.5);

    text1 = game.add.text(game.world.centerX, game.world.height-50, 'Works best on Mozilla Firefox', style);
    text1.anchor.setTo(0.5,0.5);
}


function preload2(){
    game.load.spritesheet('heli','assets/sprites/heli.png',423,150);
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

    score = 0;

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);


    heli = game.add.sprite(100,100,'heli');

    game.physics.arcade.enable(heli);

    heli.body.gravity.y = 800;

    heli.anchor.setTo(0.5,0.5);
    heli.body.setSize(350,150,0,0);
    heli.scale.setTo(0.35,0.35);
    heli.body.collideWorldBounds=true;

    weapon = game.add.weapon(1, 'bullet');

    weapon.bullets.setAll('scale.x', 0.1);
    weapon.bullets.setAll('scale.y', 0.06);
    weapon.bullets.setAll('body.setsize.x',50);
    weapon.bullets.setAll('body.setsize.y',6);


    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    weapon.bulletAngleOffset = 90;

    weapon.bulletSpeed = -600;
    weapon.trackSprite(heli, 0, 0);

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

        if(count==4){
            console.log("in count 8");
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

    houses = game.add.group();
    houses.enableBody = true;
    houses.physicsBodyType = Phaser.Physics.ARCADE;


    loop_hide = setInterval(function(){
        var xpos = game.rnd.integerInRange(game.world.width+10, game.world.width+300);

        var house = houses.create(xpos, game.world.height - 70, 'house');
        house.anchor.setTo(0.5,0.5);
        house.body.setSize(450,400,80,0);
        house.scale.setTo(0.3,0.3);
        house.body.velocity.x = -200;

    },6000);

    score_timer = setInterval(function(){
        inc_score();
    },1000);

    scoreText = game.add.text(30, 30, 'SCORE: ' + score, { fontSize: '15px', fill: '#FFFF00' });

    if(keyboard==1){
        cursors = game.input.keyboard.createCursorKeys();

        fireButton = game.input.keyboard.addKey(Phaser.KeyCode.CONTROL);
        jumpButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    }

}


function missileOut(missile) {

        var ypos = game.rnd.integerInRange(10, game.world.height-150)
        missile.reset(game.world.width + 10, ypos);

        missile.body.velocity.x = -600;

}

function impact(heli, missile){

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

    hit.play();
  
    blast.x = house.x;
    blast.y = house.y;

    blast.visible = true;
    blast.animations.play('expl');

    house.destroy();

    setTimeout(function(){
        blast.visible = false;
    },1000);

    score+=50;    
}

function update2(){

    game.physics.arcade.overlap(heli, missiles, impact, null, this);
    game.physics.arcade.collide(heli, ground, impact_g, null, this);
    game.physics.arcade.collide(weapon.bullets, houses, impact_h, null, this);


    ground.body.velocity.x = -200;

    if(ground.x < -50){
        ground.reset(0,game.world.height - 70);

        ground.body.velocity.x = -200;
    }

    if(keyboard == 1){
        if(fireButton.isDown){
            weapon.fire();
        }

        if(jumpButton.isDown){
                heli.body.gravity.y = 0;
                heli.body.velocity.y = -300;
                heli.body.gravity.y = 800;
        }
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

        if(y<0){
            heli.body.gravity.y = 0;
            heli.body.velocity.y = -300;
            heli.body.gravity.y = 800;
        }
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

    up.anchor.setTo(0.5,0.5);
    fire.anchor.setTo(0.5,0.5);

    up.scale.setTo(3,3);
    fire.scale.setTo(1,1);
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

function goHome(){
    console.log("home");
    location.href = "http://localhost:3000";
}

function goReplay(){
    console.log("replay");
    game.state.start('gameState2');
}

function create4(){

    clearInterval(loop_hide);
    game.scale.stopFullScreen();

    scoreTextf = game.add.text(game.world.centerX, 20, 'Current Score: '+score, { fontSize: '32px', fill: '#FFF'});
    scoreTextf.anchor.setTo(0.5,0.5);

    var home = game.add.button(50, 50 , 'home', goHome);

    var replay = game.add.button(game.world.width-100, game.world.height-100 , 'replay', goReplay);

    Client.socket.emit('sendScore',score);
    Client.socket.emit('getHighScore')
    Client.socket.on('sendHighScore', function(data){

        game.add.text(350, 200, "Rank", { fontSize: '30px', fill: '#FFF'});
        game.add.text(650, 200, "Name", { fontSize: '30px', fill: '#FFF'});
        game.add.text(950, 200, "Score", { fontSize: '30px', fill: '#FFF'});
        for(var i=0; i<data.length; i++){
            game.add.text(350,i*50 +250, i+1 , { fontSize: '30px', fill: '#FFF'});
            game.add.text(650,i*50 +250, data[i].name, { fontSize: '30px', fill: '#FFF'});
            game.add.text(950,i*50 +250, data[i].score, { fontSize: '30px', fill: '#FFF'});
        }
    });
    home.scale.setTo(0.4,0.4);
    replay.scale.setTo(0.4,0.4);

}

function update4(){

}