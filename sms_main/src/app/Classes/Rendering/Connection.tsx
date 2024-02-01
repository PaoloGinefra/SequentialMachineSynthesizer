import Node from "./Node";
import p5 from "p5";
import FSA from "../FSA";

export default class Connection {
    static CONNECTION_COLOR = "white";
    static CONNECTION_STROKE_WEIGHT = 1;
    static ARROWHEAD_SIZE = 4;
    static SELF_LOOP_RADIUS_SCALE = 0.7;
    static SELF_LOOP_OFFSET_SCALE = 1.2;
    static LABEL_FONT_SIZE = 16;
    static LABEL_COLOR = "white";
    static LABEL_BACKGROUND_COLOR = "black";
    static LABEL_FONT = "Arial";

    private label: string = "";

    constructor(private from: Node, private to: Node, private input: number, private output: number) {
        this.label = input + " | ";
        if (output != FSA.DONT_CARE) {
            this.label += output;
        }
        else {
            this.label += "-";
        }
    }

    private drawSelfLoop(p5: p5) {
        //draw offsetted circle
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.noFill();
        p5.circle(this.from.getPosition().x + Node.NODE_RADIUS * Connection.SELF_LOOP_OFFSET_SCALE, this.from.getPosition().y, 2 * Node.NODE_RADIUS * Connection.SELF_LOOP_RADIUS_SCALE);

        //draw arrowhead
        p5.push();
        let s = (Connection.SELF_LOOP_RADIUS_SCALE + Connection.SELF_LOOP_OFFSET_SCALE + 1) / 2;
        let A = Math.sqrt(s * (s - 1) * (s - Connection.SELF_LOOP_RADIUS_SCALE) * (s - Connection.SELF_LOOP_OFFSET_SCALE));
        let dy = 2 * A / Connection.SELF_LOOP_OFFSET_SCALE;
        let dx = Math.sqrt(1 - dy * dy);

        let offsettedTarget = p5.createVector(dx, dy).mult(Node.NODE_RADIUS).add(this.from.getPosition());
        p5.translate(offsettedTarget);
        p5.fill(Connection.CONNECTION_COLOR);
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

        let angle = p5.atan2(dy, dx);
        p5.rotate(angle + p5.PI / 2);

        dx = Connection.ARROWHEAD_SIZE * p5.cos(p5.PI / 6);
        dy = Connection.ARROWHEAD_SIZE * p5.sin(p5.PI / 6) * 3;
        p5.triangle(-dx, -dy, dx, -dy, 0, 0);
        p5.pop();

        //draw label
        p5.push();
        p5.translate(this.from.getPosition().copy().add(p5.createVector(Node.NODE_RADIUS * (Connection.SELF_LOOP_OFFSET_SCALE + Connection.SELF_LOOP_RADIUS_SCALE), 0)));
        p5.fill(Connection.LABEL_BACKGROUND_COLOR);
        p5.stroke(Connection.LABEL_BACKGROUND_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

        //use text bounds to draw a rectangle around the text
        p5.textFont(Connection.LABEL_FONT);
        let width = p5.textWidth(this.label);
        let height = p5.textAscent() + p5.textDescent();

        p5.rectMode(p5.CENTER);
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.rect(width / 2, 0, 1.5 * width + 10, height + 10, 5);
        p5.rectMode(p5.CORNER);

        p5.fill(Connection.LABEL_COLOR);
        p5.stroke(Connection.LABEL_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.textSize(Connection.LABEL_FONT_SIZE);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.label, width / 2, 0);
        p5.pop();

    }

    private drawNormal(p5: p5) {
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
        let width = p5.textWidth(this.label);
        let height = p5.textAscent() + p5.textDescent();

        p5.rectMode(p5.CENTER);
        p5.stroke(Connection.CONNECTION_COLOR);
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

    public draw(p5: p5) {
        if (this.from == this.to) {
            this.drawSelfLoop(p5);
        }
        else {
            this.drawNormal(p5);
        }
    }
}