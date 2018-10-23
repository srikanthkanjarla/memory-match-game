const cardValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
const cardObjectsArray = []; // placeholder for all card objects created by constructor
let randomCardValues;
let openCardsArray = []; // placeholder for two open cards
let readyState = true;
let cardsCompleted = 0;
let elapsedTime = 0;
let timeInterval;
let timerStarted = false;

const gameSound = document.createElement('audio');
const fireworksSound = document.createElement('audio');
gameSound.src = 'sounds/game-sound.mp3';
fireworksSound.src = 'sounds/fireworks.mp3';

/* card background colors */
const hiddenCardColor = '#4D9DE0';
const openCardColor = '#E84855';
const completedCardColor = '#3BB273';

/* access elements */
const cardElements = document.getElementsByClassName('panel');
const controlsElement = document.getElementById('controls-box');
const modalElement = document.getElementById('modal');
// const soundToggleElement = document.getElementById('sound-toggle');

/* constructor to create object for each card with defaults */
function CardsFactory(cardId, completed, clicked, value) {
  this.cardId = cardId;
  this.completed = completed;
  this.clicked = clicked;
  this.value = value;
}

/* shuffle answers[] array values randomly  */
function shuffleArray(array) {
  const arr = array;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function playGameSound() {
  if (localStorage.soundSetting === 'true') {
    gameSound.play();
  } else {
    gameSound.pause();
  }
}
function playFireworksSound() {
  if (localStorage.soundSetting === 'true') {
    fireworksSound.play();
    fireworksSound.loop = true;
  }
}

function revealCard(cardId) {
  cardElements[cardId].style.backgroundColor = openCardColor;
  cardElements[cardId].innerHTML = cardObjectsArray[cardId].value;
  cardObjectsArray[cardId].clicked = true;
  playGameSound();
}

function hideCard(cardId) {
  readyState = false;
  setTimeout(() => {
    cardElements[cardId].style.backgroundColor = hiddenCardColor;
    cardElements[cardId].innerHTML = '';
    cardObjectsArray[cardId].clicked = false;
    openCardsArray = [];
    readyState = true;
  }, 500);
}

function completeMatch(cardId) {
  cardsCompleted += 1;
  cardElements[cardId].style.backgroundColor = completedCardColor;
  cardObjectsArray[cardId].completed = true;
  cardObjectsArray[cardId].clicked = true;
  /* all cards are matched perfectly, game won */
  if (cardsCompleted === 12) {
    setTimeout(() => {
      clearInterval(timeInterval);
      modalElement.style.display = 'block';
      document.getElementById('final-time').innerHTML += +' ' + elapsedTime;
      controlsElement.style.display = 'none';
    }, 200);
    playFireworksSound();
  }
}

function compareOpenCards() {
  if (cardObjectsArray[openCardsArray[0]].value === cardObjectsArray[openCardsArray[1]].value) {
    completeMatch(openCardsArray[0]);
    completeMatch(openCardsArray[1]);
    openCardsArray = [];
  } else {
    hideCard(openCardsArray[0]);
    hideCard(openCardsArray[1]);
    openCardsArray = [];
  }
}

/* timer to record play time in seconds */
function startTimer() {
  if (timerStarted === false) {
    timeInterval = setInterval(() => {
      elapsedTime += 1;
      document.getElementById('timer').innerHTML = `Time Elapsed : <span class='time'> ${elapsedTime}</span> seconds`;
    }, 1000);
    timerStarted = true;
  }
}

function runGame() {
  if (!readyState) {
    return;
  }
  startTimer();
  const index = this.id;
  /* add index to openCardsArray[] to compare two clicked cards */
  if (!cardObjectsArray[index].clicked && !cardObjectsArray[index].completed) {
    openCardsArray.push(index);
    revealCard(index);
  }

  /* openCardArray length === 2 compare two cards */
  if (openCardsArray.length === 2) {
    compareOpenCards();
  }
}

/* entry point, create object for each cardElement  */
function loadGame() {
  for (let index = 0; index < cardElements.length; index += 1) {
    if (!cardObjectsArray[index]) {
      cardObjectsArray[cardElements[index].id] = new CardsFactory(
        cardElements[index].id,
        false,
        false,
        randomCardValues[index]
      );
    }
    /* add click event handler to each cardElement */
    cardElements[index].addEventListener('click', runGame);
  }
}

function restart() {
  document.location.reload();
}

/* Event handlers */

document.getElementById('restart').addEventListener('click', () => {
  restart();
  fireworksSound.pause();
});

document.getElementById('play-again').addEventListener('click', () => {
  modalElement.style.display = 'none';
  fireworksSound.pause();
  setTimeout(() => {
    restart();
  }, 200);
});

/* close score board modal */
document.getElementById('close').addEventListener('click', () => {
  modalElement.style.display = 'none';
  controlsElement.style.display = 'block';
  fireworksSound.pause();
});

/* game sound toggle on/off */
document.getElementById('toggle-sound').addEventListener('click', e => {
  if (e.target.checked) {
    localStorage.soundSetting = 'true';
  } else {
    localStorage.soundSetting = 'false';
  }
});
/* update checkbox value based on sound setting from localstorage */
if (localStorage.soundSetting === 'true') {
  document.getElementById('toggle-sound').checked = true;
}
if (localStorage.soundSetting === 'false') {
  document.getElementById('toggle-sound').checked = false;
}
/* function calls */
randomCardValues = shuffleArray(cardValues);
loadGame();
