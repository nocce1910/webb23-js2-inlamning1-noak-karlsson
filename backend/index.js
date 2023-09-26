const express = require("express"); //inporterar express från mode_modules
const fs = require("fs");


const app = express();
const port = 4000; // Använd din valda port här
app.use(express.json()); //Tala om at vi ska hantera data i json-format
app.use(function (req, res, next) { // Tillåt requests från alla orgins
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/highscore', (req, res) => {
    console.log('Get request received at /highscore');
    const rawHighscore = fs.readFileSync("./data/highscore.json");
    const highscoreArray = JSON.parse(rawHighscore);
    //console.log(highscoreArray);
    res.send(highscoreArray);
})

app.post('/highscore', (req, res) => {
    const { name, score } = req.body;

    // Läs in den befintliga highscore-arrayen från JSON-filen
    const rawHighscore = fs.readFileSync("./data/highscore.json");
    const highscoreArray = JSON.parse(rawHighscore);

    // Lägg till den nya highscoren i arrayen
    highscoreArray.push({ name, score });

    // Sortera highscore-arrayen i fallande ordning baserat på poäng
    highscoreArray.sort((a, b) => b.score - a.score);

    // Begränsa listan till topp 5 highscores
    const top5Highscores = highscoreArray.slice(0, 5);

    // Spara den uppdaterade highscore-arrayen tillbaka till JSON-filen
    fs.writeFileSync("./data/highscore.json", JSON.stringify(top5Highscores, null, 2));

    // Skicka de topp 5 highscores tillbaka till frontend
    res.status(200).json(top5Highscores);
});

app.listen(4000, () => {
    console.log('Listening on port 4000 ...')
})