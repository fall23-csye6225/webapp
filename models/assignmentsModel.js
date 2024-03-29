module.exports = (sequelize, DataTypes) => {
    const Assignments= sequelize.define('assignments', {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    },
    name: {
    type: DataTypes.STRING
    },
    points: {
    type: DataTypes.INTEGER.UNSIGNED
    },
    num_of_attempts: {
    type: DataTypes.INTEGER.UNSIGNED
    },
    deadline: {
    type: DataTypes.DATE,
    },
    assignment_created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    },
    assignment_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    }

    }, {tableName: 'assignments', timestamps: false});

    return Assignments;

    };