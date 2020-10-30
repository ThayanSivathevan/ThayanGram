import React, { useEffect, useState,useContext } from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const Profile = () => {
    const {state,dispatch}=useContext(UserContext)
    const [mypics, setpics] = useState([])
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            setpics(result.mypost)
        })
    }, [])
    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div>
                <Link to="/changeProfilePic">
                    <img alt="profile pic" style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={state?state.url:""} />
                </Link>
                </div>
                <div>
                    <h5 >{state?state.name:"loading"}</h5>
                    <h5>{state?state.email:""}</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state ? state.followers.length : 0} followers</h6>
                        <h6>{state ? state.following.length : 0} following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    
                    mypics.map(item=>{
                        return(
                        <img key={item.id}alt={item.title} className="item" src={item.photo}></img>
                        )
                    })
                    
                }
            </div>

        </div>
    )
}

export default Profile