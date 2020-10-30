import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "../../App"
import M from 'materialize-css'
import { Link } from 'react-router-dom'
const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            }
        }).then(res => res.json()).then(result => {
            console.log(result)
            setData(result.posts)
        })
    }, [])
    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            //console.log(result)
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            //console.log(result)
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"
                )
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json()).then(result => {
            console.log(result)
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }
    const deletePost = (postid) => {
        fetch('/deletepost/' + postid.toString(), {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                M.toast({ html: "Post deleted", classes: "#4a148c purple darken-4" })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deleteComment = (postId, comment) => {
        fetch('/deletecomment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                comment
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                M.toast({ html: "Comment deleted", classes: "#4a148c purple darken-4" })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="home1">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 >
                                <img  alt="profile pic" style={{ border: "5px solid #555",margin: "5px", width: "50px", height: "50px", borderRadius: "80px" }}
                                    src={item.postedBy.url} />
                                <Link style={{ fontWeight: "750" }} to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} >{item.postedBy.name}</Link>
                                {item.postedBy._id === state._id && <i onClick={() => deletePost(item._id)} className="material-icons" style={{ color: "black", float: "right" }}>delete</i>
                                }</h5>

                            <div className="card-image">
                                <img alt="pic" src={item.photo} />
                            </div>
                            <div className="card-content input-field">

                                {item.likes.includes(state._id) ? <i onClick={() => { unlikePost(item._id) }} className="material-icons" style={{ color: "red" }}>favorite</i>
                                    : <i onClick={() => { likePost(item._id) }} className="material-icons" style={{ color: "black" }}>favorite</i>}

                                <h6>{item.likes.length} likes</h6>
                                <h6 style={{ fontWeight: "750" }}>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>
                                                <Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} >{record.postedBy.name}</Link>:
                                            </span>
                                                {record.text}
                                                {record.postedBy._id === state._id && <i onClick={() => deleteComment(item._id, record)} className="material-icons" style={{ color: "black", float: "right" }}>delete</i>
                                                }
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    console.log(item._id)
                                    makeComment(e.target[0].value, item._id)

                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>

                    )
                })
            }
        </div>
    )
}

export default Home