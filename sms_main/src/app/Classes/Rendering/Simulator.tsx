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

export class ChainedElectronSimulator implements Simulator {
    public renderer: FSARenderer;
    private targetConnectionLength: number = 200;
    private electronConstant: number = 100000;
    private chainConstant: number = 0.1;
    private radialConstant: number = 0;
    private chainPasses: number = 1;

    constructor(renderer: FSARenderer) {
        this.renderer = renderer;
    }

    private applyElectornForces(node1: Node, node2: Node) {
        let dir = node2.getPosition().copy().sub(node1.getPosition());
        let distance = dir.mag();
        let force = dir.normalize().mult(-this.electronConstant / Math.pow(distance, 2));
        node1.applyForce(force);
        node2.applyForce(force.mult(-1));
    }

    private applyChainForces(node1: Node, node2: Node, p5: p5) {
        let dir = node2.getPosition().copy().sub(node1.getPosition());
        let distance = dir.mag();
        let direction = dir.normalize();
        if (distance > this.targetConnectionLength) {
            let force = direction.mult(distance - this.targetConnectionLength).div(2).mult(this.chainConstant);
            node1.applyForce(force);
            node2.applyForce(force.mult(-1));
        }
    }

    private applyRadialForce(node1: Node, p5: p5) {
        let distance = node1.getPosition().mag();
        let force = node1.getPosition().copy().normalize().mult(1 / Math.pow(distance, 2)).mult(this.radialConstant);
        node1.applyForce(force);
    }

    public simulationStep(p5: p5) {
        let nodes = this.renderer.getNodes();

        for (let i = 0; i < nodes.length; i++) {
            this.applyRadialForce(nodes[i], p5);
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                this.applyElectornForces(nodes[i], nodes[j]);
            }
        }

        for (let pass = 0; pass < this.chainPasses; pass++) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = 0; j < nodes.length; j++) {
                    if (i != j && this.renderer.getConnection(i, j) != undefined) {
                        this.applyChainForces(nodes[i], nodes[j], p5);
                    }
                }
            }
        }

        this.renderer.normalizeNodesToCenter(p5);
    }
}