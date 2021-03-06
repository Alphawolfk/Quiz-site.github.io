const question = document.getElementById("question");

const choices = Array.from(document.getElementsByClassName("choice-text"));

const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');

const progressBarFull = document.getElementById('progressBarFull');


const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

var myArray = ['https://opentdb.com/api.php?amount=10&category=22&type=multiple',
'https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple',
'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple',
'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple',
'https://opentdb.com/api.php?amount=10&category=30&difficulty=easy&type=multiple'
];

var randomLink = myArray[Math.floor(Math.random()*myArray.length)];

fetch(randomLink)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
            return formattedQuestion;

        });

        startGame();
    }).catch(err => {
        console.error(err);
    });

//constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;


function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

function getNewQuestion() {

    if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("./end.html");
    }

    questionCounter++;
    progressText.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`;
    //update the bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};


var timer;
var myTimer;
var minutes, seconds;

function startTimer(duration, display) {
    timer = duration

    myTimer = setInterval(function () {

        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            getNewQuestion();
        }
    }, 1000);
}

var fiveMinutes = 60 * 1.5;
var display = document.querySelector('#time');
window.onload = function () {

    startTimer(fiveMinutes, display);
}

function resetTimer() {
    clearInterval(myTimer);
    startTimer(fiveMinutes, display);

}


choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        console.log(currentQuestion.answer);
        document.getElementById("myspan").innerHTML = currentQuestion.answer;

        if (classToApply == 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        correctAnswer.classList.remove("hidden");

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
            correctAnswer.classList.add("hidden");
            resetTimer();
        }, 1500);
    });

    function incrementScore(num) {
        score += num;
        scoreText.innerText = score;
    }
});