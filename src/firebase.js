import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAbul4BaR5NYl8H0geGEKAYA6hnPtoLIBE",
    authDomain: "hyeonjaae.firebaseapp.com",
    databaseURL: "https://hyeonjaae.firebaseio.com",
    projectId: "hyeonjaae",
    storageBucket: "hyeonjaae.appspot.com",
    messagingSenderId: "309130699257",
    appId: "1:309130699257:web:733e64ef6e67d739ac5d28",
    measurementId: "G-H3XF8GHC9R"
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
export default firebase;
