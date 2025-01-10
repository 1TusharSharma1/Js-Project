// DOM Elements
const gameBoard = document.getElementById("gameBoard");
const movesCounter = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("bestScore");
const restartButton = document.getElementById("restartButton");
const logoutButton = document.getElementById("logoutButton");

// Game Variables
let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer;
let startTime;
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || '';

// Fetch Users from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

function getUserDetailsByUsername(username) {
    const user = users.find(user => user.username === username);
    return user || null;
}
const userDetails = getUserDetailsByUsername(loggedInUser);
const bestScore = userDetails.bestScore;

console.log("User Details Found:", userDetails);
console.log(bestScore);


function displayBestScore(bestScore) {
  
  const { moves, time } = bestScore;
  if(!moves && !time){
    bestScoreDisplay.textContent = "N/A";
    return;
  }else{
    bestScoreDisplay.textContent = `${moves} moves, ${time}s`;
  }
  
}

function generateCardGrid() {
  const symbols = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍉", "🥝", "🍍"];
  cards = shuffle([...symbols, ...symbols]);
  gameBoard.innerHTML = ""; 

  cards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="card-content">
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      </div>`;
    gameBoard.appendChild(card);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

gameBoard.addEventListener("click", (e) => {
    const clickedCard = e.target.closest(".card");
    console.log(flippedCards,"just after clicking");
    if (
        !clickedCard ||
        flippedCards.includes(clickedCard) ||
        matchedCards.includes(clickedCard)
    ) {
        if(flippedCards.includes(clickedCard)){
            console.log("already flipped");
        }
        return;
    }
  
    flipCard(clickedCard);
    flippedCards.push(clickedCard);
    console.log(flippedCards,"just after pushing");
    if (flippedCards.length == 2) {
      checkForMatch();
    }
    if(flippedCards.length>2){
      console.log(flippedCards,"version 0");
      for(var i=0;i<flippedCards.length-1;i++){
          flippedCards[i].classList.remove("flipped");
      }
      console.log(flippedCards,"version 1");
      flippedCards=[flippedCards[flippedCards.length-1]];
      console.log(flippedCards,"version 2");
    }
    console.log(flippedCards,"just after last line of fn");
    
    
  });
  
  function flipCard(card) {
    card.classList.add("flipped");
  }
  
  function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
      matchedCards.push(card1, card2);
      flippedCards = [];
  
      if (matchedCards.length === cards.length) {
        endGame();
      }
    } else {
      setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          if(flippedCards.length>2){
          flippedCards=[flippedCards[flippedCards.length-1]];
          }else if(flippedCards.length==2){
            flippedCards=[]
          }
      }, 1000);
    }
  
    moves++;
    movesCounter.textContent = moves;
  }
  

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = formatTime(elapsedTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function endGame() {
  stopTimer();
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  alert(`Game Over! You completed the game in ${moves} moves and ${elapsedTime} seconds.`);
  updateUserBestScore(bestScore, moves, elapsedTime);
}

function updateUserBestScore(bestScore, newMoves, newTime) {
  const {moves, time} = bestScore;
  if (!moves || !time || newMoves < moves || newTime < time) {
    bestScore.moves = newMoves;
    bestScore.time = newTime;
    localStorage.setItem("users", JSON.stringify(users));
    displayBestScore(bestScore);
}
}

restartButton.addEventListener("click", () => {
  moves = 0;
  matchedCards = [];
  flippedCards = [];
  movesCounter.textContent = moves;
  timerDisplay.textContent = "00:00";
  stopTimer();
  generateCardGrid();
  startTimer();
  displayBestScore(bestScore);

});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

displayBestScore(bestScore);
generateCardGrid();
startTimer();
