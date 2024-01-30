export default class FSA {
    static DONT_CARE = -1;
    private n_states: number;
    private n_symbols: number;
    private stateTransitionMatrix: number[][];
    private symbolTransitionMatrix: number[][];

    constructor(other?: FSA, n_states?: number, n_symbols?: number) {
        if (other) {
            this.n_states = other.n_states;
            this.n_symbols = other.n_symbols;
            this.stateTransitionMatrix = this.copyMatrix(other.stateTransitionMatrix);
            this.symbolTransitionMatrix = this.copyMatrix(other.symbolTransitionMatrix);
        }
        else if (n_states && n_symbols) {
            this.n_states = n_states;
            this.n_symbols = n_symbols;
            this.stateTransitionMatrix = new Array(this.n_states);
            this.symbolTransitionMatrix = new Array(this.n_states);
            this.randomStates();
            this.randomSymbols();
        }
        else {
            throw new Error("FSA must be initialized with either another FSA or with n_states and n_symbols");
        }

    }

    private copyMatrix(matrix: number[][]) {
        let copy = new Array(matrix.length);
        for (let i = 0; i < matrix.length; i++) {
            copy[i] = new Array(matrix[i].length);
            for (let j = 0; j < matrix[i].length; j++) {
                copy[i][j] = matrix[i][j];
            }
        }
        return copy;
    }


    private emptyStates() {
        this.stateTransitionMatrix = new Array(this.n_states);
        for (let i = 0; i < this.n_states; i++) {
            this.stateTransitionMatrix[i] = new Array(this.n_symbols);
            for (let j = 0; j < this.n_symbols; j++) {
                this.stateTransitionMatrix[i][j] = FSA.DONT_CARE;
            }
        }
    }

    private emptySymbols() {
        this.symbolTransitionMatrix = new Array(this.n_states);
        for (let i = 0; i < this.n_states; i++) {
            this.symbolTransitionMatrix[i] = new Array(this.n_symbols);
            for (let j = 0; j < this.n_symbols; j++) {
                this.symbolTransitionMatrix[i][j] = FSA.DONT_CARE;
            }
        }
    }

    private randomStates(dcProb: number = 0.5) {
        this.stateTransitionMatrix = new Array(this.n_states);
        for (let i = 0; i < this.n_states; i++) {
            this.stateTransitionMatrix[i] = new Array(this.n_symbols);
            for (let j = 0; j < this.n_symbols; j++) {
                if (Math.random() > dcProb) {
                    this.stateTransitionMatrix[i][j] = Math.floor(Math.random() * this.n_states);
                }
                else {
                    this.stateTransitionMatrix[i][j] = FSA.DONT_CARE;
                }
            }
        }
    }

    private randomSymbols(dcProb: number = 0.5) {
        this.symbolTransitionMatrix = new Array(this.n_states);
        for (let i = 0; i < this.n_states; i++) {
            this.symbolTransitionMatrix[i] = new Array(this.n_symbols);
            for (let j = 0; j < this.n_symbols; j++) {
                if (Math.random() > dcProb) {
                    this.symbolTransitionMatrix[i][j] = Math.floor(Math.random() * this.n_symbols);
                }
                else {
                    this.symbolTransitionMatrix[i][j] = FSA.DONT_CARE;
                }
            }
        }
    }

    private matrixToString(matrix: number[][], title: string, cols: number, rows: number) {
        let str = "";
        str += title + "\n";
        str += "-----------------------\n";
        str += "# | ";

        for (let i = 0; i < cols; i++) {
            str += i + " | ";
        }
        str += "\n";

        for (let i = 0; i < rows; i++) {
            str += i + " | ";
            for (let j = 0; j < cols; j++) {
                if (matrix[i][j] == FSA.DONT_CARE) {
                    str += "- | ";
                }
                else {
                    str += matrix[i][j] + " | ";
                }
            }
            str += "\n";
        }
        return str;
    }


    public toString() {
        return this.matrixToString(
            this.stateTransitionMatrix,
            "State Transition Matrix",
            this.n_symbols,
            this.n_states)
            + "\n" +
            this.matrixToString(
                this.symbolTransitionMatrix,
                "Symbol Transition Matrix",
                this.n_symbols,
                this.n_states);
    }

    public getNStates() {
        return this.n_states;
    }

    public getNSymbols() {
        return this.n_symbols;
    }

    public getState(state: number, symbol: number) {
        return this.stateTransitionMatrix[state][symbol];
    }

    public getSymbol(state: number, symbol: number) {
        return this.symbolTransitionMatrix[state][symbol];
    }

    public setState(state: number, symbol: number, value: number) {
        if (value < 0 || value >= this.n_states) {
            throw new Error("Invalid state value: " + value);
        }

        let newFSA = new FSA(this);
        newFSA.stateTransitionMatrix[state][symbol] = value;
        return newFSA;
    }

    public setSymbol(state: number, symbol: number, value: number) {
        if (value < 0 || value >= this.n_symbols) {
            throw new Error("Invalid symbol value: " + value);
        }

        let newFSA = new FSA(this);
        newFSA.symbolTransitionMatrix[state][symbol] = value;
        return newFSA;
    }

    public setNStates(n_states: number) {
        if (n_states < 1) {
            throw new Error("Invalid number of states: " + n_states);
        }

        let newFSA = new FSA(undefined, n_states, this.n_symbols);
        for (let i = 0; i < Math.min(this.n_states, n_states); i++) {
            for (let j = 0; j < this.n_symbols; j++) {
                newFSA.stateTransitionMatrix[i][j] = this.stateTransitionMatrix[i][j];
            }
        }
        return newFSA;
    }

    public setNSymbols(n_symbols: number) {
        if (n_symbols < 1) {
            throw new Error("Invalid number of symbols: " + n_symbols);
        }

        let newFSA = new FSA(undefined, this.n_states, n_symbols);
        for (let i = 0; i < this.n_states; i++) {
            for (let j = 0; j < Math.min(this.n_symbols, n_symbols); j++) {
                newFSA.stateTransitionMatrix[i][j] = this.stateTransitionMatrix[i][j];
            }
        }
        return newFSA;
    }

}