import React from 'react';
import logo from './logo.svg';
import Chatter from './Chatter';
import './App.css';

function App() {
  const socket = new WebSocket('ws://localhost:8080');

  return (
    <div className="App">
      <Chatter></Chatter>
    </div>
  );
}

export default App;
