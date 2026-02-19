const messages = require("../message/index.js");
const response = require("../config/response.js");
const { validationResult } = require('express-validator');
const CommonConfig = require('../config/common.js');
const CommonFun = require('../libs/common.js');
const InstituteSubCoursesModel = require("../models/instituteSubCourses.js");
const InstituteCoursesModel = require("../models/instituteCourses.js");
const InstituteBatchesModel = require("../models/instituteBatches.js");

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const allowedRoles = ["SuperAdmin","InstituteManager"];
        const userHasAccess = req.user.userRoles?.some(role => allowedRoles.includes(role));
        if (!userHasAccess) {
            return res.status(404).send(response.toJson(messages['en'].auth.not_access));
        }

        const name = req.body.name ? (req.body.name).trim() : null;

        const existsCourse = await InstituteCoursesModel.findOne({ name : name });
        if (existsCourse) {
            return res.status(404).send(response.toJson(messages['en'].common.exists));
        }

        await InstituteCoursesModel.create({
            name : name,
            price : req.body.price || "",
            discount : req.body.discount || "",
            createdBy : req.user._id
        });

        return res.status(200).send(response.toJson(messages['en'].common.create_success));
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

const createSubCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const allowedRoles = ["SuperAdmin","InstituteManager"];
        const userHasAccess = req.user.userRoles?.some(role => allowedRoles.includes(role));
        if (!userHasAccess) {
            return res.status(404).send(response.toJson(messages['en'].auth.not_access));
        }

        const name = req.body.name ? (req.body.name).trim() : null;

        const existsSubCourse = await InstituteSubCoursesModel.findOne({
            instituteCourseId : req.body.instituteCourseId ,
            name : name
        });
        if (existsSubCourse) {
            return res.status(404).send(response.toJson(messages['en'].common.exists));
        }

        await InstituteSubCoursesModel.create({
            instituteCourseId : req.body.instituteCourseId ,
            name : name,
            price : req.body.price || "",
            discount : req.body.discount || "",
            createdBy : req.user._id
        });

        return res.status(200).send(response.toJson(messages['en'].common.create_success));
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}


const list = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const allowedRoles = ["SuperAdmin","InstituteManager","InstituteExecutive"];
        const userHasAccess = req.user.userRoles?.some(role => allowedRoles.includes(role));
        if (!userHasAccess) {
            return res.status(404).send(response.toJson(messages['en'].auth.not_access));
        }

        const page = req.query.page - 1;
        const pageSize = CommonConfig.instituteCourseListLimit;

        let reqSortBy = req.query.sortBy || 'createdAt';
        const orderBy = req.query.sort && req.query.sort == 'ASC' ? -1 : 1;
        const sorting = { [reqSortBy]: orderBy };

        let baseQuery = {
            status : 'ACTIVE',
            isDeleted: false,
        }

        let [rawUsers, total] = await Promise.all([
            InstituteCoursesModel.find(baseQuery)
                .sort(sorting)
                .populate({
                    path: 'subCourses',
                    select: '_id name price discount status'
                })
                .lean(),
            InstituteCoursesModel.countDocuments(baseQuery)
        ]);

        // Manual pagination on the filtered list
        const paginatedUsers = rawUsers.slice(
            parseInt(page) * parseInt(pageSize),
            parseInt(page) * parseInt(pageSize) + parseInt(pageSize)
        );

        const fieldsToRemove = ['__v', 'createdAt' , 'updatedAt', 'deletedAt', 'isDeleted'];
        const fieldsToAdd = (data) => ({
            // fullName : `${data.firstName} ${data.lastName}`,
            // createdAtNew : data.createdAt.toISOString(),
        });

        let courses = await Promise.all(
            paginatedUsers.map(async (source) => {
                return CommonFun.transformObject(source, fieldsToRemove, fieldsToAdd);
            })
        );

        const data = {
            courses,
            total,
        }

        return res.status(200).send(response.toJson(messages['en'].common.list_success, data));

    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}


