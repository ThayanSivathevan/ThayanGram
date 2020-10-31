import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory,useParams} from 'react-router-dom'

import M from 'materialize-css'


const Middle=()=>{
    const history = useHistory()
    const { userid } = useParams()
    useEffect(() => {
        history.push("/profile/" + userid)
    },[])
    return (
        <div>
        <h4>Middle Text</h4>
        </div>
    )
}

export default Middle