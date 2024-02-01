import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { useEffect, useState } from "react";

import FSARenderer from "@/app/Classes/Rendering/FSARenderer";
import FSA from "@/app/Classes/FSA";

type MySketchProps = SketchProps & {
    rotation: number;
};

function sketch(p5: P5CanvasInstance<MySketchProps>) {
    let rotation = 0;
    let fsa = new FSA(undefined, 5, 5);
    let fsaRenderer: FSARenderer;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth * 0.8, 400);
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
        fsaRenderer.draw(p5);
    };

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth * 0.8, 400);
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

    return <NextReactP5Wrapper sketch={sketch} rotation={rotation} />;
}