document.addEventListener("DOMContentLoaded", function () {
    // Hämta referenser till olika HTML-element från deras ID
    // Globala variabler för alla dom-element
    const gameForm = document.getElementById("game-form"); // Formuläret för spelet
    const playerNameInput = document.getElementById("player-name-input"); // Textinmatningsfält för spelarens namn
    const startGameBtn = document.getElementById("start-game-btn"); // Knapp för att starta spelet
    const gameContainer = document.getElementById("game-container"); // Kontainer för själva spelet
    const playerName = document.getElementById("player-name"); // Visning av spelarens namn
    const playerScore = document.getElementById("player-score"); // Visning av spelarens poäng
    const rockBtn = document.getElementById("rock-btn"); // Knapp för att välja sten
    const paperBtn = document.getElementById("paper-btn"); // Knapp för att välja papper
    const scissorsBtn = document.getElementById("scissors-btn"); // Knapp för att välja sax
    const result = document.getElementById("result"); // Resultatet av spelet visas här
    const restartGameBtn = document.getElementById("restart-game-btn"); // Knapp för att starta om spelet

    // Deklarera och initiera variabler för spelarens val och poäng
    let playerChoice = ""; // Variabel för spelarens val
    let playerPoints = 0; // Variabel för spelarens poäng

    // Lyssna på händelsen "submit" för formuläret
    gameForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Förhindra standard beteende för att skicka formuläret

        const name = playerNameInput.value; // Hämta värdet från textinmatningsfältet för spelarens namn
        if (name) {
            playerName.textContent = name; // Visa spelarens namn i DOM:en
            gameContainer.style.display = "block"; // Visa spelet genom att ändra display-egenskapen för kontainern
            startGameBtn.disabled = true; // Inaktivera startknappen
        }
    });

    // Funktion för att generera datorns val
    function generateComputerChoice() {
        const choices = ["Sten", "Sax", "Påse"]; // En array med möjliga val för datorn
        const randomIndex = Math.floor(Math.random() * choices.length); // Slumpmässigt index för att välja ett val
        return choices[randomIndex]; // Returnera det slumpade valet
    }

    // Funktion för att uppdatera poängen i DOM:en
    function updateScores() {
        playerScore.textContent = `${playerName.textContent}: ${playerPoints}`; // Visa spelarens poäng
    }

    // Funktion för att avsluta spelet
    function endGame() {
        rockBtn.disabled = true;
        paperBtn.disabled = true;
        scissorsBtn.disabled = true;
        restartGameBtn.style.display = "block";

        // *****************************************************************************************

        // Uppdatera highscore-listan endast om datorn har vunnit
        if (computerWins) {
            fetchHighscores();
        }
        // *****************************************************************************************

    }

    // Funktion för att spela en runda
    function playRound(playerChoice) {
        const computerChoice = generateComputerChoice();
        result.textContent = `Ditt val: ${playerChoice} | Datorns val: ${computerChoice}`;

        if (playerChoice === computerChoice) {
            result.textContent += " | Oavgjort! Runda spelas igen.";
        } else if (
            (playerChoice === "Sten" && computerChoice === "Sax") ||
            (playerChoice === "Sax" && computerChoice === "Påse") ||
            (playerChoice === "Påse" && computerChoice === "Sten")
        ) {
            playerPoints++;
            result.textContent += " | Du vinner rundan!";
        } else {
            result.textContent += " | Datorn vinner rundan. Spelet är avslutat.";
            computerWins = true; // Markera att datorn har vunnit

            // När en omgång är klar och du vill spara spelarens poäng:
            const player = {
                name: playerName.textContent,
                score: playerPoints,
            };
            console.log(player);
            newPlayer(player);

            endGame(); // Anropa funktionen för att avsluta spelet och uppdatera highscore-listan

        }

        updateScores();
    }



    // Lägger till en händelselyssnare för knappen med id "rockBtn"
    rockBtn.addEventListener("click", function () {
        playRound("Sten");
    });

    // Lägger till en händelselyssnare för knappen med id "paperBtn"
    paperBtn.addEventListener("click", function () {
        playRound("Påse");
    });

    // Lägger till en händelselyssnare för knappen med id "scissorsBtn"
    scissorsBtn.addEventListener("click", function () {
        playRound("Sax");
    });

    // Lägger till en händelselyssnare för knappen med id "restartGameBtn"
    restartGameBtn.addEventListener("click", function () {
        location.reload(); // Ladda om sidan när knappen klickas på
    });
});



// *****************************************************************************************

// Funktion för att visa highscoren i DOM:en
function renderHighscores(highscores) {
    const highscoreList = document.getElementById('highscore-list');

    // Sortera highscores i fallande ordning
    highscores.sort((a, b) => b.score - a.score);

    // Begränsa listan till topp 5 highscores
    const top5Highscores = highscores.slice(0, 5);

    // Visa highscoren i listan
    highscoreList.innerHTML = '';
    top5Highscores.forEach((highscore, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${highscore.name}: ${highscore.score}`;
        highscoreList.appendChild(listItem);
    });
}

// Funktion för att hämta highscore-data från backend och uppdatera DOM
function fetchHighscores() {
    fetch('http://localhost:4000/highscore')
        .then(response => response.json())
        .then(data => {
            // Anropa renderHighscores med den hämtade datan
            renderHighscores(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


async function newPlayer(player) {
    try {
        const response = await fetch('http://localhost:4000/highscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player),
        });

        if (response.ok) {
            const newHighscores = await response.json();
            renderHighscores(newHighscores); // Uppdatera highscore-listan i DOM:en med de nya highscores
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Anropa fetchAndUpdateHighscores för att hämta och uppdatera highscore-data när sidan laddas
fetchHighscores();