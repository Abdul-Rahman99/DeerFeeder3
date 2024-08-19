const models = require("../models");
const { QueryTypes, Op } = require("sequelize");
var { ExecuteFeedingCommands, collectSchedules } = require("../Helper");
var { client, PublishCommand } = require("../mqtt");
var moment = require("moment");
var motor = require("../constants/motor");

const TestAPI = async (req, res) => {
  let feedJobs = await models.FoodSchedules.findAll({
    include: [{ model: models.FeedingDevices }],
  });
  res.status(200).json(feedJobs);
};

const addSchedule = async (req, res) => {
  let feederId = req.params.feederId;
  let userId = req.body.userId;
  let isNew = req.body.isNew;
  let post = {
    title: req.body.title,
    quantity: req.body.quantity,
    feed_schedule: req.body.feed_schedule,
    feed_time: req.body.feed_time,
    feed_time_type: req.body.feed_time_type,
    feed_day: JSON.stringify(req.body.feed_day),
    feeder_id: feederId,
  };

  try {
    if (isNew && isNew != "") {
      await models.FoodSchedules.update(post, {
        where: { id: req.body.isNew },
      });
    } else {
      await models.FoodSchedules.create(post);
    }

    await ExecuteFeedingCommands(feederId, userId);

    const foodschedule_data = await models.FoodSchedules.findAll();

    const response = {
      status: "success",
      data: foodschedule_data,
    };
    res.status(200).json(response);
  } catch (error) {
    const response = {
      status: "failed",
      error: error.message,
    };
    res.status(400).json(response);
  }
};
const deleteSchedule = async (req, res) => {
  try {
    let result = await models.FoodSchedules.destroy({
      where: {
        id: req.body.id,
      },
    });
    let feederId = req.params.feederId;
    let userId = req.params.userId;

    await ExecuteFeedingCommands(feederId, userId);
    const response = {
      status: "success",
    };
    res.status(200).json(response);
  } catch (error) {
    const response = {
      status: "failed",
    };
    res.status(400).json(response);
  }
};
const ExecuteFeedNow = async (req, res) => {
  let {
    params: { userId, feederId },
    body: { quantity = 10 },
  } = req;

  quantity = isNaN(quantity) ? 10 : +quantity;
  const duration = quantity / motor.kgPerSec;

  let feedingDevices = await models.FeedingDevices.findOne({
    where: {
      id: feederId,
    },
  });

  if (feedingDevices !== null) {
    let topic = "ctrl/feedsetting";
    let message = "0<ctrl_feed_now>0,1<" + feedingDevices.feeder_id + ">1";
    console.log("command", message);
    PublishCommand(topic, message);
    await models.AuditLogs.create({ command: message, user_id: userId });

    let newMessage = `{"0":"feed_done","50":"11","60":"45","61":"10000","62":"0","65":"1721243644","67":"2","68":"1439"}`;
    await models.FeedingDone.create({
      client_message: newMessage,
      feeder_id: feedingDevices.id,
    });

    const response = {
      status: true,
    };
    res.status(200).json(response);
  } else {
    const response = {
      status: false,
    };
    res.status(200).json(response);
  }
};
const ExecuteFeedingStopCommands = async (feeder_id, is_enabled, userId) => {
  let feedingDevices = await models.FeedingDevices.findOne({
    where: {
      id: feeder_id,
    },
  });
  if (feedingDevices !== null) {
    let topic = "ctrl/feedsetting";
    let message;
    if (is_enabled == 1) {
      message = "0<ctrl_feed_stop_on>0,1<" + feedingDevices.feeder_id + ">1";
    } else {
      message = "0<ctrl_feed_stop_off>0,1<" + feedingDevices.feeder_id + ">1";
    }
    console.log("command", message);
    PublishCommand(topic, message);
    await ExecuteFeedingCommands(feeder_id, userId);
    await models.AuditLogs.create({ command: message, user_id: userId });
  }
};
const UpdateScheduleStopStatus = async (req, res) => {
  let feederId = req.params.feederId;
  let userId = req.params.userId;
  let prev_status = req.body.is_started;
  let ToStop = prev_status == 1 ? 0 : 1;

  let FeedRunStatus = await models.FeedRunStatus.findOne({
    where: {
      feeder_id: feederId,
    },
  });
  if (FeedRunStatus !== null) {
    await models.FeedRunStatus.update(
      { status: ToStop },
      {
        where: {
          feeder_id: feederId,
        },
      }
    );
  } else {
    await models.FeedRunStatus.create({ feeder_id: feederId, status: ToStop });
  }
  ExecuteFeedingStopCommands(feederId, ToStop, userId);

  const response = {
    status: "success",
  };
  res.status(200).json(response);
};
const getFeederStopStatus = async (req, res) => {
  let feederId = req.params.feederId;

  let FeedRunStatus = await models.FeedRunStatus.findOne({
    where: {
      feeder_id: feederId,
    },
  });

  if (!FeedRunStatus) {
    FeedRunStatus = await models.FeedRunStatus.create({
      feeder_id: feederId,
      status: 1,
    });
  }

  res.status(200).json(FeedRunStatus);
};
const updateScheduleStatus = async (req, res) => {
  try {
    let userId = req.params.userId;

    await models.FoodSchedules.update(
      { is_enabled: req.body.is_enabled },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    let result = await models.FoodSchedules.findOne({
      where: {
        id: req.body.id,
      },
    });
    let feederId = req.params.feederId;

    console.log("\n\n\n", feederId, userId, "\n\n\n");
    await ExecuteFeedingCommands(feederId, userId);
    console.log("\n\n\n", feederId, userId, "\n\n\n");
    const response = {
      status: "success",
      data: result,
    };
    res.status(200).json(response);
  } catch (error) {
    const response = {
      status: "failed",
      error: error,
    };
    res.status(201).json(response);
  }
};

const getSchedules = async (req, res) => {
  try {
    let feederId = req.params.feederId;
    const foodschedule_data = await models.FoodSchedules.findAll({
      where: { feeder_id: feederId },
    });

    let schData = await collectSchedules(feederId);
    const response = {
      status: "success",
      data: foodschedule_data,
      schedule_data: schData,
    };
    res.status(200).json(response);
  } catch (error) {
    const response = {
      status: "failed",
      error: error.message,
    };
    res.status(400).json(response);
  }
};
const getFormatted = (str) => {
  // let newDate = str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate() + " " + str.getHours() + ":" + str.getMinutes() + ":" + str.getSeconds();
  let newDate =
    str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate();
  return newDate;
};

const getFeedConsumptionData = async (req, res) => {
  try {
    const feederId = req.params.feederId;
    let sfilter = req.params.sfilter || "Daily";
    let sdatefrom = req.params.datefrom;
    let sdateto = req.params.dateto;

    // Log request parameters
    console.log("Request Params:", { feederId, sfilter, sdatefrom, sdateto });

    // Validate feederId
    if (!feederId) {
      return res.status(400).send({ error: "Feeder ID is required" });
    }

    // Default to last 7 days if dates are not provided
    const today = moment().startOf("day");
    const defaultDateFrom = moment().subtract(7, "days").startOf("day");

    sdatefrom = sdatefrom ? moment(sdatefrom, "YYYY-MM-DD") : defaultDateFrom;
    sdateto = sdateto ? moment(sdateto, "YYYY-MM-DD") : today;

    if (!sdatefrom.isValid() || !sdateto.isValid()) {
      return res.status(400).send({ error: "Invalid date format" });
    }

    let selectCmd = "",
      groupCmd = "",
      orderCmd = "";
    let duration_diff = 0;

    // Calculate duration
    var duration = moment.duration(sdateto.diff(sdatefrom));
    console.log(
      "Duration:",
      duration,
      "From:",
      sdatefrom.format("YYYY-MM-DD"),
      "To:",
      sdateto.format("YYYY-MM-DD")
    );

    // Determine filter and SQL commands based on the filter type
    switch (sfilter) {
      case "Daily":
        selectCmd = " DAYNAME(createdAt) as timeperiod, ";
        groupCmd = " DAY(createdAt)";
        orderCmd = "ORDER BY DAY(createdAt)";
        duration_diff = duration.asDays();
        break;
      case "Weekly":
        selectCmd = " WEEK(createdAt) as timeperiod, ";
        groupCmd = " WEEK(createdAt)";
        orderCmd = "ORDER BY WEEK(createdAt)";
        duration_diff = duration.asWeeks();
        break;
      case "Monthly":
        selectCmd = " MONTHNAME(createdAt) as timeperiod, ";
        groupCmd = " MONTHNAME(createdAt)";
        orderCmd = "ORDER BY MONTHNAME(createdAt)";
        duration_diff = duration.asMonths();
        break;
      case "Yearly":
        selectCmd = " YEAR(createdAt) as timeperiod, ";
        groupCmd = " YEAR(createdAt)";
        orderCmd = "ORDER BY YEAR(createdAt)";
        duration_diff = duration.asYears();
        break;
      default:
        sfilter = "Daily";
        selectCmd = " DAYNAME(createdAt) as timeperiod, ";
        groupCmd = " DAY(createdAt)";
        orderCmd = "ORDER BY DAY(createdAt)";
        duration_diff = duration.asDays();
        break;
    }

    console.log("Filter:", sfilter, "Duration Diff:", duration_diff);

    let testAr = [];
    for (let i = 0; i <= duration_diff; i++) {
      let moment_date = sdatefrom.clone().add(i, "days").format("YYYY-MM-DD");
      console.log("Date:", moment_date);
      testAr.push(moment_date);
    }

    const query_max = `
              SELECT COUNT(0) AS 'feed'
              FROM FeedingDones
              WHERE feeder_id = '${feederId}' 
              AND LENGTH(client_message) > 30 
              AND DATE(createdAt) BETWEEN '${sdatefrom.format(
                "YYYY-MM-DD"
              )}' AND '${sdateto.format("YYYY-MM-DD")}'
          `;
    console.log("Query Max:", query_max);

    const records_max = await models.sequelize.query(query_max, {
      type: QueryTypes.SELECT,
    });
    const feed_max = records_max ? records_max[0].feed : 0;
    console.log("Feed Max:", feed_max);

    let myLabels = [];
    let myValues = [];
    let queries = [];

    if (sfilter === "Daily") {
      for (let i = 0; i <= duration_diff; i++) {
        let moment_date = sdatefrom.clone().add(i, "days").format("YYYY-MM-DD");
        const query = `
                      SELECT client_message AS 'feed'
                      FROM FeedingDones
                      WHERE feeder_id = '${feederId}' 
                      AND DATE(createdAt) = '${moment_date}'
                  `;
        console.log("Query:", query);

        myLabels.push(moment_date);
        queries.push(
          models.sequelize.query(query, { type: QueryTypes.SELECT })
        );
      }

      (await Promise.all(queries)).forEach((records) => {
        let feed_consumed = 0;
        if (records) {
          records.forEach((val) => {
            let feed = JSON.parse(val.feed);
            if (feed[61]) {
              let timeran = feed[61]; // motor duration
              feed_consumed += (timeran / 1000) * motor.kgPerSec;
            }
          });
        }
        myValues.push(Math.round(feed_consumed) || 0);
      });

      console.log("Labels:", myLabels);
      console.log("Values:", myValues);
      res.status(200).send({ data: myValues, labels: myLabels, max: feed_max });
    } else {
      const query = `
                  SELECT ${selectCmd} COUNT(0) AS 'feed', DAYNAME(MAX(createdAt)) AS 'dayname',
                      MONTHNAME(MAX(createdAt)) AS 'monthname', YEAR(MAX(createdAt)) AS 'year', DATE(MAX(createdAt)) AS 'createdAt'
                  FROM FeedingDones
                  WHERE feeder_id = '${feederId}' 
                  AND DATE(createdAt) BETWEEN '${sdatefrom.format(
                    "YYYY-MM-DD"
                  )}' AND '${sdateto.format("YYYY-MM-DD")}'
                  AND LENGTH(client_message) > 30
                  GROUP BY ${groupCmd}
                  ${orderCmd}
              `;
      console.log("Query:", query);

      const records = await models.sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
      if (records) {
        records.forEach((val) => {
          let timeperiod = val.timeperiod;
          let feed = val.feed;
          let monthname = val.monthname.substring(0, 3);
          let year = val.year;
          if (sfilter === "Weekly")
            myLabels.push(`${monthname} Week ${timeperiod}`);
          else if (sfilter === "Monthly") myLabels.push(`${monthname}-${year}`);
          else myLabels.push(timeperiod);
          myValues.push(feed * 2);
        });

        console.log("Labels:", myLabels);
        console.log("Values:", myValues);
        res
          .status(200)
          .send({ data: myValues, labels: myLabels, max: feed_max });
      } else {
        res.status(200).send(myValues);
      }
    }
  } catch (error) {
    console.error("Error in getFeedConsumptionData:", error);
    res.status(500).send({
      error: "An error occurred while fetching feed consumption data",
    });
  }
};

const getHourlyFeedConsumptionData = async (req, res) => {
  try {
    const feederId = req.params.feederId;
    const startDate = req.params.datefrom
      ? moment(req.params.datefrom, "YYYY-MM-DD")
      : moment().startOf("day").subtract(1, "days");
    const endDate = req.params.dateto
      ? moment(req.params.dateto, "YYYY-MM-DD")
      : moment().startOf("day");

    if (!feederId) {
      return res.status(400).send({ error: "Feeder ID is required" });
    }

    if (!startDate.isValid() || !endDate.isValid()) {
      return res.status(400).send({ error: "Invalid date format" });
    }

    if (startDate.isAfter(endDate)) {
      return res
        .status(400)
        .send({ error: "Start date cannot be after end date" });
    }

    let labels = [];
    let values = [];
    let queries = [];

    for (let i = 0; i < 24; i++) {
      const startHour = startDate.clone().add(i, "hours");
      const endHour = startHour.clone().add(1, "hours");

      const query = `
      SELECT Wieghts, createdAt AS 'timeperiod'
      FROM (
        SELECT 
          Wieghts, 
          createdAt, 
          ROW_NUMBER() OVER (PARTITION BY 
            DATE_FORMAT(createdAt, '%Y-%m-%d %H'), 
            FLOOR(MINUTE(createdAt) / 10) 
          ORDER BY ABS(MINUTE(createdAt) - 10 * FLOOR(MINUTE(createdAt) / 10))) AS rn
        FROM wtsensors
        WHERE FeederId = '${feederId}'
          AND createdAt BETWEEN '${startHour.format("YYYY-MM-DD HH:mm:ss")}'
          AND '${endHour.format("YYYY-MM-DD HH:mm:ss")}'
      ) AS subquery
      WHERE rn = 1
      ORDER BY createdAt;
      `;

      queries.push(models.sequelize.query(query, { type: QueryTypes.SELECT }));
      labels.push(startHour.format("HH:mm"));
    }

    const results = await Promise.all(queries);

    results.forEach((records) => {
      if (records.length === 6) {
        let hourWeights = records.map((record) => {
          return record.Wieghts.split(",").map((weight) => parseFloat(weight));
        });
        // console.log("hourWeights:", hourWeights);
        const totalConsumption = hourWeights[0].reduce(
          (acc, weight, i) => acc + (weight - hourWeights[5][i]),
          0
        );
        // console.log("totalConsumption:", totalConsumption);
        const averageConsumption = totalConsumption;

        // jsut a failire condition if the feed is getting filled by someone or someone puts his hands in the trays so the value increased
        // NO DEERS WILL CONSUME MORE THAN 5kg PER HOUR <they are consuming from 10 to 20 kgs per day>
        if (Math.abs(averageConsumption.toFixed(1)) > 5) {
          values.push(0);
        } else {
          values.push(Math.abs(averageConsumption.toFixed(1)));
        }
      } else {
        values.push(0);
      }
    });

    res.status(200).send({ data: values, labels: labels });
  } catch (error) {
    console.error("Error in getHourlyFeedConsumptionData:", error);
    res.status(500).send({ error: error.message });
  }
};

const getDailyFeedConsumptionData = async (req, res) => {
  try {
    const feederId = req.params.feederId;
    const startDate = req.params.datefrom
      ? moment(req.params.datefrom, "YYYY-MM-DD")
      : moment().startOf("day").subtract(7, "days");
    const endDate = req.params.dateto
      ? moment(req.params.dateto, "YYYY-MM-DD")
      : moment().startOf("day");

    if (!feederId) {
      return res.status(400).send({ error: "Feeder ID is required" });
    }

    if (!startDate.isValid() || !endDate.isValid()) {
      return res.status(400).send({ error: "Invalid date format" });
    }

    if (startDate.isAfter(endDate)) {
      return res
        .status(400)
        .send({ error: "Start date cannot be after end date" });
    }

    let labels = [];
    let values = [];

    const daysCount = endDate.diff(startDate, "days") + 1;

    for (let i = 0; i < daysCount; i++) {
      const dayStart = startDate.clone().add(i, "days").startOf("day");
      const dayEnd = dayStart.clone().endOf("day");

      let dailyConsumption = 0;

      for (let hour = 0; hour < 24; hour++) {
        const startHour = dayStart.clone().add(hour, "hours");
        const endHour = startHour.clone().add(1, "hours");

        const query = `
        SELECT Wieghts, createdAt AS 'timeperiod'
        FROM (
          SELECT 
            Wieghts, 
            createdAt, 
            ROW_NUMBER() OVER (PARTITION BY 
              DATE_FORMAT(createdAt, '%Y-%m-%d %H'), 
              FLOOR(MINUTE(createdAt) / 10) 
            ORDER BY ABS(MINUTE(createdAt) - 10 * FLOOR(MINUTE(createdAt) / 10))) AS rn
          FROM wtsensors
          WHERE FeederId = '${feederId}'
            AND createdAt BETWEEN '${startHour.format("YYYY-MM-DD HH:mm:ss")}'
            AND '${endHour.format("YYYY-MM-DD HH:mm:ss")}'
        ) AS subquery
        WHERE rn = 1
        ORDER BY createdAt;
        `;

        const records = await models.sequelize.query(query, {
          type: QueryTypes.SELECT,
        });

        if (records.length === 6) {
          let hourWeights = records.map((record) => {
            return record.Wieghts.split(",").map((weight) =>
              parseFloat(weight)
            );
          });
          const totalConsumption = hourWeights[0].reduce(
            (acc, weight, i) => acc + (weight - hourWeights[5][i]),
            0
          );
          const averageConsumption = totalConsumption;

          if (Math.abs(Math.round(averageConsumption)) <= 5) {
            dailyConsumption += Math.abs(Math.round(averageConsumption));
          }
        }
      }

      labels.push(dayStart.format("YYYY-MM-DD"));
      values.push(dailyConsumption);
    }

    res.status(200).send({ data: values, labels: labels });
  } catch (error) {
    console.error("Error in getDailyFeedConsumptionData:", error);
    res.status(500).send({ error: error.message });
  }
};

const getSunriseSunsetRange = async (req, res) => {
  const { sDay = new Date(), eDay = new Date() } = req.query;

  try {
    const sunrisesSunsets = await models.SunriseSunset.findAll({
      attributes: [
        [models.Sequelize.fn("DATE", models.Sequelize.col("sp_date")), "day"],
        ["sunrise", "Sunrise"],
        ["sunset", "Sunset"],
      ],
      where: models.Sequelize.where(
        models.Sequelize.fn("DATE", models.Sequelize.col("sp_date")),
        {
          [Op.between]: [
            moment(sDay).utcOffset(240).format("YYYY-MM-DD"),
            moment(eDay).utcOffset(240).format("YYYY-MM-DD"),
          ],
        }
      ),
    });

    res.status(200).json(sunrisesSunsets);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFeedsTimings = async (req, res) => {
  let feederId = req.params.feederId;
  let moment_date = moment().utcOffset(240).format("YYYY-MM-DD");
  let SunriseSunset = await models.SunriseSunset.findOne({
    where: models.sequelize.where(
      models.sequelize.fn("date", models.sequelize.col("sp_date")),
      "=",
      moment_date
    ),
  });
  let StrTimings = [];
  if (SunriseSunset !== null && SunriseSunset.length > 0) {
    let sunrise = SunriseSunset.sunrise;
    let sunset = SunriseSunset.sunset;

    let feedJobs = await models.FoodSchedules.findAll({
      include: [{ model: models.FeedingDevices }],
      where: {
        feeder_id: feederId,
        is_enabled: 1,
      },
    });

    if (feedJobs !== null && feedJobs.length > 0) {
      // console.log(feedJobs);
      // process.exit(0)
      var dateString_Sunrise = moment(moment_date + " " + sunrise);
      var dateString_Sunset = moment(moment_date + " " + sunset);

      // var dateString_Sunrise = moment.unix(sunrise).utcOffset(240);
      // var dateString_Sunset = moment.unix(sunset).utcOffset(240);
      let feederId = feedJobs[0].FeedingDevice.feeder_id;
      console.log("feederId", feederId);
      console.log("Ssunrise", dateString_Sunrise);
      console.log("Ssunset", dateString_Sunset);

      feedJobs.map((val) => {
        // let feederId = val.FeedingDevice.feeder_id;
        let feed_schedule = val.feed_schedule;
        let feed_time_type = val.feed_time_type;
        let feed_time = val.feed_time;

        console.log("feedschedule", feed_schedule);

        if (feed_schedule == "FixedTime") {
          let feedtimesplited = feed_time.split(",");

          feedtimesplited.map((val) => {
            StrTimings.push(val);
          });
          // StrTimings.push(feed_time);
        } else if (feed_schedule == "Sunrise") {
          console.log("sunrise in");
          if (feed_time_type == "before") {
            console.log("sunrise before");
            var sunriseTimeToFeed = moment(dateString_Sunrise)
              .subtract(feed_time, "minutes")
              .format("H:mm");
            let sunriseAr = sunriseTimeToFeed.split(":");
            if (sunriseAr[0] < 10) {
              StrTimings.push("0" + sunriseTimeToFeed);
            } else {
              StrTimings.push(sunriseTimeToFeed);
            }
          } else {
            console.log("sunrise after");
            var sunriseTimeToFeed = moment(dateString_Sunrise)
              .add(feed_time, "minutes")
              .format("H:mm");
            let sunriseAr = sunriseTimeToFeed.split(":");
            if (sunriseAr[0] < 10) {
              StrTimings.push("0" + sunriseTimeToFeed);
            } else {
              StrTimings.push(sunriseTimeToFeed);
            }
          }
        } else if (feed_schedule == "Sunset") {
          if (feed_time_type == "before") {
            var sunsetTimeToFeed = moment(dateString_Sunset)
              .subtract(feed_time, "minutes")
              .format("H:mm");
            StrTimings.push(sunsetTimeToFeed);
          } else {
            var sunsetTimeToFeed = moment(dateString_Sunset)
              .add(feed_time, "minutes")
              .format("H:mm");
            StrTimings.push(sunsetTimeToFeed);
          }
        }
      });
      StrTimings.sort();
      console.log(StrTimings);
      // var currentTime = moment().format("Hmm");
      // console.log(currentTime);
    }
  }

  // process.exit(0)
  //
  let feedData = await models.FeedingDone.findOne({
    where: {
      feeder_id: feederId,
      client_message: {
        [Op.like]: '{"0":"feed_done"%',
      },
    },
    order: [["id", "DESC"]],
    limit: 1,
  });
  if (feedData !== null) {
    const response = {
      status: true,
      data: feedData,
      StrTimings: StrTimings,
    };
    res.status(200).json(response);
  } else {
    res.status(200).json({ success: false });
  }
};

module.exports = {
  TestAPI,
  addSchedule,
  deleteSchedule,
  updateScheduleStatus,
  getSchedules,
  getDailyFeedConsumptionData,
  getHourlyFeedConsumptionData,
  getSunriseSunsetRange,
  getFeedConsumptionData,
  getFeedsTimings,
  UpdateScheduleStopStatus,
  getFeederStopStatus,
  ExecuteFeedNow,
};
