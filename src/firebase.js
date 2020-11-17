import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCCXoUP01vwreJXROQya4hPfns9dk0phXc",
  authDomain: "gamergram-af05a.firebaseapp.com",
  databaseURL: "https://gamergram-af05a.firebaseio.com",
  projectId: "gamergram-af05a",
  storageBucket: "gamergram-af05a.appspot.com",
  messagingSenderId: "646732558671",
  appId: "1:646732558671:web:38b713a307e6dcd3d5953a",
  measurementId: "G-THEEMXJ3BD",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
