let answers = [1, 1, 2, 2, 3, 3, 4, 4, 5,5,6,6];
let hiddenCardColor = '#4D9DE0';
let openCardColor = '#E84855';
let completedCardColor = '#3BB273';
let cardObjArr = []; //placeholder for all card objects created by constructor
let openCardsArr = []; //placeholder for two open cards
let readyState = true;
let cardsCompleted = 0;
let elapsedTime = 0;
let timeInterval;
let timerStarted = false;

/* shuffle answers[] array values randomly  */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/* constructor to create object for each card with defaults */
function CardsFactory(cardId, completed, clicked, value) {
    this.cardId = cardId;
    this.completed = completed;
    this.clicked = clicked;
    this.value = value;
}

/* reveal card on click  */
function revealCard(cardIndex) {
    cardElements[cardIndex].style.backgroundColor = openCardColor;
    cardElements[cardIndex].innerHTML = cardObjArr[cardIndex].value;
    cardObjArr[cardIndex].clicked = true;
}


function hideCard(cardIndex) {
    readyState = false;
    setTimeout(function () {
        cardElements[cardIndex].style.backgroundColor = hiddenCardColor;
        cardElements[cardIndex].innerHTML = "";
        cardObjArr[cardIndex].clicked = false;
        openCardsArr = [];
        readyState = true;
    }, 500);

}

function completeMatch(cardIndex) {
    cardsCompleted++;
    cardElements[cardIndex].style.backgroundColor = completedCardColor;
    cardObjArr[cardIndex].completed = true;
    cardObjArr[cardIndex].clicked = true;
    
    if(cardsCompleted === 12){
        setTimeout(function(){
            alert('you won this game in '+ elapsedTime + ' seconds <button id="reset">Restart</button>' );
            clearInterval(timeInterval);
        },200);
        
    }
}
function startTimer(){
    if (timerStarted == false){
        timeInterval = setInterval(function(){
            elapsedTime++;
            document.getElementById("timer").innerHTML = "Time Elapsed: " + elapsedTime +" seconds";
        },1000);
        timerStarted = true;
}
}
/* reset game */
document.getElementById('reset').addEventListener('click', function () {
    document.location.reload();
});


let cardElements = document.getElementsByClassName('panel');

function loadGame() {
    for (let index = 0; index < cardElements.length; index++) {
        /*object for each cardElement with defaulsts */
        if (!cardObjArr[index]) {
            cardObjArr[index] = new CardsFactory(index, false, false, answers[index]);
        }
       /* add click event handler to each cardElement */
        cardElements[index].addEventListener('click', function () {
            if(!readyState){
                return;
            }
            startTimer();
            if (cardObjArr[index].clicked === false && cardObjArr[index].completed === false){
                openCardsArr.push(index);  /* add index to openCardsArr[] to compare two clicked cards */
                revealCard(index); /* reveal card onclick*/
            }
           
            /* array length === 2 and two cardElements values are equal call completeMatch() otherwise call hideCard() */
            if (openCardsArr.length === 2) {
                if (cardObjArr[openCardsArr[0]].value === cardObjArr[openCardsArr[1]].value) {
                    completeMatch(openCardsArr[0]);
                    completeMatch(openCardsArr[1]); 
                    openCardsArr = [];
                   
                    console.log('perfect');
                } else {
                    hideCard(openCardsArr[0]);
                    hideCard(openCardsArr[1]);
                    openCardArr = [];
                    console.log('try again');
                }
            }
        });


    }
    console.log('game loaded successfully');
}

/* function calls */
shuffleArray(answers);
loadGame();