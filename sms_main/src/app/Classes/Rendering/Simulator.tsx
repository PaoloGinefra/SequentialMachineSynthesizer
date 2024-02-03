import FSARenderer from "./FSARenderer";
import p5 from "p5";
import Node from "./Node";

export interface Simulator {
    simulationStep(p5: p5): void;
    renderer: FSARenderer;
}

export class SpringEmbeddingSimulator implements Simulator {
    public renderer: FSARenderer;
    private targetConnectionLength: number = 300;
    private springConstant: number = 0.001;

    constructor(renderer: FSARenderer) {
        this.renderer = renderer;
    }

    private getForce(node1: Node, node2: Node) {
        let dir = node2.getPosition().copy().sub(node1.getPosition());
        let distance = dir.mag();
        //let force = dir.normalize().mult(this.springConstant * Math.log(distance / this.targetConnectionLength));
        let force = dir.normalize().mult(this.springConstant * (-Math.pow(this.targetConnectionLength, 2) / distance + Math.pow(distance, 2) / this.targetConnectionLength));
        return force;
    }

    public simulationStep(p5: p5) {
        let nodes = this.renderer.getNodes();
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let force = p5.createVector(0, 0);

            for (let j = 0; j < nodes.length; j++) {
                if (i != j && this.renderer.getConnection(i, j) != undefined) {
                    force.add(this.getForce(node, nodes[j]));
                }
            }
            node.applyForce(force);
        }

        this.renderer.normalizeNodesToCenter(p5);
    }
}