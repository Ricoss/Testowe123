import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import * as signalR from "@microsoft/signalr";

export class ChatGroup extends Component {
    static displayName = ChatGroup.name;
    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            message: '',
            messages: [],
            messagenover: '',
            messagesnover: [],
            messagepriv: '',
            messagespriv: [],
            hubConnection: null,
            Nover: 'Nover', 
            name: '',
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
                .then(() => console.log('Connection started! ID: [  '+ hubConnection.connectionId+'  ]'))
                .catch(err => console.log('Error while establishing connection :('));
            

            

            this.state.hubConnection.on('SendMessageToAll', (nick, receivedMessage) => {
                const text = `${nick}: ${receivedMessage}`;
                const messages = this.state.messages.concat([text]);
                this.setState({ messages });
            });
        });


    }

    JoniChat = () => {
        
        this.state.hubConnection
            .invoke('JoinRoom', this.state.Nover)
            .then(() => console.log('Connection started! Nover'))
            .catch(err => console.error(err));

        this.state.hubConnection.on('SendMessageGroup', (nick, receivedMessage , ) => {
                const text = `${nick}: ${receivedMessage}`;
                 const messagesnover = this.state.messagesnover.concat([text]);
                 this.setState({ messagesnover });
        });
        
    };

    sendMessage = () => {
        this.state.hubConnection
            .invoke('SendMessageToAll', this.state.nick, this.state.message)
            .catch(err => console.error(err));

        this.setState({ message: '' });

    };   
       
    sendMessageNover = () => {
        this.state.hubConnection
            .invoke('SendMessageGroup', this.state.nick, this.state.messagenover, this.state.Nover)
            .catch(err => console.error(err));

        this.setState({ messagenover: '' });
       
    };   

    sendPrivMessage = () => {

        this.state.hubConnection
            .invoke('SendMessageToUser', this.state.nick, this.statis.name, this.state.messagepriv)
            .catch(err => console.error(err))
        this.messagespriv({ messagenover: '' });
    }

    
    
    


    render() {
        
        return (
            <Container>
                <Row >
                    <Col>
                        <div>
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
                    </Col>
                    <Col>
                        <div>
                            <button onClick={this.JoniChat}>Join Nover Chat</button>
                            <br />
                            <input
                                type="text"
                                value={this.state.messagenover}
                                onChange={e => this.setState({ messagenover: e.target.value })}
                            />
                            <button onClick={this.sendMessageNover}>Send</button>

                            <div>
                                {this.state.messagesnover.map((messagenover, index) => (
                                    <span style={{ display: 'block' }} key={index}> {messagenover} </span>
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col>
                        <div>
                            <h1>Private</h1>
                            Nick :
                            <input 
                                type="text"
                                value={this.state.name}
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                            Message:
                             <input
                                type="text"
                                value={this.state.messagepriv}
                                onChange={e => this.setState({ messagepriv: e.target.value })}
                            />
                            <button onClick={this.sendPrivMessage}>Send</button>
                            <div>
                                {this.state.messagespriv.map((messagepriv, index) => (
                                    <span style={{ display: 'block' }} key={index}> {messagepriv} </span>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>  
        );
    }

}


