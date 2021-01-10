
const username = document.getElementById('username');

const mostRecentScore = localStorage.getItem('mostRecentScore');
const finalScore = document.getElementById('finalScore');

const saveScoreBtn = document.getElementById('saveScoreBtn');

const highScores = JSON.parse(localStorage.getItem("highscores")) || [];

const MAX_HIGH_SCORES = 5;

const savedText = document.getElementById("savedScoreText");

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;

});

function saveHighScore(e) {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    };
    highScores.push(score);

    highScores.sort((a, b) => b.score - a.score)
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));

    savedText.classList.remove("hidden");
    setTimeout(() => {
        savedText.classList.add("hidden");
    }, 1500);
};

//math.floor(math.random() * 100)