import React from "react";
import "./userAvatarImg.css";


const UserAvatarImg = (props) =>{
    return (
        <div className={`userImage ${props.lg === true && 'lg'}`}>
            <span className="rounded-circle">
                <img src={props.img} className="w-100" alt="user profile picture" />
            </span>
        </div>
    )
}

export default UserAvatarImg;
