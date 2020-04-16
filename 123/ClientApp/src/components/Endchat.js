﻿import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import * as signalR from "@microsoft/signalr";

export class Endchat extends Component {
    static displayName = Endchat.name;
    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            roomName:'',
            message: '',
            messages: [],
            hubConnection: null,
            privNick: '',
            group:'',
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
                
            this.state.hubConnection.on('SendMessageToUser', (nick, receivedMessage, ) => {
            const text = `${nick}: ${receivedMessage}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });
        });

        });  
    }

    sendNick = () => {
        this.state.hubConnection
            .invoke('Login', this.state.nick)
            .then(() => console.log('Apllay'))
            .catch(err => console.error(err));
    }


    //sendMessage = () => {
    //    this.state.hubConnection
    //        .invoke('SendMessagePrivate', this.state.nick, this.state.message, this.state.roomName, this.state.privNick)
    //        .catch(err => console.error(err));

    //    this.setState({ message: '' });
    //};
   
    //privateChat = () => {
    //    this.state.roomName = this.state.nick + this.state.privNick
    //    console.log(this.state.roomName);
    //    this.state.hubConnection
    //        .invoke('Private', this.state.roomName, this.state.privNick, this.state.nick)
    //        .then(() => console.log('Connection started!' + this.state.roomName))
    //        .catch(err => console.error(err));      
    //};

    private = () => {
       
        this.state.roomName = this.state.nick + this.state.privNick
        console.log(this.state.roomName);
        this.state.hubConnection
            .invoke('SendMessageToUser', this.state.nick, this.state.privNick, this.state.message)
    }
    render() { 
        return (
            <Container>
                <Row>
                    <Col>
                        <div>    
                            <button onClick={this.sendNick}>Login</button>
                            <br />
                            Send priv to:
                            <br />  
                            <input
                                type="text"
                                value={this.state.privNick}
                                onChange={e => this.setState({ privNick: e.target.value })}
                            />
                        </div>
                        <div>
                        Group:
                        <br />    
                        <input
                                type="text"
                                value={this.state.group}
                                onChange={e => this.setState({ group: e.target.value })}
                         />
                            <br />
                            <button onClick={this.private}>CreateGroup</button>
                            {this.state.messages.map((message, index) => (
                                <span style={{ display: 'block' }} key={index}> {message} </span>
                            ))}
                            <button onClick={this.private}>Add</button>
                            {this.state.messages.map((message, index) => (
                                <span style={{ display: 'block' }} key={index}> {message} </span>
                            ))}
                            <button onClick={this.private}>Remove</button>
                            {this.state.messages.map((message, index) => (
                                <span style={{ display: 'block' }} key={index}> {message} </span>
                            ))}
                        </div>
                        
                    </Col>
                    <Col>
                        <div>
                            <input
                                type="text"
                                value={this.state.message}
                                onChange={e => this.setState({ message: e.target.value })}
                            />
                            <br />
                            <button onClick={this.private}>Send</button>
                            {this.state.messages.map((message, index) => (
                                <span style={{ display: 'block' }} key={index}> {message} </span>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>

        );
    }

}