const publicList = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const page = req.query.page - 1;
        const pageSize = CommonConfig.instituteCourseListLimit;

        let reqSortBy = req.query.sortBy || 'createdAt';
        const orderBy = req.query.sort && req.query.sort == 'ASC' ? -1 : 1;
        const sorting = { [reqSortBy]: orderBy };

        let baseQuery = {
            // status : 'ACTIVE',
            isDeleted: false,
        }

        let [rawUsers, total] = await Promise.all([
            InstituteCoursesModel.find(baseQuery)
                .sort(sorting)
                .populate({
                    path: 'subCourses',
                    select: '_id name price discount status'
                })
                .lean(),
            InstituteCoursesModel.countDocuments(baseQuery)
        ]);

        // Manual pagination on the filtered list
        const paginatedUsers = rawUsers.slice(
            parseInt(page) * parseInt(pageSize),
            parseInt(page) * parseInt(pageSize) + parseInt(pageSize)
        );

        const fieldsToRemove = ['__v', 'createdAt' , 'updatedAt', 'deletedAt', 'isDeleted'];
        const fieldsToAdd = (data) => ({
            // fullName : `${data.firstName} ${data.lastName}`,
            // createdAtNew : data.createdAt.toISOString(),
        });

        let courses = await Promise.all(
            paginatedUsers.map(async (source) => {
                return CommonFun.transformObject(source, fieldsToRemove, fieldsToAdd);
            })
        );

        const data = {
            courses,
            total,
        }

        return res.status(200).send(response.toJson(messages['en'].common.list_success, data));

    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

const subCourcePublicList = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const page = req.query.page - 1;
        const pageSize = CommonConfig.instituteCourseListLimit;

        let reqSortBy = req.query.sortBy || 'createdAt';
        const orderBy = req.query.sort && req.query.sort == 'ASC' ? -1 : 1;
        const sorting = { [reqSortBy]: orderBy };

        let baseQuery = {
            // status : 'ACTIVE',
            isDeleted: false,
        }

        if(req.query.instituteCourseId){
            baseQuery = {
                ...baseQuery,
                instituteCourseId : req.query.instituteCourseId,
            }
        }

        let [rawUsers, total] = await Promise.all([
            InstituteSubCoursesModel.find(baseQuery)
                .sort(sorting)
                // .populate({
                //     path: 'subCourses',
                //     select: '_id name price discount status'
                // })
                .lean(),
            InstituteSubCoursesModel.countDocuments(baseQuery)
        ]);

        // Manual pagination on the filtered list
        const paginatedUsers = rawUsers.slice(
            parseInt(page) * parseInt(pageSize),
            parseInt(page) * parseInt(pageSize) + parseInt(pageSize)
        );

        const fieldsToRemove = ['__v', 'createdAt' , 'updatedAt', 'deletedAt'];
        const fieldsToAdd = (data) => ({
            // fullName : `${data.firstName} ${data.lastName}`,
            // createdAtNew : data.createdAt.toISOString(),
        });

        let subCourses = await Promise.all(
            paginatedUsers.map(async (source) => {
                return CommonFun.transformObject(source, fieldsToRemove, fieldsToAdd);
            })
        );

        const data = {
            subCourses,
            total,
        }

        return res.status(200).send(response.toJson(messages['en'].common.list_success, data));

    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

const batchPublicList = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const page = req.query.page - 1;
        const pageSize = CommonConfig.instituteCourseListLimit;

        let reqSortBy = req.query.sortBy || 'createdAt';
        const orderBy = req.query.sort && req.query.sort == 'ASC' ? -1 : 1;
        const sorting = { [reqSortBy]: orderBy };

        let baseQuery = {
            // status : 'ACTIVE',
            isDeleted: false,
        }

        if(req.query.status){
            baseQuery = {
                ...baseQuery,
                status : req.query.status,
            }
        }

        if(req.query.instituteCourseId){
            baseQuery = {
                ...baseQuery,
                instituteCourseId : req.query.instituteCourseId,
            }
        }

        if(req.query.instituteSubCourseId){
            baseQuery = {
                ...baseQuery,
                instituteSubCourseId : req.query.instituteSubCourseId,
            }
        }

        let [rawUsers, total] = await Promise.all([
            InstituteBatchesModel.find(baseQuery)
                .sort(sorting)
                // .populate({
                //     path: 'subCourses',
                //     select: '_id name price discount status'
                // })
                .lean(),
            InstituteBatchesModel.countDocuments(baseQuery)
        ]);

        // Manual pagination on the filtered list
        const paginatedUsers = rawUsers.slice(
            parseInt(page) * parseInt(pageSize),
            parseInt(page) * parseInt(pageSize) + parseInt(pageSize)
        );

        const fieldsToRemove = ['__v', 'createdAt' , 'updatedAt', 'deletedAt', 'isDeleted'];
        const fieldsToAdd = (data) => ({
            // fullName : `${data.firstName} ${data.lastName}`,
            // createdAtNew : data.createdAt.toISOString(),
        });

        let batches = await Promise.all(
            paginatedUsers.map(async (source) => {
                return CommonFun.transformObject(source, fieldsToRemove, fieldsToAdd);
            })
        );

        const data = {
            batches,
            total,
        }

        return res.status(200).send(response.toJson(messages['en'].common.list_success, data));

    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

