const { check } = require("express-validator");

exports.create = [
  check('name').not().isEmpty().withMessage('Name is requied'),
  check('price').optional(),
  check('discount').optional(),
];

exports.subCourseCreate = [
  check('instituteCourseId').not().isEmpty().withMessage('Institute Course id is requied'),
  check('name').not().isEmpty().withMessage('Name is requied'),
  check('price').optional(),
  check('discount').optional(),
];

exports.list = [
  check('page').not().isEmpty().withMessage('Page is requied').toInt().withMessage('Page is allowed Only numbers'),
  check('sortBy').optional(),
  check('sort').optional(),
];

exports.publicList = [
  check('page').not().isEmpty().withMessage('Page is requied').toInt().withMessage('Page is allowed Only numbers'),
  check('sortBy').optional(),
  check('sort').optional(),
];

exports.subCourcePublicList = [
  check('page').not().isEmpty().withMessage('Page is requied').toInt().withMessage('Page is allowed Only numbers'),
  check('sortBy').optional(),
  check('sort').optional(),
  check('instituteCourseId').optional(),
];

exports.batchPublicList = [
  check('page').not().isEmpty().withMessage('Page is requied').toInt().withMessage('Page is allowed Only numbers'),
  check('sortBy').optional(),
  check('sort').optional(),
  check('instituteCourseId').optional(),
  check('instituteSubCourseId').optional(),
];

// institute batches
exports.batchCreate = [
  check('instituteCourseId').not().isEmpty().withMessage('Institute Course id is requied'),
  check('instituteSubCourseId').optional(),
  check('batchName').not().isEmpty().withMessage('Batch Name is requied'),
  check('startTime').not().isEmpty().withMessage('Start Time is requied')
  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Start Time must be in HH:MM 24-hour format"),
  check('endTime').not().isEmpty().withMessage('End Time is requied')
  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("End Time must be in HH:MM 24-hour format"),

  check('shift').not().isEmpty().withMessage('Shift is requied'),
  // check('orientationDate').optional().matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/).withMessage('Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ss.SSSZ)'),
  check('orientationDate').not().isEmpty().withMessage('Orientation Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Orientation Date must be in format YYYY-MM-DD'),

  // Format YYYY-MM-DD needed & Registration end date must be on or before start date
  check('registrationEndDate')
  .not().isEmpty().withMessage('Registration End Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Registration End Date must be in format YYYY-MM-DD')
  .custom((registrationEndDate, { req }) => {
    if (req.body.startDate && new Date(registrationEndDate) < new Date(req.body.startDate)) {
      throw new Error("Registration end date must be on or before start date");
    }
    return true;
  }),

  // Format YYYY-MM-DD needed
  check('startDate')
  .not().isEmpty().withMessage('Start Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Start Date must be in format YYYY-MM-DD'),

  // Format YYYY-MM-DD needed & End Date must be on or after Start Date
  check('endDate')
  .not().isEmpty().withMessage('End Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('End Date must be in format YYYY-MM-DD')
  .custom((endDate, { req }) => {
    if (req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
      throw new Error('End Date must be on or after Start Date');
    }
    return true;
  }),
];

exports.batchUpdate = [
  check('batchId').not().isEmpty().withMessage('Batch id is requied'),
  check('instituteCourseId').not().isEmpty().withMessage('Institute Course id is requied'),
  check('instituteSubCourseId').optional(),
  check('startTime').optional()
  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Start Time must be in HH:MM 24-hour format"),
  check('endTime').optional()
  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("End Time must be in HH:MM 24-hour format"),

  check('shift').optional(),

  // check('orientationDate').optional().matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/).withMessage('Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ss.SSSZ)'),
  check('orientationDate').not().isEmpty().withMessage('Orientation Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Orientation Date must be in format YYYY-MM-DD'),

  // Format YYYY-MM-DD needed & Registration end date must be on or before start date
  check('registrationEndDate')
  .optional()
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Registration End Date must be in format YYYY-MM-DD')
  .custom((registrationEndDate, { req }) => {
    if (req.body.startDate && new Date(registrationEndDate) < new Date(req.body.startDate)) {
      throw new Error("Registration end date must be on or before start date");
    }
    return true;
  }),

  // Format YYYY-MM-DD needed
  check('startDate')
  .optional()
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Start Date must be in format YYYY-MM-DD'),

  // Format YYYY-MM-DD needed & End Date must be on or after Start Date
  check('endDate')
  .optional()
  .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('End Date must be in format YYYY-MM-DD')
  .custom((endDate, { req }) => {
    if (req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
      throw new Error('End Date must be on or after Start Date');
    }
    return true;
  }),
];

exports.batchList = [
  check('page').not().isEmpty().withMessage('Page is requied').toInt().withMessage('Page is allowed Only numbers'),
  check('type').optional().isIn(['UPCOMING', 'ONGOING', 'COMPLETED']).withMessage('Type must be one of the following: UPCOMING, ONGOING, COMPLETED'),
  check('instituteCourseId').optional(),
  check('instituteSubCourseId')
  .optional()
  .custom((value, { req }) => {
    if (value && !req.body.instituteCourseId && !req.query.instituteCourseId) {
      throw new Error('instituteCourseId is required');
    }
    return true;
  }),
  check('sortBy').optional(),
  check('sort').optional(),
  check('pageSize').optional(),
];

