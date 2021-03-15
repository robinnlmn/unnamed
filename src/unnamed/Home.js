import React, { useEffect, useState } from 'react'
import "./Home.css"
import { db, auth, storage } from "./firebase"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button, Input } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import Add from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import firebase from "firebase";
import Chat from './Chat';
import Logo from "./imgs/Logo.png";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: "black",
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function Home() {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [chats, setChats] = useState([])
    const [searchedChats, setSearchedChats] = useState("")
    const [open, setOpen] = useState(false)
    const [openSignIn, setOpenSignIn] = useState(false)
    const [createNew, setCreateNew] = useState(false)
    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [user, setUser] = useState(null)

    const [chatName, setChatName] = useState("")
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const unsubscribe = auth
        .onAuthStateChanged((authUser) => {
            if(authUser) {
                // user logged in
                console.log(authUser);
                setUser(authUser);
            } else {
                // user logged out
                setUser(null);
            }
        })

        return () => {
            unsubscribe();
        }
    }, [user, username])

    useEffect(() => {
        reloadPage()
    }, [])
    
    //Create Account
    const singUp = (e) => {
        e.preventDefault()

        auth
        .createUserWithEmailAndPassword(mail, password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username,
                role: "ADMIN",
            })
        })
        .catch((error) => alert(error.message));
        setOpen(false);
    }

    //Login to a Account
    const singIn = (e) => {
        e.preventDefault();

        auth
        .signInWithEmailAndPassword(mail, password)
        .catch((error) => alert(error.message))
        setOpenSignIn(false);
    }

    const haveAccount = (e) => {
        setOpen(false)
        setOpenSignIn(true)
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = (e) => {

        if(chatName == "") {
            setChatName("NO NAME")
        }

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("chats").add({
                        creator: user.displayName,
                        name: chatName,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        chatIcon: url
                    })

                    setProgress(0);
                    setChatName("");
                    setImage(null);
                })
            }
        )
    }

    function reloadPage() {
        var searchedChats = document.querySelector("#searchChats").value;
        db.collection("chats").orderBy("timestamp", "desc").onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({ id: doc.id, chat: doc.data() })).filter(doc => (
                doc.chat.name.toLowerCase().search(searchedChats.toLowerCase()) !== -1
            )));
        })
    }

    return (
        <div className="home">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="post__signUp">
                        <Input 
                            placeholder="username"
                            className="searchChats"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input 
                            placeholder="email"
                            className="searchChats"
                            type="text"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                        />
                        <Input 
                            placeholder="password"
                            className="searchChats"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button 
                            type="submit"
                            onClick={singUp}
                        >SIGN UP
                        </Button>
                        <Button
                            onClick={haveAccount}
                        >ALREADY HAVE AN ACCOUNT?
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="post__signUp">
                        <Input 
                            placeholder="email"
                            className="searchChats"
                            type="text"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                        />
                        <Input 
                            placeholder="password"
                            className="searchChats"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button 
                            type="submit"
                            onClick={singIn}
                        >SIGN IN
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open={createNew}
                onClose={() => setCreateNew(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="post__signUp">
                        <Input 
                            placeholder="Chat Name"
                            className="searchChats"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                        />
                        <h4>TIPP: USE 512x512 1024x1024... as an resulution</h4>
                        <div className="icon">
                            <h3>ICON:</h3>
                            <input 
                                type="file"
                                accept=".icon, .ico, 512px"
                                className="imagePicker"
                                onChange={handleChange}
                            />
                        </div>
                        <Button 
                            className="createChat"
                            onClick={handleUpload}
                        >Create
                        </Button>
                    </div>
                </div>
            </Modal>

            <div className="header">
                <img src={Logo} className="home__logo"/>

                <Input className="searchChats" id="searchChats" placeholder="Search Chat" onChange={ e => {
                    reloadPage()
                } } />

                <div>
                    {user ?  (
                        <div className="posts__loginContainer">
                            <h2>{user.displayName}</h2>
                            <h3>{user.role}</h3>
                            <Button onClick={() => auth.signOut()}>LOGOUT</Button>
                        </div>
                    ) : (
                        <div className="posts__loginContainer">
                            <Button onClick={() => setOpen(true)}>SIGN UP</Button>
                            <Button onClick={() => setOpenSignIn(true)}>SIGN IN</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="chats">
                {
                    user ? (
                        <div className="chat">
                            <div className="createNewChat">
                                <AddIcon onClick={() => setCreateNew(true)} />
                            </div>
                        </div>
                    ) : (
                        <div className="chat">
                            <div className="loginPopUp">
                                <h2 onClick={() => setOpen(true)} className="loginPopUp">LOGIN</h2>
                            </div>
                        </div>
                    )
                }

                {
                    chats.map(({id, chat}) => (
                        <Chat 
                            name={chat.name}
                            chatIcon={chat.chatIcon}
                            creator={chat.creator}
                            id={id}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Home