// institute batches
const createBatch = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const allowedRoles = ["SuperAdmin","InstituteManager"];
        const userHasAccess = req.user.userRoles?.some(role => allowedRoles.includes(role));
        if (!userHasAccess) {
            return res.status(404).send(response.toJson(messages['en'].auth.not_access));
        }

        // start time must be before end time
        if (req.body.startTime && req.body.endTime) {

            const startTime = req.body.startTime.split(':');
            const endTime = req.body.endTime.split(':');

            if (startTime[0] >= endTime[0]) {
                return res.status(404).send(response.toJson(messages['en'].instituteCourse.start_end_time_invalid));
            }
        }

        const instituteCourseId = req.body.instituteCourseId;
        const instituteSubCourseId = req.body.instituteSubCourseId;

        // course exist
        const existsCourse = await InstituteCoursesModel.findOne({ _id : instituteCourseId });
        if (!existsCourse) {
            return res.status(404).send(response.toJson(messages['en'].instituteCourse.course_not_exist));
        }

        if (instituteSubCourseId) {
            // sub course exist and parent is course
            const existsSubCourse = await InstituteSubCoursesModel.findOne({
                _id : instituteSubCourseId ,
                instituteCourseId : instituteCourseId
            });

            if (!existsSubCourse) {
                return res.status(404).send(response.toJson(messages['en'].instituteCourse.subcourse_invalid));
            }
        }

        const batchName = req.body.batchName ? (req.body.batchName).trim() : null;
        const slug = await CommonFun.createSlug(batchName);

        // batch exist
        const existsBatch = await InstituteBatchesModel.findOne({slug : slug});
        if (existsBatch) {
            return res.status(404).send(response.toJson(messages['en'].instituteCourse.batch_exists));
        }

        await InstituteBatchesModel.create({
            instituteCourseId : req.body.instituteCourseId,
            instituteSubCourseId : req.body.instituteSubCourseId || null,
            batchName : batchName,
            slug : slug,
            startTime : req.body.startTime,
            endTime : req.body.endTime,
            shift : req.body.shift,
            orientationDate : req.body.orientationDate || "",
            registrationEndDate : req.body.registrationEndDate,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            createdBy : req.user._id
        });

        return res.status(200).send(response.toJson(messages['en'].common.create_success));


    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

const updateBatch = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const allowedRoles = ["SuperAdmin","InstituteManager"];
        const userHasAccess = req.user.userRoles?.some(role => allowedRoles.includes(role));
        if (!userHasAccess) {
            return res.status(404).send(response.toJson(messages['en'].auth.not_access));
        }

         // start time must be before end time
         if (req.body.startTime && req.body.endTime) {

            const startTime = req.body.startTime.split(':');
            const endTime = req.body.endTime.split(':');

            if (startTime[0] >= endTime[0]) {
                return res.status(404).send(response.toJson(messages['en'].instituteCourse.start_end_time_invalid));
            }
        }

        // batch exist
        const batchId = req.params.batchId;
        const batch = await InstituteBatchesModel.findById(batchId);
        if (!batch) {
            return res.status(404).send(response.toJson(messages['en'].instituteCourse.batch_not_exist));
        }

        const { instituteCourseId, instituteSubCourseId, batchName } = req.body;

        // course exist
        const existsCourse = await InstituteCoursesModel.findOne({ _id : instituteCourseId });
        if (!existsCourse) {
            return res.status(404).send(response.toJson(messages['en'].instituteCourse.course_not_exist));
        }


        // sub course exist and parent is course
        const subCourseIdToCheck = instituteSubCourseId || batch.instituteSubCourseId;
        if (subCourseIdToCheck) {
            const existsSubCourse = await InstituteSubCoursesModel.findOne({
                _id : subCourseIdToCheck ,
                instituteCourseId : instituteCourseId
            });

            if (!existsSubCourse) {
                return res.status(404).send(response.toJson(messages['en'].instituteCourse.subcourse_invalid));
            }
        }

        // Check batch name uniqueness (exclude current batch)
        let newBatchName = batchName ? (batchName).trim() : batch.batchName;
        const slug = await CommonFun.createSlug(newBatchName);

        const existsBatch = await InstituteBatchesModel.findOne({slug : slug, _id : {$ne : batch._id}});
        if (existsBatch) {
            return res.status(404).send(response.toJson(messages['en'].instituteCourse.batch_exists));
        }

        await InstituteBatchesModel.updateOne({ _id : batch._id }, {
            $set : {
                ...req.body,
                batchName : newBatchName,
                slug : slug,
                updatedBy : req.user._id,
                updatedAt : new Date()
            }
        });

        return res.status(200).send(response.toJson(messages['en'].common.update_success));

    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

