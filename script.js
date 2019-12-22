let canvas, ctx, interval, canvasSide, circle;

function init() {
    interval = 10;
    canvasSide = 600;

    canvas = document.getElementById("clock");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.height = canvasSide;

    window.setInterval(drawCanvas, interval);
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvasSide, canvasSide);

    drawCircle();
    createScale();
    showTime();
}

function drawCircle() {
    let circle = defineCircle();

    // Clock boundaries
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner decorative circle
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, (circle.radius * 0.03), 0, Math.PI * 2);
    ctx.stroke();
    ctx.save();
}

// Find the center of the canvas which will be used as the center of the clock. 
// Calculate the maximum allowed radius based on the canvas dimensions.
function defineCircle() {
    let x, y, radius;

    y = canvas.height / 2;
    x = canvas.width / 2;
    radius = (canvas.height / 2) - 1;

    circle = {
        "x": x,
        "y": y,
        "radius": radius
    }

    return circle;
}


function getVector(degrees) {
    let theta = degrees * (Math.PI / 180);
    // let cos = Math.cos(degrees);
    // let sin = Math.cos(degrees);
    let cosTheta = Math.cos(theta);
    let sinTheta = Math.sin(theta);
    // let tanTheta = sinTheta / cosTheta;
    return vector = {
        // "cos": cos,
        // "sin": sin,
        "theta": theta,
        "cosTheta": cosTheta,
        "sinTheta": sinTheta,
        // "tanTheta": tanTheta
    };
}

function getPointOnCircle(angle, length, remainder) {
    let coordinates, x, y, vector, radius;

    if (typeof length === "boolean") {
        remainder = length;
        length = 0;
    }

    if (remainder === undefined || remainder === null || typeof remainder !== "boolean") {
        remainder = false;
    }

    if (length === undefined || length === 0 || length === null) {
        radius = circle.radius;
    } else if (length !== 0) {
        radius = length;
    } else if (remainder === true) {
        // If O the circle center, B the point where the radius meets circumference and A some intermediate point,
        // we will try to get AB.
        radius = circle.radius - length;
    }


    vector = getVector(angle);
    x = Math.round((vector.cosTheta * radius) + circle.radius);
    y = Math.round((vector.sinTheta * radius) + circle.radius);

    coordinates = {
        "x": x,
        "y": y
    }

    return coordinates;
}

function createScale() {

    let length;

    for (i = 0; i < 360; i += 6) {
        if (i % 30 == 0) {
            // It will calculate the point from center until the 91.5% of the radius. 
            // This point will be extended on the radius and will be connected to the circumference.
            length = circle.radius * 0.915;
        } else {
            length = circle.radius * 0.97;
        }

        let startCoordinates = getPointOnCircle(i);
        let endCoordinates = getPointOnCircle(i, length, true);
        ctx.moveTo(startCoordinates.x, startCoordinates.y);
        ctx.lineTo(endCoordinates.x, endCoordinates.y)
        ctx.stroke();
    }
}

// Converting time to the corresponding angle on the clock disk.
function time() {
    let now;
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Achieving gradual transition between minutes.
    // -90 because in trigonometry 0 deg would be 3 o'clock
    // returns degrees, NOT time.
    let angleHours = ((((hours * 60) + minutes) / 720) * 360) - 90;
    let angleMinutes = ((((minutes * 60) + seconds) / 3600) * 360) - 90;
    let angleSeconds = ((seconds / 60) * 360) - 90;

    now = {
        "hours": angleHours,
        "minutes": angleMinutes,
        "seconds": angleSeconds
    }
    
    return now;
}

function Hand(width, length) {
    this.width = width;
    this.length = length;
}

function showTime() {
    let now = time();
    hourHand = new Hand(6, circle.radius * 0.65);
    minuteHand = new Hand(3, circle.radius * 0.78);
    secondHand = new Hand(1, circle.radius * 0.86);
    drawHand(getPointOnCircle(now.hours, hourHand.length), hourHand.width);
    drawHand(getPointOnCircle(now.minutes, minuteHand.length), minuteHand.width);
    drawHand(getPointOnCircle(now.seconds - 180, circle.radius*0.12), getPointOnCircle(now.seconds, secondHand.length), secondHand.width);

}

function drawHand(startPoint, endPoint, width) {
    if (typeof endPoint === 'number') {
        width = endPoint;
        endPoint = startPoint;
        startPoint = {
            "x": circle.x,
            "y": circle.y
        }
    }

    ctx.lineWidth = width;
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
}

init();


