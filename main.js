let answers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
let cardObjectsArray = []; //placeholder for all card objects created by constructor
let openCardsArray = []; //placeholder for two open cards
let readyState = true;
let cardsCompleted = 0;
let elapsedTime = 0;
let timeInterval;
let timerStarted = false;
let gameSound = document.createElement("audio");
let fireworksSound = document.createElement("audio");
gameSound.src = "sounds/game-sound.mp3";
fireworksSound.src = "sounds/fireworks.mp3";

/* save user preference of sound on/off to localstorage */
//localStorage.soundSetting = "true";

/* card background colors */
let hiddenCardColor = '#4D9DE0';
let openCardColor = '#E84855';
let completedCardColor = '#3BB273';

/* access elements */
let cardElements = document.getElementsByClassName('panel');
let controlsElement = document.getElementById('controls-box');
let modalElement = document.getElementById('modal');
let soundOnElement = document.getElementById('sound-on');
let soundOffElement = document.getElementById('sound-off');


/* constructor to create object for each card with defaults */
function CardsFactory(cardId, completed, clicked, value) {
    this.cardId = cardId;
    this.completed = completed;
    this.clicked = clicked;
    this.value = value;
}

/* shuffle answers[] array values randomly  */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function revealCard(cardIndex) {
    cardElements[cardIndex].style.backgroundColor = openCardColor;
    cardElements[cardIndex].innerHTML = cardObjectsArray[cardIndex].value;
    cardObjectsArray[cardIndex].clicked = true;
    playGameSound();
}


function hideCard(cardIndex) {
    readyState = false;
    setTimeout(function () {
        cardElements[cardIndex].style.backgroundColor = hiddenCardColor;
        cardElements[cardIndex].innerHTML = "";
        cardObjectsArray[cardIndex].clicked = false;
        openCardsArray = [];
        readyState = true;
    }, 500);

}
 
function compareOpenCards(){
    if (cardObjectsArray[openCardsArray[0]].value === cardObjectsArray[openCardsArray[1]].value) {
        completeMatch(openCardsArray[0]);
        completeMatch(openCardsArray[1]);
        openCardsArray = [];
    } else {
        hideCard(openCardsArray[0]);
        hideCard(openCardsArray[1]);
        openCardArray = [];
    }
}

function completeMatch(cardIndex) {
    cardsCompleted++;
    cardElements[cardIndex].style.backgroundColor = completedCardColor;
    cardObjectsArray[cardIndex].completed = true;
    cardObjectsArray[cardIndex].clicked = true;
/* all cards are matched perfectly, game won */
    if (cardsCompleted === 12) {
        setTimeout(function () {
            clearInterval(timeInterval);
            modalElement.style.display = "block";
            document.getElementById('final-time').innerHTML += +" " + elapsedTime;
            controlsElement.style.display = "none";
        }, 200);
        fireworksSound.play();
        fireworksSound.loop = true;
    }
}

/* timer to record play time in seconds */
function startTimer() {
    if (timerStarted == false) {
        timeInterval = setInterval(function () {
            elapsedTime++;
            document.getElementById("timer").innerHTML = "Time Elapsed : <span class='time'> " + elapsedTime + "</span> seconds";
        }, 1000);
        timerStarted = true;
    }
}

/* play game sound on clicking card  */ 

function playGameSound() {
localStorage.soundSetting ==="false" ? gameSound.pause() : gameSound.play();
}


/* toggle audio buttons background based on soundSetting from local storage */
function toggleSoundBtn(){
if(localStorage.soundSetting === "false"){
    soundOffElement.classList.replace('sound-disabled','sound-selected');
    soundOnElement.classList.replace('sound-selected','sound-disabled');
}
if(localStorage.soundSetting === "true")
{   
    soundOffElement.classList.replace('sound-selected','sound-disabled');
    soundOnElement.classList.replace('sound-disabled','sound-selected');
}
}
 
function restart() {
    document.location.reload();
}

/* entry point */
function loadGame() {
    for (let index = 0; index < cardElements.length; index++) {

        /*create object for each cardElement  */
        if (!cardObjectsArray[index]) {
            cardObjectsArray[index] = new CardsFactory(index, false, false, answers[index]);
        }

        /* add click event handler to each cardElement */
        cardElements[index].addEventListener('click', function () {
            if (!readyState) {
                return;
            }
            startTimer();

            /* add index to openCardsArray[] to compare two clicked cards */
            if (!cardObjectsArray[index].clicked && !cardObjectsArray[index].completed) {
                openCardsArray.push(index);
                revealCard(index);
            }

            /* openCardArray length === 2 compare two cards */
            if (openCardsArray.length === 2) {
                compareOpenCards();
            }
        });
    }
}

/* Event handlers */

document.getElementById('restart').addEventListener('click', () => {
    restart();
    fireworksSound.pause();
});

document.getElementById('play-again').addEventListener('click', () => {
    modalElement.style.display = "none";
    fireworksSound.pause();
    setTimeout(function () {
        restart();
    }, 200);
});

/* close score board modal */
document.getElementById('close').addEventListener('click', () => {
    modalElement.style.display = "none"
    controlsElement.style.display = "block";
    fireworksSound.pause();
});

/* game sound toggle on/off */
document.getElementById('sound-on').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.soundSetting = "true";
    playGameSound();
    toggleSoundBtn();
});

document.getElementById('sound-off').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.soundSetting = "false";
    playGameSound();
    toggleSoundBtn();
})

/* function calls */
shuffleArray(answers);
loadGame();
toggleSoundBtn();