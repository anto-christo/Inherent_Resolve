/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS);
game.state.add('Game',Game);
game.state.start('Game');
game.state.add('Control',Control);