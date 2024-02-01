import Node from "./Node";
import p5 from "p5";

export default class Connection {
    static CONNECTION_COLOR = "white";
    static CONNECTION_STROKE_WEIGHT = 1;
    static ARROWHEAD_SIZE = 4;
    static LABEL_FONT_SIZE = 16;
    static LABEL_COLOR = "white";
    static LABEL_BACKGROUND_COLOR = "black";
    static LABEL_FONT = "Arial";

    private label: string = "";

    constructor(private from: Node, private to: Node, private input: number, private output: number) {
        this.label = input + " | " + output;
    }

    public draw(p5: p5) {
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.line(this.from.getPosition().x, this.from.getPosition().y, this.to.getPosition().x, this.to.getPosition().y);

        //draw arrowhead
        let dir = p5.createVector(this.to.getPosition().x - this.from.getPosition().x, this.to.getPosition().y - this.from.getPosition().y);
        let angle = p5.atan2(dir.y, dir.x);

        let offsettedTarget = p5.createVector(this.to.getPosition().x, this.to.getPosition().y).sub(dir.normalize().mult(Node.NODE_RADIUS));
        p5.push();
        p5.translate(offsettedTarget);
        p5.rotate(angle - p5.HALF_PI);
        p5.fill(Connection.CONNECTION_COLOR);
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

        let dx = Connection.ARROWHEAD_SIZE * p5.cos(p5.PI / 6);
        let dy = Connection.ARROWHEAD_SIZE * p5.sin(p5.PI / 6) * 3;
        p5.triangle(-dx, -dy, dx, -dy, 0, 0);
        p5.pop();

        //draw label
        p5.push();
        p5.translate(this.from.getPosition().copy().add(this.to.getPosition()).div(2));
        p5.fill(Connection.LABEL_BACKGROUND_COLOR);
        p5.stroke(Connection.LABEL_BACKGROUND_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);



        //use text bounds to draw a rectangle around the text
        p5.textFont(Connection.LABEL_FONT);

        let message = p5.text(this.label, 0, 0);
        let width = p5.textWidth(this.label);
        let height = p5.textAscent() + p5.textDescent();

        p5.rectMode(p5.CENTER);
        p5.rect(0, 0, width + 10, height + 10, 5);
        p5.rectMode(p5.CORNER);


        p5.fill(Connection.LABEL_COLOR);
        p5.stroke(Connection.LABEL_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.textSize(Connection.LABEL_FONT_SIZE);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.label, 0, 0);
        p5.pop();
    }
}