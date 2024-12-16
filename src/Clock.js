// Author: David Zenteno

import React from 'react';
import './styles.scss';

class Clock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            breakLength : 5,
            breakSeconds: 0,
            sessionLength: 25,
            sessionSeconds: 0,
            timerLabel: "Session",
            startStopSwitch: true,
            breakMinDisplay: 5,
            sessionMinDisplay: 25
        }

        this.timeInterval = null;

        this.adjustTime = this.adjustTime.bind(this);
        this.handleTimer = this.handleTimer.bind(this);
        this.handleSessionSecDisplay = this.handleSessionSecDisplay.bind(this);
        this.handleSessionMinDisplay = this.handleSessionMinDisplay.bind(this);

        this.handleBreakSecDisplay = this.handleBreakSecDisplay.bind(this);
        this.handleBreakMinDisplay = this.handleBreakMinDisplay.bind(this);

        this.playBeep = this.playBeep.bind(this);
        this.startStopTimer = this.startStopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.stopReloadBeep = this.stopReloadBeep.bind(this);
    }

    handleSessionSecDisplay(){
        if(this.state.sessionSeconds < 10 ){
            return "0" + this.state.sessionSeconds;
        }else{
            return this.state.sessionSeconds;
        }
    }

    handleSessionMinDisplay(){
        if(this.state.sessionLength < 10){
            return "0" + this.state.sessionLength;
        }else{
            return this.state.sessionLength;
        }
    }

    handleBreakSecDisplay(){
        if(this.state.breakSeconds < 10){
            return "0" + this.state.breakSeconds;
        }else{
            return this.state.breakSeconds;
        }
    }

    handleBreakMinDisplay(){
        if(this.state.breakLength < 10){
            return "0" + this.state.breakLength;
        }else{
            return this.state.breakLength;
        }
    }

    //Handles countdown of time
    handleTimer(){
        let seconds = this.state.timerLabel === "Session" ? this.state.sessionSeconds : this.state.breakSeconds;
        let minutes = this.state.timerLabel === "Session" ? this.state.sessionLength : this.state.breakLength;

        //---------------------------------------
        //handles Session countdown
        if(this.state.timerLabel === "Session"){
            if(minutes === 0 && seconds ===0){
                this.playBeep();
                this.setState({
                    timerLabel: "Break",
                    breakLength:  this.state.breakMinDisplay,
                    breakSeconds: 0
                },
                () =>{
                    clearInterval(this.timeInterval);
                    this.timeInterval = setInterval(this.handleTimer, 1000);
                }
            );
            }else if(this.state.sessionSeconds === 0){
                this.setState((prevState)=>{
                    return {
                        sessionSeconds: 59,
                        sessionLength: prevState.sessionLength - 1
                    }
                });
            }else{
                this.setState((prevState)=>{
                    return {
                        sessionSeconds: prevState.sessionSeconds - 1
                    }
                })
            }
            
        }else{ //handles Break countdown
            console.log("Break Label now");
            if(minutes === 0 && seconds ===0){
                this.playBeep();
                this.setState({
                    timerLabel: "Session",
                    sessionLength: this.state.sessionMinDisplay,
                    sessionSeconds: 0
                },
                ()=>{
                    clearInterval(this.timeInterval);
                    this.timeInterval = setInterval(this.handleTimer, 1000);
                }
            );
            }
            else if(seconds === 0){
                this.setState((prevState)=>{
                    return {
                        breakSeconds: 59,
                        breakLength: prevState.breakLength - 1
                    }
                });
            }else{
                this.setState((prevState)=>{
                    return {
                        breakSeconds: prevState.breakSeconds - 1
                    }
                })
            }
            
        }
    }

    //Increments or Decrements both break and session timer duration
    adjustTime(adjustment){ 
        //break decrement and increment
        if(adjustment === "break-decrement" && this.state.breakMinDisplay > 1){
            this.setState((prevState)=>{
                return {
                    breakMinDisplay: prevState.breakMinDisplay - 1,
                    breakLength: prevState.breakMinDisplay - 1,
                    breakSeconds: 0
                }
            })
        }else if(adjustment === "break-increment" && this.state.breakMinDisplay < 60){
            this.setState((prevState)=>{
                return{
                    breakMinDisplay: prevState.breakMinDisplay + 1,
                    breakLength: prevState.breakMinDisplay + 1,
                    breakSeconds: 0
                }
            })
        }
        //session decrement and increment
        if(adjustment === "session-decrement" && this.state.sessionMinDisplay > 1){
            this.setState((prevState)=>{
                return {
                    sessionMinDisplay: prevState.sessionMinDisplay - 1,
                    sessionLength: prevState.sessionMinDisplay - 1,
                    sessionSeconds: 0
                }
            })
        }else if(adjustment === "session-increment" && this.state.sessionMinDisplay < 60){
            this.setState((prevState)=>{
                return {
                    sessionMinDisplay: prevState.sessionMinDisplay + 1,
                    sessionLength: prevState.sessionMinDisplay + 1,
                    sessionSeconds: 0
                }
            })
        }
    }

    //Starts and stops the timer
    startStopTimer(){
        if(this.state.startStopSwitch){
            this.timeInterval = setInterval(this.handleTimer, 1000);
            this.setState({
                startStopSwitch: false
            });
        }else{
            clearInterval(this.timeInterval);
            this.timeInterval = null;
            this.setState({
                startStopSwitch: true
            });
        }
    }

    componentWillUnmount(){
        clearInterval(this.timeInterval);
    }

    //Plays a beep sound when timer goes to 00:00
    playBeep(){
         let audio = document.getElementById("beep");
         audio.play();
    }

    //Stops the audio, then loads it 
    stopReloadBeep(){
        let audio = document.getElementById("beep");
        audio.pause();
        audio.currentTime = 0;
        audio.load();
    }

    resetTimer(){
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        this.stopReloadBeep();
        this.setState({
            breakLength: 5,
            breakSeconds: 0,
            sessionLength: 25,
            sessionSeconds: 0,
            breakMinDisplay: 5,
            sessionMinDisplay: 25,
            timerLabel: "Session",
            startStopSwitch: true
        });
    }

    render(){
        const audioClipLink = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";
        return (
            <div className="pomodoro-clock-container">
                <audio src={audioClipLink} id="beep"></audio>  
                <div>
                    <h1 className="title">Pomodoro Clock</h1>
                </div>
                

                <div id="break-label">
                    <h3>Break Length</h3>

                    <div className="length-adjust-container">
                        <div id="break-decrement" onClick={()=> this.adjustTime("break-decrement")}>
                            <i class="bi bi-arrow-down arrow-size"></i>
                        </div>

                        <span id="break-length">{this.state.breakMinDisplay}</span>

                        <div id="break-increment" onClick={()=> this.adjustTime("break-increment")}>
                            <i class="bi bi-arrow-up arrow-size"></i>
                        </div>
                    </div>
                    
                </div>

                <div id="session-label">
                    <h3>Session Length</h3>
                    <div className="length-adjust-container">
                        <div id="session-decrement" onClick={()=>this.adjustTime("session-decrement")}>
                            <i class="bi bi-arrow-down arrow-size"></i>
                        </div>

                        <span id="session-length">{this.state.sessionMinDisplay}</span>

                        <div id="session-increment" onClick={()=>this.adjustTime("session-increment")}>
                            <i class="bi bi-arrow-up arrow-size"></i>
                        </div>
                    </div>
                    
                </div>

                {/* Timer */}
                <div id="timer-label">
                    <div className="timer-container">
                        <span className="timerLabel-text-size">{this.state.timerLabel}</span>
                        <br></br>
                        <div id="time-left">
                            <span>{this.state.timerLabel === "Session" ? this.handleSessionMinDisplay() : this.handleBreakMinDisplay()}:{this.state.timerLabel === "Session" ? this.handleSessionSecDisplay() : this.handleBreakSecDisplay()}</span>
                        </div>
                    </div>
                    
                </div>

                {/* Buttons */}
                <div className="timeButtonsContainer">
                    <div className="start-stop-reset-btns" id="start_stop" onClick={()=>{
                        this.startStopTimer();
                        // console.log("Outside the while loop");
                    }}>
                        <i class="bi bi-play"></i>
                        <i class="bi bi-pause"></i>
                    </div>
                    <div className="start-stop-reset-btns" id="reset" onClick={()=>{
                        this.resetTimer();
                    }}>
                        <i class="bi bi-arrow-repeat"></i>
                    </div>
                </div>
            </div>
        );
    }
}

export default Clock;