import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import animalsJSON from "../../public/animals.json";
import adjectivesJSON from "../../public/animal_adjectives.json";


function hexToRgb(hex: string) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return {r: r, g: g, b: b};
}

function determineTextColor(hex: string) {
  const {r, g, b} = hexToRgb(hex.replace("#", ""));
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? '#000' : '#fff';
}


function getAnimal(){
  const animal = animalsJSON[Math.floor(Math.random() * animalsJSON.length)];
  return `${animal}`;
}

function getAnimalAdjective(){
  const adjective = adjectivesJSON[Math.floor(Math.random() * adjectivesJSON.length)];
  return `${adjective}`;
}




const Home: NextPage = () => {
  const [palette, setPalette] = useState<string[]>([]);
  const [animal, setAnimal] = useState<string>("");
  const [animalAdjective, setAnimalAdjective] = useState<string>("");


  useEffect(() => {
    refresh()
  }, []);


  const refreshAnimal = () => {
    const animal = getAnimal();
    setAnimal(animal);
    setAnimalAdjective(getAnimalAdjective());
  }

  const refreshPalette = () => {
    const url = `https://www.colr.org/json/scheme/random?query&scheme_size_limit=5&timestamp=${new Date().getTime()}`;
    fetch(url)
    .then((res) => {
      const json = res.json();
      return json
    })
    .then((data) => {
      setPalette(data.schemes[0].colors.map((color: string) => "#" + color));
    })
    .catch(() => {
      refreshPalette()
    })
  }
  
  const refresh = () => {
    refreshAnimal();
    refreshPalette();
  }
  

  return (
    <>
      <Head>
        <title>PalArt</title>
        <meta name="description" content="A tool for creating palettes and art ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen bg-slate-800 ">
        <div className="h-auto py-5 w-full justify-center items-center"><h1 className="bold text-white text-4xl text-center">PalArt</h1></div>
        <div className="py-3"></div>
        <h2 className="bold text-white text-3xl text-center">Use this palette...</h2>
        <div className="py-3"></div>
        <div className="flex flex-row items-center">
          {palette.map((color) => (
            <div className="flex flex-col items-center justify-end h-40 w-1/2" key={color} style={{ backgroundColor: color }}>
              <h2 className="bold" style={{'color':determineTextColor(color)}}>{color.toUpperCase()}</h2>
            </div>))}
        </div>

        <div className="py-3"></div>
        <h2 className="bold text-white text-3xl text-center">To draw...</h2>
        <div className="py-3"></div>

        <div className="flex flex-row justify-center items-center">
          <h2 className="text-center capitalize bold text-white text-3xl">A {animalAdjective} {animal}</h2>
        </div>
        <div className="py-3"></div>
        <div onClick={refresh} className="flex justify-center items-center h-auto py-3 w-full"><button className="border p-2 rounded text-white text=5xl text-center">Refresh</button></div>
      </div>

    </>
  );
};

export default Home;
