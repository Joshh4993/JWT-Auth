import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email', 'access_flags']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.body
        const user = await Users.findAll({
            where: {
                id: id
            }
        });
        let userObj = {
            userId: user[0].id,
            name: user[0].name,
            email: user[0].email
        }
        res.json(userObj);
    } catch (error) {
        res.status(404).json({ msg: "User not found." });
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Passwords do not match." });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            access_flags: JSON.stringify([
                "PERSONAL_VIEW",
                "CLIENTELLE_VIEW",
                "CLIENTELLE_CREATE",
            ]),
            projects: JSON.stringify([]),
            custom_url: nanoid(2)
        });
        res.json({ msg: "Registration Successful" });
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Invalid Email or Password" });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const access_flags = user[0].access_flags;
        const accessToken = jwt.sign({ userId, name, email, access_flags }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        })
        const refreshToken = jwt.sign({ userId, name, email, access_flags }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Invalid Email or Password" });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}