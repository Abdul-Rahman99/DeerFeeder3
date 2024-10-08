const { Json } = require("sequelize/lib/utils");
const { collectSchedules } = require("../Helper");
const models = require("../models");
const {
  Op,
  QueryTypes,
  where,
  sequelize,
  INTEGER,
  query,
} = require("sequelize");
const {
  ExecuteFeedNowWT,
  ExecuteFeedingStopCommands,
} = require("./foodcontroller");
const { PublishCommand } = require("../mqtt");

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

    let query = `UPDATE FeedingDevices
              SET feed_level = ${remainingFeed}, feed_level_percentage = ${feedLevelPercentage}
              WHERE FeedingDevices.id = ${feederId};
              `;

    await models.sequelize.query(query, {
      type: QueryTypes.UPDATE,
    });

    return feedLevelPercentage;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

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
      // await getFeedPercentage(id);

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

const refillTank = async (req, res) => {
  const feederId = req.params.feederId;

  try {
    const devices = await models.FeedingDevices.findAll({
      attributes: ["tank_capacity"],
      where: { id: feederId },
      raw: true,
    });
    const tank_capacity = JSON.stringify(devices[0].tank_capacity);
    const tank_cap_num = Number(tank_capacity);

    const updatedRows = await models.FeedingDevices.update(
      {
        feed_level: tank_cap_num,
        feed_level_percentage: 100,
      },
      {
        where: { id: feederId },
      }
    );

    if (updatedRows > 0) {
      res.status(200).send({ message: "Tank refilled successfully" });
    } else {
      res.status(404).send({ message: "Feeding device not found" });
    }
  } catch (error) {
    console.error("Error refilling tank:", error);
    res.status(500).send({ message: error.message });
  }
};

const getFeedLevelWtData = async (req, res) => {
  const loggedInUserId = req.session?.user?.id;

  const query = `
    SELECT 
      FeedingDevices.id,
      FeedingDevices.title,  
      FeedingDevices.location, 
      FeedingDevices.other_info, 
      FeedingDevices.feeder_id,
      TRUNCATE(FeedingDevices.Tray1,1) AS Tray1,
      TRUNCATE(FeedingDevices.Tray2,1) AS Tray2,
      TRUNCATE(FeedingDevices.Tray3,1) AS Tray3,
      TRUNCATE(FeedingDevices.Tray4,1) AS Tray4,
      FeedingDevices.has_capacity,
      FeedingDevices.feed_level_percentage as tankLevel,
      TRUNCATE(FeedingDevices.feed_level2,1) as tankLevel2,
      FeedingDevices.has_tray as has_tray,
      FeedingDevices.has_mode3 as has_mode3,
      FeedingDevices.mode3_status as mode3_status
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

      // console.log("dsfsdf4ds5f4ds654f65ds4ds    " , myNewAr.Tray1)
      // (myNewAr.Tray1).toFixed(1)
      // (myNewAr.Tray2).toFixed(1)
      // (myNewAr.Tray3).toFixed(1)
      // (myNewAr.Tray4).toFixed(1)
      // (myNewAr.tankLevel2).toFixed(1)



      newAr = {
        all: AllFeedLevels,
        all_c: AllFeedLevels.length,
        low_c: LowFeedLevels.length,
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

const updateHasCapacity = async (req, res) => {
  const feederId = req.params.feederId;
  const hasCapacity = req.body.hasCapacity;

  if (!feederId || typeof hasCapacity !== "boolean") {
    return res.status(400).send({ message: "Invalid input" });
  }

  try {
    const [updatedRows] = await models.FeedingDevices.update(
      { has_capacity: hasCapacity },
      { where: { id: feederId } }
    );

    if (updatedRows > 0) {
      res.status(200).send({ message: "Updated successfully" });
    } else {
      res.status(404).send({ message: "Feeder not found" });
    }
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getFeedLevelData,
  getFeedLocations,
  getSchedulesSummary,
  getAllNotifications,
  getFeedDateTimes,
  refillTank,
  getFeedLevelWtData,
  updateHasCapacity,
};
