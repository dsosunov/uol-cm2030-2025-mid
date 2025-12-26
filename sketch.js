let Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
let engine;

/**
 * Creates the physics engine.
 * and sets the gravity to 0.
 */
function setupPhysics() {
    engine = Engine.create();
    engine.gravity.y = 0;
}

let table;

/**
 * Initializes the game state with rendering, physics and scene variables.
 */
function setup() {
    canvas = createCanvas(1600, 900);
    rectMode(CENTER);
    textAlign(CENTER);
    angleMode(DEGREES);
    setupPhysics();
    table = new Table(createVector(width / 2, height / 2), createVector(1200, 600), "#4f8834");
}

/**
 * Draws the background, table and its elements. Also updates the physics engine.
 */
function draw() {
    Engine.update(engine);
    background(200);
    table.draw();
}
/**
 * Represents the snooker table.
 * @class
 */
class Table {
    constructor(position, size, color) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.ballDiameter = this.size.x / 36;
        this.pocketDiameter = this.ballDiameter * 1.5;
        this.pocketCoverWidth = this.ballDiameter * 2;
        this.borders = this.spawnBorders();
        this.pockets = this.spawnPockets();
        this.pocketCovers = this.spawnPocketCovers();
        this.cushions = this.spawnCushions();
        this.balls = this.spawnBalls();
        this.cue = new Cue(this.position, createVector(360, 12));
        this.cue.spawn(this.balls[0]);
    }
    draw() {w
        this.drawSelf();
        this.drawLine();
        this.drawD();
        this.drawCushions();
        this.drawBorders();
        this.drawPocketCovers();
        this.drawPockets();
        this.drawBalls();
        this.cue.draw();
    }
    drawSelf() {
        push();
        noStroke();
        fill(this.color);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }
    drawBorders() {
        this.borders.forEach(border => border.draw());
    }
    drawPockets() {
        this.pockets.forEach(pocket => pocket.draw());
    }
    drawPocketCovers() {
        this.pocketCovers.forEach(pocketCover => pocketCover.draw());
    }
    drawCushions() {
        this.cushions.forEach(cushion => cushion.draw());
    }
    drawLine() {
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        translate(this.position.x, this.position.y);
        line(
            -this.position.x / 3,
            -this.size.y / 2,
            -this.position.x / 3,
            this.size.y / 2
        );
        pop();
    }
    drawD() {
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        translate(this.position.x, this.position.y);
        arc(
            -this.position.x / 3,
            0,
            250,
            250,
            90,
            270
        )
        pop();
    }
    drawBalls() {
        this.balls.forEach(ball => ball.draw());
    }
    spawnBorders() {
        let borders = [];
        let borderThickness = 32;
        let borderLength = this.size.x / 2 - this.pocketCoverWidth;
        // Top-left border
        borders.push(new TableBorder(this.position, createVector(-this.size.x / 4, -this.size.y / 2 - borderThickness / 2), createVector(borderLength, borderThickness), "#41230d"));
        // Top-right border
        borders.push(new TableBorder(this.position, createVector(this.size.x / 4, -this.size.y / 2 - borderThickness / 2), createVector(borderLength, borderThickness), "#41230d"));
        // Right border
        borders.push(new TableBorder(this.position, createVector(this.size.x / 2 + borderThickness / 2, 0), createVector(borderThickness, borderLength), "#41230d"));
        // Bottom-right border
        borders.push(new TableBorder(this.position, createVector(this.size.x / 4, this.size.y / 2 + borderThickness / 2), createVector(borderLength, borderThickness), "#41230d"));
        // Bottom-left border
        borders.push(new TableBorder(this.position, createVector(-this.size.x / 4, this.size.y / 2 + borderThickness / 2), createVector(borderLength, borderThickness), "#41230d"));
        // Left border
        borders.push(new TableBorder(this.position, createVector(-this.size.x / 2 - borderThickness / 2, 0), createVector(borderThickness, borderLength), "#41230d"));
        return borders;
    }
    spawnPockets() {
        let pockets = [];
        // Top pocket
        pockets.push(new Pocket(this.position, createVector(0, -this.size.y / 2), this.pocketDiameter, "#000"));
        // Top-right pocket
        pockets.push(new Pocket(this.position, createVector(this.size.x / 2, -this.size.y / 2), this.pocketDiameter, "#000"));
        // Bottom-right pocket
        pockets.push(new Pocket(this.position, createVector(this.size.x / 2, this.size.y / 2), this.pocketDiameter, "#000"));
        // Bottom pocket
        pockets.push(new Pocket(this.position, createVector(0, this.size.y / 2), this.pocketDiameter, "#000"));
        // Bottom-left pocket
        pockets.push(new Pocket(this.position, createVector(-this.size.x / 2, this.size.y / 2), this.pocketDiameter, "#000"));
        // Top-left pocket
        pockets.push(new Pocket(this.position, createVector(-this.size.x / 2, -this.size.y / 2), this.pocketDiameter, "#000"));
        return pockets;
    }
    spawnPocketCovers() {
        let pocketCovers = [];
        let pocketCoverThickness = 32;
        // Top pocket cover
        pocketCovers.push(new PocketCover(this.position, createVector(0, -this.size.y / 2 - pocketCoverThickness / 2), createVector(this.pocketCoverWidth, pocketCoverThickness), "#ecd850"));
        // Top-right pocket cover top edge
        pocketCovers.push(new PocketCover(this.position, createVector(this.size.x / 2, -this.size.y / 2 - pocketCoverThickness / 2), createVector(this.pocketCoverWidth, pocketCoverThickness), "#ecd850"));
        // Top-right pocket cover bottom edge
        pocketCovers.push(new PocketCover(this.position, createVector(this.size.x / 2 + this.pocketCoverWidth / 2 - pocketCoverThickness / 2, -this.size.y / 2), createVector(pocketCoverThickness, this.pocketCoverWidth), "#ecd850"));
        // Bottom-right pocket cover top edge
        pocketCovers.push(new PocketCover(this.position, createVector(this.size.x / 2 + this.pocketCoverWidth / 2 - pocketCoverThickness / 2, this.size.y / 2), createVector(pocketCoverThickness, this.pocketCoverWidth), "#ecd850"));
        // Bottom-right pocket cover bottom edge
        pocketCovers.push(new PocketCover(this.position, createVector(this.size.x / 2, this.size.y / 2 + pocketCoverThickness / 2), createVector(this.pocketCoverWidth, pocketCoverThickness), "#ecd850"));
        // Bottom pocket cover
        pocketCovers.push(new PocketCover(this.position, createVector(0, this.size.y / 2 + pocketCoverThickness / 2), createVector(this.pocketCoverWidth, pocketCoverThickness), "#ecd850"));
        // Bottom pocket cover bottom edge
        pocketCovers.push(new PocketCover(this.position, createVector(-this.size.x / 2, this.size.y / 2 + pocketCoverThickness / 2), createVector(this.pocketCoverWidth, pocketCoverThickness), "#ecd850"));
        // Bottom pocket cover top edge
        pocketCovers.push(new PocketCover(this.position, createVector(-this.size.x / 2 - this.pocketCoverWidth / 2 + pocketCoverThickness / 2, this.size.y / 2), createVector(pocketCoverThickness, this.pocketCoverWidth), "#ecd850"));
        // Top-left pocket cover bottom edge
        pocketCovers.push(new PocketCover(this.position, createVector(-this.size.x / 2 - this.pocketCoverWidth / 2 + pocketCoverThickness / 2, -this.size.y / 2), createVector(pocketCoverThickness, this.pocketCoverWidth), "#ecd850"));
        // Top-left pocket cover top edge
        pocketCovers.push(new PocketCover(this.position, createVector(-this.size.x / 2, -this.size.y / 2 - pocketCoverThickness / 2), createVector(this.pocketCoverWidth, pocketCoverThickness), "#ecd850"));
        return pocketCovers;
    }
    spawnCushions() {
        let cushions = [];
        let cushionLength = this.size.x / 4 - this.pocketCoverWidth / 3.5;
        let offsetFromBorder = 12;
        // Top-left cushion
        cushions.push(new Cushion(createVector(this.position.x - this.size.x / 4, this.position.y - this.size.y / 2 + offsetFromBorder), [
            { x: -cushionLength + this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: -cushionLength + this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 },
            { x: cushionLength - this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: cushionLength - this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 }
        ], "#33601a"));
        // Top-right cushion
        cushions.push(new Cushion(createVector(this.position.x + this.size.x / 4, this.position.y - this.size.y / 2 + offsetFromBorder), [
            { x: -cushionLength + this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: -cushionLength + this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 },
            { x: cushionLength - this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: cushionLength - this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 }
        ], "#33601a"));
        // Right cushion
        cushionLength -= this.pocketCoverWidth * 0.7;
        cushions.push(new Cushion(createVector(this.position.x + this.size.x / 2 - offsetFromBorder, this.position.y), [
            { x: this.pocketDiameter, y: -cushionLength - this.pocketDiameter / 7 },
            { x: this.pocketDiameter * 1.5, y: -cushionLength - this.pocketDiameter * 5 / 7 },
            { x: this.pocketDiameter, y: cushionLength + this.pocketDiameter / 7 },
            { x: this.pocketDiameter * 1.5, y: cushionLength + this.pocketDiameter * 5 / 7 }
        ], "#33601a"));
        // Left cushion
        cushions.push(new Cushion(createVector(this.position.x - this.size.x / 2 + offsetFromBorder, this.position.y), [
            { x: -this.pocketDiameter, y: -cushionLength - this.pocketDiameter / 7 },
            { x: -this.pocketDiameter * 1.5, y: -cushionLength - this.pocketDiameter * 5 / 7 },
            { x: -this.pocketDiameter, y: cushionLength + this.pocketDiameter / 7 },
            { x: -this.pocketDiameter * 1.5, y: cushionLength + this.pocketDiameter * 5 / 7 }
        ], "#33601a"));
        // Bottom-right cushion
        cushions.push(new Cushion(createVector(this.position.x + this.size.x / 4, this.position.y + this.size.y / 2 - offsetFromBorder), [
            { x: cushionLength + this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: cushionLength + this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 },
            { x: -cushionLength - this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: -cushionLength - this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 }
        ], "#33601a"));
        // Bottom-left cushion
        cushions.push(new Cushion(createVector(this.position.x - this.size.x / 4, this.position.y + this.size.y / 2 - offsetFromBorder), [
            { x: cushionLength + this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: cushionLength + this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 },
            { x: -cushionLength - this.pocketDiameter / 7, y: this.pocketDiameter },
            { x: -cushionLength - this.pocketDiameter * 5 / 7, y: this.pocketDiameter * 1.5 }
        ], "#33601a"));
        return cushions;
    }
    spawnBalls() {
        let balls = [];
        // Cue
        balls.push(new CueBall(this.position, createVector(-this.size.x / 4 - this.ballDiameter * 2, 0), this.ballDiameter));
        // Green
        balls.push(new Ball(this.position, createVector(-this.size.x / 3 + 125 + this.ballDiameter / 4, -125), this.ballDiameter, "green"));
        // Brown
        balls.push(new Ball(this.position, createVector(-this.size.x / 3 + 125 + this.ballDiameter / 4, 0), this.ballDiameter, "brown"));
        // Yellow
        balls.push(new Ball(this.position, createVector(-this.size.x / 3 + 125 + this.ballDiameter / 4, 125), this.ballDiameter, "yellow"));
        // Blue
        balls.push(new Ball(this.position, createVector(0, 0), this.ballDiameter, "blue"));
        // Pink
        balls.push(new Ball(this.position, createVector(this.size.x / 6 - this.ballDiameter * 1, 0), this.ballDiameter, "pink"));
        // Black
        balls.push(new Ball(this.position, createVector(this.size.x / 2.5 - this.ballDiameter * 1, 0), this.ballDiameter, "black"));
        // Reds
        // First row
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 0, 0), this.ballDiameter, "red"));
        // Second row
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 1, -this.ballDiameter / 2), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 1, this.ballDiameter / 2), this.ballDiameter, "red"));
        // Third row
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 2, -this.ballDiameter), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 2, 0), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 2, this.ballDiameter), this.ballDiameter, "red"));
        // Fourth row
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 3, -this.ballDiameter * 3 / 2), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 3, -this.ballDiameter / 2), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 3, this.ballDiameter / 2), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 3, this.ballDiameter * 3 / 2), this.ballDiameter, "red"));
        // Fifth row
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 4, -this.ballDiameter * 2), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 4, -this.ballDiameter), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 4, 0), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 4, this.ballDiameter), this.ballDiameter, "red"));
        balls.push(new Ball(this.position, createVector(this.size.x / 6 + this.ballDiameter * 4, this.ballDiameter * 2), this.ballDiameter, "red"));
        return balls;
    }
};

