import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
import { set } from 'mongoose'
const Navbar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current)
    fetchUsers("")
  }, [])
  const renderList = () => {
    if (state) {
      return [
        <div key="1" >
          <li ><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/create">Create Post</Link></li>
          <li><Link to="/myHome">My home</Link></li>
          <li><Link to="/login">
            <button className="btn waves-effect waves-light #4a148c purple darken-4"
              onClick={() => {
                localStorage.clear()
                dispatch({ type: "CLEAR" })
                M.toast({ html: "Logged out", classes: "#4a148c purple darken-4" })
                history.push('/')
              }}>
              Log out
                </button>
          </Link></li>
        </div>
      ]
    }
    else {
      return [
        <div key="2">
          <li ><Link to="/login">Log in</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </div>
      ]
    }
  }
  const renderHome = () => {

    return [<Link to={state ? "/" : "/login"} className="brand-logo left">ThayanGram</Link>]

  }


  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json()).then(results => {
      setUserDetails(results.user)
    })
  }

  return (
    <nav>
      <div className="nav-wrapper white">
        {renderHome()}
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
        {state._id?<div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
          <div className="modal-content input-field">
            <input value={search} onChange={(e) => fetchUsers(e.target.value)} type="text" placeholder="search" />
          <ul className="collection">
            {userDetails.map(item => {
              return <Link to={item._id !== state._id ? "/middle/" + item._id : "/profile"} 
              onClick={()=>{
                M.Modal.getInstance(searchModal.current).close()
                setSearch('')}
              }><li className="collection-item">{item.name + " " + item.email}</li></Link>
            })}
          </ul>

        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
        </div>
      </div>:<div />}
    </nav>
  )
}

export default Navbar