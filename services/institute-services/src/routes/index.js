const express = require('express');
const router = express.Router();

const instituteCoursesRoutes = require('./instituteCoursesRoutes');

router.use('/institute-courses', instituteCoursesRoutes);

module.exports = router;
