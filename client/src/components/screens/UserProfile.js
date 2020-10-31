import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
const UserProfile = () => {
    const { state, dispatch } = useContext(UserContext)
    const [showfollow, setShowFollow] = useState(true)
    const [userProfile, setProfile] = useState(null)
    const { userid } = useParams()
    useEffect(() => {
        console.log(userProfile)
        const user= JSON.parse(localStorage.getItem("user"))
        dispatch({type:"USER",payload:user})
        fetch('/user/' + userid, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            setProfile(result)
        
            setShowFollow(result.user.followers.includes(state._id) ? false : true)
        })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {


                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {


                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    const newFollower=prevState.user.followers.filter(item=>item!==data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }
    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                        <div>
                            <img alt="profile pic" style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={userProfile.user.url} />
                        </div>
                        <div>
                            <h5>{userProfile.user.name}</h5>
                            <h5>{userProfile.user.email}</h5>
                            {showfollow ? <button style={{ margin:"10px" }} className="btn waves-effect waves-light #4a148c purple darken-4" onClick={() => followUser()}>
                                            Follow
                                        </button> 
                            :
                                <button style={{ margin:"10px" }} className="btn waves-effect waves-light #4a148c purple darken-4" onClick={() => unfollowUser()}>
                                    Unfollow
                                </button>
                            }





                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                        </div>
                    </div>

                    <div className="gallery">
                        {

                            userProfile.posts.map(item => {
                                return (
                                    <img key={item.id} alt={item.title} className="item" src={item.photo}></img>
                                )
                            })

                        }
                    </div>

                </div>
                : <h2>loading</h2>}
        </>
    )
}

export default UserProfile