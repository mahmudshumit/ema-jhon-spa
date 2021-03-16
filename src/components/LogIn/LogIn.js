

import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { useContext, useState } from 'react';
import {UserContext} from '../../App';


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function LogIn() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,

    name: '',
    email: '',
    phone: '',
    password: '',

  });

  const [loggedInUser,setLoggedInUser]= useContext(UserContext);



  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {

        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        console.log('fb user after sign in', user);

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.


        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });

  }


  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(result => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          error: '',
          success: false,
        }
        setUser(signedOutUser);
      })
      .catch(err => {

      })
  }
  const handleBlur = (event) => {
    let isFormValid = true;
    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;

    }
    if (isFormValid) {
      const newUserInfo = { ...user }
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);

    }
  }
  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);

        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });

    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          console.log('sign in user info', res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }


    event.preventDefault();
  }
  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name

    }).then(function () {
      console.log('user name updated successfully')
    }).catch(function (error) {
      console.log(error);
    });
  }
  return (
    <div style={{textAlign: 'center'}}>

      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      <br />
      <button onClick={handleFbSignIn}>Sign In Using facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome , {user.name}</p>
          <p>Your Email :{user.email}</p>
          <img src={user.photo} alt="" />

        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New user sign Up</label>

      <form onSubmit={handleSubmit}>

        {newUser && <input name="name" onBlur={handleBlur} type="text" placeholder="Your Name" required />}
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email Address" required />
        <br />
        <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Your Password" required />
        <br />
        <input type="submit" value={newUser ? 'sign up' : 'sign In'} />

      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>user {newUser ? 'created' : 'Logged In'} Successfully</p>}

    </div>
  );
}

export default LogIn;
