const { collectSchedules, getFeedDones } = require("../Helper");
const models = require("../models");
const { Op, QueryTypes } = require("sequelize");

const getBirdFeedingDevices = (req, res) => {};

const getFeedPercentage = async (feederId) => {
  const tankCapacity = 800; // Assuming a constant tank capacity
  const startDate = new Date("2024-06-11");
  const endDate = new Date(); // Current date and time

  console.log(
    `Fetching records from ${startDate.toISOString()} to ${endDate.toISOString()} for feederId ${feederId}`
  );

  try {
    // Fetch feeding done records from 2024-06-11 until now
    const feedingDonePromise = models.FeedingDone.findAll({
      where: {
        feeder_id: feederId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Fetch client messages with specific topic and pattern in client_message
    const clientMessagesPromise = models.ClientMessages.findAll({
      where: {
        feeder_id: feederId,
        client_topic: "response",
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        client_message: {
          [Op.like]: '%"0":"ctrl_feed_now_done"%',
        },
      },
    });

    // Execute both queries concurrently
    const [feedingDoneRecords, clientMessages] = await Promise.all([
      feedingDonePromise,
      clientMessagesPromise,
    ]);

    console.log(
      `Fetched ${feedingDoneRecords.length} records from FeedingDone.`
    );
    console.log(
      `Fetched ${clientMessages.length} records from ClientMessages.`
    );

    let totalFeedUsed = 0;

    // Calculate feed used based on feeding done records
    feedingDoneRecords.forEach((record) => {
      try {
        const clientMessage = JSON.parse(record.client_message);
        const milliseconds = parseInt(clientMessage["61"], 10);
        console.log(
          `Parsed milliseconds from 61: ${milliseconds} from record: ${record.client_message}`
        );
        if (!isNaN(milliseconds)) {
          const seconds = milliseconds / 1000;
          totalFeedUsed += seconds * 0.4;
          console.log(
            `Total feed used so far from FeedingDone: ${totalFeedUsed}`
          );
        } else {
          console.warn(
            `Skipping record with invalid milliseconds in 61: ${record.client_message}`
          );
        }
      } catch (error) {
        console.error(
          `Error parsing client_message for record: ${record.client_message}`,
          error
        );
      }
    });

    let totalFeedUsedFeedNow = 0;

    // Calculate feed used based on client messages
    clientMessages.forEach((record) => {
      try {
        const clientMessage = JSON.parse(record.client_message);
        const milliseconds = parseInt(clientMessage["31"], 10);
        console.log(
          `Parsed milliseconds from 31: ${milliseconds} from client_message: ${record.client_message}`
        );
        if (!isNaN(milliseconds)) {
          const seconds = milliseconds / 1000;
          totalFeedUsedFeedNow += seconds * 0.4;
          console.log(
            `Total feed used so far from ClientMessages: ${totalFeedUsedFeedNow}`
          );
        } else {
          console.warn(
            `Skipping record with invalid milliseconds in 31: ${record.client_message}`
          );
        }
      } catch (error) {
        console.error(
          `Error parsing client_message for record: ${record.client_message}`,
          error
        );
      }
    });

    const adjustedFeedUsed = Math.max(0, totalFeedUsed + totalFeedUsedFeedNow);
    const remainingFeed = tankCapacity - adjustedFeedUsed;
    const feedLevelPercentage = (remainingFeed / tankCapacity) * 100;

    console.log(
      `Total feed used: ${
        totalFeedUsed + totalFeedUsedFeedNow
      }, Remaining feed: ${remainingFeed}, Feed level percentage: ${feedLevelPercentage}%`
    );

    // let query = `UPDATE FeedingDevices
    //           SET feed_level = ${remainingFeed}, feed_level_percentage = ${feedLevelPercentage}
    //           WHERE FeedingDevices  .id = ${feederId};
    //           `;

    // await models.sequelize.query(query, {
    //   type: QueryTypes.UPDATE,
    // });

    return feedLevelPercentage;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

/*
const getFeedPercentage = async (feederId) => {
  const tankCapacity = 800; // Assuming a constant tank capacity as you mentioned earlier

  // Fetch feeding done records from 11/6 until now
  const startDate = new Date("2024-06-11");
  const endDate = new Date();

  const feedingDoneRecords = await models.FeedingDone.findAll({
    where: {
      feeder_id: feederId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  let totalFeedUsed = 0;

  // Calculate feed used based on feeding done records
  feedingDoneRecords.forEach((record) => {
    const clientMessage = JSON.parse(record.client_message);
    const milliseconds = parseInt(clientMessage["61"], 10);
    const seconds = milliseconds / 1000;
    totalFeedUsed += seconds * 0.4;
  });

  const adjustedFeedUsed = Math.max(0, totalFeedUsed);
  const remainingFeed = tankCapacity - adjustedFeedUsed;
  const feedLevelPercentage = (remainingFeed / tankCapacity) * 100;

  return feedLevelPercentage;
};*/

const getFeedLevelData = async (req, res) => {
  const loggedInUserId = req.session?.user?.id;

  const query = `
    SELECT 
      FeedingDevices.id,
      FeedingDevices.title, 
      FeedingDevices.mac_address, 
      FeedingDevices.location, 
      FeedingDevices.other_info, 
      FeedingDevices.feeder_id,
      FeedingDevices.feed_level,
      FeedingDevices.feed_level_percentage as tankLevel
    FROM 
      FeedingDevices 
    INNER JOIN
      UserDevices ON UserDevices.feeder_id = FeedingDevices.id
    WHERE 
      1=1 ${loggedInUserId ? `AND UserDevices.user_id = ${loggedInUserId}` : ""}
  `;

  try {
    const records = await models.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    let newAr = {};
    let LowFeedLevels = [];
    let AllFeedLevels = [];

    for (let i = 0; i < records.length; i++) {
      const { id, title, location, other_info, tankLevel } = records[i];

      const myNewAr = {
        id,
        tankLevel,
        title,
        location,
        other_info,
      };

      AllFeedLevels.push(myNewAr);
      if (tankLevel <= 30) {
        LowFeedLevels.push(id);
      }
    }

    newAr = {
      all: AllFeedLevels,
      all_c: AllFeedLevels.length,
      low_c: LowFeedLevels.length,
    };

    res.status(200).send(newAr);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/*const getFeedPercentage = async (feederId) => {
  const tankCapacity = 800;

  // Fetch feeding done records for today
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const feedingDoneRecords = await models.FeedingDone.findAll({
    where: {
      feeder_id: feederId,
      createdAt: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
  });

  let totalFeedUsed = 0;

  // Calculate feed used based on feeding done records
  feedingDoneRecords.forEach((record) => {
    const clientMessage = JSON.parse(record.client_message);
    const milliseconds = parseInt(clientMessage["61"], 10);
    const seconds = milliseconds / 1000;
    totalFeedUsed += seconds * 0.4;
  });

  const adjustedFeedUsed = Math.max(0, totalFeedUsed);
  const feedLevelPercentage =
    ((tankCapacity - adjustedFeedUsed) / tankCapacity) * 100;

  return feedLevelPercentage;
};

const getFeedLevelData = async (req, res) => {
  let date_now = new Date();
  let date_pre = date_now - 518400000; //432000000;

  date_now = new Date(date_now);
  date_pre = new Date(date_pre);

  var loggedInUserId = req.session?.user?.id;
  if (!loggedInUserId) {
    loggedInUserId = "";
  } else {
    loggedInUserId = `AND UserDevices.user_id = ${loggedInUserId}`;
  }
  const query = `SELECT 
                        FeedingDevices.id,
                        FeedingDevices.title, 
                        FeedingDevices.mac_address, 
                        FeedingDevices.location, 
                        FeedingDevices.other_info, 
                        FeedingDevices.feeder_id 
                    FROM 
                        FeedingDevices 
                    INNER JOIN
                        UserDevices ON UserDevices.feeder_id = FeedingDevices.id
                    WHERE 
                        1=1 ${loggedInUserId}`;
  const records = await models.sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  let newAr = {};
  let LowFeedLevels = [];
  let AllFeedLevels = [];
  for (let i = 0; i < records.length; i++) {
    let feederId = records[i].id;
    let tankLevel = await getFeedPercentage(feederId);
    let myNewAr = {
      id: feederId,
      tankLevel: tankLevel,
      title: records[i].title,
      location: records[i].location,
      other_info: records[i].other_info,
    };
    AllFeedLevels.push(myNewAr);
    if (tankLevel <= 30) {
      LowFeedLevels.push(feederId);
    }
  }
  newAr = {
    all: AllFeedLevels,
    all_c: AllFeedLevels.length,
    low_c: LowFeedLevels.length,
  };
  res.status(200).send(newAr);
};*/
//const getFeedPercentage = async(ping_dist) => {
// return await getFeedDones(feeder_id);
//let ping_dist_p = (130 - ping_dist) / (1.3)
//let truncated_ping_dist_p = ping_dist_p.toFixed(0).toString().slice(0, 2);
// console.log(truncated_ping_dist_p);
//return 100 - truncated_ping_dist_p;

// if (ping_dist >= 64) {
//   return 0;
// } else if (ping_dist >= 55) {
//   return 20;
// } else if (ping_dist >= 44) {
//   return 40;
// } else if (ping_dist >= 35) {
//   return 60;
// } else if (ping_dist >= 20) {
//   return 80;
// } else {
//   return 100;
// }
// let total_cm = 70;
// if (ping_dist > total_cm) {
//     ping_dist = 70;
// }
// return Math.round((total_cm - ping_dist) * 100 / total_cm);
//};

/*const getFeedLevelData = async (req, res) => {
    let date_now = new Date();
    let date_pre = date_now - 518400000; //432000000;

    date_now = new Date(date_now)
    date_pre = new Date(date_pre)

    var loggedInUserId = req.session?.user?.id;
    if (!loggedInUserId) {
        loggedInUserId = ""
    } else {
        loggedInUserId = `AND UserDevices.user_id = ${loggedInUserId}`
    }
    const query = `SELECT 
                        FeedingDevices.id,
                        FeedingDevices.title, 
                        FeedingDevices.mac_address, 
                        FeedingDevices.location, 
                        FeedingDevices.other_info, 
                        FeedingDevices.feeder_id 
                    FROM 
                        FeedingDevices 
                    INNER JOIN
                        UserDevices ON UserDevices.feeder_id = FeedingDevices.id
                    WHERE 
                        1=1 ${loggedInUserId}`;
    const records = await models.sequelize.query(query, {
        type: QueryTypes.SELECT
    });

    let newAr = {}
    let LowFeedLevels = []
    let AllFeedLevels = []
    for (i = 0; i < records.length; i++) {
        let feederId = records[i].id;
        let tankLevel = await getFeedPercentage(feederId);
        let myNewAr = { id: feederId, tankLevel: tankLevel, title: records[i].title, location: records[i].location, other_info: records[i].other_info }
        AllFeedLevels.push(myNewAr);
        if (tankLevel <= 30) {
         s.push(feederId);
        }
    }
    newAr = { "all": AllFeedLevels, "all_c": AllFeedLevels.length, "low_c": LowFeedLevels.length }
    res.status(200).send(newAr);
}*/

/*const getFeedLevelData = async (req, res) => {
  try {
    let date_now = new Date();
    let date_pre = new Date(date_now.getTime() - 518400000);

    let loggedInUserId = req.session?.user?.id;
    if (loggedInUserId) {
      loggedInUserId = `AND UserDevices.user_id = :userId`;
    } else {
      loggedInUserId = "";
    }

    const query = `SELECT 
                        FeedingDevices.id,
                        FeedingDevices.title, 
                        FeedingDevices.mac_address, 
                        FeedingDevices.location, 
                        FeedingDevices.other_info, 
                        FeedingDevices.feeder_id
                    FROM 
                        FeedingDevices 
                    INNER JOIN
                        UserDevices ON UserDevices.feeder_id = FeedingDevices.id
                    WHERE 
                        1=1 ${loggedInUserId}`;

    const records = await models.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: req.session?.user?.id },
    });

    let newAr = {};
    let LowFeedLevels = [];
    let AllFeedLevels = [];
    const initialTankCapacity = 800;

    for (let i = 0; i < records.length; i++) {
      let feederId = records[i].id;

      // Query to get the total quantity of feed used for performed schedules
      const scheduleQuery = `
        SELECT SUM(quantity) as totalFeedUsed
        FROM FoodSchedules 
        WHERE 
          feeder_id = :feederId AND 
          is_enabled = 1 AND 
          feed_time <= :currentTime`;

      const result = await models.sequelize.query(scheduleQuery, {
        type: QueryTypes.SELECT,
        replacements: {
          feederId: feederId,
          currentTime: date_now,
        },
      });

      const totalFeedUsed = result[0].totalFeedUsed || 0;
      const adjustedFeedUsed = Math.max(0, totalFeedUsed * 0.8);
      const feedLevelPercentage =
        ((initialTankCapacity - adjustedFeedUsed) / initialTankCapacity) * 100;

      let myNewAr = {
        id: feederId,
        tankLevel: feedLevelPercentage,
        title: records[i].title,
        location: records[i].location,
        other_info: records[i].other_info,
      };
      AllFeedLevels.push(myNewAr);
      if (feedLevelPercentage <= 30) {
        LowFeedLevels.push(feederId);
      }
    }

    newAr = {
      all: AllFeedLevels,
      all_c: AllFeedLevels.length,
      low_c: LowFeedLevels.length,
    };
    res.status(200).send(newAr);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching feed level data" });
  }
};
*/

const getFeedLocations = async (req, res) => {
  let data = await models.FeedingDevices.findAll();
};

const getFormatted = (str) => {
  let newDate =
    str.getFullYear() +
    "-" +
    (str.getMonth() + 1) +
    "-" +
    str.getDate() +
    " " +
    str.getHours() +
    ":" +
    str.getMinutes() +
    ":" +
    str.getSeconds();
  return newDate;
};
const getSchedulesSummary = async (req, res) => {
  let date_now = new Date();
  let date_pre = date_now - 432000000;
  date_pre = new Date(date_pre);
  //dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

  let dateFrom = getFormatted(date_pre);
  let dateTo = getFormatted(date_now);

  console.log("Date From: " + dateFrom);
  console.log("Date To: " + dateTo);

  const query =
    "select createdAt, client_message from ClientMessages where client_topic='response' and createdAt BETWEEN '" +
    dateFrom +
    "' and '" +
    dateTo +
    "' order by id desc";
  const records = await models.sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  let myAr = { sunset: 0, sunrise: 0, fixed: 0 };
  if (records) {
    records.map((val) => {
      let createdAt = val.createdAt;
      let myDate = new Date(createdAt);

      let data = val.client_message;
      let jsonData = JSON.parse(data);
      if (jsonData[0] == "query_feed_timing_reply") {
        myAr["fixed"] += 1;
      } else {
        if (myDate.getHours >= "00" && myDate.getHours < "12") {
          myAr["sunrise"] += 1;
        } else {
          myAr["sunset"] += 1;
        }
      }
    });
    res.status(200).send(myAr);
  } else {
    res.status(200).send(myAr);
  }
};

const getAllNotifications = async (req, res) => {
  //sensors health
  //sensors reading
  let feedData = await models.Notifications.findOne({
    where: {
      createdAt: { [Op.gt]: "2023-11-01 01:00:00" },
      [Op.or]: [
        {
          [Op.and]: [
            { client_topic: "sensorstatus" },
            { client_message: { '"8"': { [Op.lt]: 11.5 } } },
          ],
        },
        {
          [Op.and]: [
            { client_topic: "sensorstatus" },
            { client_message: { '"5"': { [Op.lt]: 20 } } },
          ],
        },
        {
          [Op.and]: [
            { client_topic: "sensorworking" },
            { client_message: { '"Motor"': '"N"' } },
          ],
        },
        {
          [Op.and]: [
            { client_topic: "sensorworking" },
            { client_message: { '"BtyVoltage"': '"N"' } },
          ],
        },
        {
          [Op.and]: [
            { client_topic: "sensorworking" },
            { client_message: { '"BtyCurrent"': '"N"' } },
          ],
        },
        {
          [Op.and]: [{ client_topic: "feedingdone" }],
        },
      ],
    },
    order: [["id", "DESC"]],
    limit: 15,
  });

  console.log(feedData);
  process.exit(0);
  if (feedData !== null) {
    const response = {
      status: true,
      data: feedData,
    };
    res.status(200).json(response);
  } else {
    res.status(200).json({ success: false });
  }
};

const getFeedDateTimes = async (req, res) => {
  let feeder_id = req.params.feederId;
  const data = await collectSchedules(feeder_id);
  if (data !== false) {
    res.status(200).json(data);
  } else {
    res.status(200).json(false);
  }
};

module.exports = {
  getFeedLevelData,
  getFeedLocations,
  getSchedulesSummary,
  getAllNotifications,
  getFeedDateTimes,
};
