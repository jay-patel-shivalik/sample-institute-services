const messages = require("../message/index.js");
const response = require("../config/response.js");
const { validationResult } = require('express-validator');
const CommonConfig = require('../config/common.js');
const CommonFun = require('../libs/common.js');
const InstituteAssetModel = require("../models/instituteAsset.js");

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }
    try {
        // Role validation
        // const allowedRoles = ["SuperAdmin", "InstituteManager", "InstituteExecutive"];
        // const userHasAccess = req.user?.userRoles?.some(role =>
        //     allowedRoles.includes(role)
        // );

        // if (!userHasAccess) {
        //     return res.status(404).send(
        //         response.toJson(messages['en'].auth.not_access)
        //     );
        // }
        const { assetNumber, assetType, assetName, capacity } = req.body;
        const newAsset = new InstituteAssetModel({
            assetNumber,
            assetType,
            assetName,
            capacity,
            createdBy: req.userId
        });
        const savedAsset = await newAsset.save();
        return res.status(200).send(response.toJson(messages['en'].common.create_success, savedAsset));
    }
    catch (error) {
        console.error("Error creating asset:", error);
        return res.status(500).send(response.toJson(messages['en'].instituteAsset.create_failure));
    }
};

const list = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }
    try {
        // Role validation
        // const allowedRoles = ["SuperAdmin", "InstituteManager", "InstituteExecutive"];
        // const userHasAccess = req.user?.userRoles?.some(role =>
        //     allowedRoles.includes(role)
        // );

        // if (!userHasAccess) {
        //     return res.status(404).send(
        //         response.toJson(messages['en'].auth.not_access)
        //     );
        // }
        const {
            search,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const filter = { isDeleted: false };

        if (search) {
            filter.$or = [
                { assetNumber: { $regex: search, $options: "i" } },
                { assetType: { $regex: search, $options: "i" } },
                { assetName: { $regex: search, $options: "i" } }
            ];
        }

        const sort = {
            [sortBy]: sortOrder === "asc" ? 1 : -1
        };
        const [assets, total] = await Promise.all([
            InstituteAssetModel
                .find(filter)
                .select("_id assetNumber assetType assetName capacity")
                .sort(sort)
                .skip(skip)
                .limit(limitNumber),

            InstituteAssetModel.countDocuments(filter)
        ]);
        const formattedAssets = assets.map(asset => ({
            id: asset._id,
            number: asset.assetNumber,
            type: asset.assetType,
            name: asset.assetName,
            capacity: asset.capacity
        }));

        return res.status(200).send(
            response.toJson(messages['en'].common.list_success,
                {
                    totalRecords: total,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(total / limitNumber),
                    assets: formattedAssets
                }
            )
        );

    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errMess = error.message || error;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

const details = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }
    try {
        // Role validation
        // const allowedRoles = ["SuperAdmin", "InstituteManager", "InstituteExecutive"];
        // const userHasAccess = req.user?.userRoles?.some(role =>
        //     allowedRoles.includes(role)
        // );

        // if (!userHasAccess) {
        //     return res.status(404).send(
        //         response.toJson(messages['en'].auth.not_access)
        //     );
        // }  
        const { assetId } = req.params;

        const asset = await InstituteAssetModel.findOne({
            _id: assetId,
            isDeleted: false
        }).select("_id assetNumber assetType assetName capacity status createdAt updatedAt");

        if (!asset) {
            return res.status(404).send(
                response.toJson(messages['en'].instituteAsset.not_exists)
            );
        }

        return res.status(200).send(
            response.toJson(
                messages['en'].common.detail_success,
                asset
            )
        );

    } catch (error) {
        return res.status(500).send(
            response.toJson("Internal server error")
        );
    }
};

const updateAsset = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }
    try {
        // Role validation
        // const allowedRoles = ["SuperAdmin", "InstituteManager", "InstituteExecutive"];
        // const userHasAccess = req.user?.userRoles?.some(role =>
        //     allowedRoles.includes(role)
        // );

        // if (!userHasAccess) {
        //     return res.status(404).send(
        //         response.toJson(messages['en'].auth.not_access)
        //     );
        // }
        const { assetId } = req.params;

        const updateData = {
            ...req.body,
            updatedBy: req.userId,
            updatedAt: new Date()
        };

        const updatedAsset = await InstituteAssetModel.findByIdAndUpdate(
            assetId,
            updateData,
            { new: true }
        );

        if (!updatedAsset) {
            return res.status(404).send(
                response.toJson(messages['en'].instituteAsset.not_found)
            );
        }

        return res.status(200).send(
            response.toJson(messages['en'].common.update_success, updatedAsset)
        );

    } catch (error) {
        console.error("Error updating asset:", error);
        return res.status(500).send(
            response.toJson(messages['en'].common.something_wrong)
        );
    }
};

const deleteAsset = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }
    try {

        // Role validation
        // const allowedRoles = ["SuperAdmin", "InstituteManager", "InstituteExecutive"];
        // const userHasAccess = req.user?.userRoles?.some(role =>
        //     allowedRoles.includes(role)
        // );

        // if (!userHasAccess) {
        //     return res.status(404).send(
        //         response.toJson(messages['en'].auth.not_access)
        //     );
        // }
        const { assetId } = req.params;
        const deletedAsset = await InstituteAssetModel.findByIdAndUpdate

            (assetId,
                {
                    isDeleted: true,
                    deletedAt: new Date(),
                    updatedBy: req.userId,
                    updatedAt: new Date()
                },
                { new: true }
            );
        if (!deletedAsset) {
            return res.status(404).send(response.toJson(messages['en'].instituteAsset.not_found));
        }
        return res.status(200).send(response.toJson(messages['en'].common.delete_success));
    }
    catch (error) {
        console.error("Error deleting asset:", error);
        return res.status(500).send(response.toJson(messages['en'].common.not_exists));
    }
};

module.exports = {
    create,
    list,
    details,
    updateAsset,
    deleteAsset
}
