const inputBox = document.getElementById("input-box");
const operationsContainer = document.getElementById("operations-container");
const play = document.querySelector('.play');
const pause = document.querySelector('.pause');
const playButton = document.querySelector('.circle__btn');
const wave1 = document.querySelector('.circle__back-1');
const wave2 = document.querySelector('.circle__back-2');
const circle = document.querySelector('.circle-shake-animation');
const countDownTimer = document.getElementById("countdown-timer");
let maxOperandNumber = 12;
let countDownTimerIntervalId;


const toggleBlurAllElements = (idsToIgnore = [], blurHeadElement = false, blurBodyElement = false) => {
    const allElements = document.querySelectorAll('*');
    let elementsToIgnore = [];
    // Add the elements and all its descendants to the array of elements we should ignore
    for (const idToIgnore of idsToIgnore) {
        const elementToIgnore = document.getElementById(idToIgnore);
        // Set them to NOT get blurred
        elementToIgnore.classList.add("ignore-blur");
        document.getElementById(idToIgnore).querySelectorAll('*').forEach((element) => {
            element.classList.add("ignore-blur");
            elementsToIgnore.push(element);
        });
    }
    // Blur all the elements that don't have the .ignore-blur class.
    for (const element of allElements) {
        if (!blurHeadElement && element.contains(document.head)) {
            continue;
        }
        if (!blurBodyElement && element.contains(document.body)) {
            continue;
        }
        if (!element.classList.contains("ignore-blur")) {
            if (!element.style.filter.includes("blur")) {
                element.style.filter = "blur(3rem)";
            } else {
                element.style.filter = "none";
            }
        }
    }
    // Remove the ignore blur from the elements we've already ignored since we're done blurring the ones we want.
    for (const element of elementsToIgnore) {
        element.classList.remove("ignore-blur");
    }
};

toggleBlurAllElements(["nav"]);

/**
 * Toggles play button animation on or off
 */
const togglePlayButton = () => {
    pause.classList.toggle('visibility');
    play.classList.toggle('visibility');
    playButton.classList.toggle('shadow');
    wave1.classList.toggle('paused');
    wave2.classList.toggle('paused');
};

const runTimer = () => {
    if (countDownTimer.innerText === "0") {
        inputBox.value = "";
        inputBox.blur();
        togglePlayButton();
        const playAgainButton = document.createElement("div");
        playAgainButton.id = "play-again-button";
        playAgainButton.innerHTML = "<p>Play Again</p>";
        playAgainButton.classList.add("button", "button__primary", "prevent-highlight");
        document.getElementById("nav").after(playAgainButton);
        document.getElementById("play-again-button").addEventListener('click', playAgain);
        toggleBlurAllElements(["play-again-button", "icon", "score"]); // TODO: Not ignoring blur 
        clearInterval(countDownTimerIntervalId);
    } else {
        countDownTimer.innerText -= String(1);
    }
};

const playAgain = () => {
    toggleBlurAllElements(["play-again-button", "icon"]);
    countDownTimer.innerText = String(60); // TODO: get this from settings page
    togglePlayButton();
    inputBox.focus();
    countDownTimerIntervalId = setInterval(runTimer, 1000);
    document.getElementById("play-again-button").remove();
};

playButton.addEventListener('click', async (event) => {
    event.preventDefault();
    togglePlayButton();
    toggleBlurAllElements(["nav"]);
    // Generate random numbers when the page loads
    document.getElementById("left-operand").innerText = String(getRandomNumberBetween(1, maxOperandNumber));
    document.getElementById("right-operand").innerText = String(getRandomNumberBetween(1, maxOperandNumber));
    circle.classList.remove('circle-shake-animation');
    
    if (!wave1.classList.contains('paused')) {
        inputBox.focus();
        countDownTimerIntervalId = setInterval(runTimer, 1000);
    } else {
        inputBox.value = "";
        clearInterval(countDownTimerIntervalId);
    }
});

/**
 * Generates a random number between the lowNumber and the highNumber (inclusive)
 *
 * @param {number} lowNumber the low number to generate from
 * @param {number} highNumber the high number to generate to (inclusive)
 */
const getRandomNumberBetween = (lowNumber, highNumber) => {
    return Math.floor(Math.random() * (highNumber - lowNumber + 1) + lowNumber);
};

// We create this, so we can assign an id for every new speech bubble created. A new speech bubble will be created
// every time the user submits an answer and will be deleted after its animation.
let speechBubblePrefixCount = 0;

/**
 * Plays speech bubble animation
 *
 * @param {string} textToDisplay displays the text inside the speech bubble
 * @param {number} animationDuration indicates how long the speech bubble animation will take
 * @param {string} backgroundColor indicates the background color of the speech bubble
 */
const playSpeechBubbleAnimation = async (textToDisplay, animationDuration, backgroundColor = "#5a5a5a") => {
    const speechBubbleClassNameWithID = `speech-bubble${speechBubblePrefixCount}`;
    operationsContainer.innerHTML += `<div id=${speechBubbleClassNameWithID} class="speech-bubble"></div>`;
    speechBubblePrefixCount++;
    // Restart the prefix count when we reach 10,000. We assume by that time, at least speech-bubble0 is deleted.
    speechBubblePrefixCount = speechBubblePrefixCount > 10000 ? 0 : speechBubblePrefixCount;
    // const speechBubbles = document.getElementsByClassName("speech-bubble");
    const speechBubble = document.getElementById(speechBubbleClassNameWithID);
    speechBubble.style.animationName = "";
    speechBubble.style.animationDuration = "";
    speechBubble.style.backgroundColor = backgroundColor;
    speechBubble.innerHTML = textToDisplay;
    speechBubble.style.animationName = "expand-bounce";
    speechBubble.style.animationDuration = `${animationDuration}s`;
    speechBubble.style.animationName = "shrink";
    setTimeout(() => {
        document.getElementById(speechBubbleClassNameWithID).remove();
    }, 2000);
};

/**
 * Event listener for when a user presses enter after they type in an answer
 */
inputBox.addEventListener("keyup", async (keyboardEvent) => {
    if ((keyboardEvent.key === "Enter" || keyboardEvent.key === "Return") && inputBox.value.length > 0) {
        const leftOperandElement = document.getElementById("left-operand");
        const rightOperandElement = document.getElementById("right-operand");
        const scoreValue = document.getElementById("score-value");
        const answer = Number(rightOperandElement.innerText) * Number(leftOperandElement.innerText);
        const userAnswer = Number(inputBox.value);
        let speechBubbleText;
        let speechBubbleBackgroundColor;
        if (userAnswer === answer) {
            speechBubbleText = "Correct!";
            speechBubbleBackgroundColor = "#2dcb72";
            scoreValue.innerText++;
        } else {
            speechBubbleText = "Wrong!";
            speechBubbleBackgroundColor = "#ef5c5c";
        }
        inputBox.value = "";
        rightOperandElement.innerText = String(getRandomNumberBetween(1, maxOperandNumber));
        leftOperandElement.innerText = String(getRandomNumberBetween(1, maxOperandNumber));
        await playSpeechBubbleAnimation(speechBubbleText, 2, speechBubbleBackgroundColor);
    }
});
