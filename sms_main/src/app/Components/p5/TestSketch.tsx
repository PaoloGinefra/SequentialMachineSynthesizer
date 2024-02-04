import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { useEffect, useState } from "react";

import FSARenderer from "@/app/Classes/Rendering/FSARenderer";
import FSA from "@/app/Classes/FSA";

import p5 from 'p5';
import InputHandler from "@/app/Classes/Input/InputHandler";
import { Translate, Scale } from "@/app/Classes/Input/Action";

type MySketchProps = SketchProps & {
    rotation: number;
};
let inputHandler: InputHandler;

function sketch(p5: P5CanvasInstance<MySketchProps>) {
    let rotation = 0;
    let fsa = new FSA(undefined, 50, 2);
    let fsaRenderer: FSARenderer;

    inputHandler = new InputHandler(p5, new Translate(p5));
    inputHandler.addAction(new Scale(p5));

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth * 0.8, 800);
        fsaRenderer = new FSARenderer(fsa, p5);
        console.log(fsa.toString());
    }


    p5.updateWithProps = (props: MySketchProps) => {
        if (props.rotation) {
            rotation = (props.rotation * Math.PI) / 180;
        }
    };

    p5.draw = () => {
        p5.background(20);
        p5.translate(p5.width / 2, p5.height / 2);
        inputHandler.loop(p5);
        fsaRenderer.draw(p5);

        fsaRenderer.simulationStep(p5);
    };

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth * 0.8, 800);
    }

    p5.mouseClicked = () => {
        inputHandler.mouseClicked(p5);
    }

    p5.mousePressed = () => {
        inputHandler.mousePressed(p5);
    }

    p5.mouseReleased = () => {
        inputHandler.mouseReleased(p5);
    }
}

export default function TestSketch() {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => setRotation(rotation => rotation + 100),
            100
        );

        return () => {
            clearInterval(interval);
        };
    }, []);

    return <>
        <NextReactP5Wrapper sketch={sketch} rotation={rotation} />
        {inputHandler && inputHandler.render()}
    </>
}