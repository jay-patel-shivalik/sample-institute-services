const express = require('express');
const router = express.Router();

const instituteCoursesRoutes = require('./instituteCoursesRoutes');
const expertsRoutes = require('./expertsRoutes');

router.use('/institute-courses', instituteCoursesRoutes);
router.use('/experts', expertsRoutes);

module.exports = router;
