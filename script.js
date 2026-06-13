const match = document.getElementById("match");
const candle = document.getElementById("candle");
const darkFilter = document.getElementById("darkFilter");

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
    }, 5000);
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