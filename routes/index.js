const router = require("express").Router();

const {
   home,
   uploadFile,
   fileDelete,
   showFile,
} = require("../controller/fileController");

// For rendering different pages and controllers
router.get("/", home);
router.post("/upload", uploadFile);
router.get("/delete/:file", fileDelete);
router.get("/show", showFile);

module.exports = router;
