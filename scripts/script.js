// Selecteert het HTML-element waar het woord wordt weergegeven
const wordDisplay = document.querySelector(".word-display");

// Selecteert het element waar het aantal gokpogingen wordt weergegeven
const guessesText = document.querySelector(".guesses-text b");

// Selecteert het element waar de toetsen (knoppen) worden geplaatst
const keyboardDiv = document.querySelector(".keyboard");

// Selecteert de afbeelding van de galg
const hangmanImage = document.querySelector(".hangman-box img");

// Selecteert het eindscherm (gewonnen/verloren)
const gameModal = document.querySelector(".game-modal");

// Selecteert de knop om opnieuw te spelen
const playAgainBtn = gameModal.querySelector("button");

// Variabelen voor het spel
let currentWord, correctLetters, wrongGuessCount;

// Aantal foutpogingen dat maximaal mag
const maxGuesses = 6;

// Functie om het spel te resetten
const resetGame = () => {
    // Zet juiste letters terug naar leeg
    correctLetters = [];
    // Zet fouten op nul
    wrongGuessCount = 0;
    // Zet de galg-afbeelding terug naar het begin
    hangmanImage.src = "img/hangman-0.svg";
    // Update de goktekst naar 0 / max
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    // Toon lege vakjes voor elk letter van het woord
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    // Zorg dat alle toetsen weer aanklikbaar zijn
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    // Verberg het eindscherm
    gameModal.classList.remove("show");
}

// Functie om een willekeurig woord en hint te kiezen
const getRandomWord = () => {
    // Kies een willekeurig item uit de woordlijst
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    // Sla het gekozen woord op in de variabele
    currentWord = word;
    // Zet de hint in het HTML-element
    document.querySelector(".hint-text b").innerText = hint;
    // Reset het spel met het nieuwe woord
    resetGame();
}

// Functie om spel te beëindigen (gewonnen of verloren)
const gameOver = (isVictory) => {
    // Bepaal de tekst op basis van winst of verlies
    const modalText = isVictory ? `Je hebt het woord gevonden:` : 'Het juiste woord was:';
    // Verander het plaatje naar een overwinning of verlies
    gameModal.querySelector("img").src = `img/${isVictory ? 'victory' : 'lost'}.gif`;
    // Zet de titel in het scherm (Gefeliciteerd of Game Over)
    gameModal.querySelector("h4").innerText = isVictory ? 'Gefeliciteerd!' : 'Game Over!';
    // Toon het woord dat geraden of gemist is
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    // Laat het eindscherm zien
    gameModal.classList.add("show");
}

// Functie die wordt aangeroepen bij elke klik op een toets
const initGame = (button, clickedLetter) => {
    // Controleer of de aangeklikte letter in het woord zit
    if(currentWord.includes(clickedLetter)) {
        // Loop door elk karakter in het woord
        [...currentWord].forEach((letter, index) => {
            // Als de letter klopt, toon hem op de juiste plek
            if(letter === clickedLetter) {
                // Voeg de letter toe aan de lijst van correcte letters
                correctLetters.push(letter);
                // Vul de letter in in het juiste vakje
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                // Voeg een klasse toe voor opmaak (bv. groene kleur)
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Verkeerde letter, verhoog het aantal fouten
        wrongGuessCount++;
        // Verander de afbeelding van de galg
        hangmanImage.src = `img/hangman-${wrongGuessCount}.svg`;
    }

    // Zet de knop uit zodat je er niet nog eens op kunt klikken
    button.disabled = true;

    // Update de tekst van het aantal gemaakte fouten
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Als het maximum aantal fouten is bereikt, verlies
    if(wrongGuessCount === maxGuesses) return gameOver(false);

    // Als alle letters geraden zijn, win
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Maak knoppen voor elke letter van het alfabet
for (let i = 97; i <= 122; i++) {
    // Maak een knop
    const button = document.createElement("button");
    // Zet de letter (a-z) als tekst in de knop
    button.innerText = String.fromCharCode(i);
    // Voeg de knop toe aan het toetsenbord
    keyboardDiv.appendChild(button);
    // Voeg een klikgebeurtenis toe aan de knop
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// Start het spel met een willekeurig woord
getRandomWord();

// Als je op opnieuw spelen klikt, start een nieuw spel
playAgainBtn.addEventListener("click", getRandomWord);
