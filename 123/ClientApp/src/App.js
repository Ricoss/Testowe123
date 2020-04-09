import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { chat } from './components/chat';
import { ChatGroup } from './components/ChatGroup';
import { Endchat } from './components/Endchat';
import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/chat' component={chat} />
        <Route path='/123' component={ChatGroup} />
            <Route path='/end' component={Endchat} />

      </Layout>
    );
  }
}
