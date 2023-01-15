import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const SpecialTokens = db.define('special_tokens', {
    token_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiry: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default SpecialTokens;