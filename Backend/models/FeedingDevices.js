module.exports = (sequelize, DataTypes) => {
  const FeedingDevices = sequelize.define("FeedingDevices", {
    title: {
      type: DataTypes.STRING,
    },
    feeder_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mac_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    camera_mac_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    other_info: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "1",
    },
    feed_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feed_level_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tank_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return FeedingDevices;
};