const listBatch = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const allowedRoles = ["SuperAdmin","InstituteManager","InstituteExecutive"];
        const userHasAccess = req.user.userRoles?.some(role => allowedRoles.includes(role));
        if (!userHasAccess) {
            return res.status(404).send(response.toJson(messages['en'].auth.not_access));
        }

        const page = req.query.page - 1;
        const pageSize = req.query.pageSize ? req.query.pageSize : CommonConfig.instituteBatchListLimit;

        let reqSortBy = req.query.sortBy || 'createdAt';
        const orderBy = req.query.sort && req.query.sort == 'ASC' ? -1 : 1;
        const sorting = { [reqSortBy]: orderBy };

        const filters = {
            instituteCourseId: req.query.instituteCourseId,
            instituteSubCourseId: req.query.instituteSubCourseId,
            type: req.query.type,
        };

        // Base query per filters 1-3
        let baseQuery = {
            isDeleted: false,
        };

        if (filters.instituteCourseId) {
            baseQuery.instituteCourseId = filters.instituteCourseId;
        }
        if (filters.instituteSubCourseId) {
            baseQuery.instituteSubCourseId = filters.instituteSubCourseId;
        }

        // Fetch batches
        let rawBatches = await InstituteBatchesModel.find(baseQuery).sort(sorting).lean();

        // Helper: parse date string into UTC date at midnight
        const parseDate = (val) => {
            if (!val || typeof val !== 'string') return null;
            let d = null;
            try {
                const tmp = new Date(val);
                if (!isNaN(tmp.getTime())) {
                    d = new Date(Date.UTC(tmp.getUTCFullYear(), tmp.getUTCMonth(), tmp.getUTCDate()));
                }
            } catch (_) {
                d = null;
            }
            return d;
        };

        // Today UTC (midnight)
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

        // Apply type filter if provided
        let filtered = rawBatches;
        if (filters.type) {
            const typeLower = String(filters.type).toLowerCase();
            filtered = rawBatches.filter((b) => {
                const s = parseDate(b.startDate);
                const e = parseDate(b.endDate);
                if (!s || !e) return false;
                const isCompleted = e < todayUTC;
                const isUpcoming = s > todayUTC;
                const isOngoing = s <= todayUTC && todayUTC <= e;

                if (typeLower === 'completed') return isCompleted;
                if (typeLower === 'upcoming') return isUpcoming;
                if (typeLower === 'ongoing') return isOngoing;
                return true;
            });
        }

        const total = filtered.length;

        // Manual pagination
        const paginated = page !== null ? filtered.slice(
            parseInt(page) * parseInt(pageSize),
            parseInt(page) * parseInt(pageSize) + parseInt(pageSize)
        ) : filtered;

        const fieldsToRemove = ['__v', 'createdAt', 'updatedAt', 'deletedAt', 'isDeleted'];
        const fieldsToAdd = (data) => ({});

        let batches = await Promise.all(
            paginated.map(async (source) => {
                return CommonFun.transformObject(source, fieldsToRemove, fieldsToAdd);
            })
        );

        const data = { batches, total };
        return res.status(200).send(response.toJson(messages['en'].common.list_success, data));

    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
}

module.exports = {
    create,
    createSubCourse,
    list,
    publicList,
    createBatch,
    updateBatch,
    listBatch,
    batchPublicList,
    subCourcePublicList,
}