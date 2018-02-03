var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 100/60) };

//create canvas
var canvas = document.createElement('canvas');
var width =  400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

//call animate method
window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

// 1. update objects: the player’s paddle, the computer’s paddle, and the ball
// 2. render objects
// 3. use requestAnimationFrame to call the step function again
var step = function() {
  update();
  render();
  animate(step);
};

//animate ball towards paddle
var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle, scoreComputer, scorePlayer);
  scoreComputer.update();
  scorePlayer.update();
};

// give the computer player a max speed & computer position to center of ball 
Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};

//update position depending on key pressed
Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { //all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}

Ball.prototype.update = function(paddle1, paddle2, score) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 400) { // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > 600) { // a point was scored
    this.x_speed = 0;
    this.y_speed = 3;

    if(this.y < 0) {
      scorePlayer.incrementPlayerScore();
    }
    if(this.y > 600) {
      scoreComputer.incrementComputerScore();
    }
    this.x = 200;
    this.y = 300;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

//build objects & update render function
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);
var scoreComputer = new ScoreComputer();
var scorePlayer = new ScorePlayer();

var render = function() {
  context.fillStyle = "#C6DD73";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
  scoreComputer.render();
  scorePlayer.render();
};

//add paddle object
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
};

//set players x,y coordinates for bottom of screen
function Player() {
  this.paddle = new Paddle(175, 580, 50, 10);
}
//set computers x,y coordinates for top of screen
function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}

// render paddle objects for player and computer
Player.prototype.render = function() {
  context.fillStyle = "#4424D6";
  this.paddle.render();
};

Computer.prototype.render = function() {
  context.fillStyle = "#FC600A";
  this.paddle.render();
};

//create ball object - x,y coordinates = center , radius of 7
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 6;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#110934";
  context.fill();
};

function ScoreComputer() {
  this.computerScore = 0;
}

function ScorePlayer() {
  this.playerScore = 0;
}

ScoreComputer.prototype.update = function() {
  if(this.computerScore === 21) {
    alert("Computer Won!");
    location.reload();
  }
}

ScorePlayer.prototype.update = function() {
  if(this.playerScore === 21) {
    alert("You Won!");
    location.reload();
  }
}

ScoreComputer.prototype.incrementComputerScore = function() {
  this.computerScore++;
}

ScorePlayer.prototype.incrementPlayerScore = function() {
  this.playerScore++;
}

ScoreComputer.prototype.render = function() {
  context.font = "23px Arial";
  context.fillStyle = "#FC600A";
  context.fillText(this.computerScore, 10, 30);
}

ScorePlayer.prototype.render = function() {
  context.font = "23px Arial";
  context.fillStyle = "#4424D6";
  context.fillText(this.playerScore, 10, 585);
}

//update position of paddle
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});
