const moment = require("moment");
const models = require("../models");
const { client, PublishCommand } = require("../mqtt");
const { exit } = require("process");
const {
  Op,
  QueryTypes,
  where,
  sequelize,
  INTEGER,
  query,
} = require("sequelize");
// const {
//   ExecuteFeedNowWT,
// } = require("../controllers/foodcontroller");

const handleQuantity = (time, qty) => {
  let div = qty / 2;
  console.log(time);
  for (let i = 1; i < div; i++) {
    let newHM = moment("2024-02-24 " + time)
      .add(2, "minutes")
      .format("H:mm");
    time = newHM;
    console.log(newHM);
  }
};
const getFeedDones = async (feeder_id) => {
  let datefrom = process.env.DateFromTank || Date.now();
  let tank;
  if (parseInt(feeder_id) == 5 || parseInt(feeder_id) == 3) {
    tank = 260;
  } else {
    tank = 800;
  }

  let tanksize = tank / 0.4;
  let data = await models.FeedingDone.findAll({
    where: {
      [models.Sequelize.Op.and]: [
        {
          feeder_id: feeder_id,
        },
        models.sequelize.where(
          models.sequelize.fn("date", models.sequelize.col("createdAt")),
          ">=",
          datefrom
        ),
      ],
    },
    raw: true,
  });
  if (data !== null) {
    let seconds = 0;
    data.map((val, i) => {
      let client_message = JSON.parse(val.client_message);
      if (client_message) {
        let getdata = client_message[61];
        seconds = seconds + parseInt(getdata);
      }
    });
    seconds = seconds / 1000;
    let percentage = (seconds / tanksize) * 100;
    percentage = Math.round(percentage);
    if (percentage <= 100) {
      return 100 - percentage;
    }
  }
  return 0;
};

