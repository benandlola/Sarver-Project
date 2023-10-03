//import firebaseApp from './firebase-config'; 
/*
// Sign in with Google
var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(googleAuthProvider)

// Sign up with email and password
firebase.auth().createUserWithEmailAndPassword(email, password)

// Log in with email and password
firebase.auth().signInWithEmailAndPassword(email, password)
*/

const showSignUp = document.getElementById("showSignUp");
const signUpForm = document.getElementById("signUpForm");
const emailLogin = document.getElementById("emailLogin");

showSignUp.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default link behavior
    signUpForm.style.display = (signUpForm.style.display === "block") ? "none" : "block";
    emailLogin.style.display = (emailLogin.style.display === "block") ? "none" : "block";
});