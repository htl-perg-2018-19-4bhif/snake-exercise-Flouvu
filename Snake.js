//Variablen
var keypress = require('keypress');
var ansi = require('ansi');

process.stdin.setRawMode(true);
process.stdin.resume();

var cursor = ansi(process.stdout);
var length = 40;
var height = 20;
var applePosX = 0;
var applePosY = 0;
var snakePosX = 2;
var snakePosY = 2;
var direction = 0;

intiPlayGround();
createApple();
startGame();
listenKey();

function intiPlayGround() {Q
    process.stdout.write('\x1Bc');

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < length; x++) {
            if (x === 0 || x === length - 1 || y === 0 || y === height - 1) {
                cursor.bg.grey().write(' ').bg.reset();
            } else {
                cursor.bg.white().write(' ').bg.reset();
            }
        }
        process.stdout.write('\n');
    }
    cursor.bg.reset();
}

function listenKey() {
    keypress(process.stdin);
    process.stdin.on('keypress', function (ch, key) {
        if (key) {
            switch (key.name) {
                case 'right': direction = 0; break;
                case 'left': direction = 1; break;
                case 'up': direction = 2; break;
                case 'down': direction = 3; break;
            }
        }
    });
    process.stdin.setRawMode(true);
}

function startGame() {

    removeSnake();
    
    switch (direction) {
        case 0: snakePosX += 1; break;      //right
        case 1: snakePosX -= 1; break;      //left
        case 2: snakePosY -= 1; break;      //up
        case 3: snakePosY += 1; break;      //down
    }

    placeSnake();

    //Abprüfen ob ein Apfel getroffen wird
    if(snakePosX === applePosX && snakePosY === applePosY){
        createApple();
    }

    //Abprüfen ob die Schlange noch im Spielfeld ist
    if(snakePosY <= 0 || snakePosY >= height || snakePosX <= 0 || snakePosX >= length){
        endGame();
    }
    setTimeout(startGame, 1000 / 3);
}


function createApple() {
    deleteApple();
    applePosX = Math.floor(Math.random() * Math.floor(length - 2) + 1);
    applePosY = Math.floor(Math.random() * Math.floor(height - 2) + 1);
    placeApple();
}

function placeApple() {
    cursor.goto(applePosX + 1, applePosY + 1);
    cursor.bg.red().write(' ').bg.reset();
    process.stdout.write('\x1B[?25l');
}
function deleteApple() {
    cursor.goto(applePosX + 1, applePosY + 1);
    cursor.bg.white().write(' ').bg.reset();

}
function placeSnake() {
    cursor.goto(snakePosX + 1, snakePosY + 1);
    cursor.bg.green().write(' ').bg.reset();
    process.stdout.write('\x1B[?25l');

}
function removeSnake() {
    cursor.goto(snakePosX + 1, snakePosY + 1);
    cursor.bg.white().write(' ').bg.reset();
}

function endGame() {
    cursor.reset();
    cursor.bg.black();
    cursor.fg.red();

    cursor.goto(length / 2 - 3, height / 2);
    process.stdout.write('Game Over');
    cursor.goto(height + 3, height + 3);

    cursor.reset();
    process.exit();
}