import p5 from "p5";
import FSA from "../FSA";
import Node from "./Node";
import { Connection, NormalConnection, SelfLoopConnection, SymmetricConnection } from "./Connection";

export default class FSARenderer {
    private nodes: Node[] = [];
    private connections: Connection[] = [];
    private targetConnectionLength: number = 300;
    private springConstant: number = 0.001;

    constructor(private fsa: FSA, p5: p5) {
        this.nodesFromFSA(p5);
        this.connectionsFromFSA(p5);
    }

    public draw(p5: p5) {
        this.connections.forEach(connection => connection.draw(p5));
        this.nodes.forEach(node => node.draw(p5));
    }

    private nodesFromFSA(p5: p5) {
        this.nodes = [];
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            this.nodes.push(new Node(p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height)), i.toString()));
        }
    }

    private connectionsFromFSA(p5: p5) {
        this.connections = [];
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            let connectionsHash: { [key: number]: Connection } = {};
            for (let j = 0; j < this.fsa.getNSymbols(); j++) {
                let nextState = this.fsa.getState(i, j);
                let nextSymbol = this.fsa.getSymbol(i, j);
                if (nextState != FSA.DONT_CARE) {
                    if (connectionsHash[nextState] == undefined) {
                        if (i == nextState)
                            connectionsHash[nextState] = new SelfLoopConnection(this.nodes[i], j, nextSymbol);
                        else if (Array.from(Array(this.fsa.getNSymbols()).keys()).some(k => this.fsa.getState(nextState, k) == i)) {
                            console.log("symmetric: " + i + " " + nextState)
                            connectionsHash[nextState] = new SymmetricConnection(this.nodes[i], this.nodes[nextState], j, nextSymbol, i < nextState);
                        }
                        else {
                            connectionsHash[nextState] = new NormalConnection(this.nodes[i], this.nodes[nextState], j, nextSymbol);
                        }
                    }
                    else {
                        if (i != nextState)
                            connectionsHash[nextState].addInputOutput(j, nextSymbol);
                    }
                }
            }
            for (let nextState in connectionsHash) {
                this.connections.push(connectionsHash[nextState]);
            }
        }
    }

    private getForce(node1: Node, node2: Node) {
        let dir = node2.getPosition().copy().sub(node1.getPosition());
        let distance = dir.mag();
        //let force = dir.normalize().mult(this.springConstant * Math.log(distance / this.targetConnectionLength));
        let force = dir.normalize().mult(this.springConstant * (-Math.pow(this.targetConnectionLength, 2) / distance + Math.pow(distance, 2) / this.targetConnectionLength));
        return force;
    }

    private normalizeNodes(p5: p5) {
        let offset = this.nodes.reduce((acc, node) => acc.add(node.getPosition()), p5.createVector(0, 0)).div(this.nodes.length).mult(-1);
        this.nodes.forEach(node => node.applyForce(offset));

        // let maxDistance = this.nodes.reduce((acc, node) => Math.max(acc, node.getPosition().mag()), 0);
        // let scaleFactor = p5.min(p5.width / 2, p5.height / 2) / maxDistance;
        // if (scaleFactor < 1)
        //     this.nodes.forEach(node => node.scalePosition(scaleFactor));
    }

    public simulationStep(p5: p5) {
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            let node = this.nodes[i];
            let force = p5.createVector(0, 0);
            for (let j = 0; j < this.fsa.getNStates(); j++) {
                if (i != j && this.fsa.getState(i, j) != FSA.DONT_CARE) {
                    force.add(this.getForce(node, this.nodes[j]));
                }
            }
            node.applyForce(force);
        }

        this.normalizeNodes(p5);
    }
}