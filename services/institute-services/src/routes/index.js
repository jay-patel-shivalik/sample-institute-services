const express = require('express');
const router = express.Router();

const instituteStagesRoutes = require('./instituteStagesRoutes');
const instituteCoursesRoutes = require('./instituteCoursesRoutes');
const instituteLeadRoutes = require('./instituteLeadRoutes');

router.use('/institute-stages', instituteStagesRoutes);
router.use('/institute-courses', instituteCoursesRoutes);
router.use('/institute-leads', instituteLeadRoutes);


module.exports = router;
