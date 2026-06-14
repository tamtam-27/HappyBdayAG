const match = document.getElementById("match");
const candle = document.getElementById("candle");
const darkFilter = document.getElementById("darkFilter");
const fairy = document.getElementById("fairy");
const fairyTextBox = document.getElementById("fairy-textbox");
const fairyText = document.getElementById("fairy-text");
const basket = document.getElementById("basket");
const items = document.querySelectorAll(".collect");
const fadeOverlay = document.getElementById("fadeOverlay");
const chars = document.querySelectorAll(".chars");

let dialogueStep = 0;
let collectedItems = 0;

let dragging = false;

match.addEventListener("pointerdown", (e) => {
    dragging = true;
    match.setPointerCapture(e.pointerId);
    match.style.cursor = "grabbing";
});

match.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    match.style.left = e.clientX - match.offsetWidth / 2 + "px";
    match.style.top = e.clientY - match.offsetHeight / 2 + "px";
    match.style.bottom = "auto";

    if (isMatchInCandleMiddle(match, candle)) {
        lightCandle();
    }
});

match.addEventListener("pointerup", () => {
    dragging = false;
    match.style.cursor = "grab";
});

function isMatchInCandleMiddle(match, candle) {
    const matchRect = match.getBoundingClientRect();
    const candleRect = candle.getBoundingClientRect();

    const matchCenterX = matchRect.left + matchRect.width / 2;
    const matchCenterY = matchRect.top + matchRect.height / 2;

    const candleMiddleLeft = candleRect.left + candleRect.width * 0.35;
    const candleMiddleRight = candleRect.left + candleRect.width * 0.65;
    const candleMiddleTop = candleRect.top + candleRect.height * 0.25;
    const candleMiddleBottom = candleRect.top + candleRect.height * 0.55;

    return (
        matchCenterX >= candleMiddleLeft &&
        matchCenterX <= candleMiddleRight &&
        matchCenterY >= candleMiddleTop &&
        matchCenterY <= candleMiddleBottom
    );
}

function lightCandle() {
    dragging = false;

    candle.src = "images/candle_lit.png";
    match.style.pointerEvents = "none";

    setTimeout(() => {
        darkFilter.style.opacity = "0";
    }, 1000);

    setTimeout(() => {
        match.classList.add("hidden");
        candle.classList.add("hidden");
        showFairyDialogue();
    }, 5000);
}

function showFairyDialogue() {
    fairy.classList.remove("hidden");
    fairyTextBox.classList.remove("hidden");
    fairyText.textContent = "Hello, I am glad you found the way."; //before 1
    dialogueStep = 1;
}

fairyTextBox.addEventListener("click", () => {
    if (dialogueStep === 1) {
        fairyText.textContent = "We still have to collect some things for the prince before we can get going."; //before 2
        dialogueStep = 2;
    } else if (dialogueStep === 2) {
        fairyText.textContent = "Can you drag all the items into the basket for us?"; //before 3
        dialogueStep = 3;
    } else if (dialogueStep === 3) {
        fairy.classList.add("hidden");
        fairyTextBox.classList.add("hidden");
        showBasketTask();
    } else if (dialogueStep === 4) {
        fairyText.textContent = "Now onto our way to New Haven!"; //after 5
        setTimeout(() => {
            fadeOverlay.classList.add("fade-out");
            setTimeout(() => {
                document.querySelector(".main").style.backgroundImage = 'url("images/forest_village.jpg")';
                fadeOverlay.classList.remove("fade-out");
            }, 2000);
        }, 1000);
        dialogueStep = 5;
    } else if (dialogueStep === 5) {
        fairyText.textContent = "There's the prince! But who is that next to him?" //later 6
        dialogueStep = 6;
    } else if (dialogueStep === 6) {
        fairy.classList.add("hidden");
        fairyTextBox.classList.add("hidden");
        revealChars();
    } else if (dialogueStep === 7) {

    }
});

function showBasketTask() {
    basket.classList.remove("hidden");

    items.forEach(item => {
        item.classList.remove("hidden");
        makeDraggable(item);
    });
}

function makeDraggable(item) {
    let isDraggingItem = false;

    item.addEventListener("pointerdown", (e) => {
        isDraggingItem = true;
        item.setPointerCapture(e.pointerId);
        item.style.cursor = "grabbing";
    });

    item.addEventListener("pointermove", (e) => {
        if (!isDraggingItem) return;

        item.style.left = e.clientX - item.offsetWidth / 2 + "px";
        item.style.top = e.clientY - item.offsetHeight / 2 + "px";

        if (isItemInBasket(item, basket)) {
            collectItem(item);
            isDraggingItem = false;
        }
    });

    item.addEventListener("pointerup", () => {
        isDraggingItem = false;
        item.style.cursor = "grab";
    });
}
function isItemInBasket(item, basket) {
    const itemRect = item.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    const itemCenterX = itemRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top + itemRect.height / 2;

    return (
        itemCenterX >= basketRect.left &&
        itemCenterX <= basketRect.right &&
        itemCenterY >= basketRect.top &&
        itemCenterY <= basketRect.bottom
    );
}

function collectItem(item) {
    item.classList.add("hidden");
    item.style.pointerEvents = "none";
    collectedItems++;

    if (collectedItems === items.length) {
        document.querySelector(".main").style.backgroundImage = 'url("images/maison_happy.jpg")';
        basket.classList.add("hidden");
        fairy.classList.remove("hidden");
        fairyTextBox.classList.remove("hidden");
        fairyText.textContent = "Thank you so much! I wonder what he needs these things for..."; //after 4
        dialogueStep = 4;
    }
}

function revealChars() {
    chars.forEach(char => {
        char.classList.remove("hidden");
    })
    dialogueStep = 7;
}

function fireworks() {
    if (typeof confetti !== 'function') {
        return;
    }

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
};

function countdownMeet() {
    var endDate = new Date("June 15, 2026 00:00:00").getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = endDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "I SEE U";
        }
    }, 1000);
};

window.addEventListener('load', fireworks);
window.addEventListener('load', countdownMeet);