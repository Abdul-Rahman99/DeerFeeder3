import { useEffect } from "react";
import io from 'socket.io-client'

import { api } from '../../../../config';

var socket = io.connect(api.SOCKET_API_URL)

export const useSocket = ({
    handleFeederUpdate,
    getDeviceDetails,
    getFeedsTimings,
    getSensorData,
    updateCameras,
}) => {

    useEffect(()=> {
        socket = io.connect(api.SOCKET_API_URL)
        const onCustomEvent = (topic, message, feeder_id) => {
            handleFeederUpdate(feeder_id, topic, message);
            updateCameras(topic, message);
        }

        const onConnect = () => {
            socket.on(`custom-event`, onCustomEvent);
        }

        socket.on("connect", onConnect);

        return () => {
            socket.off(`custom-event`)
            socket.off("connect")
            socket.disconnect()
         }
    }, [])

    useEffect(() => {
        getSensorData();
        getFeedsTimings();
        getDeviceDetails();
    }, [])
};