/**
 * Represents the table borders.
 * @class
 */
class TableBorder {
    constructor(tablePosition, position, size, color) {
        this.tablePosition = tablePosition;
        this.position = position;
        this.size = size;
        this.color = color;
    }
    draw() {
        push();
        noStroke();
        translate(this.tablePosition.x, this.tablePosition.y);
        fill(this.color);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }
};

/**
 * Represents the snooker pockets.
 * @class
 */
class Pocket {
    constructor(tablePosition, position, diameter, color) {
        this.tablePosition = tablePosition;
        this.position = position;
        this.diameter = diameter;
        this.color = color;
    }
    draw() {
        push();
        noStroke();
        translate(this.tablePosition.x, this.tablePosition.y);
        fill(this.color);
        circle(this.position.x, this.position.y, this.diameter);
        pop();
    }
};

/**
 * Represents the pocket covers.
 * @class
 */
class PocketCover {
    constructor(tablePosition, position, size, color) {
        this.tablePosition = tablePosition;
        this.position = position;
        this.size = size;
        this.color = color;
    }
    draw() {
        push();
        translate(this.tablePosition.x, this.tablePosition.y);
        fill(this.color);
        noStroke();
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }
};

/**
 * Represents the table cushions.
 * @class
 */
class Cushion {
    constructor(position, points, color) {
        this.points = points;
        this.color = color;
        this.body = Bodies.fromVertices(
            position.x, position.y, points, {
            isStatic: true, restitution: 0.3
        }
        )
        this.turnPhysicsOn();
    }
    turnPhysicsOn() {
        Composite.add(engine.world, [this.body]);
    }
    turnPhysicsOff() {
        Composite.remove(engine.world, [this.body]);
    }
    draw() {
        push();
        noStroke();
        fill(this.color);
        beginShape();
        this.body.vertices.forEach(bodyVertex => {
            vertex(bodyVertex.x, bodyVertex.y)
        });
        endShape(CLOSE);
        pop();
    }
};

