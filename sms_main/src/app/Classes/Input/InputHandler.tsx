import { Action, Translate } from "./Action"
import p5 from 'p5';

export default class InputHandler {
    private action: Action;
    constructor(defaultAction: Action) {
        this.action = defaultAction;
    }

    public setAction(action: Action) {
        this.action = action;
    }

    public mouseClicked(p5: p5) {
        this.action.mouseClicked(p5);
    }

    public mousePressed(p5: p5) {
        this.action.mousePressed(p5);
    }

    public mouseReleased(p5: p5) {
        this.action.mouseReleased(p5);
    }

    public loop(p5: p5) {
        this.action.loop(p5);
    }
}