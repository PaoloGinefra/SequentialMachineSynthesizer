# Sequential Machine Synthesizer (SMS)

## Goal

The goal of this project is to create a tool from scratch that can help the user to synthesize a sequential machine from a given specification e.g. a set of input/output sequences. The tool will be accessible via a web interface.

## Project Structure

```mermaid
graph TD

A[Design FSA] --> B[Minimize FSA]
B --> C[Choose Flip Flop type]
C --> D[Generate Transition Table]
D --> E[Generate Excitation Table]
E --> F[Generate Karnaugh Map]
F --> G[Generate Logic Equations]
G --> H[Generate Logic Circuit]
```

## Development Plan

### 0. Choose the technology stack

- **Frontend Framework:** [React](https://reactjs.org/) (with TypeScript)
- **Backend Framework:** [Next.js](https://nextjs.org/)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
- **Graphics Library:** [p5.js](https://p5js.org/)
- **Deployment:** [Vercel](https://vercel.com/)

```mermaid
graph TD
  subgraph Frontend
    A[<img src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" alt="React" width="50"/><br/>React] --> B[<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" alt="TypeScript" width="50"/><br/>TypeScript]
    B --> C[<img src="https://images.ctfassets.net/23aumh6u8s0i/c04wENP3FnbevwdWzrePs/1e2739fa6d0aa5192cf89599e009da4e/nextjs" alt="Next.js" width="50"/><br/>Next.js]
    C -->D[<img src="https://logowik.com/content/uploads/images/tailwind-css3232.logowik.com.webp" alt="Tailwind CSS" width="50"/><br/>Tailwind CSS]
    D -->E[<img src="https://miro.medium.com/v2/resize:fit:300/1*h9G7gjWQeQVwqkbhHVvOQg.png" alt="p5.js" width="50"/><br/>p5.js]
  end

  subgraph Deployment
    F[<img src="https://logowik.com/content/uploads/images/vercel1868.jpg" alt="Vercel" width="50"/><br/>Vercel] -->G[SMS]
  end

```
