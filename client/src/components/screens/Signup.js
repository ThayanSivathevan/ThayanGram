import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")


    const uploadPic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "thayangram")
        data.append("cloud_name", "dxderxdefrtgsx123123")
        fetch("https://api.cloudinary.com/v1_1/dxderxdefrtgsx123123/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => {
            console.log(data.url)
            setUrl(data.url)
            postData(data.url)

        }).catch(err => {
            console.log(err)
        })



    }
    const uploadData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Please enter valid email", classes: "#4a148c purple darken-4" })
            return;
        }
        if (image && !url) {
            uploadPic()
        }
        else if(!url){
            M.toast({ html: "Please add a profile picture", classes: "#4a148c purple darken-4" })
            return
        }
        else{
            postData()
        }
        
    }
    const postData=(url1)=>{
        if(!url1){
            url1=this.url
        }
        fetch("/signup", {

            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                url:url1
            })

        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: "#4a148c purple darken-4" })
            }
            else {
                M.toast({ html: data.message, classes: "#4a148c purple darken-4" })
                history.push("/login")
            }
        }).catch(err => {
            console.log(err)
        })
    }




    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>ThayanGram</h2>
                <input value={name} onChange={(e) => setName(e.target.value)}
                    type="text" placeholder="name" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #4a148c purple darken-4">
                        <span>Upload Profile Picture</span>
                        <input className="file" type="file" multiple onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #4a148c purple darken-4" onClick={() => uploadData()}>
                    Register
                </button>
                <h6>
                    <Link to="/login">Already have an account?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signup