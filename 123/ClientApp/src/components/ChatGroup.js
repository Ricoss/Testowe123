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
            hubConnection: null,
        };
        
    }

    
       
    

    

   



    render() {
        return (
           


        );
    }

}


