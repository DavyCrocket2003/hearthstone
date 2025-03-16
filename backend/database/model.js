import { DataTypes } from "sequelize";
import sequelize from "./db.js";


const User = sequelize.define("User", {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    }
}, {
    tableName: "users",
    timestamps: true
});
    

export default {User}