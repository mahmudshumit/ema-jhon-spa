


import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from "react-router";
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut,initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';



function LogIn() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,

    name: '',
    email: '',
    phone: '',
    password: '',

  });
  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn =()=>{
    handleGoogleSignIn()
    .then(res=>{
      handleResponse(res,true);
    })
  }

  const signOut =()=>{
    handleSignOut()
    .then(res=>{
     handleResponse(res,false);
    })
  }
  const fbSignIn=()=>{
    handleFbSignIn()
    .then(res=>{
      handleResponse(res,true);
    })
  }

  const handleResponse =(res,redirect)=>{
    
      setUser(res);
      setLoggedInUser(res);
     
      if(redirect){
        history.replace(from);
      }
  
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
      createUserWithEmailAndPassword(user.name,user.email,user.password)
      .then(res=>{
        handleResponse(res,true);
      })
    }

    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(user.email,user.password)
      .then(res=>{
        handleResponse(res,true);
      })
    }


    event.preventDefault();
  }

  return (
    <div style={{ textAlign: 'center' }}>

      {
        user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
          <button onClick={googleSignIn}>Sign In</button>
      }
      <br />
      <button onClick={fbSignIn}>Sign In Using facebook</button>
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
