const models = require("../models");
const { QueryTypes, Op } = require("sequelize");

const nodemailer = require("nodemailer");
const sendRefillNotification = async (feederData) => {
  try {
    const { id, title, feed_level2, other_info, location } = feederData;
    const query = `
      SELECT 
        UserDevices.user_id,
        UserDevices.feeder_id
      FROM 
        UserDevices 
        INNER JOIN FeedingDevices ON UserDevices.feeder_id = FeedingDevices.id
      WHERE UserDevices.feeder_id = ${id}
    `;

    const records = await models.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    // send email to the users with low feed level notification for device
    for (let j = 0; j < records.length; j++) {
      const { user_id } = records[j];
      const user = await models.Users.findOne({ where: { id: user_id } });
      if (user) {
        const { email } = user;

        // send email to the users with low feed level notification for device

        const { latitude, longitude } = JSON.parse(other_info);

        // Create the email template

        const emailTemplate = `
            <h1>Dear <strong>${user.username}</strong>, </h1>
            <p>We are pleased to inform you that the <strong>${title}</strong> located at <strong>${location}</strong> has been successfully refilled with <strong>${feed_level2}</strong> KG of feed.</p>
            <p>You can check the location of the feeder by following this link.</p>
            <a href="https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed"> <strong>Device Location</strong></a>
            <p>Thank you for ensuring the continued operation of the feeder.</p>
            <p>Best Regards,</p>
            <p><strong>Smart DCC Team</strong></p>
                `;
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "developer@dccme.ai", // replace this with developer@dccme.ai
            pass: "yfen ping pjfh emkp", // replace this with google app password
          },
        });
        const mailOptions = {
          from: "Smart DCC <info@dccme.ai>",
          to: email,
          subject: `Refill Confirmation: Your Feeder ${title} Has Been Refilled`,
          html: emailTemplate,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }
      console.log("email sent to user", user_id);
    }

    return 1;
  } catch (error) {
    console.log("errorNotification", error.message);
  }

  return 0;
};

module.exports = { sendRefillNotification };
