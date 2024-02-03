import p5 from "p5";
import FSA from "../FSA";
import Node from "./Node";
import { Connection, NormalConnection, SelfLoopConnection, SymmetricConnection } from "./Connection";
import { Simulator, SpringEmbeddingSimulator } from "./Simulator";

export default class FSARenderer {
    private nodes: Node[] = [];
    private connections: Connection[][] = [];
    private simulator: Simulator = new SpringEmbeddingSimulator(this);

    constructor(private fsa: FSA, p5: p5) {
        this.nodesFromFSA(p5);
        this.connectionsFromFSA(p5);
    }

    public draw(p5: p5) {
        this.connections.flatMap(connection => connection).forEach(connection => connection ? connection.draw(p5) : null);
        this.nodes.forEach(node => node.draw(p5));
    }

    private nodesFromFSA(p5: p5) {
        this.nodes = [];
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            this.nodes.push(new Node(p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height)), i.toString()));
        }
    }

    public addConnection(connection: Connection, i: number, j: number) {
        this.connections[i][j] = connection;
    }

    public getConnection(i: number, j: number) {
        return this.connections[i][j];
    }

    private connectionsFromFSA(p5: p5) {
        this.connections = [];
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            this.connections.push([]);
        }

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
                            let isFirst = (i < nextState);
                            connectionsHash[nextState] = new SymmetricConnection(this.nodes[i], this.nodes[nextState], j, nextSymbol, isFirst);
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
                this.connections[i][nextState] = connectionsHash[nextState];
            }
        }
    }

    public normalizeNodesToCenter(p5: p5) {
        let offset = this.nodes.reduce((acc, node) => acc.add(node.getPosition()), p5.createVector(0, 0)).div(this.nodes.length).mult(-1);
        this.nodes.forEach(node => node.applyForce(offset));
    }

    public normalizeNodesToCenterAndScale(p5: p5) {
        this.normalizeNodesToCenter(p5);

        let maxDistance = this.nodes.reduce((acc, node) => Math.max(acc, node.getPosition().mag()), 0);
        let scaleFactor = p5.min(p5.width / 2, p5.height / 2) / maxDistance;
        if (scaleFactor < 1)
            this.nodes.forEach(node => node.scalePosition(scaleFactor));
    }

    public simulationStep(p5: p5) {
        this.simulator.simulationStep(p5);
    }

    public getNodes() {
        return this.nodes;
    }

    public getConnections() {
        return this.connections;
    }
}