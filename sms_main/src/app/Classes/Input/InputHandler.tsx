import React from "react";
import { Action, Translate } from "./Action"
import p5 from 'p5';

export default class InputHandler extends React.Component {
    private actions: Action[] = [];
    constructor(props: any, defaultAction: Action) {
        super(props);
        this.actions = [defaultAction];

        this.state = {
            actions: [defaultAction]
        }
    }

    public addAction(action: Action) {
        this.actions.push(action);

        this.setState({
            actions: this.actions
        });
    }

    private mouseIn(p5: p5) {
        return p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height;
    }

    public mouseClicked(p5: p5) {
        if (!this.mouseIn(p5)) return;
        this.actions.forEach(action => action.mouseClicked(p5));
    }

    public mousePressed(p5: p5) {
        if (!this.mouseIn(p5)) return;
        this.actions.forEach(action => action.mousePressed(p5));
    }

    public mouseReleased(p5: p5) {
        this.actions.forEach(action => action.mouseReleased(p5));
    }

    public loop(p5: p5) {
        this.actions.forEach(action => action.loop(p5));
    }

    public render() {
        return <div className="flex flex-col gap-5 justify-center my-10">
            {this.actions.map(action => action.render())}
        </div>
    }
}