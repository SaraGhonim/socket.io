/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { GiftedChat } from 'react-native-gifted-chat'
import socketIOClient from 'socket.io-client';

class App extends Component {
  
   constructor(props) {
    super(props);
    this.state = {
      messages: [

        {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            }
        }
      ],
      userId: 1
    };

    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);

    this.socket = socketIOClient('http://localhost:3000');
    this.socket.on('message',(messages)=>{
            this._storeMessages(messages);
           console.log(messages);
        

        } );
    this.determineUser();
  } 
 
  determineUser() {
    
        // If there isn't a stored userId, then fetch one from the server.
        if (!null) {
          this.socket.emit('userJoined', null);
          this.socket.on('userJoined', (userId) => {
            this.setState({ userId });
          });
        } else {
          this.socket.emit('userJoined', userId);
          this.setState({ userId });
        }
   
  }

  onReceivedMessage(messages) {
    this._storeMessages(messages);
    console.log(messages);
  }
  onSend(messages=[]) {
    this.socket.emit('message', messages[0]);
    this._storeMessages(messages);
    console.log(messages)

  }
  render() {

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
          }
 _storeMessages(messages) {
            this.setState((previousState) => {
              return {
                messages: GiftedChat.append(previousState.messages, messages),
              };
            });
          }
        
};

const styles = StyleSheet.create({
  container: {
    flex:1
  }, 
  
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
