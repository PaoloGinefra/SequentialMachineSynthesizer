import p5 from 'p5';

export interface Action {
    mouseClicked: (p5: p5) => void;
    mousePressed: (p5: p5) => void;
    mouseReleased: (p5: p5) => void;
    loop: (p5: p5) => void;
}

export class Translate implements Action {
    private lastMousePosition: p5.Vector;
    private isDown: boolean = false;
    private offset: p5.Vector;
    private delta: p5.Vector;

    constructor(p5: p5) {
        this.offset = p5.createVector(0, 0);
        this.delta = p5.createVector(0, 0);
        this.lastMousePosition = p5.createVector(0, 0);
    }

    public mouseClicked(p5: p5) {
    }

    public mousePressed(p5: p5) {
        let mousePosition = p5.createVector(p5.mouseX, p5.mouseY);
        this.lastMousePosition = mousePosition;
        this.isDown = true;
    }

    public mouseReleased(p5: p5) {
        this.isDown = false;
        this.offset.add(this.delta);
        this.delta = p5.createVector(0, 0);
    }

    public loop(p5: p5) {
        if (this.isDown) {
            let mousePosition = p5.createVector(p5.mouseX, p5.mouseY);
            this.delta = mousePosition.sub(this.lastMousePosition);
        }
        p5.translate(this.offset);
        p5.translate(this.delta);
    }
}