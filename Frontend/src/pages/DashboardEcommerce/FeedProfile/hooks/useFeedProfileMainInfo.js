import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const useFeedProfileMainInfo = () => {
    document.title = "Feed Profile";

    const location = useLocation();
    const currentFeederId = location.state.feederId;

    const [userId, setUserId] = useState()
    
    useEffect(() => {
        let authUser = window.sessionStorage.getItem("authUser")
        if (authUser && authUser != null) {
            let userdata = JSON.parse(authUser);
            setUserId(userdata.data.id);
        }
    }, [])

    useEffect(() => {
        window.sessionStorage.setItem("feederId", location.state.feederId);
    }, [currentFeederId])

    return {
        currentFeederId,
        userId,
    }
}