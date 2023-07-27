const leftOperandElement = document.getElementById("left-operand");
const rightOperandElement = document.getElementById("right-operand");
const multiplicationSymbol = document.getElementById("multiplication-symbol");

const inputBox = document.getElementById("input-box");
const operationsContainer = document.getElementById("operations-container");
let maxOperandNumber = 12;

/**
 * Generates a random number between the lowNumber and the highNumber (inclusive)
 * 
 * @param {number} lowNumber the low number to generate from
 * @param {number} highNumber the high number to generate to (inclusive)
 */
const getRandomNumberBetween = (lowNumber, highNumber) => {
    return Math.floor(Math.random() * (highNumber - lowNumber + 1) + lowNumber) ;
}

let speechBubblePrefixCount = 0;
const playSpeechBubbleAnimation = async (textToDisplay, animationDuration, backgroundColor = "#5a5a5a") => {
    const speechBubbleClassNameWithID = `speech-bubble${speechBubblePrefixCount}`;
    operationsContainer.innerHTML += `<div id=${speechBubbleClassNameWithID} class="speech-bubble">I'm a rectangle</div>`;
    speechBubblePrefixCount++;
    // Restart the prefix count when we reach 10,000. We assume by that time, at least speech-bubble0 is deleted.
    speechBubblePrefixCount = speechBubblePrefixCount > 10000 ? 0 : speechBubblePrefixCount;
    const speechBubbles = document.getElementsByClassName("speech-bubble");
    const speechBubble = speechBubbles[0];
    speechBubble.style.animationName = "";
    speechBubble.style.animationDuration = "";
    speechBubble.style.backgroundColor = backgroundColor;
    speechBubble.innerHTML = textToDisplay;
    speechBubble.style.animationName = "bounce";
    speechBubble.style.animationDuration = `${animationDuration}s`;
    speechBubble.style.animationName = "shrink";
    setTimeout(() => {
        document.getElementById(speechBubbleClassNameWithID).remove();
    }, 1500);
}

rightOperandElement.innerText = String(getRandomNumberBetween(1, maxOperandNumber));
leftOperandElement.innerText = String(getRandomNumberBetween(1, maxOperandNumber));

inputBox.addEventListener("keyup", (keyboardEvent) => {
    if ((keyboardEvent.key === "Enter" || keyboardEvent.key === "Return") && inputBox.value.length > 0) {
        const answer = Number(rightOperandElement.innerText) * Number(leftOperandElement.innerText);
        const userAnswer = Number(inputBox.value);
        let speechBubbleText = "";
        let speechBubbleBackgroundColor = "";
        if (userAnswer === answer) {
            speechBubbleText = "Correct!";
            speechBubbleBackgroundColor = "green";
        } else {
            speechBubbleText = "Wrong!";
            speechBubbleBackgroundColor = "red";
        }
        playSpeechBubbleAnimation(speechBubbleText, 1.5, speechBubbleBackgroundColor);
        inputBox.value = "";
        rightOperandElement.innerHTML = String(getRandomNumberBetween(1, maxOperandNumber));
        leftOperandElement.innerHTML = String(getRandomNumberBetween(1, maxOperandNumber));
    }
});
