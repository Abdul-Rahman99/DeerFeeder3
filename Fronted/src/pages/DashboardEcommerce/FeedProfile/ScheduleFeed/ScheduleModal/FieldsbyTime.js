import React from "react";

export const FieldsbyTime = ({feed_schedule, feedTimeType, TimesDropDown, FixedTime}) => {
    switch (feed_schedule) {
        case "Sunrise":
        case "Sunset":
            if (feedTimeType != "fixed" && feedTimeType != "") {
                return <div>{TimesDropDown}</div>
            } else {
                return;
            }
        case "FixedTime":
            return (FixedTime)

    }
}