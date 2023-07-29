const inputBox = document.getElementById("input-box");
const operationsContainer = document.getElementById("operations-container");
/* play button */
const play = document.querySelector('.play');
const pause = document.querySelector('.pause');
const playButton = document.querySelector('.circle__btn');
/* wave animation elements for play button*/
const wave1 = document.querySelector('.circle__back-1');
const wave2 = document.querySelector('.circle__back-2');
const circle = document.querySelector('.circle-shake-animation');
const modal = document.querySelector(".modal");
/* settings modal buttons */
const settingsButton = document.getElementById("icon");
const closeButton = document.querySelector(".close-button");
const restartGameButton = document.getElementById("restart-game-button");
const restartGameButtonText = document.getElementById("restart-game-button-text");
/* settings modal rate slider */
const sliderBoxContainer = document.querySelector('.slider__box');
const sliderButton = document.querySelector('.slider__btn');
const sliderColor = document.querySelector('.slider__color');
const sliderToolTip = document.querySelector('.slider__tooltip');
/* settings modal number picker */
const decreaseMaxOperandButton = document.getElementById("decrease-max-operand-button");
const increaseMaxOperandButton = document.getElementById("increase-max-operand-button");
const maxOperandInput = document.getElementById("max-operand-input");
// The maximum number we will generate up to. The settings modal number picker sets this when used.
let maxOperandNumber = 12;
const countDownTimer = document.getElementById("countdown-timer");
// The value we will count down from at the start of every new game. The settings modal rate slider sets this when used.
let countDownTimerValue = "60";
// Our global countdown interval id. Used to set and clear the current running interval, which decrements our
// countDownTimer.
let countDownTimerIntervalId;
let mainContentIsBlurred = true;
// We create this, so we can assign an id for every new speech bubble created. A new speech bubble will be created
// every time the user submits an answer and will be deleted after its animation. The speech bubble tells the user
// if their answer is correct or wrong.
let speechBubblePrefixCount = 0;

/**
 * The main content of the page except for the nav bar gets blurred when this function is called.
 *
 * @param {Boolean} blur sets whether to blur elements or not. If this is not set, elements are blurred by default.
 */
const toggleBlurForBlurrableElements = (blur) => {
    const elementsToBlur = document.getElementsByClassName("will-blur");
    for (const element of elementsToBlur) {
        if (blur || blur === undefined) {
            element.style.filter = "blur(3rem)";
            mainContentIsBlurred = true;
        } else {
            element.style.filter = "none";
            mainContentIsBlurred = false;
        }
    }
};

/**
 * Generates a random number between the lowNumber and the highNumber (inclusive).
 *
 * @param {number} lowNumber the low number to generate from
 * @param {number} highNumber the high number to generate to (inclusive)
 */
const getRandomNumberBetween = (lowNumber, highNumber) => {
    return Math.floor(Math.random() * (highNumber - lowNumber + 1) + lowNumber);
};

/**
 * Creates a new element and displays whether the user got the answer correct or wrong. Speech bubbles are deleted
 * after 2 seconds.
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
 * Toggles play button image and animation.
 */
const togglePlayButtonAnimation = () => {
    pause.classList.toggle('visibility');
    play.classList.toggle('visibility');
    playButton.classList.toggle('shadow');
    wave1.classList.toggle('paused');
    wave2.classList.toggle('paused');
};

/**
 * Starts the countdown timer on the page until it reaches 0. The game is over when it reaches zero and the user has
 * the option to play again.
 */
const runCountDownTimer = () => {
    if (Number(countDownTimer.innerText) <= 0) {
        inputBox.value = "";
        inputBox.blur();
        togglePlayButtonAnimation();
        const playAgainButton = document.createElement("div");
        playAgainButton.id = "play-again-button";
        playAgainButton.innerHTML = "<p>Play Again</p>";
        playAgainButton.classList.add("button", "button__primary", "prevent-highlight", "play-again-button");
        document.getElementById("nav").after(playAgainButton);
        document.getElementById("play-again-button").addEventListener('click', (mouseEvent) => {
            toggleBlurForBlurrableElements(!mainContentIsBlurred);
            togglePlay(mouseEvent);
        });
        toggleBlurForBlurrableElements(true);
        clearInterval(countDownTimerIntervalId);
    } else {
        countDownTimer.innerText -= String(1);
    }
};

/**
 * Toggles the settings modal view and blurs the main game if necessary.
 */
const toggleSettingsModal = () => {
    modal.classList.toggle("show-modal");
};

/**
 * Toggles the play state of the game and performs the necessary operations based on what button was clicked.
 * (playButton, restartGameButton, or playAgainButton).
 *
 * @param mouseEvent the callback function mouse event.
 */
