import p5 from 'p5';

export interface Action {
    mouseClicked: (p5: p5) => void;
    mousePressed: (p5: p5) => void;
    mouseReleased: (p5: p5) => void;
    loop: (p5: p5) => void;
    render: () => JSX.Element;
}

export class Translate implements Action {
    private lastMousePosition: p5.Vector;
    private isDown: boolean = false;
    private offset: p5.Vector;
    private delta: p5.Vector;
    private p5: p5;

    constructor(p5: p5) {
        this.offset = p5.createVector(0, 0);
        this.delta = p5.createVector(0, 0);
        this.lastMousePosition = p5.createVector(0, 0);
        this.p5 = p5;
    }

    public mouseClicked(p5: p5) {
    }

    public mousePressed(p5: p5) {
        let mousePosition = p5.createVector(p5.mouseX, p5.mouseY);
        this.lastMousePosition = mousePosition;
        this.isDown = true;
    }

    public mouseReleased(p5: p5) {
        this.isDown = false;
        this.offset.add(this.delta);
        this.delta = p5.createVector(0, 0);
    }

    public reset() {
        this.offset = this.p5.createVector(0, 0);
        this.delta = this.p5.createVector(0, 0);
    }

    public loop(p5: p5) {
        if (this.isDown) {
            let mousePosition = p5.createVector(p5.mouseX, p5.mouseY);
            this.delta = mousePosition.sub(this.lastMousePosition);
        }
        p5.translate(this.offset);
        p5.translate(this.delta);
    }

    public render() {
        return <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { this.reset() }}>
            Reset Translation
        </button>
    }
}


export class Scale implements Action {
    private scale: number = 1;

    constructor(p5: p5) {

    }

    public mouseClicked(p5: p5) {
    }

    public mousePressed(p5: p5) {
    }

    public mouseReleased(p5: p5) {
    }

    public loop(p5: p5) {
        p5.scale(this.scale);
    }

    public render() {
        return <div className='flex flex-col gap-3'>
            <label>Scale: {this.scale}</label>
            <input type="range" min="0.1" max="2" step="0.01" value={this.scale} onChange={(e) => this.scale = parseFloat(e.target.value)} />
        </div>
    }
}