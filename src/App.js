import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input, Avatar } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
//import InstagramEmbed from "react-instagram-embed";

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
    position: "absolute",
    width: 500,
    border: "none",
    backgroundColor: "whitesmoke",

    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openlogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  //UseEffect:  Runs a piece of code for a condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //Logged In
        // console.log(authUser);
        setUser(authUser);
      } else {
        //Logged Out
        setUser(null);
      }
    });

    return () => {
      //perform cleanup
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    //Code running area
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      }); //snapshot takes a snapshot of the current collection on passes it
  }, []);

  const signup = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signin = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenLogin(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className="app__modal">
          <form className="app__signup">
            <center>
              <img
                className="app__headerimage"
                src="https://images.vexels.com/media/users/3/153149/isolated/preview/1dbe90ba2f24289a1668a0dbc8150e2e-gamepad-colored-stroke-icon-by-vexels.png"
                alt="logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input type="file" />
            <Button className="app__modalbutton" onClick={signup}>
              SignUp
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openlogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerimage"
                src="https://images.vexels.com/media/users/3/153149/isolated/preview/1dbe90ba2f24289a1668a0dbc8150e2e-gamepad-colored-stroke-icon-by-vexels.png"
                alt="logo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signin}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerimage"
          src="https://images.vexels.com/media/users/3/153149/isolated/preview/1dbe90ba2f24289a1668a0dbc8150e2e-gamepad-colored-stroke-icon-by-vexels.png"
          alt="logo"
        />

        <h1 className="app__headername">GAMER'S-HUB</h1>

        {user ? (
          <div className="app__afterlogin">
            <div>
              <Avatar
                className="post__avatar"
                src="/static/images/1.jpg"
                alt={username}
              />
            </div>
            <div>
              <Button className="app__button" onClick={() => auth.signOut()}>
                Log Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="app__login">
            <Button className="app__button" onClick={() => setOpenLogin(true)}>
              Sign In
            </Button>
            <Button className="app__button" onClick={() => setOpen(true)}>
              Sign Up
            </Button>
          </div>
        )}
      </div>

      {/*Post*/}
      <div className="app__posts">
        <div className="app__postsleft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              id={id}
              user={user}
            />
          ))}
        </div>
        <div className="app__postsright">
          {/* <InstagramEmbed
            url="replace with a public insta account"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
        </div>
      </div>

      {/*Post*/}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <center>
          <h3 className="app__login">Login to Upload</h3>
        </center>
      )}
    </div>
  );
}

export default App;
