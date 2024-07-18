const models = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { Parser } = require("json2csv");

const exportDataByDateAndTable = async (req, res) => {
  const { table, fromDate, toDate } = req.body;

  // Validate input
  if (!table || !fromDate || !toDate) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Check if the table exists in the models
  if (!models[table]) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid table name" });
  }

  try {
    // Determine the date range
    const startOfDay = moment(fromDate).startOf("day").toDate();
    const endOfDay = moment(toDate).endOf("day").toDate();
    const dateRange = { [Op.between]: [startOfDay, endOfDay] };

    const data = await models[table].findAll({
      where: {
        createdAt: dateRange,
      },
      raw: true,
    });

    if (data.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No data found for the specified parameters",
      });
    }

    const fields = Object.keys(data[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${table}_data.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while exporting the data",
      error: error.message,
    });
  }
};

module.exports = {
  exportDataByDateAndTable,
};
