import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Companies = db.define('companies', {
    name: {
        type: DataTypes.STRING
    },
    postcode: {
        type: DataTypes.STRING
    },
    citytown: {
        type: DataTypes.STRING
    },
    addressline: {
        type: DataTypes.STRING
    },
    registration_num: {
        type: DataTypes.STRING
    },
    contact_email: {
        type: DataTypes.STRING
    },
    contact_number: {
        type: DataTypes.STRING
    },
    company_contact: {
        type: DataTypes.JSON
    },
    employees: {
        type: DataTypes.JSON
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Companies;