import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
const Navbar = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <div>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/create">Create Post</Link></li>
          <li><Link to="/myHome">My home</Link></li>
          <li><Link to="/login">
              <button className="btn waves-effect waves-light #4a148c purple darken-4" 
              onClick={() => {
                localStorage.clear()
                dispatch({type:"CLEAR"})
                M.toast({ html: "Logged out", classes: "#4a148c purple darken-4" })
                history.push('/')
              }}>
                    Log out
                </button>
            </Link></li>
        </div>
      ]
    }
    else{
      return [
      <div>
        <li><Link to="/login">Log in</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </div>
    ]}
  }
  const renderHome=()=>{

      return [<Link to={state?"/":"/login"} className="brand-logo left">ThayanGram</Link>]

  }

return (
  <nav>
    <div className="nav-wrapper white">
    {renderHome()}
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
)
}

export default Navbar