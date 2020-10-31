import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'



import M from 'materialize-css'
const Reset = () => {
    const history = useHistory();
    const [email, setEmail] = useState("")
    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Please enter valid email", classes: "#4a148c purple darken-4" })
            return;
        }
        fetch("/reset-password", {

            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })

        }).then(res => res.json()).then(data => {
            console.log(data)
            if (data.error) {
                M.toast({ html: data.error, classes: "#4a148c purple darken-4" })
            }
            else {
                M.toast({ html:data.message, classes: "#4a148c purple darken-4" })
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
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" />
                <button className="btn waves-effect waves-light #4a148c purple darken-4" onClick={() => postData()}>
                    Reset Password
                </button>
                <h6>
                    <Link to="/signup">Need to signup?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Reset