/**
 * Represents the snooker balls.
 * @class
 */
class Ball {
    constructor(tablePosition, position, diameter, color) {
        this.tablePosition = tablePosition;
        this.position = position;
        this.diameter = diameter;
        this.color = color;
        this.isPhysicsEnabled = false;
        this.physicsOptions = {
            restitution: 0.6, friction: 0.4, density: 0.002
        };
        this.turnPhysicsOn();
        this.colors = {
            "red": "#dd3737ff", "pink": "#f36fb3ff", "blue": "#23ccffff",
            "green": "#2e5024", "brown": "#855123", "yellow": "#ffff00",
            "black": "#333", "cue": "#eee"
        };
    }
    draw() {
        push();
        noStroke();
        fill(this.colors[this.color]);
        if (this.isPhysicsEnabled) {
            beginShape();
            this.body.vertices.forEach(bodyVertex => {
                vertex(bodyVertex.x, bodyVertex.y)
            });
            endShape(CLOSE);
        } else {
            translate(this.tablePosition.x, this.tablePosition.y);
            circle(this.position.x, this.position.y, this.diameter);
        }
        pop();
    }
    turnPhysicsOn() {
        this.body = Bodies.circle(
            this.tablePosition.x + this.position.x, this.tablePosition.y + this.position.y, this.diameter / 2, this.physicsOptions
        );
        Composite.add(engine.world, [this.body]);
        this.isPhysicsEnabled = true;
    }
    turnPhysicsOff() {
        Composite.remove(engine.world, this.body);
        this.isPhysicsEnabled = false;
        this.body = null;
    }
};

