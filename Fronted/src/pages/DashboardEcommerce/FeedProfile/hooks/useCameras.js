import { useState } from "react"

export const useCameras = (currentFeederId) => {
    var [camPic2, setPicture2] = useState(0)
    var [camPic, setPicture] = useState(0)

    const updateCameras = (topic, message) => {
        if (
            currentFeederId + "capture1" == topic ||
            currentFeederId + "capture2" == topic ||
            currentFeederId + "processed1" == topic ||
            currentFeederId + "processed2" == topic
        ) {

            if (topic == currentFeederId + "capture1") {
                if (message.key != null && message.key != "undefined") {
                    setPicture(message.key)
                }
            }
            if (topic == currentFeederId + "capture2") {
                if (message.key != null && message.key != "undefined") {
                    setPicture2(message.key)
                }
            }
            if (topic == currentFeederId + "processed1") {
                if (message.key != null && message.key != "undefined") {
                    setPicture(message.key)
                }
            }
            if (topic == currentFeederId + "processed2") {
                if (message.key != null && message.key != "undefined") {
                    setPicture2(message.key)
                }
            }


        } else {

            if (parseInt(currentFeederId) === 3 || currentFeederId == "3") {
                if (topic == "capture3") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture(message.key)
                    }
                }
                if (topic == "capture4") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture2(message.key)
                    }
                }
            } else if (parseInt(currentFeederId) === 2 || currentFeederId == "2") {
                if (topic == "e45f01e4b30aCapture1") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture(message.key)
                    }
                }
                if (topic == "e45f01e4b30aCapture2") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture2(message.key)
                    }
                }

            } else {
                if (topic == "capture1") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture(message.key)
                    }
                }
                if (topic == "capture2") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture2(message.key)
                    }
                }
                if (topic == "Processed1") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture(message.key)
                    }
                }
                if (topic == "Processed2") {
                    if (message.key != null && message.key != "undefined") {
                        setPicture2(message.key)
                    }
                }
            }
        }
    }

    return {
        camPic,
        camPic2,
        updateCameras
    }
}