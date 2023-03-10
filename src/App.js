import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import "typeface-roboto";
import logo from "./ellucian_logo_inverted.png";

const App = () => {
  const defaultTime = 0;
  const [minuteValue, setMinutes] = useState(defaultTime);
  const [isOpened, setIsOpened] = useState(false);
  const seconds = minuteValue * 60;

  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }

  function setInputValue() {
    setMinutes("");
  }
  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("00:00:00");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + seconds);
    return deadline;
  };

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };
  const handleChange = (event) => {
    setMinutes(event.target.value);
    startTimer(event);
  };

  return (
    <React.Fragment>
      <div className="timer-background"></div>
      <div className="timer-container">
        <div className="logo" onClick={toggle}>
          <img src={logo} alt="Logo" />
        </div>
        <div className="slide-title">{minuteValue} Minute Break</div>
        <h1>{timer}</h1>
        {isOpened && (
          <div className="controls">
            <button onClick={onClickReset}>Start Break</button>
            <input
              type="text"
              id="minutes"
              name="minutes"
              onChange={handleChange}
              value={minuteValue}
            />
            <button onClick={setInputValue}>Clear Values</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default App;
