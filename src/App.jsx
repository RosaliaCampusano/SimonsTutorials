import { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import simon from "./assets/sounds/sprite.mp3";
import "./App.css";

function App() {
  //Colors
  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const redRef = useRef(null);

  //Sounds
  const [play] = useSound(simon, {
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 500],
    },
  });

  const colors = [
    {
      color: "#FAF303",
      ref: yellowRef,
      sound: "one",
    },
    {
      color: "#030AFA",
      ref: blueRef,
      sound: "two",
    },
    {
      color: "#FA0E03",
      ref: redRef,
      sound: "three",
    },
    {
      color: "#0AFA03",
      ref: greenRef,
      sound: "four",
    },
  ];

  //Speed game and internal calculation
  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 400;

  //State of game --- !!! Optimize it ----
  const [sequence, setSequence] = useState([]); // Almacenara la secuencia que va generando el juego
  const [currentGame, setCurrentGame] = useState([]); //la secuencia que va ejecutando el juego
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false); //booleano para permitir pulsar la tecla
  const [speed, setSpeed] = useState(speedGame); //almacena los cambios de velocidad , se gestiona de forma progresiva
  const [turn, setTurn] = useState(0); //almacena el numero de turno que estas ejecutando
  const [pulses, setPulses] = useState(0); //almacena las pulsaciones
  const [success, setSuccess] = useState(0); //almacena el numero de aciertos
  const [isGameOn, setIsGameOn] = useState(false); //si el juego debe iniciarse

  const initGame = () => {
    randomNUmber();
    setIsGameOn(true);
  };

  const randomNUmber = () => {
    setIsAllowedToPlay(false);
    const randomNUmber = Math.floor(
      Math.random() * (maxNumber - minNumber + 1) + minNumber
    );
    setSequence([...sequence, randomNUmber]);
    setTurn(turn + 1);
  };

  const handlerClick = (index) => {
    if (isAllowedToPlay) {
      play({ id: colors[index].sound });
      colors[index].ref.current.style.opacity = 1;
      colors[index].ref.current.style.scale = 0.9;
      setTimeout(() => {
        colors[index].ref.current.style.opacity = 0.5;
        colors[index].ref.current.style.scale = 1;
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      }, speed / 2);
    }
  };

  useEffect(() => {
    if (pulses > 0) {
      if (Number(sequence[pulses - 1] === Number(currentGame[pulses - 1]))) {
        setSuccess(success + 1);
      } else {
        const index = sequence[pulses - 1];
        if (index) colors[index].ref.current.style.opacity = 1;
        play({ id: "error" });
        setTimeout(() => {
          if (index) colors[index].ref.current.style.opacity = 0.5;
          setIsGameOn(false);
        }, speed * 2);
        setIsAllowedToPlay(false);
      }
    }
  }, [pulses]);

  useEffect(() => {
    if (!isGameOn) {
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isGameOn]);

  useEffect(() => {
    if (success === sequence.length && success > 0) {
      setSpeed(speed - sequence.length * 2);
      setTimeout(() => {
        setSuccess(0);
        setPulses(0);
        setCurrentGame([]);
        randomNUmber();
      }, 500);
    }
  }, [success]);

  useEffect(() => {
    if (!isAllowedToPlay) {
      sequence.map((item, index) => {
        setTimeout(() => {
          play({ id: colors[item].sound });

          colors[item].ref.current.style.opacity = 1;

          setTimeout(() => {
            colors[item].ref.current.style.opacity = 0.5;
          }, speed / 2);
        }, speed * index);
      });
    }
    setIsAllowedToPlay(true);
  }, [sequence]);

  return (
    <>
      {isGameOn ? (
        <>
          <div className="header">
            <h1>Turn {turn}</h1>
          </div>
          <div className="container">
            {colors.map((item, index) => {
              return (
                <div
                  key={index}
                  ref={item.ref}
                  className={`pad pad-${index}`}
                  style={{ backgroundColor: `${item.color}`, opacity: 0.6 }}
                  onClick={() => handlerClick(index)}
                ></div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="header">
            <h1>Super Simon</h1>
          </div>
          <button onClick={initGame}>Start Game</button>
        </>
      )}
    </>
  );
}

export default App;
