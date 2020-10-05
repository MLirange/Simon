window.onload = () => {
  simon();
}

function simon() {
  //Establish arrays to hold game data
  let buttonColors = ['red', 'blue', 'green', 'yellow'];
  let gamePattern = [];
  let playerPattern = [];
  let btnList = document.querySelectorAll('.btn');
  let started = false;
  let score = 0;
  let highScore = 0;
  let speed = 500;

  //Start game on button click
  let startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', e => {
    if (!started) {
      startBtn.textContent = 'Start';
      started = true;
      nextSequence();
    } else {
      gameOver();
    }
  });

  //class to construct buttons
  class Button {
    constructor (id, elem) {
      this.elem = elem;
      this.id = id;
      this.sound = new Audio(`https://www.dumpsterfirema.com/sounds/${id}.mp3`);
    }

    animation = (automated) => {
      this.elem.style.opacity = 0;
      setTimeout(() => {
        this.elem.style.opacity = 1;
      }, 100);
      if (automated) {
        this.sound.currentTime = 0;
        this.sound.play();
      }
    }

    clickEvent = (e) => {
      if (!started) {
        e.preventDefault;
      } else {
        this.sound.currentTime = 0;
        this.sound.play();
        this.animation(false);
        playerPattern.push(this.id);

        checkSequence(playerPattern.length - 1, this);
      }
    }
  }

  let red = new Button('red', document.getElementById('red'));
  let blue = new Button('blue', document.getElementById('blue'));
  let green = new Button('green', document.getElementById('green'));
  let yellow = new Button('yellow', document.getElementById('yellow'));

  let btnObj = {
    red: red,
    blue: blue,
    green: green,
    yellow: yellow
  }

  //Create click event
  btnList.forEach(elem => {
      elem.addEventListener('click', btnObj[elem.id].clickEvent);
  });

  //Update scores and generate next pattern
  function nextSequence() {
    //Switch button to reset
    startBtn.textContent = 'Reset';
    
    //update scores
    score++;
    if (score > highScore) {
      highScore = score;
    }

    //Set current and high scores
    document.getElementById('current-score').textContent = score - 1;
    document.getElementById('high-score').textContent = highScore - 1;

    //empty player pattern for new level
    playerPattern = [];

    //determine next color in sequence
    let randomNumber = Math.floor(Math.random() * 4);
    let randomColor = buttonColors[randomNumber];
  
    gamePattern.push(randomColor);
    setTimeout(playSequence, 750);
  }

  //play current game sequence in order
  function playSequence() {
    if (score % 5 === 0) {
      speed *= 0.8;
    }

    gamePattern.forEach((elem, i) => {
      setTimeout(function() {
        btnObj[elem].animation(true);
      }, i * speed);
    });
  }

  function checkSequence(score, elem) {
    if (gamePattern[score] === playerPattern[score]) {
      if (playerPattern.length === gamePattern.length){
        setTimeout(nextSequence, 300);
      }
    } else {
      elem.sound.pause();
      let wrongAudio = new Audio('https://www.dumpsterfirema.com/sounds/wrong.mp3');
      wrongAudio.play();

      gameOver();
    }
  }

  function gameOver() {
    startBtn.textContent = 'Start';
    score = 0;
    started = false;
    speed = 500;
    gamePattern = [];
    playerPattern = [];
  }
}

