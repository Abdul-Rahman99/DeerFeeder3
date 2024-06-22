import React from "react";

import { Series } from '../../../../../Components/Common/Series';

export const HoursMinutesDDL = ({type, setTimeHours, setTimeMinute}) => {
    if (type == 0) {
        return (
            <select 
                id="feed_time2" 
                className="form-select rounded-pill" 
                onChange={(e) => setTimeHours(e.target.value)}
            >
                <option value={''}>Hours</option>
                <Series
                    length={24}
                    isZeroPrefixed
                    component={(val) => (<option key={val} value={val}>{val}</option>)}
                />
            </select>
        )
    } else {
        return (
            <select className="form-select rounded-pill" onChange={(e) => setTimeMinute(e.target.value)}>
                <option value={''}>Minutes</option>
                <Series
                    length={60}
                    isZeroPrefixed
                    component={(val) => (<option key={val} value={val}>{val}</option>)}
                />
            </select>
        )
    }
}