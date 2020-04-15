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
            privNick: '',
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
                            <br />
                            Mesage:
                            <br />
                            <input
                                type="text"
                                value={this.state.message}
                                onChange={e => this.setState({ message: e.target.value })}
                            /> 
                            <br />
                               <button onClick={this.sendMessage}>Send</button>
                        </div>
                        
                    </Col>
                    <Col>
                        <div>
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


