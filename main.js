let answers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
let cardObjectsArray = []; //placeholder for all card objects created by constructor
let openCardsArray = []; //placeholder for two open cards
let readyState = true;
let cardsCompleted = 0;
let elapsedTime = 0;
let timeInterval;
let timerStarted = false;
let gameSoundOn = false;

/* card background colors */
let hiddenCardColor = '#4D9DE0';
let openCardColor = '#E84855';
let completedCardColor = '#3BB273';

/* access elements */
let cardElements = document.getElementsByClassName('panel');
let controlsElement = document.getElementById('controls-box');
let gameAudioElement = document.getElementById("game-sound");
let fireworksAudioElement = document.getElementById('fireworks-sound');
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
    gameSoundOn = true;
    cardElements[cardIndex].style.backgroundColor = openCardColor;
    cardElements[cardIndex].innerHTML = cardObjectsArray[cardIndex].value;
    cardObjectsArray[cardIndex].clicked = true;
    playSound(gameAudioElement);
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

function completeMatch(cardIndex) {
    cardsCompleted++;
    cardElements[cardIndex].style.backgroundColor = completedCardColor;
    cardObjectsArray[cardIndex].completed = true;
    cardObjectsArray[cardIndex].clicked = true;

    if (cardsCompleted === 12) {
        setTimeout(function () {
            //alert('you won this game in '+ elapsedTime + ' seconds <button id="reset">Restart</button>' );
            clearInterval(timeInterval);
            modalElement.style.display = "block";
            document.getElementById('final-time').innerHTML += +" " + elapsedTime;
            fireworksAudioElement.play();
            fireworksAudioElement.loop = true;
            controlsElement.style.display = "none";
        }, 200);
    }
}

function startTimer() {
    if (timerStarted == false) {
        timeInterval = setInterval(function () {
            elapsedTime++;
            document.getElementById("timer").innerHTML = "Time Elapsed : <span class='time'> " + elapsedTime + "</span> seconds";
        }, 1000);
        timerStarted = true;
    }
}

function playSound(track) {
    if (gameSoundOn) {
        track.play();
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
        });
    }
}

/* Event handlers */

document.getElementById('restart').addEventListener('click', () => {
    restart();
    fireworksAudioElement.pause();
});

document.getElementById('play-again').addEventListener('click', () => {
    modalElement.style.display = "none";
    fireworksAudioElement.pause();
    setTimeout(function () {
        restart();
    }, 200);
});

document.getElementById('close').addEventListener('click', () => {
    modalElement.style.display = "none"
    controlsElement.style.display = "block";
    fireworksAudioElement.pause();
});

document.getElementById('sound-on').addEventListener('click', function (e) {
    e.preventDefault();
    gameAudioElement.muted = false;
    soundOnElement.classList.toggle('sound-active');
    soundOffElement.classList.toggle('sound-active');
});

document.getElementById('sound-off').addEventListener('click', function (e) {
    e.preventDefault();
    gameAudioElement.muted = true;
    soundOffElement.classList.toggle('sound-active');
    soundOnElement.classList.toggle('sound-active');
})



/* function calls */
shuffleArray(answers);
loadGame();
