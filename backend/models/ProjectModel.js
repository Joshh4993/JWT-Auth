import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Companies = db.define('projects', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creator: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    project_ref: {
        type: DataTypes.STRING
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Companies;