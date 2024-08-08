module.exports = (sequelize, DataTypes) => {
    const WtSensors = sequelize.define("WtSensors ", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        MessageType: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        CalFactors: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Wieghts: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tsreFactors: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        TotalSensors: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        MessageSerialNo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        MessageDate: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        LastRunTime: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        TotalFeedNows: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        FeedMode3_EN_MotorP_Dur: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        UpperThWt_LowerThWt: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        FeederId: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    })
    return WtSensors;
}