const collectSchedules = async (feeder_id, curday = "today") => {
  let moment_date;
  let dayName;
  if (curday == "today") {

    moment_date = moment().utcOffset(240).format("YYYY-MM-DD");

    dayName = moment().utcOffset(240).format("ddd");
  } else {
    moment_date = moment().add(1, "day").utcOffset(240).format("YYYY-MM-DD");

    dayName = moment().add(1, "day").utcOffset(240).format("ddd");
  }

  let whereCond = {
    is_enabled: 1,
    feeder_id: feeder_id,
  };

  let SunriseSunset = await models.SunriseSunset.findOne({
    where: models.sequelize.where(
      models.sequelize.fn("date", models.sequelize.col("sp_date")),
      "=",
      moment_date
    ),
  });

  if (SunriseSunset) {
    let sunrise = SunriseSunset.sunrise;
    let sunset = SunriseSunset.sunset;
    console.log("DayName", sunrise, sunset);

    let feedJobs = await models.FoodSchedules.findAll({
      include: [{ model: models.FeedingDevices }],
      where: whereCond,
    });
    if (feedJobs !== null) {
      var dateString_Sunrise = moment(moment_date + " " + sunrise);
      var dateString_Sunset = moment(moment_date + " " + sunset);

      console.log("sunrise", sunrise);
      console.log("sunset", sunset);
      console.log("Ssunrise", dateString_Sunrise);
      console.log("Ssunset", dateString_Sunset);

      let FeederTimings = [];
      let Feeders = [];
      feedJobs.map((val) => {
        let feederId = val.FeedingDevice.feeder_id;
        if (Feeders.includes(feederId) == false) {
          Feeders[val.FeedingDevice.id] = feederId;
          FeederTimings[val.FeedingDevice.id] = [];
        }
        let feed_schedule = val.feed_schedule;
        let feed_time_type = val.feed_time_type;
        let feed_time = val.feed_time;
        let feedDays = JSON.parse(val.feed_day);
        console.log("feedschedule", dayName, feedDays);

        let StrTimings = [];
        if (feedDays.includes(dayName)) {
          console.log("feedschedule", feed_schedule);

          if (feed_schedule == "FixedTime") {
            let feedtimesplited = feed_time.split(",");

            feedtimesplited.map((val) => {
              StrTimings.push(val);
            });

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
          if (FeederTimings.includes(val.FeedingDevice.id) == false) {
            // Feeders[val.FeedingDevice.id] = feederId
            // FeederTimings[val.FeedingDevice.id] = []
          }
          FeederTimings[val.FeedingDevice.id].push(StrTimings);
        } else {
          console.log("Feeders", Feeders);
          console.log("FeederTimings", FeederTimings);
        }
      });
      console.log("Feeders", Feeders);
      console.log("FeederTimings", FeederTimings);
      if (FeederTimings[feeder_id]?.length > 0) {
        let myNewAr = [];
        for (let i = 0; i < FeederTimings[feeder_id].length; i++) {
          FeederTimings[feeder_id][i].map((val, j) => {
            // console.log("Feeders", FeederTimings[feeder_id][i]);
            let ArVal = FeederTimings[feeder_id][i][j];
            ArVal = ArVal.split(":");
            console.log("Feeders", ArVal);
            let NextPossible = ArVal[0] + "" + ArVal[1];
            myNewAr.push(NextPossible);
          });
        }
        myNewAr.sort();

        // exit(0)

        myNewAr.map((timeframe, i) => {
          var output = [timeframe.slice(0, 2), ":", timeframe.slice(2)].join(
            ""
          );
          myNewAr[i] = moment_date + " " + output + ":00";
        });

        var CurrentdateString = moment()
          .zone("+0400")
          .format("dddd, MMMM D, YYYY, H:mm:ss");
        let mostlasttime = myNewAr[myNewAr.length - 1];
        var nextSchedule = moment(mostlasttime).format(
          "dddd, MMMM D, YYYY, H:mm:ss"
        );
        if (moment(nextSchedule).isAfter(CurrentdateString)) {
          return myNewAr;
        } else {
          return await collectSchedules(feeder_id, "tomorrow");
        }

        // return myNewAr
      } else {
        return false;
      }
    } else {
      // If no schedule on this day
      return false;
    }
  } else {
    // No sunset and sunrise
    return false;
  }
};

const ExecuteFeedingCommands = async (feeder_id = null, userId = null) => {

  let moment_date = moment().format("YYYY-MM-DD");

  let dayName = moment().format("ddd");

  let whereCond = {
    is_enabled: 1,
  };

  if (feeder_id && userId) {
    whereCond = {
      is_enabled: 1,
      feeder_id: feeder_id,
    };
  }

  let SunriseSunset = await models.SunriseSunset.findOne({
    where: models.sequelize.where(
      models.sequelize.fn("date", models.sequelize.col("sp_date")),
      "=",
      moment_date
    ),
  });

  if (SunriseSunset) {
    let sunrise = SunriseSunset.sunrise;
    let sunset = SunriseSunset.sunset;
    console.log("DayName", sunrise, sunset);

    let feedJobs = await models.FoodSchedules.findAll({
      include: [{ model: models.FeedingDevices }],
      where: whereCond,
    });
    if (feedJobs !== null) {
      var dateString_Sunrise = moment(moment_date + " " + sunrise);
      var dateString_Sunset = moment(moment_date + " " + sunset);

      // console.log("feederId", feederId)

      let FeederTimings = [];
      let Feeders = [];
      feedJobs.map((value) => {
        let val = value.get({ plain: true });
        console.log(val);
        if (val.FeedingDevice != null) {
          let feederId = val.FeedingDevice.feeder_id;
          if (Feeders.includes(feederId) == false) {
            Feeders[val.FeedingDevice.id] = feederId;
            FeederTimings[val.FeedingDevice.id] = [];
          }
          let feed_schedule = val.feed_schedule;
          let feed_time_type = val.feed_time_type;
          let feed_time = val.feed_time;
          let feedDays = JSON.parse(val.feed_day);

          let StrTimings = [];
          if (feedDays.includes(dayName)) {
            console.log("feedschedule", feed_schedule);
            console.log("feedschedule", feed_time);

            if (feed_schedule == "FixedTime") {
              if (feed_time != "null" && feed_time !== null) {
                if (feed_time.indexOf(",") >= 0) {
                  let feedtimesplited = feed_time.split(",");
                  feedtimesplited.map((val) => {
                    StrTimings.push(val);
                  });
                } else {
                  StrTimings.push(feed_time);
                }
              }
              // let feedtimesplited = feed_time.split(",");

              // feedtimesplited.map((val) => {
              //     StrTimings.push(val);
              // })
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
            if (FeederTimings.includes(val.FeedingDevice.id) == false) {
              // Feeders[val.FeedingDevice.id] = feederId
              // FeederTimings[val.FeedingDevice.id] = []
            }
            FeederTimings[val.FeedingDevice.id].push(StrTimings);
          }
        }
      });

      console.log("Feeders", Feeders);
      console.log("FeederTimings", FeederTimings);

      if (Feeders.length > 0) {
        console.log("Automatic generated Commands\n");
        console.log("Day is : ", dayName);
        console.log("\n");
        await Promise.all(
          Feeders.map(async (feederId, i) => {
            if (i > 0) {
              if (
                FeederTimings &&
                FeederTimings[i] &&
                FeederTimings[i].length > 0
              ) {
                let topic = "ctrl/feedsetting";
                if (process.env.DEV_ENV === "development") {
                  await HandleStopService(i, feederId, false);
                }
                let AllTimings = FeederTimings[i].join();
                console.log("Final Timings: ", feederId, AllTimings);
                let message =
                  "0<ctrl_feed_timings>0," +
                  "1<" +
                  feederId +
                  ">1," +
                  "81<" +
                  AllTimings +
                  ">81";

                console.log("command ", i);
                console.log(message);
                // console.log("\n")
                PublishCommand(topic, message);
                AuditInsertion = { command: message };
                if (feeder_id && userId) {
                  AuditInsertion = { command: message, user_id: userId };
                }
                await models.AuditLogs.create(AuditInsertion);
              } else {
                if (process.env.DEV_ENV === "development") {
                  await HandleStopService(i, feederId, true);
                }
              }
            } else {
              console.log("command", FeederTimings);
            }
          })
        );
      }
    } else {
      console.log("scheduleData is null");
    }
  }
};
let HandleStopService = async (intFeederId, feederId, ToStop) => {
  let FeedRunStatus = await models.FeedRunStatus.findOne({
    where: {
      feeder_id: intFeederId,
    },
  });
  let toStop = ToStop ? 0 : 1;
  if (FeedRunStatus !== null) {
    await models.FeedRunStatus.update(
      { status: toStop },
      {
        where: {
          feeder_id: intFeederId,
        },
      }
    );
  } else {
    await models.FeedRunStatus.create({
      feeder_id: intFeederId,
      status: toStop,
    });
  }

  let topic = "ctrl/feedsetting";
  let message;
  if (ToStop) {
    message = "0<ctrl_feed_stop_on>0,1<" + feederId + ">1";
  } else {
    message = "0<ctrl_feed_stop_off>0,1<" + feederId + ">1";
  }
  console.log("command");
  console.log(message);
  console.log("\n");
  PublishCommand(topic, message);
  let AuditInsertion = { command: message };
  await models.AuditLogs.create(AuditInsertion);
};

const getFeedLevelWtData = async () => {
  const query = `
    SELECT 
      FeedingDevices.id,
      FeedingDevices.title,  
      FeedingDevices.location, 
      FeedingDevices.other_info, 
      FeedingDevices.feeder_id,
      FeedingDevices.Tray1,
      FeedingDevices.Tray2,
      FeedingDevices.Tray3,
      FeedingDevices.Tray4,
      FeedingDevices.has_capacity,
      FeedingDevices.feed_level_percentage as tankLevel,
      FeedingDevices.feed_level2 as tankLevel2,
      FeedingDevices.has_tray as has_tray,
      FeedingDevices.has_mode3 as has_mode3,
      FeedingDevices.mode3_status as mode3_status
    FROM 
      FeedingDevices 
    INNER JOIN
      UserDevices ON UserDevices.feeder_id = FeedingDevices.id`;

  try {
    const records = await models.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    let newAr = {};
    let LowFeedLevels = [];
    let AllFeedLevels = [];

    for (let i = 0; i < records.length; i++) {
      const {
        id,
        title,
        location,
        feeder_id,
        other_info,
        Tray1,
        Tray2,
        Tray3,
        Tray4,
        has_capacity,
        tankLevel,
        tankLevel2,
        has_tray,
        has_mode3,
        mode3_status,
      } = records[i];

      const myNewAr = {
        id,
        title,
        location,
        feeder_id,
        other_info,
        Tray1,
        Tray2,
        Tray3,
        Tray4,
        has_capacity,
        tankLevel,
        tankLevel2,
        has_tray,
        has_mode3,
        mode3_status,
      };

      newAr = {
        all: AllFeedLevels,
        all_c: AllFeedLevels.length,
        low_c: LowFeedLevels.length,
      };

      AllFeedLevels.push(myNewAr);
      let allTrays =
        myNewAr.Tray1 + myNewAr.Tray2 + myNewAr.Tray3 + myNewAr.Tray4;

      if (
        allTrays <= 5 &&
        myNewAr.has_mode3 == 1 &&
        myNewAr.mode3_status == 0 &&
        myNewAr.tankLevel2 > 10
      ) {
        try {
          myNewAr.mode3_status == 1
          await models.FeedingDevices.update(
            { mode3_status: 1},
            { where: { id: myNewAr.id } }
          );
        } catch {
          await models.FeedingDevices.update(
            { mode3_status: 0 },
            { where: { id: myNewAr.id } }
          );
        }
      }

      setTimeout(() => {
        if (myNewAr.has_mode3 && myNewAr.mode3_status == 1) {
          let topic = "ctrl/wtsensor";
          let message = "0<hx711_get_params>0,1<" + myNewAr.feeder_id + ">1";
          PublishCommand(topic, message);
        }
      }, 10000);

    //   setTimeout(async () => {

    //     if (
    //       (myNewAr.Tray1 >= 15 || myNewAr.Tray2 >= 15 || myNewAr.Tray3 >= 15 || myNewAr.Tray4 >= 15) &&
    //       myNewAr.mode3_status == 1
    //     ) {
    //       // ExecuteFeedingStopCommands(id, 0, 11);
    //       await models.FeedingDevices.update(
    //         { mode3_status: 0 },
    //         { where: { id: myNewAr.id } }
    //       );
    //     } else {
    //       if(myNewAr.mode3_status == 1 && myNewAr.has_mode3 == 1){
            
    //         ExecuteFeedNowWT({
    //           params: { userId: 11, feederId: myNewAr.id },
    //           body: { quantity: 10 },
    //         });
    //       }
    //     }
    //   }, 1000);

      if (tankLevel <= 30) {
        LowFeedLevels.push(id);
      }
    }

    newAr = {
      all: AllFeedLevels,
      all_c: AllFeedLevels.length,
      low_c: LowFeedLevels.length,
    };

  } catch (error) {
    console.log(error.message)
  }
};

module.exports = { ExecuteFeedingCommands, collectSchedules, getFeedDones,getFeedLevelWtData };