/**
 * Represents the cue ball.
 * @class
 */
class CueBall extends Ball {
    constructor(tablePosition, position, diameter) {
        super(tablePosition, position, diameter, "cue");
    }
};

/**
 * Represents the snooker cue.
 * @class
 */
class Cue {
    constructor(tablePosition, size) {
        this.tablePosition = tablePosition;
        this.size = size;
        this.color = "#d28c54";
        this.states = Object.freeze({
            HIDDEN: "HIDDEN",
            VISIBLE: "VISIBLE"
        });
        this.currentState = this.states.HIDDEN;

        // Shot path properties
        this.showShotPath = true;
        this.shotPathColor = "rgba(255, 255, 255, 0.7)";
        this.shotPathLength = 500;
    }

    spawn(cueBall) {
        this.cueBall = cueBall;
        this.currentState = this.states.VISIBLE;
    }

    draw() {
        if (this.currentState === this.states.HIDDEN) {
            return;
        }

        // Get cue ball position
        let cueBallX, cueBallY;
        if (this.cueBall.isPhysicsEnabled) {
            cueBallX = this.cueBall.body.position.x;
            cueBallY = this.cueBall.body.position.y;
        } else {
            cueBallX = this.tablePosition.x + this.cueBall.position.x;
            cueBallY = this.tablePosition.y + this.cueBall.position.y;
        }

        // TWO DIFFERENT ANGLES:
        // 1. For CUE: angle from mouse to cue ball (cue appears behind ball)
        const cueDeltaX = cueBallX - mouseX;
        const cueDeltaY = cueBallY - mouseY;
        const cueAngle = atan2(cueDeltaY, cueDeltaX);

        // 2. For SHOT PATH: angle from cue ball to mouse (ball direction)
        const shotDeltaX = mouseX - cueBallX;
        const shotDeltaY = mouseY - cueBallY;
        const shotAngle = atan2(shotDeltaY, shotDeltaX);

        // Draw shot path first (in background)
        if (this.showShotPath) {
            this.drawShotPath(cueBallX, cueBallY, shotAngle);
        }

        // Then draw the cue on top
        this.drawCueStick(cueBallX, cueBallY, cueAngle);
    }

