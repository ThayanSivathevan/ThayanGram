import React, { useState, useContext } from 'react'
import { Link, useHistory,useParams } from 'react-router-dom'
import { UserContext } from '../../App'


import M from 'materialize-css'
const NewPassword = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory();
    const [password, setPassword] = useState("")
    const {token}=useParams()
    const postData = () => {
        fetch("/new-password", {

            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
            })

        }).then(res => res.json()).then(data => {
            console.log(data)
            if (data.error) {
                M.toast({ html: data.error, classes: "#4a148c purple darken-4" })
            }
            else {
                M.toast({ html: "Signed in successfully", classes: "#4a148c purple darken-4" })
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
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="enter new password" />
                <button className="btn waves-effect waves-light #4a148c purple darken-4" onClick={() => postData()}>
                    Reset password
                </button>
            </div>
        </div>
    )
}

export default NewPassword