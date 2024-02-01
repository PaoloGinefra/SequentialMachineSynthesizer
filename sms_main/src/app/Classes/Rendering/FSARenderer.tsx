import p5 from "p5";
import FSA from "../FSA";
import Node from "./Node";
import Connection from "./Connection";

export default class FSARenderer {
    private nodes: Node[] = [];
    private connections: Connection[] = [];

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
            for (let j = 0; j < this.fsa.getNSymbols(); j++) {
                let nextState = this.fsa.getState(i, j);
                let nextSymbol = this.fsa.getSymbol(i, j);
                if (nextState != FSA.DONT_CARE) {
                    this.connections.push(new Connection(this.nodes[i], this.nodes[nextState], j, nextSymbol));
                }
            }
        }
    }
}