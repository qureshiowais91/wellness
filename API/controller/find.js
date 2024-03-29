const doctor = require("../model/doctor");
const patient = require("../model/patient");
const pharmacy = require("../model/pharmacy");
const laboratory = require("../model/laboratory");
const drug = require("../model/drug");
const test = require("../model/test");
const appoinment = require("../model/appoinment");
const order = require("../model/order");

// custome class that send error Object to error middleware
const ErrorResponse = require("../utils/errorResponse");
const { escapeRegExp } = require("../utils/utilsFunction");


// pass fullname of user and return object
exports.findByFullname = async (req, res, next) => {
    try {
        let userFound = false;
        switch (req.body.role) {
            case process.env.Doctor:
                userFound = await doctor.find({ fullname: new RegExp('^' + escapeRegExp(req.body.fullname) + '$', "i") });
                break;
            case process.env.Pharmacy:
                userFound = await pharmacy.find({ fullname: new RegExp('^' + escapeRegExp(req.body.fullname) + '$', "i") });
                break;
            case process.env.Patient:
                userFound = await patient.find({ fullname: new RegExp('^' + escapeRegExp(req.body.fullname) + '$', "i") });
                break;
            case process.env.Laboratory:
                userFound = await laboratory.find({ fullname: new RegExp('^' + escapeRegExp(req.body.fullname) + '$', "i") });
                break;
            default:
                throw new ErrorResponse("Invalid Role", 403)
        }

        if (!userFound) {
            throw new ErrorResponse("User Not Found", 404);
        }

        res.status(200).json({
            success: true,
            user: userFound
        })
    } catch (error) {
        next(error);
    }
}

exports.findByUsername = async (req, res, next) => {
    try {
        let userFound = false;
        switch (req.body.role) {
            case process.env.Doctor:
                userFound = await doctor.find({ username: new RegExp('^' + escapeRegExp(req.body.username) + '$', "i") });
                break;
            case process.env.Pharmacy:
                userFound = await pharmacy.find({ username: new RegExp('^' + escapeRegExp(req.body.username) + '$', "i") });
                break;
            case process.env.Patient:
                userFound = await patient.find({ username: new RegExp('^' + escapeRegExp(req.body.username) + '$', "i") });
                break;
            case process.env.Laboratory:
                userFound = await laboratory.find({ username: new RegExp('^' + escapeRegExp(req.body.username) + '$', "i") });
                break;
            default:
                throw new ErrorResponse("Invalid Role", 403)
        }

        if (!userFound) {
            throw new ErrorResponse("User Not Found", 404);
        }

        res.status(200).json({
            success: true,
            user: userFound
        })
    } catch (error) {
        next(error);
    }
}

exports.findByCity = async (req, res, next) => {
    try {
        let userFound = false;
        switch (req.body.role) {
            case process.env.Doctor:
                console.log(req.body);
                userFound = await doctor.find({ city: req.body.city });
                break;
            case process.env.Pharmacy:
                userFound = await pharmacy.find({ city: new RegExp('^' + escapeRegExp(req.body.city) + '$', "i") });
                break;
            case process.env.Patient:
                userFound = await patient.find({ city: new RegExp('^' + escapeRegExp(req.body.city) + '$', "i") });
                break;
            case process.env.Laboratory:
                userFound = await laboratory.find({ city: new RegExp('^' + escapeRegExp(req.body.city) + '$', "i") });
                break;
            default:
                throw new ErrorResponse("Invalid Role", 403)
        }

        if (!userFound) {
            throw new ErrorResponse("User Not Found", 404);
        }

        res.status(200).json({
            success: true,
            user: userFound
        })
    } catch (error) {
        next(error);
    }
}

exports.findBySpeciality = async (req, res, next) => {

    try {
        let userFound = false;
        switch (req.body.role) {
            case process.env.Doctor:
                console.log(req.body);
                userFound = await doctor.find({ speciality: req.body.speciality });
                break;
            case process.env.Pharmacy:
                userFound = await pharmacy.find({ speciality: req.body.speciality });
                break;
            case process.env.Patient:
                userFound = await patient.find({ speciality: req.body.speciality });
                break;
            case process.env.Laboratory:
                userFound = await laboratory.find({ speciality: req.body.speciality });
                break;
            default:
                throw new ErrorResponse("Invalid Role", 403)
        }

        if (!userFound) {
            throw new ErrorResponse("User Not Found", 404);
        }

        res.status(200).json({
            success: true,
            user: userFound
        })
    } catch (error) {
        next(error);
    }
}

exports.findDrug = async (req, res, next) => {
    try {
        let queryString = JSON.stringify(req.query);
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);


        const foundDrug = await drug
            .find(JSON.parse(queryString))
            .populate({ path: "addedBy" });

        res
            .status(200)
            .json({
                success: true,
                data: foundDrug,
                page: res.paginationData
            });

    } catch (error) {
        next(error);
    }
}

exports.findTest = async (req, res, next) => {
    try {
        let queryString = JSON.stringify(req.query);
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        const limit = res.paginationData.curr.limit;
        const page = res.paginationData.curr.page;

        const testFound = await test
            .find(JSON.parse(queryString))
            .limit(limit)
            .skip(page);

        if (!testFound) {
            throw new ErrorResponse("Drug not found");
        }

        res
            .status(200)
            .json({
                success: true,
                page: res.paginationData,
                testFound
            });

    } catch (error) {
        next(error);
    }
}

exports.findAppoinment = async (req, res, next) => {
    try {
        let queryString = JSON.stringify(req.query);

        queryString = queryString
            .replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        const limit = res.paginationData.curr.limit;
        const page = res.paginationData.curr.page;

        const foundAppoinment = await appoinment
            .find(JSON.parse(queryString))
            .limit(limit)
            .skip(page)
            .populate({ path: "patient_id doctor_id" });

        console.log(queryString);

        if (!foundAppoinment) {
            throw new ErrorResponse("appoinments not found", 404);
        }

        res
            .status(200)
            .json({
                success: true,
                page: res.paginationData,
                data: foundAppoinment
            });

    } catch (error) {
        next(error)
    }
}

exports.findOrder = async (req, res, next) => {
    try {
        let queryString = JSON.stringify(req.query);
        queryString = queryString
            .replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        const limit = res.paginationData.curr.limit;
        const page = res.paginationData.curr.page;

        const foundOrder = await order
            .find(JSON.parse(queryString))
            .limit(limit)
            .skip(page);

        if (!foundOrder) {
            throw new ErrorResponse("appoinments not found", 404);
        }

        res
            .status(200)
            .json({
                success: true,
                page: res.paginationData,
                foundOrder
            });

    } catch (error) {
        next(error);
    }
}
