import { api } from "./api";

export const getBirdsDataForGraphApi = async (
  feederId,
  { date, filter } = {}
) => {
  return (
    await api.get(
      ["getBirdsDataForGraph", feederId, date, filter].filter(Boolean).join("/")
    )
  ).data;
};

export const getExportedDataApi = async (feederId, date) => {
  return (
    await api.get(["getExportedData", feederId, date].filter(Boolean).join("/"))
  ).data;
};

export const getFeedConsumptionDataApi = async (
  feederId,
  { sfilter, dateFrom, dateTo } = {}
) => {
  const url = ["getFeedConsumptionData", feederId, sfilter, dateFrom, dateTo]
    .filter(Boolean)
    .join("/");
//   console.log("Request URL:", url);
  return (await api.get(url)).data;
};

export const getDeviceDetailsApi = async (feederId) => {
  return (await api.get(`getDeviceDetails/${feederId}`)).data;
};

export const getFeedsTimingsApi = async (feederId) => {
  return (await api.get(`getFeedsTimings/${feederId}`)).data;
};

export const getSensorDataApi = async (feederId) => {
  return (await api.get(`getSensorData/${feederId}`)).data;
};

export const addScheduleApi = async (feederId, data) => {
  return (await api.post(`addSchedule/${feederId}`, data)).data;
};

export const getFeederStopStatusApi = async (feederId) => {
  return (await api.get(`getFeederStopStatus/${feederId}`)).data;
};

export const updateScheduleStopStatusApi = async (userId, feederId, data) => {
  return (
    await api.post(`updateScheduleStopStatus/${userId}/${feederId}`, data)
  ).data;
};

export const updateScheduleStatusApi = async (userId, feederId, data) => {
  return (await api.post(`updateScheduleStatus/${userId}/${feederId}`, data))
    .data;
};

export const deleteScheduleApi = async (userId, feederId, data) => {
  return (await api.post(`deleteSchedule/${userId}/${feederId}`, data)).data;
};

export const getSchedulesApi = async (feederId) => {
  return (await api.get(`getSchedules/${feederId}`)).data;
};

export const getSunriseSunsetRangeApi = async (params) => {
  return api.get(`sunriseSunsetRange`, { params });
};

export const executeFeedNowApi = async (userId, feederId, data) => {
  return (await api.post(`executeFeedNow/${userId}/${feederId}`, data)).data;
};
