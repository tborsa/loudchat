import React, {useReducer, useState} from 'react';
import './Chatter.css';
const socket = new WebSocket('ws://localhost:8080');

const reduceMessages = (state, action)=>{
    console.log(action);
    if(action.type === 'add'){
        const msg = new SpeechSynthesisUtterance(action.message.content);
        window.speechSynthesis.speak(msg);

        const msges = [...state, action.message];
        return msges;
    }
}
const Chatter = () => {
    let [messages, dispatchMessage] = useReducer(reduceMessages,[]);
    let [user, setUser] = useState('');

    socket.onopen = ()=>{
        console.log('Connected');
    };
    socket.onmessage = (message)=>{
        console.log("incomming", message);
        let data = JSON.parse(message.data);
        if(data.type === 'message'){
            dispatchMessage({type: 'add', message: {name: data.name, avatar: data.avatar, content: data.content}});
        }else if (data.type === 'assign'){
            setUser({name: data.name, avatar: data.avatar});
        }
    };
    const sendMessage = (e) =>{
        e.preventDefault();
        if(e.target.querySelector('input').value){
            if(user){
                let message = {type: "message", name: user.name, avatar: user.avatar, content: e.target.querySelector('input').value};
                socket.send(JSON.stringify(message));
            }else{
                let message = {type: "register", name: e.target.querySelector('input').value};
                socket.send(JSON.stringify(message));
            }
            e.target.querySelector('input').value='';
        }
    }
    const displayMessages = messages.map((message, index) => {
        return(
            <div className={user.name===message.name? 'msg you': 'msg'} key={index}>
                <img src={`/animated/${message.avatar}.gif`} alt='avatar'></img>
                <h3>{message.name}</h3>
                <p>{message.content}</p>
            </div>
        );
    });
    return (
        <div className="flex container">
            <div className='messages'>
                {displayMessages}
            </div>
            <div className="message-input">
                <form onSubmit={sendMessage}>
                    <label>
                    {user ? "Message:" : "Name: "}
                    <input type="text" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
};

export default Chatter;