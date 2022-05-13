let timer = 90;
let runningTimer;
let score = 500;
let username = "";
let qNumber;
let finalScore;
const MAX_HIGH_SCORES = 7;

const startButton = document.getElementById("startButton");
const finishButton = document.getElementById("finishButton");
const qContainer = document.getElementById("questionsContainer");
const qElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const countdown = document.getElementById("timerArea");
const scoreArea = document.getElementById("scoreArea");
const highScoresButton = document.getElementById("showScoresButton");

let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

startButton.addEventListener("click", startGame);
finishButton.addEventListener("click", startGame);
highScoresButton.addEventListener("click", displayScores);
finishButton.classList.add("hide");

function startGame() {
  startButton.classList.add("hide");
  finishButton.classList.add("hide");
  scoreArea.classList.add("hide");
  answerButtons.classList.remove("hide");
  qNumber = 0;
  qContainer.classList.remove("hide");
  scoreArea.innerHTML = "";
  startClock();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  showQuestion(questions[qNumber]);
}

function showQuestion(question) {
  qElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function startClock() {
  countdown.innerHTML = "Time Remaining: " + timer;
  if (timer <= 0) {
    gameOver();
  } else {
    timer -= 1;
    runningTimer = setTimeout(startClock, 1000);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  if (!selectedButton.dataset.correct) {
    timer = timer - 5;
    console.log(timer);
  }
  if (qNumber == questions.length - 1) {
    gameOver();
  } else {
    clearQuestion();
    qNumber++;
    showQuestion(questions[qNumber]);
    console.log(score);
  }
}
function clearQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function gameOver() {
  clearInterval(runningTimer);
  countdown.innerHTML = "Finished";
  clearQuestion();
  showResults();
  finishButton.classList.remove("hide");
  timer = 90;
  score = 0;
}

function showResults() {
  finalScore = timer  * 15;
  if (finalScore < 0) {
    finalScore = 0;
  }
  qElement.innerText = "";
  scoreArea.classList.remove("hide");
  answerButtons.classList.add("hide");
  scoreArea.innerHTML = `Your score is ${finalScore}!<div id="init">Name: <input type="text" name="initials" id="initials" placeholder="Enter Your Name"><button id="save-btn" class="save-btn btn" onclick="submitScores(event)" disabled>Save</button>`;
  username = document.getElementById("initials");
  saveButton = document.getElementById("save-btn");
  username.addEventListener("keyup", function() {
    saveButton.disabled = !username.value;
  });
}

function submitScores(e) {
  const score = {
    score: finalScore,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayScores();
}

function displayScores() {
  clearInterval(runningTimer);
  countdown.innerHTML = "";
  clearQuestion();
  qElement.innerText = "";
  scoreArea.classList.remove("hide");

  scoreArea.innerHTML = `<h2>High Scores</h2><ul id="highScoresList"></ul><button id="clearScores" class="btn" onclick="clearScores()">Clear Scores</button>`;
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="scoresList">${score.name} - ${score.score}</li>`;
    })
    .join("");
  startButton.classList.remove("hide");
  highScoresButton.classList.add("hide");
}

function clearScores() {
  highScores = [];
  highScoresList.innerHTML = "<h3>Scores have been Cleared</h3>";
  document.getElementById("clearScores").classList.add("hide");
}

const questions = [
  { //1
    question: "What is the highest mountain in France?",
    answers: [
      { text: "Everest", correct: false },
      { text: "Mont Blanc", correct: true },
      { text: "La Tournette", correct: false },
      { text: "Djebel Chambi", correct: false }
    ]
  },
  {//2
    question: "France is home to the world largest museum. Which one is it?",
    answers: [
      { text: "Bardou", correct: false },
      { text: "Army museum", correct: false },
      { text: "Eiffel Tower", correct: false },
      { text: "Louvre Museum", correct: true }
    ]
  },
  {//3
    question: "What colours can you find on the French flag?",
    answers: [
      { text: "bleu-white-red", correct: true },
      { text: "yellow-red-black", correct: false},
      { text: 'red-white-bleu', correct: false },
      { text: 'green-white-red', correct: false },
    ]
  },
  {//4
    question: 'Which city was the capital of France from 1417 to 1422?',
    answers: [
      { text: 'Tournai', correct: true },
      { text: 'Paris', correct: false },
      { text: 'Toulouse', correct: false },
      { text: 'Lyon', correct: false }
    ]
  },
  {//5
    question: "Who was the president of France in 2000?",
    answers: [
      { text: "François Mitterrand ", correct: false },
      { text: "François Hollande ", correct: false },
      { text: "Jacques Chirac", correct: true },
      { text: "Nicolas Sarkozy", correct: false }
    ]
  },

  {//6
    question: "Who wrote “Les Misérables”?",
    answers: [
      { text: "George Sand", correct: false },
      { text: "Charles Baudelaire", correct: false },
      { text: "Victor Hugo", correct: true },
      { text: "Simone de Beauvoir", correct: false }
    ]
  }
];
