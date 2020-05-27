import React, { Component } from 'react';
import { Howl, Howler } from 'howler';

import './App.css';
import './BackBtn.css';
import './Buttons.css';
import beepSound from '../assets/audio/beep.wav';

class App extends Component {
  state = {
    timer: '00:00:00',
    convertedToSec: 0,
    convertedCopy: 0,
    isSet: false,
    isRunning: false,
    loopForever: true,
    numOfLoops: 1,
    completeLoops: 0
  }

  soundPlay = (src) => {
    const sound = new Howl({
      src
    })
    sound.play();
  }

  cleanTimeDisplay = (SECONDS) => {
    //create the hours
    let updatedHr = Math.floor(SECONDS / 3600);
    if (updatedHr < 10) { updatedHr = `0${updatedHr}` };
    if (updatedHr < 1) { updatedHr = `00` };

    //create the minutes
    let updatedMin = Math.floor((SECONDS - (updatedHr * 3600)) / 60);
    if (updatedMin < 10) { updatedMin = `0${updatedMin}` };
    if (updatedMin < 1) { updatedMin = `00` };

    //create the seconds
    let updatedSec = SECONDS - ((updatedHr * 3600) + (updatedMin * 60));
    if (updatedSec < 10) { updatedSec = `0${updatedSec}` };
    if (updatedSec < 1) { updatedSec = `00` };

    let rollingTime = `${updatedHr}:${updatedMin}:${updatedSec}`;

    return rollingTime;
  }

  pushNumHandler = (num) => {
    let str = this.state.timer.slice(0);
    str = str.replace(/:/g, '').split('');
    str.push(num);
    str.shift();
    str = str.map((cur, i) => i === 1 || i === 3 ? `${cur}:` : cur).join('');

    this.setState({ timer: str });
  }

  clearInit = () => this.setState({ timer: '00:00:00' });

  setHandler = () => {
    let rollingTime;
    let timer = this.state.timer.slice(0);
    timer = timer.replace(/:/g, '');
    let hr = +timer.slice(0, 2);
    let min = +timer.slice(2, 4);
    let sec = +timer.slice(4, 6);


    let converted2Sec = (hr * 3600) + (min * 60) + sec;

    // if there is no input when set, it becomes 30sec
    if (converted2Sec === 0) {
      converted2Sec = 30;
      // if the input is greater than the 86400 (24hrs), then it becomes 24hrs
    } else if (converted2Sec >= 86400) {
      converted2Sec = 86400;
    } else {
      rollingTime = this.cleanTimeDisplay(converted2Sec);
    }

    this.setState({ isSet: true, timer: rollingTime, convertedToSec: converted2Sec, convertedCopy: converted2Sec });
  }

  resetCounterHandler = () => {
    clearInterval(this.interval);
    this.setState({ convertedToSec: this.state.convertedCopy, isRunning: false, completeLoops: 0 })
  }

  hitBackHandler = () => {
    clearInterval(this.interval);
    this.setState({ timer: '00:00:00', isSet: false, isRunning: false, completeLoops: 0, numOfLoops: 0 });
  }

  startTimerHandler = () => {

    this.setState({ isRunning: true });

    // let date = new Date();
    // let currentSecond = date.getSeconds();

    this.interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.convertedToSec === 1) {
          return {
            completeLoops: prevState.completeLoops + 1,
            convertedToSec: prevState.convertedToSec - 1
          };
        }

