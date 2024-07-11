import { useCallback, useState } from "react";

import { getDeviceDetailsApi } from "../../../../services/feedProfile.services";

export const useEnvInfo = (currentFeederId) => {
    const [deviceDetail, setDeviceDetails] = useState();
    const [weatherInfo, setWeatherInfo] = useState()

    const getWeatherInfo = async (lat, lon) => {
        const {
            REACT_APP_WEATHER_API_KEY: weatherApiKey,
            REACT_APP_WEATHER_API_URL: weatherUrl
        } = process.env;
        
        const weather_url = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

        await fetch(weather_url)
            .then(res => res.json())
            .then(result => {
                setWeatherInfo(result);
            }).catch((err) => {});

    }

    const getDeviceDetails = useCallback(() => {
        getDeviceDetailsApi(currentFeederId)
            .then(result => {
                setDeviceDetails(result.data);
                let coords = JSON.parse(result.data.other_info);
                getWeatherInfo(coords.latitude, coords.longitude);
            })
    }, [currentFeederId])

    return {
        weatherInfo,
        deviceDetail,
        getDeviceDetails,
    }
}