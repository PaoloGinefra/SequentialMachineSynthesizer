import Node from "./Node";
import p5 from "p5";
import FSA from "../FSA";

export abstract class Connection {
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
    private inputs: number[] = [];
    private outputs: number[] = [];

    constructor(private from: Node, private to: Node, private input: number, private output: number) {
        this.addInputOutput(input, output);
    }

    public getFrom() {
        return this.from;
    }

    public getTo() {
        return this.to;
    }

    public getLabel() {
        return this.label;
    }

    private UpdateLabel() {
        this.label = "";
        for (let i = 0; i < this.inputs.length; i++) {
            this.label += this.inputs[i]
            if (i < this.inputs.length - 1) {
                this.label += ",";
            }
        }
        this.label += " | ";
        for (let i = 0; i < this.outputs.length; i++) {
            if (this.outputs[i] != FSA.DONT_CARE) {
                this.label += this.outputs[i]
            }
            else {
                this.label += "-";
            }

            if (i < this.outputs.length - 1) {
                this.label += ",";
            }
        }
    }

    public addInputOutput(input: number, output: number) {
        this.inputs.push(input);
        this.outputs.push(output);
        this.UpdateLabel();
    }

    // private drawSelfLoop(p5: p5) {
    //     let dirK = this.from.getPosition().x > 0 ? 1 : -1;

    //     //draw offsetted circle
    //     p5.stroke(Connection.CONNECTION_COLOR);
    //     p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
    //     p5.noFill();
    //     p5.circle(this.from.getPosition().x + dirK * Node.NODE_RADIUS * Connection.SELF_LOOP_OFFSET_SCALE, this.from.getPosition().y, 2 * Node.NODE_RADIUS * Connection.SELF_LOOP_RADIUS_SCALE);

    //     //draw arrowhead
    //     p5.push();
    //     let s = (Connection.SELF_LOOP_RADIUS_SCALE + Connection.SELF_LOOP_OFFSET_SCALE + 1) / 2;
    //     let A = Math.sqrt(s * (s - 1) * (s - Connection.SELF_LOOP_RADIUS_SCALE) * (s - Connection.SELF_LOOP_OFFSET_SCALE));
    //     let dy = 2 * A / Connection.SELF_LOOP_OFFSET_SCALE;
    //     let dx = dirK * Math.sqrt(1 - dy * dy);

    //     let offsettedTarget = p5.createVector(dx, dy).mult(Node.NODE_RADIUS).add(this.from.getPosition());
    //     p5.translate(offsettedTarget);
    //     p5.fill(Connection.CONNECTION_COLOR);
    //     p5.stroke(Connection.CONNECTION_COLOR);
    //     p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

    //     let angle = p5.atan2(dy, dx);
    //     p5.rotate(angle + p5.PI / 2);

    //     dx = Connection.ARROWHEAD_SIZE * p5.cos(p5.PI / 6);
    //     dy = Connection.ARROWHEAD_SIZE * p5.sin(p5.PI / 6) * 3;
    //     p5.triangle(-dx, -dy, dx, -dy, 0, 0);
    //     p5.pop();

    //     //draw label
    //     p5.push();
    //     p5.translate(this.from.getPosition().copy().add(p5.createVector(dirK * Node.NODE_RADIUS * (Connection.SELF_LOOP_OFFSET_SCALE + Connection.SELF_LOOP_RADIUS_SCALE), 0)));
    //     p5.fill(Connection.LABEL_BACKGROUND_COLOR);
    //     p5.stroke(Connection.LABEL_BACKGROUND_COLOR);
    //     p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

    //     //use text bounds to draw a rectangle around the text
    //     p5.textFont(Connection.LABEL_FONT);
    //     let width = p5.textWidth(this.label);
    //     let height = p5.textAscent() + p5.textDescent();

    //     p5.rectMode(p5.CENTER);
    //     p5.stroke(Connection.CONNECTION_COLOR);
    //     p5.rect(dirK * width / 2, 0, width + 10, height + 10, 5);
    //     p5.rectMode(p5.CORNER);

    //     p5.fill(Connection.LABEL_COLOR);
    //     p5.stroke(Connection.LABEL_COLOR);
    //     p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
    //     p5.textSize(Connection.LABEL_FONT_SIZE);
    //     p5.textAlign(p5.CENTER, p5.CENTER);
    //     p5.text(this.label, width / 2 * dirK, 0);
    //     p5.pop();

    // }

    public draw(p5: p5) {
    }
}

export class NormalConnection extends Connection {
    constructor(from: Node, to: Node, input: number, output: number) {
        super(from, to, input, output);
    }

    public draw(p5: p5) {
        let from = this.getFrom();
        let to = this.getTo();
        let label = this.getLabel();

        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.line(from.getPosition().x, from.getPosition().y, to.getPosition().x, to.getPosition().y);

        //draw arrowhead
        let dir = p5.createVector(to.getPosition().x - from.getPosition().x, to.getPosition().y - from.getPosition().y);
        let angle = p5.atan2(dir.y, dir.x);

        let offsettedTarget = p5.createVector(to.getPosition().x, to.getPosition().y).sub(dir.normalize().mult(Node.NODE_RADIUS));
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
        p5.translate(from.getPosition().copy().add(to.getPosition()).div(2));
        p5.fill(Connection.LABEL_BACKGROUND_COLOR);
        p5.stroke(Connection.LABEL_BACKGROUND_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

        //use text bounds to draw a rectangle around the text
        p5.textFont(Connection.LABEL_FONT);
        let width = p5.textWidth(label);
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
        p5.text(label, 0, 0);
        p5.pop();
    }

}

export class SelfLoopConnection extends Connection {
    constructor(from: Node, input: number, output: number) {
        super(from, from, input, output);
    }

