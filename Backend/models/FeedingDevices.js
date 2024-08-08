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
      type: DataTypes.FLOAT,
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
    motor_speed: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Tray1: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Tray2: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Tray3: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Tray4: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    has_capacity: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    feed_level2: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    has_tray: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    has_mode3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    mode3_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  });

  return FeedingDevices;
};