    drawCueStick(cueBallX, cueBallY, cueAngle) {
        const cueStartDistance = this.cueBall.diameter / 2 + 10;
        const cueStartX = cueBallX + cos(cueAngle) * cueStartDistance;
        const cueStartY = cueBallY + sin(cueAngle) * cueStartDistance;
        const cueEndX = cueStartX + cos(cueAngle) * this.size.x;
        const cueEndY = cueStartY + sin(cueAngle) * this.size.x;

        push();
        stroke(this.color);
        strokeWeight(this.size.y);
        strokeCap(ROUND);
        line(cueStartX, cueStartY, cueEndX, cueEndY);
        pop();
    }

    drawShotPath(cueBallX, cueBallY, shotAngle) {
        push();
        stroke(this.shotPathColor);
        strokeWeight(2);

        // Draw dotted line
        const segmentLength = 10;
        const gapLength = 5;
        const totalSegmentLength = segmentLength + gapLength;
        const numSegments = this.shotPathLength / totalSegmentLength;

        // Start just outside the cue ball
        const startDistance = this.cueBall.diameter / 2 + 5;
        let currentX = cueBallX + cos(shotAngle) * startDistance;
        let currentY = cueBallY + sin(shotAngle) * startDistance;

        for (let i = 0; i < numSegments; i++) {
            const dotStartX = currentX;
            const dotStartY = currentY;
            const dotEndX = currentX + cos(shotAngle) * segmentLength;
            const dotEndY = currentY + sin(shotAngle) * segmentLength;

            line(dotStartX, dotStartY, dotEndX, dotEndY);

            currentX += cos(shotAngle) * totalSegmentLength;
            currentY += sin(shotAngle) * totalSegmentLength;
        }

        // Draw arrow at the end
        this.drawArrow(
            currentX - cos(shotAngle) * gapLength,
            currentY - sin(shotAngle) * gapLength,
            shotAngle
        );

        pop();
    }

    drawArrow(x, y, angle) {
        push();
        translate(x, y);
        rotate(angle);

        stroke(this.shotPathColor);
        strokeWeight(2);
        fill(this.shotPathColor);

        // Arrow head
        beginShape();
        vertex(0, 0);
        vertex(-10, -5);
        vertex(-10, 5);
        endShape(CLOSE);

        pop();
    }
}