const togglePlay = (mouseEvent) => {
    circle.classList.remove('circle-shake-animation');
    togglePlayButtonAnimation();
    document.getElementById("left-operand").innerText = String(getRandomNumberBetween(1, maxOperandNumber));
    document.getElementById("right-operand").innerText = String(getRandomNumberBetween(1, maxOperandNumber));
    if (modal.classList.contains("show-modal")) {
        toggleSettingsModal();
        circle.classList.remove("circle-shake-animation");
    }
    const playAgainButton = document.getElementById("play-again-button");
    if (playAgainButton !== null) {
        playAgainButton.remove();
    }
    if (Number(countDownTimer.innerText) <= 0 || (mouseEvent.target === restartGameButton || mouseEvent.target === restartGameButtonText)) {
        maxOperandNumber = Number(maxOperandInput.value);
        inputBox.focus();
        countDownTimerIntervalId = setInterval(runCountDownTimer, 1000);
        countDownTimer.innerText = countDownTimerValue;
        return;
    }
    if (Number(countDownTimer.innerText) > 0) {
        if (!wave1.classList.contains('paused')) {
            inputBox.focus();
            countDownTimerIntervalId = setInterval(runCountDownTimer, 1000);
        } else {
            inputBox.value = "";
            clearInterval(countDownTimerIntervalId);
        }
    }
};


/**
 * Takes care of updating the rate slider sliderButton position and color filling in the settings modal.
 *
 * @param targetElement the element to be targeted on mouse events. Should be the parent of sliderButton.
 * @param sliderButton the sliderButton that will slide. Its parent should be the targetElement.
 */
const dragElement = (targetElement, sliderButton) => {
    targetElement.addEventListener('mousedown', (e) => {
        onMouseMove(e);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    let onMouseMove = (e) => {
        e.preventDefault();
        let targetRect = targetElement.getBoundingClientRect();
        let x = e.pageX - targetRect.left;
        if (x > targetRect.width) {
            x = targetRect.width
        }

        if (x < 1) {
            x = 1
        }

        sliderButton.x = x - 10;
        sliderButton.style.left = sliderButton.x + 'px';

        // get the position of the sliderButton inside the container (%)
        let percentPosition = (sliderButton.x + 10) / targetRect.width * 300;

        // color width = position of sliderButton (%)
        sliderColor.style.width = percentPosition / 3 + "%";

        // move the sliderToolTip when sliderButton moves, and show the sliderToolTip
        sliderToolTip.style.left = sliderButton.x - 5 + 'px';
        sliderToolTip.style.opacity = "1";

        // show the percentage in the sliderToolTip
        countDownTimerValue = String(Math.round(percentPosition));
        if (Number(countDownTimer.innerText) <= 0) {
            countDownTimer.innerText = countDownTimerValue;
        }
        sliderToolTip.innerText = countDownTimerValue;
    };

    let onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        sliderToolTip.style.opacity = "0";

        sliderButton.addEventListener('mouseover', function () {
            sliderToolTip.style.opacity = "1";
        });

        sliderButton.addEventListener('mouseout', function () {
            sliderToolTip.style.opacity = "0";
        });
    };
};

/**
 * Toggles the settings modal to off when the window is clicked.
 *
 * @param mouseEvent the mouse event of the callback function.
 */
const windowOnClick = (mouseEvent) => {
    if (mouseEvent.target === modal) {
        toggleSettingsModal();
    }
};

/**
 * Increments or decrements the value of the number picker in the settings modal based on the mouse event.
 *
 * @param mouseEvent the mouse event of the callback function. Used to determine increment or decrement.
 */
const updateMaxOperandInputValue = (mouseEvent) => {
    if (mouseEvent.target.id === "decrease-max-operand-icon" || mouseEvent.target.id === "decrease-max-operand-button") {
        maxOperandInput.value -= 1;
    } else {
        maxOperandInput.value = String(Number(maxOperandInput.value) + 1);
    }
}

/**
 * Event listener for when a user presses enter on the inputBox. Takes care of all the necessary
 * processing such as speech bubble result and updating the current score.
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

playButton.addEventListener('click', (event) => {
    toggleBlurForBlurrableElements(!mainContentIsBlurred);
    togglePlay(event);
});

settingsButton.addEventListener('click', () => {
    if (!mainContentIsBlurred) {
        toggleBlurForBlurrableElements(true);
    }
    if (!wave1.classList.contains("paused")) {
        togglePlayButtonAnimation();
    }
    clearInterval(countDownTimerIntervalId);
    toggleSettingsModal();
});

closeButton.addEventListener("click", toggleSettingsModal);

window.addEventListener("click", windowOnClick);
restartGameButton.addEventListener('click', (mouseEvent) => {
    toggleBlurForBlurrableElements(!mainContentIsBlurred);
    togglePlay(mouseEvent);
});

decreaseMaxOperandButton.addEventListener('mousedown', updateMaxOperandInputValue);

increaseMaxOperandButton.addEventListener('mousedown', updateMaxOperandInputValue);

// When game starts the main content will be blurred until the user presses play.
toggleBlurForBlurrableElements(true);
// Set the rate slider box and button to be draggable
dragElement(sliderBoxContainer, sliderButton);