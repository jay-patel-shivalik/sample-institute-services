const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('./index.js')
const { commonStatus } = require('../config/data.js');

const instituteLectureSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institutecourses',
        required: true
    },
    subCourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institutesubcourses',
        required: false
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institutebatches',
        required: false
    },
    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'experts',
        required: false
    },
    classroomNumber: {
        type: String,
        required: true
    },
    lectureDate: {
        type: Date,
        required: true
    },
    lectureType: {
        type: String, 
        required: true
    },
    projectReviewLecture: {
        type: Boolean,
        default: false
    },
    sessionStartTime: {
        type: String,
        required: true
    },
    sessionEndTime: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: false
    },
    createFeedbackForLearner: {
        type: Boolean,
        default: false
    },
    feedbackForCoordinator: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: commonStatus,
        default: 'ACTIVE'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
    },
});

instituteLectureSchema.index({ courseId: 1 });

instituteLectureSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.hashed_password;
    delete obj.salt;
    return obj;
}

const InstituteLectures = DBConnect.model('institutelectures', instituteLectureSchema);

module.exports = {
    InstituteLectures
}