        if (prevState.convertedToSec === 0) {

          return {
            convertedToSec: prevState.convertedCopy - 1
          };
        } else {
          return {
            convertedToSec: prevState.convertedToSec - 1
          };
        }
      });
    }, 1000);
  }

  pauseTimerHandler = () => {
    let currentTimer = this.state.convertedToSec;
    clearInterval(this.interval);
    this.setState({ isRunning: false, convertedToSec: currentTimer });
  }

  radioBtnHandler = (event) => {
    if (event.target.id === 'loop-num') {
      let copy = this.state.loopForever;
      this.setState({ loopForever: !copy });
    }

    if (event.target.id === 'loop-forever') {
      let copy = this.state.loopForever;
      this.setState({ loopForever: !copy });
    }

    this.setState({ numOfLoops: document.querySelector('#num').value });
  }

  componentDidUpdate() {
    if (!this.state.loopForever) {
      if (this.state.completeLoops >= this.state.numOfLoops) {
        clearInterval(this.interval);
      }
    }

    if (this.state.convertedToSec === 0 && this.state.isRunning) {
      this.soundPlay(beepSound);

      // this.setState((prevState) => {
      //     return {
      //       completeLoops: prevState.completeLoops + 1         
      //   }
      // })
    }
  }

  render() {
    Howler.volume(8.0);

    let progressBar = (
      <div>
        <div className="bar-container">
          <span className='numOfLoops' >{this.state.completeLoops} Loop(s) {this.state.loopForever ? '' : this.state.numOfLoops} </span>
          <div className='bar' style={{ width: (((this.state.convertedCopy - this.state.convertedToSec) / this.state.convertedCopy)) * 200 }} />
        </div>
      </div>
    );

    if (!this.state.isSet) {
      progressBar = '';
    }

    let buttons = (
      <div className='button-list'>
        <div>
          <button className="button" onClick={() => this.pushNumHandler('5')} >5</button>
          <button className="button" onClick={() => this.pushNumHandler('6')}>6</button>
          <button className="button" onClick={() => this.pushNumHandler('7')}>7</button>
          <button className="button" onClick={() => this.pushNumHandler('8')}>8</button>
          <button className="button" onClick={() => this.pushNumHandler('9')}>9</button>
          <button className="button" onClick={this.setHandler}>Set</button>
        </div>
        <div>
          <button className="button" onClick={() => this.pushNumHandler('0')}>0</button>
          <button className="button" onClick={() => this.pushNumHandler('1')}>1</button>
          <button className="button" onClick={() => this.pushNumHandler('2')}>2</button>
          <button className="button" onClick={() => this.pushNumHandler('3')}>3</button>
          <button className="button" onClick={() => this.pushNumHandler('4')}>4</button>
          <button className="button" onClick={this.clearInit}>Clear</button>
        </div>
        <div className='radioItems'>
          <input onClick={(event) => this.radioBtnHandler(event)} className='radio' type="radio" id="loop-num" name="iteration" value="loop-num" />
          <label htmlFor="loop-num" className='radio'>Loop</label>
          <input onChange={(event) => this.radioBtnHandler(event)} className='radio' value={this.state.numOfLoops} type="number" id="num" min='1' style={{ width: '2.5rem' }} />
          <label htmlFor="num" className='radio'>time(s)</label>
          <input onClick={(event) => this.radioBtnHandler(event)} className='radio' type="radio" id="loop-forever" name="iteration" value="loop-forever" defaultChecked />
          <label htmlFor="loop-forever" className='radio'>Loop Forever</label>
        </div>
      </div>
    )

    let running = <button className='BackBtn, button' onClick={this.pauseTimerHandler} >Pause</button>
    if (!this.state.isRunning) {
      running = <button className='BackBtn, button' onClick={() => this.startTimerHandler(this.state.pressedBackHandler)} >Start</button>
    }

    return (
      <div className="App">
        <section className="application">
          <section className="timer-app">
            <span className='hrMinSec'>{this.state.isSet ? this.cleanTimeDisplay(this.state.convertedToSec) : this.state.timer}</span>
            <div>
              {progressBar}
            </div>
            <div>
              {this.state.isSet ? null : buttons}
              {this.state.isSet ? running : null}
              {this.state.isSet ? <button className='BackBtn, button' onClick={this.resetCounterHandler} >Clear</button> : null}
              {this.state.isSet ? <button className='BackBtn, button' onClick={this.hitBackHandler}>Back</button> : null}
            </div>
          </section>
        </section>
      </div>
    );
  }
}

export default App;