    public draw(p5: p5) {
        let from = this.getFrom();
        let label = this.getLabel();

        let dirK = from.getPosition().x > 0 ? 1 : -1;

        //draw offsetted circle
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.noFill();
        p5.circle(from.getPosition().x + dirK * Node.NODE_RADIUS * Connection.SELF_LOOP_OFFSET_SCALE, from.getPosition().y, 2 * Node.NODE_RADIUS * Connection.SELF_LOOP_RADIUS_SCALE);

        //draw arrowhead
        p5.push();
        let s = (Connection.SELF_LOOP_RADIUS_SCALE + Connection.SELF_LOOP_OFFSET_SCALE + 1) / 2;
        let A = Math.sqrt(s * (s - 1) * (s - Connection.SELF_LOOP_RADIUS_SCALE) * (s - Connection.SELF_LOOP_OFFSET_SCALE));
        let dy = 2 * A / Connection.SELF_LOOP_OFFSET_SCALE;
        let dx = dirK * Math.sqrt(1 - dy * dy);

        let offsettedTarget = p5.createVector(dx, dy).mult(Node.NODE_RADIUS).add(from.getPosition());
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
        p5.translate(from.getPosition().copy().add(p5.createVector(dirK * Node.NODE_RADIUS * (Connection.SELF_LOOP_OFFSET_SCALE + Connection.SELF_LOOP_RADIUS_SCALE), 0)));
        p5.fill(Connection.LABEL_BACKGROUND_COLOR);
        p5.stroke(Connection.LABEL_BACKGROUND_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

        //use text bounds to draw a rectangle around the text
        p5.textFont(Connection.LABEL_FONT);
        let width = p5.textWidth(label);
        let height = p5.textAscent() + p5.textDescent();

        p5.rectMode(p5.CENTER);
        p5.stroke(Connection.CONNECTION_COLOR);
        p5.rect(dirK * width / 2, 0, width + 10, height + 10, 5);
        p5.rectMode(p5.CORNER);

        p5.fill(Connection.LABEL_COLOR);
        p5.stroke(Connection.LABEL_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.textSize(Connection.LABEL_FONT_SIZE);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(label, width / 2 * dirK, 0);
        p5.pop();
    }
}

export class SymmetricConnection extends Connection {
    private ImFirst: boolean = false;
    constructor(from: Node, to: Node, input: number, output: number, ImFirst: boolean) {
        super(from, to, input, output);
        this.ImFirst = ImFirst;
    }

    draw(p5: p5) {
        let from = this.getFrom();
        let to = this.getTo();
        let label = this.getLabel();

        let middlePoint = from.getPosition().copy().add(to.getPosition()).div(2);

        let width = p5.textWidth(label);
        let height = p5.textAscent() + p5.textDescent();

        let labelCenter = middlePoint.copy().add(p5.createVector(this.ImFirst ? width / 2 : -width / 2, this.ImFirst ? height / 2 : -height / 2));


        p5.stroke(Connection.CONNECTION_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.line(from.getPosition().x, from.getPosition().y, labelCenter.x, labelCenter.y);
        p5.line(to.getPosition().x, to.getPosition().y, labelCenter.x, labelCenter.y);

        //draw arrowhead
        let dir = p5.createVector(to.getPosition().x - labelCenter.x, to.getPosition().y - labelCenter.y);
        let angle = p5.atan2(dir.y, dir.x);

        let offsettedTarget = p5.createVector(to.getPosition().x, to.getPosition().y).sub(dir.normalize().mult(Node.NODE_RADIUS));
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
        p5.translate(middlePoint);
        p5.fill(Connection.LABEL_BACKGROUND_COLOR);
        p5.stroke(Connection.LABEL_BACKGROUND_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);

        //use text bounds to draw a rectangle around the text
        p5.textFont(Connection.LABEL_FONT);

        p5.rectMode(p5.CORNER);
        p5.stroke(Connection.CONNECTION_COLOR);
        if (this.ImFirst)
            p5.rect(0, 0, width + 10, height + 10, 5);
        else
            p5.rect(-width - 10, -height - 10, width + 10, height + 10, 5);

        p5.fill(Connection.LABEL_COLOR);
        p5.stroke(Connection.LABEL_COLOR);
        p5.strokeWeight(Connection.CONNECTION_STROKE_WEIGHT);
        p5.textSize(Connection.LABEL_FONT_SIZE);
        p5.textAlign(p5.CENTER, p5.CENTER);
        if (this.ImFirst)
            p5.text(label, (width + 10) / 2, (height + 10) / 2);
        else
            p5.text(label, -(width + 10) / 2, -(height + 10) / 2);

        p5.pop();

    }
}