import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { useEffect, useState } from "react";

type MySketchProps = SketchProps & {
    rotation: number;
};

function sketch(p5: P5CanvasInstance<MySketchProps>) {
    let rotation = 0;

    p5.setup = () => p5.createCanvas(600, 400, p5.WEBGL);

    p5.updateWithProps = (props: MySketchProps) => {
        if (props.rotation) {
            rotation = (props.rotation * Math.PI) / 180;
        }
    };

    p5.draw = () => {
        p5.background(100);
        p5.normalMaterial();
        p5.noStroke();
        p5.push();
        p5.rotateY(rotation);
        p5.box(100);
        p5.pop();
    };
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