import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";
import FSA from "./FSA";

enum Distinguibility {
    LOOK_AHEAD,
    DISTINGUISHABLE,
    INDISTINGUISHABLE,
    COMPATIBLE
}

export default class Minimizer {
    private fsa: FSA;
    private DistinguibilityArray: Distinguibility[];
    private LookAheadHashMap: Map<number, number[]>;
    private minimizedStates: number[][] | undefined = undefined;
    private minimizedFSA: FSA | undefined = undefined;

    constructor(fsa: FSA) {
        this.fsa = fsa;
        this.DistinguibilityArray = new Array(this.fsa.getNStates() * (this.fsa.getNStates() + 1) / 2);
        this.LookAheadHashMap = new Map();
        this.fillDistinguibilityArray();
        this.minimize();
    }

    static cantorPairing(a: number, b: number) {
        return (((a + b) * (a + b + 1)) / 2) + b;
    }

    private getIndex(i: number, j: number) {
        if (i === j) {
            throw new Error("i and j cannot be equal to each other: " + i + " " + j);
        }

        if (i > this.fsa.getNStates() || j > this.fsa.getNStates()) {
            throw new Error("i and j cannot be greater than the number of states");
        }

        if (i > j) {
            let temp = i;
            i = j;
            j = temp;
        }

        return Minimizer.cantorPairing(i, j);
    }

    private getDistinguibility(i: number, j: number) {
        return this.DistinguibilityArray[this.getIndex(i, j)];
    }

    private setDistinguibility(i: number, j: number, value: Distinguibility) {
        this.DistinguibilityArray[this.getIndex(i, j)] = value;
    }

    private deleteLookAhead(i: number, j: number) {
        this.LookAheadHashMap.delete(this.getIndex(i, j));
    }

    private addLookAhead(i: number, j: number, lookAhead: number[]) {
        this.LookAheadHashMap.set(this.getIndex(i, j), lookAhead);
    }

    private getLookAhead(i: number, j: number) {
        let lookAhead = this.LookAheadHashMap.get(this.getIndex(i, j));

        if (lookAhead === undefined) {
            throw new Error("LookAhead not found");
        }

        let isIndistinguishable = true;
        let isCompatible = true;
        for (let k = 0; k < lookAhead.length; k += 2) {
            let distinguibility = this.getDistinguibility(lookAhead[k], lookAhead[k + 1]);
            isIndistinguishable = isIndistinguishable && (distinguibility == Distinguibility.INDISTINGUISHABLE);
            isCompatible = isCompatible && ((distinguibility == Distinguibility.COMPATIBLE) || (distinguibility == Distinguibility.INDISTINGUISHABLE));
            if (distinguibility == Distinguibility.DISTINGUISHABLE) {
                this.deleteLookAhead(i, j);
                return Distinguibility.DISTINGUISHABLE;
            }
        }
        if (isIndistinguishable) {
            this.deleteLookAhead(i, j);
            return Distinguibility.INDISTINGUISHABLE;
        }
        if (isCompatible) {
            this.deleteLookAhead(i, j);
            return Distinguibility.COMPATIBLE;
        }
        return Distinguibility.LOOK_AHEAD;
    }

