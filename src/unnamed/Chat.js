import React from 'react';
import { Link } from "react-router-dom";
import "./Chat.css";

function Chat({name, chatIcon, creator, id}) {
    return (
        <div className="chatObject">
            <Link to={`/chat/${id}`} style={{textDecoration: "none"}}>
               <div className="chat">
                   <h2>{name}</h2>
                   <img alt="icon" src={chatIcon} width="300"/>
                   <h4>{creator}</h4>
               </div>
            </Link>
        </div>
    )
}

export default Chat
