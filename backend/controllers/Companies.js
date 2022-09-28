import Companies from "../models/CompanyModel.js";

export const getCompanies = async (req, res) => {
    try {
        const companies = await Companies.findAll({
            attributes: ['id', 'name', 'addressline', 'citytown']
        });
        res.json(companies);
    } catch (error) {
        console.log(error)
    }
}

export const getCompany = async (req, res) => {
    try {
        const { id } = req.body
        const company = await Companies.findAll({
            where: {
                id: id
            }
        });
        let companyObj = {
            companyId: company[0].id,
            name: company[0].name,
            postcode: company[0].postcode,
            citytown: company[0].citytown,
            addressline: company[0].addressline,
            registration_num: company[0].registration_num,
            contact_email: company[0].contact_email,
            contact_number: company[0].contact_number,
            company_contact: company[0].company_contact,
            employees: company[0].employees
        }
        res.json(companyObj);
    } catch (error) {
        res.status(404).json({ msg: "Company not found." });
    }
}

export const createCompany = async (req, res) => {
    const { name, postcode, citytown, addressline, registration_num, contact_email, contact_number } = req.body;
    try {
        await Companies.create({
            name: name,
            postcode: postcode,
            citytown: citytown,
            addressline: addressline,
            registration_num: registration_num,
            contact_email: contact_email,
            contact_number: contact_number,
            company_contact: JSON.stringify([]),
            employees: JSON.stringify([])
        });
        res.json({ msg: "Company created successfully" });
    } catch (error) {
        console.log(error);
    }
}