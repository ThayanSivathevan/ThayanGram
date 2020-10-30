import React, { useState, useEffect,useContext } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'

const ChangeProfile = () => {
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        if (!url) {
            return
        }
        fetch("/changeprofile", {

            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            },
            body: JSON.stringify({
                url
            })

        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: "#4a148c purple darken-4" })
            }
            else {
                M.toast({ html: "Changed Profile Picture", classes: "#4a148c purple darken-4" })
                localStorage.setItem("user", JSON.stringify(data))
                dispatch({ type: "USER", payload: data})
                history.push("/profile")
            }
        }).catch(err => {
            console.log(err)
        })
    }, [url])
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "thayangram")
        data.append("cloud_name", "dxderxdefrtgsx123123")
        fetch("https://api.cloudinary.com/v1_1/dxderxdefrtgsx123123/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => {
            setUrl(data.url)

        }).catch(err => {
            console.log(err)
        })


    }



    return(
        <div className="card createpost input-field">
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #4a148c purple darken-4">
                    <span>Upload Image</span>
                    <input className="file" type="file" multiple onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
            <button onClick={() => postDetails()} className="btn waves-effect waves-light #4a148c purple darken-4">
                Change Profile Picture
            </button>
        </div>


    )
    








}

export default ChangeProfile