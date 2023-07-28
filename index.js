const inputBox = document.getElementById("input-box");
const operationsContainer = document.getElementById("operations-container");
/* play button */
const play = document.querySelector('.play');
const pause = document.querySelector('.pause');
const playButton = document.querySelector('.circle__btn');
const settingsButton = document.getElementById("icon");
const wave1 = document.querySelector('.circle__back-1');
const wave2 = document.querySelector('.circle__back-2');
const circle = document.querySelector('.circle-shake-animation');
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
/* rate slider */
const sliderBoxContainer = document.querySelector('.slider__box');
const sliderButton = document.querySelector('.slider__btn');
const sliderColor = document.querySelector('.slider__color');
const sliderToolTip = document.querySelector('.slider__tooltip');
/* number picker */
// TODO: Implement these
const decreaseMaxOperandButton = document.getElementById("decrease-max-operand-button");
const increaseMaxOperandButton = document.getElementById("increase-max-operand-button");
const maxOperandInput = document.getElementById("max-operand-input");
const restartGameButton = document.getElementById("restart-game-button");
const countDownTimer = document.getElementById("countdown-timer");
let maxOperandNumber = 12;
let countDownTimerValue = sliderToolTip.innerText;
let countDownTimerIntervalId;
let gameIsOver = true;
// We create this, so we can assign an id for every new speech bubble created. A new speech bubble will be created
// every time the user submits an answer and will be deleted after its animation.
let speechBubblePrefixCount = 0;


const toggleBlurAllElements = (idsToIgnore = [], blurHeadElement = false, blurBodyElement = false) => {
    const allElements = document.querySelectorAll('*');
    let elementsToIgnore = [];
    // Add the elements and all its descendants to the array of elements we should ignore
    for (const idToIgnore of idsToIgnore) {
        const elementToIgnore = document.getElementById(idToIgnore);
        // Set them to NOT get blurred
        try {
            elementToIgnore.classList.add("ignore-blur");
            elementToIgnore.querySelectorAll('*').forEach((element) => {
                element.classList.add("ignore-blur");
                elementsToIgnore.push(element);
            });
        } catch (error) {
            console.log(error);
        }

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
 * Generates a random number between the lowNumber and the highNumber (inclusive)
 *
 * @param {number} lowNumber the low number to generate from
 * @param {number} highNumber the high number to generate to (inclusive)
 */
const getRandomNumberBetween = (lowNumber, highNumber) => {
    return Math.floor(Math.random() * (highNumber - lowNumber + 1) + lowNumber);
};

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
        gameIsOver = true;
        const playAgainButton = document.createElement("div");
        playAgainButton.id = "play-again-button";
        playAgainButton.innerHTML = "<p>Play Again</p>";
        playAgainButton.classList.add("button", "button__primary", "prevent-highlight");
        document.getElementById("nav").after(playAgainButton);
        document.getElementById("play-again-button").addEventListener('click', playAgain);
        toggleBlurAllElements(["nav", "play-again-button"]);
        clearInterval(countDownTimerIntervalId);
    } else {
        countDownTimer.innerText -= String(1);
        gameIsOver = false;
    }
};

const playAgain = () => {
    toggleBlurAllElements(["play-again-button", "nav"]);
    countDownTimer.innerText = countDownTimerValue;
    togglePlayButton();
    gameIsOver = false;
    inputBox.focus();
    countDownTimerIntervalId = setInterval(runTimer, 1000);
    try {
        document.getElementById("play-again-button").remove();
    } catch (error) {
        console.log(error);
    }
    if (modal.classList.contains("show-modal")) {
        toggleModal();
        circle.classList.remove("circle-shake-animation");
    }
};

restartGameButton.addEventListener('click', playAgain);
const togglePlay = (event) => {
    console.log(countDownTimer.innerText);
    if (countDownTimer.innerText !== "0") {
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
    } else if (countDownTimer.innerText === "0") {
        const playAgainButton = document.getElementById("play-again-button");
        if (playAgainButton !== null) {
            playAgainButton.remove();
            toggleBlurAllElements(["nav"]);
            togglePlayButton();
            countDownTimerIntervalId = setInterval(runTimer, 1000);
            // countDownTimerValue = sliderToolTip.innerText;
            countDownTimer.innerText = countDownTimerValue;
        }
    }

};

playButton.addEventListener('click', togglePlay);

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}
const openSettingsModal = (event) => {
    if (!wave1.classList.contains("paused") || !wave2.classList.contains("paused")) {
        togglePlay(event);
    }
    toggleModal();
};

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
settingsButton.addEventListener('click', openSettingsModal);

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


/**
 * Slider Logic
 */

dragElement = (target, button) => {
    target.addEventListener('mousedown', (e) => {
        onMouseMove(e);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    let onMouseMove = (e) => {
        e.preventDefault();
        let targetRect = target.getBoundingClientRect();
        let x = e.pageX - targetRect.left;
        if (x > targetRect.width) {
            x = targetRect.width
        }

        if (x < 1) {
            x = 1
        }

        button.x = x - 10;
        button.style.left = button.x + 'px';

        // get the position of the button inside the container (%)
        let percentPosition = (button.x + 10) / targetRect.width * 300;

        // color width = position of button (%)
        sliderColor.style.width = percentPosition / 3 + "%";

        // move the sliderToolTip when button moves, and show the sliderToolTip
        sliderToolTip.style.left = button.x - 5 + 'px';
        sliderToolTip.style.opacity = "1";

        // show the percentage in the sliderToolTip
        countDownTimerValue = Math.round(percentPosition);
        if (gameIsOver) {
            countDownTimer.innerText = countDownTimerValue;
        }
        sliderToolTip.textContent = String(countDownTimerValue);
    };

    let onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        sliderToolTip.style.opacity = "0";

        button.addEventListener('mouseover', function () {
            sliderToolTip.style.opacity = "1";
        });

        button.addEventListener('mouseout', function () {
            sliderToolTip.style.opacity = "0";
        });
    };
};

dragElement(sliderBoxContainer, sliderButton);