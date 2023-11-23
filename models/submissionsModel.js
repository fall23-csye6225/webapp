module.exports = (sequelize, DataTypes) => {
    const Submissions= sequelize.define('submissions', {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    },
    attempts: {
    type: DataTypes.INTEGER.UNSIGNED,    
    },
    submission_url: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    submission_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    },
    submission_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    }

    }, {tableName: 'submissions', timestamps: false});

    return Submissions;

    };