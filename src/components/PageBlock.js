import { useEffect, useState } from "react";
import Hello from "./Hello";
import Button from "./Button";
import axios from "axios";

const PageBlock = () => {
  const [counter, setCounter] = useState(1);
  const [pokemons, setPokemons] = useState(null);
  console.log("hey");
  useEffect(() => {
    try {
      axios.get("https://pokeapi.co/api/v2/pokemon").then((res) => {
        console.log(res.data);
        setTimeout(() => {
          setPokemons(res.data.results);
        }, 3000);
        console.log(res.data.results[9]);
      });
    } catch (err) {
      console.err(err);
    }
  }, []);


  return (
    <div className="w-full flex flex-col items-center">
      
        {counter < 3 ? (
          <Button setCounter={setCounter} counter={counter} />
        ) : (<p>loading</p>)
    }

      <p className="texl-lg font-bold">{counter}</p>
      <div className="w-full grid grid-cols-3">
        {pokemons ? (

            pokemons.map((item) => (
                <Hello key={item.name} title={item.url} value={item.name} />
            ))
        ) : (<p>loading</p>)
    }
      </div>
    </div>
  );
};

export default PageBlock;
