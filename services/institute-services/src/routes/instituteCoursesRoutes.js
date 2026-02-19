const router = require('express').Router();
const { superAdminVerifyToken } = require("../middleware/authJwt");
const InstituteCourseController = require("../controllers/instituteCourseController");
const InstituteCourseValidation = require("../validations/instituteCourseValidation");

router.post("/create", [superAdminVerifyToken], InstituteCourseValidation.create, InstituteCourseController.create);

router.post("/sub-course/create", [superAdminVerifyToken], InstituteCourseValidation.subCourseCreate, InstituteCourseController.createSubCourse);

router.get("/list", [superAdminVerifyToken], InstituteCourseValidation.list, InstituteCourseController.list);

router.get("/public-list", InstituteCourseValidation.publicList, InstituteCourseController.publicList);

router.get("/subcource/public-list", InstituteCourseValidation.subCourcePublicList, InstituteCourseController.subCourcePublicList);

router.get("/batch/public-list", InstituteCourseValidation.batchPublicList, InstituteCourseController.batchPublicList);

// institute batches
router.post("/batch/create", [superAdminVerifyToken], InstituteCourseValidation.batchCreate, InstituteCourseController.createBatch);

router.put("/batch/update/:batchId", [superAdminVerifyToken], InstituteCourseValidation.batchUpdate, InstituteCourseController.updateBatch);

router.get("/batch/list", [superAdminVerifyToken], InstituteCourseValidation.batchList, InstituteCourseController.listBatch);

module.exports = router;