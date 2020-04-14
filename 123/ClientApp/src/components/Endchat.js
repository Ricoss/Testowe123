import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import * as signalR from "@microsoft/signalr";

export class Endchat extends Component {
    static displayName = Endchat.name;
    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            roomName:'123',
            message: '',
            messages: [],
            hubConnection: null,
            
        };
        
    }

    componentDidMount = () => {
        const nick = window.prompt('Your name:', 'John');
        
       

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/chatt")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({ hubConnection, nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('))
                

        });
        
    }

    sendNick = () => {

        this.state.hubConnection
            .invoke('Login', this.state.nick)
            .then(() => console.log('Apllay'))
            .catch(err => console.error(err));
    }

    JoniChat = () => {

        this.state.hubConnection
            .invoke('JoinRoom', this.state.roomName)
            .then(() => console.log('Connection started! Nover'))
            .catch(err => console.error(err));

        this.state.hubConnection.on('SendMessageGroup', (nick, receivedMessage, ) => {
            const text = `${nick}: ${receivedMessage}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });
        });

    };

    sendMessage = () => {
        this.state.hubConnection
            .invoke('SendMessageGroup', this.state.nick, this.state.message, this.state.roomName)
            .catch(err => console.error(err));

        this.setState({ message: '' });
  
    };
   



    render() { 
        return (
            
            <div>
                    <button onClick={this.sendNick}>SendNick</button>
                    <br />
                    <button onClick={this.JoniChat}>Join Nover Chat</button>
                    <br />
                <br />
                <input
                    type="text"
                    value={this.state.message}
                    onChange={e => this.setState({ message: e.target.value })}
                /> 
                <button onClick={this.sendMessage}>Send</button>
                

                <div>
                    {this.state.messages.map((message, index) => (
                        <span style={{ display: 'block' }} key={index}> {message} </span>
                    ))}
                </div>

               
            </div>


        );
    }

}


