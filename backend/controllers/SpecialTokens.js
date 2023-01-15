import SpecialTokens from "../models/SpecialTokenModel.js";
import { nanoid } from "nanoid";

export const getTokens = async (req, res) => {
    try {
        const tokens = await SpecialTokens.findAll({
            attributes: ['id', 'token_id', 'reference_id', 'expiry', 'token_type']
        });
        res.json(tokens);
    } catch (error) {
        console.log(error)
    }
}

export const getToken = async (req, res) => {
    try {
        const { token_id } = req.body
        const token = await SpecialTokens.findAll({
            where: {
                token_id: token_id
            }
        });
        let tokenObj = {
            id: token[0].id,
            token_id: token[0].token_id,
            reference_id: token[0].reference_id,
            expiry: token[0].expiry,
            token_type: token[0].token_type
        }
        res.json(tokenObj);
    } catch (error) {
        res.status(404).json({ msg: "Token not found." });
    }
}

export const createToken = async (req, res) => {
    const { reference_id, token_type } = req.body
    let token_id = nanoid(24)
    let expiry = Date.now() + 86400; //24 hours from creation
    try {
        await SpecialTokens.create({
            token_id: token_id,
            reference_id: reference_id,
            expiry: expiry,
            token_type: token_type
        });

        //This is where we email the user (need to add email to the req.body const)

        res.json({ msg: "Token created" });
    } catch (error) {
        console.log(error);
    }
}