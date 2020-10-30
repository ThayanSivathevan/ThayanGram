import React, { useEffect, createContext, useReducer,useContext } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from "./components/screens/Home"
import Signup from "./components/screens/Signup"
import Login from "./components/screens/Login"
import Profile from "./components/screens/Profile"
import CreatePost from "./components/screens/CreatePost"
import UserProfile from "./components/screens/UserProfile"
import SubscribeUser from "./components/screens/SubscribeUserPost"
import ChangeProfile from "./components/screens/changeProfile"
import { reducer, initialState } from './reducers/userReducer'
export const UserContext = createContext()



const Routing = () => {
  const history = useHistory()
  const{state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
     
    }
    else{
      history.push('/login')
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/myHome">
        <SubscribeUser/>
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/changeProfilePic">
          <ChangeProfile />
      </Route>
    </Switch>
  )
}
function App() {
  const [state,dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
