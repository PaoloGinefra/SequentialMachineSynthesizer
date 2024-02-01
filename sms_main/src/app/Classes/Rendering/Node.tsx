import p5 from 'p5';

export default class Node {
    static NODE_RADIUS = 25;
    static NODE_COLOR = "black";
    static NODE_STROKE = "white";
    static NODE_STROKE_WEIGHT = 1;
    static NODE_FONT_SIZE = 16;
    static NODE_FONT_COLOR = "white";

    constructor(private position: p5.Vector, private label: string) { }

    public draw(p5: p5) {
        p5.fill(Node.NODE_COLOR);
        p5.stroke(Node.NODE_STROKE);
        p5.strokeWeight(Node.NODE_STROKE_WEIGHT);
        p5.circle(this.position.x, this.position.y, 2 * Node.NODE_RADIUS);

        p5.fill(Node.NODE_FONT_COLOR);
        p5.textSize(Node.NODE_FONT_SIZE);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.label, this.position.x, this.position.y);
    }

    public getPosition() {
        return this.position;
    }

    public applyForce(force: p5.Vector) {
        this.position.add(force);
    }

    public scalePosition(scaleFactor: number) {
        this.position.mult(scaleFactor);
    }
}