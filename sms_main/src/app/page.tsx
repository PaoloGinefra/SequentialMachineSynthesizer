'use client';
import Image from "next/image";
import { useEffect } from "react";
import FSA from "./Classes/FSA";
import Minimizer from "./Classes/Minimizer";

export default function Home() {
  let testFunc = () => {
    let fsa = new FSA(undefined, 10, 2);

    // fsa = fsa.setState(0, 0, 1)
    //   .setState(0, 1, 2)
    //   .setState(1, 0, 2)
    //   .setState(2, 0, 0)
    //   .setState(2, 1, 1)
    //   .setSymbol(0, 0, 0)
    //   .setSymbol(1, 0, 1)
    //   .setSymbol(1, 1, 1)
    //   .setSymbol(2, 0, 0)
    //   .setSymbol(2, 1, 1)
    //   .setSymbol(2, 2, 2)
    //   .setSymbol(2, 3, 3)
    //   .setSymbol(3, 0, 0)
    //   .setSymbol(3, 1, 1)
    //   .setSymbol(3, 2, 2)
    //   .setSymbol(3, 3, 3)
    //   .setSymbol(4, 0, 0)
    //   .setSymbol(4, 1, 1)
    //   .setSymbol(5, 0, 0)
    //   .setSymbol(5, 1, 1);

    console.log(fsa.toString());

    let minimizer = new Minimizer(fsa);

    console.log(minimizer.toString());
    console.log(minimizer.getMinimizedStates())

  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={testFunc}
      >
        Button
      </button>
    </main>
  );
}