    private fillDistinguibilityArray() {
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            for (let j = i + 1; j < this.fsa.getNStates(); j++) {
                let isIndistinguishable = true;
                let isCompatible = true;
                let isLookAhead = true;
                let lookAhead = new Array<number>();
                for (let k = 0; k < this.fsa.getNSymbols(); k++) {
                    let i_next = this.fsa.getSymbol(i, k);
                    let j_next = this.fsa.getSymbol(j, k);

                    let i_next_state = this.fsa.getState(i, k);
                    let j_next_state = this.fsa.getState(j, k);

                    isIndistinguishable = isIndistinguishable && (i_next == j_next) && i_next_state == j_next_state;

                    isCompatible = isCompatible &&
                        (i_next == j_next || i_next == FSA.DONT_CARE || j_next == FSA.DONT_CARE) &&
                        (i_next_state == j_next_state || i_next_state == FSA.DONT_CARE || j_next_state == FSA.DONT_CARE);

                    if (i_next_state != FSA.DONT_CARE && j_next_state != FSA.DONT_CARE && i_next_state != j_next_state && !(i == i_next_state && j == j_next_state || i == j_next_state && j == i_next_state)) {
                        lookAhead.push(i_next_state);
                        lookAhead.push(j_next_state);
                    }

                    if (i_next != FSA.DONT_CARE && j_next != FSA.DONT_CARE && i_next != j_next) {
                        isLookAhead = false;
                        this.setDistinguibility(i, j, Distinguibility.DISTINGUISHABLE);
                        break
                    }
                }
                if (isIndistinguishable) {
                    this.setDistinguibility(i, j, Distinguibility.INDISTINGUISHABLE);
                }
                else if (isCompatible) {
                    this.setDistinguibility(i, j, Distinguibility.COMPATIBLE);
                }
                else if (isLookAhead) {
                    this.setDistinguibility(i, j, Distinguibility.LOOK_AHEAD);
                    this.addLookAhead(i, j, lookAhead);
                }
            }
        }
    }

    private minimize() {
        let isMinimized = false;
        while (!isMinimized) {
            isMinimized = true;
            for (let i = 0; i < this.fsa.getNStates(); i++) {
                for (let j = i + 1; j < this.fsa.getNStates(); j++) {
                    let distinguibility = this.getDistinguibility(i, j);
                    if (distinguibility == Distinguibility.LOOK_AHEAD) {
                        let newDistinguibility = this.getLookAhead(i, j);
                        this.setDistinguibility(i, j, newDistinguibility);
                        isMinimized = isMinimized && (distinguibility == newDistinguibility);
                    }
                }
            }
        }
    }

    private computeMinimizedStates() {
        let states: number[] = new Array(this.fsa.getNStates());
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            states[i] = i;
        }

        let queue = [states];
        for (let i = 0; i < this.fsa.getNStates(); i++) {
            let newQueue: number[][] = [];
            while (queue.length > 0) {
                let currentStates = queue.pop();
                if (currentStates === undefined) {
                    break;
                }

                if (!currentStates?.includes(i)) {
                    newQueue.push(currentStates);
                    continue;
                }

                let left = currentStates?.filter((state) => state != i)
                if (left.length > 0) {
                    newQueue.push(left);
                }

                let right = currentStates?.filter((state) => (state == i) || this.getDistinguibility(state, i) != Distinguibility.DISTINGUISHABLE);
                if (right.length > 0) {
                    newQueue.push(right);
                }
            }
            queue = [];

            newQueue.forEach((states1, i) => {
                if (!newQueue.some((states2, j) => i != j && states1?.every((s) => states2?.includes(s)))) {
                    queue.push(states1);
                }
            }
            );

        }

        this.minimizedStates = queue;
    }

    public getMinimizedStates() {
        if (this.minimizedStates === undefined) {
            this.computeMinimizedStates();
        }
        return this.minimizedStates;
    }

    private computeMinimizedFSA() {
        let newStates = this.getMinimizedStates();

        if (newStates === undefined) {
            throw new Error("newStates is undefined, this should never happen");
        }

        let newFSA = new FSA(undefined, newStates.length, this.fsa.getNSymbols());
        for (let i = 0; i < newStates.length; i++) {
            for (let j = 0; j < this.fsa.getNSymbols(); j++) {
                let nextStates = new Set<number>();
                let nextSymbols = new Set<number>();

                for (let k = 0; k < newStates[i].length; k++) {
                    let state = newStates[i][k];
                    let nextState = this.fsa.getState(state, j);
                    let nextSymbol = this.fsa.getSymbol(state, j);

                    if (nextState != FSA.DONT_CARE) {
                        nextStates.add(nextState);
                    }

                    if (nextSymbol != FSA.DONT_CARE) {
                        nextSymbols.add(nextSymbol);
                    }
                }

                let nextStatesArray = Array.from(nextStates);
                let nextNewState = newStates.findIndex((state) => nextStatesArray.every((s) => state.includes(s)));

                if (nextNewState == -1) {
                    throw new Error("nextNewState not found, this should never happen:\n" + "\nnextStatesArray:" + nextStatesArray + "\nnextStates:" + newStates);
                }

                newFSA = newFSA.setState(i, j, nextNewState);

                if (nextSymbols.size > 1) {
                    throw new Error("nextSymbols.size > 1, this should never happen: " + nextSymbols + " " + nextStates);
                }

                if (nextSymbols.size != 0) {
                    newFSA = newFSA.setSymbol(i, j, nextSymbols.values().next().value);
                }
            }
        }

        this.minimizedFSA = newFSA;
    }

    public getMinimizedFSA() {
        if (this.minimizedFSA === undefined) {
            this.computeMinimizedFSA();
        }

        if (this.minimizedFSA === undefined) {
            throw new Error("this.minimizedFSA is undefined, this should never happen");
        }

        return this.minimizedFSA;
    }

    public toString() {
        let str = "";
        str += "Distinguibility Array\n";
        str += "-----------------------\n";


        for (let i = 1; i < this.fsa.getNStates(); i++) {
            str += i + " | ";
            for (let j = 0; j < i; j++) {
                let distinguibility = this.getDistinguibility(i, j);

                if (distinguibility == Distinguibility.DISTINGUISHABLE) {
                    str += "X";
                }
                else if (distinguibility == Distinguibility.INDISTINGUISHABLE) {
                    str += "V";
                }
                else if (distinguibility == Distinguibility.COMPATIBLE) {
                    str += "~";
                }
                else {
                    str += "L";
                }
                str += " | ";
            }
            str += "\n";
        }

        str += "# | ";
        for (let i = 0; i < this.fsa.getNStates() - 1; i++) {
            str += i + " | ";
        }
        str += "\n";


        str += "Look Ahead HashMap\n";
        str += "-----------------------\n";

        for (let i = 1; i < this.fsa.getNStates(); i++) {
            for (let j = 0; j < i; j++) {
                let lookAhead = this.LookAheadHashMap.get(this.getIndex(i, j));
                if (lookAhead) {
                    str += i + " " + j + " | " + lookAhead + "\n";
                }
            }
        }
        return str;
    }
}
