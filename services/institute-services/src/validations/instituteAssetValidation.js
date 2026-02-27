const { check, param } = require("express-validator");

exports.create = [
    check('assetNumber').not().isEmpty().withMessage('Asset number is required'),
    check('assetType').not().isEmpty().withMessage('Asset type is required'),
    check('assetName').not().isEmpty().withMessage('Asset name is required'),
    check('capacity').not().isEmpty().withMessage('Capacity is required').isNumeric().withMessage('Capacity must be a number'),
];

exports.list = [
    check('assetNumber').optional().not().isEmpty().withMessage('Asset number is required'),
    check('assetType').optional().not().isEmpty().withMessage('Asset type is required'),
    check('assetName').optional().not().isEmpty().withMessage('Asset name is required'),
    check('capacity').optional().not().isEmpty().withMessage('Capacity is required').isNumeric().withMessage('Capacity must be a number'),
];

exports.details = [
    check('assetId')
        .notEmpty().withMessage('Asset id is required')
        .isMongoId().withMessage('Asset id must be valid MongoDB ObjectId')
];

exports.update = [
    param('assetId')
        .notEmpty().withMessage('Asset id is required')
        .isMongoId().withMessage('Invalid asset id'),
    check('assetNumber')
        .optional()
        .notEmpty().withMessage('Asset number is required'),
    check('assetType')
        .optional()
        .notEmpty().withMessage('Asset type is required'),
    check('assetName')
        .optional()
        .notEmpty().withMessage('Asset name is required'),
    check('capacity')
        .optional()
        .notEmpty().withMessage('Capacity is required')
        .isNumeric().withMessage('Capacity must be a number'),
];

exports.delete = [
    param('assetId').not().isEmpty().withMessage('Asset id is required'),
];