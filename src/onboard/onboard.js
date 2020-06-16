import React from 'react'
import { Link } from 'react-router-dom'
import uuid from 'uuid/v4'
import socket from '../connection/socket'
import { ColorContext } from '../context/colorcontext' 
/**
 * Onboard is where we create the game room.
 */

class CreateNewGame extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
        gameId: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }
    
    send = () => {
        /**
         * This method should create a new room in the '/' namespace
         * with a unique identifier. 
         */
        const newGameRoomId = uuid()

        // set the state of this component with the gameId so that we can
        // redirect the user to that URL later. 
        this.setState({
            gameId: newGameRoomId
        })

        // emit an event to the server to create a new room 
        socket.emit('createNewGame', newGameRoomId)
    }

    typingUserName = () => {
        // grab the input text from the field from the DOM 
        const typedText = this.textArea.current.value.replace(/\s+/g, '')
        
        // set the state with that text
        this.setState({
            inputText: typedText
        })
    }

    render() {
        // !!! TODO: edit this later once you have bought your own domain. 
        const domainName = "http://localhost:3000"

        return (
            <React.Fragment>
            {
                this.state.didGetUserName ? 
                <div>
                <h3 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>1. Hey {this.state.inputText}, copy + paste the URL below to send to your friend:</h3>
                <p style={{textAlign: "center", marginTop: "30" + "px"}}>{domainName + "/game/" + this.state.gameId}</p>
                <br></br>
                <h3 style={{textAlign: "center", marginTop: "125px"}}>2. After you have sent the URL to your friend, click the "Start Game" button:</h3>
                <Link to = {"/game/" + this.state.gameId}><button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}>Start Game</button></Link>
                </div> 
            :
               <div>
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Your Username:</h1>

                    <input style={{marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px"}} 
                           ref = {this.textArea}
                           onInput = {this.typingUserName}></input>
                           
                    <button className="btn btn-primary" 
                        style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}} 
                        disabled = {!(this.state.inputText.length > 0)} 
                        onClick = {() => {
                            // When the 'Submit' button gets pressed from the username screen,
                            // We should send a request to the server to create a new room with
                            // the uuid we generate here.
                            this.props.didRedirect() 
                            this.setState({
                                didGetUserName: true
                            })
                            this.send()
                        }}>Submit</button>
                </div>
            }
            </React.Fragment>
        )
    }
}

const Onboard = () => {
    const color = React.useContext(ColorContext)

    return <CreateNewGame didRedirect = {color.playerDidRedirect} />
}


export default Onboard