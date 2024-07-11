import { useState, useEffect } from "react";
import moment from "moment";
import Papa from "papaparse";

import {
  getExportedDataApi,
  getBirdsDataForGraphApi,
  getFeedConsumptionDataApi,
} from "../../../../../services/feedProfile.services";

export function useChartsProvider(currentFeederId) {
  const [FilterTypeBirdsNew, setFilterTypeBirdsNew] = useState("Daily");
  const [birdsPieDataForGraph, setBirdsPieDataForGraph] = useState();
  const [feedConsumptionData, setFeedConsumptionData] = useState();
  const [dateRangeBirdsNew, setDateRangeBirdsNew] = useState();
  const [birdsDataForGraph, setBirdsDataForGraph] = useState();
  const [myGraphLoader, setMyGraphLoader] = useState(false);
  const [filterType, setFilterType] = useState("Days");
  const [dateRangeNew, setDateRangeNew] = useState([]);

  useEffect(() => {
    setUpDefaultDateRange();
    getFeedConsumptionData();
    getBirdsDataForGraph();
  }, [currentFeederId]);

  const getFormatted = (str) => {
    let newDate =
      str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate();
    return newDate;
  };

  const setUpDefaultDateRange = () => {
    let date_now = new Date();
    let date_pre = date_now - 604800000;

    date_now = new Date(date_now);
    date_pre = new Date(date_pre);

    let sdatefrom = getFormatted(date_pre);
    let sdateto = getFormatted(date_now);

    setDateRangeNew([...dateRangeNew, sdatefrom, sdateto]);
    setDateRangeBirdsNew([sdateto]);
  };

  const getBirdsDataForGraph = async () => {
    if (
      dateRangeBirdsNew &&
      dateRangeBirdsNew.length > 0 &&
      FilterTypeBirdsNew &&
      FilterTypeBirdsNew !== "" &&
      FilterTypeBirdsNew !== "0"
    ) {
      let dateF = moment(dateRangeBirdsNew[0]).format("YYYY-MM-DD");

      setMyGraphLoader(true);
      await getBirdsDataForGraphApi(currentFeederId, {
        date: dateF,
        filter: FilterTypeBirdsNew,
      }).then((res) => {
        setMyGraphLoader(false);
        setBirdsDataForGraph(res.data);
        setBirdsPieDataForGraph(res.birdspiedata);
      });
    } else {
      setMyGraphLoader(true);
      getBirdsDataForGraphApi(currentFeederId).then((res) => {
        setMyGraphLoader(false);
        setBirdsDataForGraph(res.data);
        setBirdsPieDataForGraph(res.birdspiedata);
      });
    }
  };
  const getExportedData = async () => {
    if (dateRangeBirdsNew && dateRangeBirdsNew.length > 0) {
      let dateF = moment(dateRangeBirdsNew[0]).format("YYYY-MM-DD");
      await getExportedDataApi(currentFeederId, dateF)
        .then((response) => {
          if (response) {
            handleFileDownload(response, "birdsdata.csv");
          } else {
            console.error("Empty response");
          }
        })
        .catch((err) => console.error("Error fetching exported data:", err));
    } else {
      setMyGraphLoader(true);
      getExportedDataApi(currentFeederId)
        .then((response) => {
          if (response) {
            handleFileDownload(response, "birdsdata.csv");
          } else {
            console.error("Empty response");
          }
        })
        .catch((err) => console.error("Error fetching exported data:", err));
    }
  };
  const handleFileDownload = async (data, filename) => {
    if (data) {
      const blob = new Blob([data], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      await link.setAttribute("download", filename);

      link.click();

      URL.revokeObjectURL(url);
    } else {
      console.error("Empty data");
    }
  };
  const getFeedConsumptionData = () => {
    if (
      filterType &&
      filterType !== "undefined" &&
      dateRangeNew &&
      dateRangeNew.length === 2
    ) {
      const dateF = moment(dateRangeNew[0]).format("YYYY-MM-DD");
      const dateT = moment(dateRangeNew[1]).format("YYYY-MM-DD");
      setMyGraphLoader(true);
      getFeedConsumptionDataApi(currentFeederId, {
        dateFrom: dateF,
        dateTo: dateT,
        sfilter: filterType,
      })
        .then((res) => {
          setMyGraphLoader(false);
          setFeedConsumptionData(res);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setMyGraphLoader(false);
        });
    } else {
      setMyGraphLoader(true);
      getFeedConsumptionDataApi(currentFeederId)
        .then((res) => {
          setMyGraphLoader(false);
          setFeedConsumptionData(res);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setMyGraphLoader(false);
        });
    }
  };

  return {
    filterType,
    setFilterType,
    myGraphLoader,
    setMyGraphLoader,
    dateRangeNew,
    setDateRangeNew,
    dateRangeBirdsNew,
    setDateRangeBirdsNew,
    getExportedData,
    birdsDataForGraph,
    setBirdsDataForGraph,
    birdsPieDataForGraph,
    setBirdsPieDataForGraph,
    FilterTypeBirdsNew,
    setFilterTypeBirdsNew,
    feedConsumptionData,
    setFeedConsumptionData,
    setUpDefaultDateRange,
    getBirdsDataForGraph,
    getFeedConsumptionData,
  };
}
