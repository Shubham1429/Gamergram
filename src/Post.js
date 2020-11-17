import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import { db } from "./firebase";
import firebase from "firebase";

function Post({ username, caption, imageUrl, id, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const handledelete = () => {
    db.collection("posts").doc(`${id}`).delete();
  };

  useEffect(() => {
    let unsubscribe;
    if (id) {
      unsubscribe = db
        .collection("posts")
        .doc(id)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [id]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(id).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__headerleft">
          <Avatar
            className="post__avatar"
            src="/static/images/1.jpg"
            alt={username}
          />
          <h3>{username}</h3>
        </div>
        <div className="post__headerright">
          {user?.displayName === username ? (
            <Button onClick={handledelete}>Delete</Button>
          ) : (
            <Button onClick={handledelete} style={{ visibility: "hidden" }}>
              Delete
            </Button>
          )}
        </div>
      </div>
      <img className="post__image" alt="" src={imageUrl} />
      <h4 className="post__text">
        <strong>{username} </strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment, id) => (
          <p key={id}>
            <b className="post__commentuser">{comment.username}</b>{" "}
            {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentbox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
