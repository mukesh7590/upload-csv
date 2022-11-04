const router = require("express").Router();

const {
   home,
   uploadFile,
   fileDelete,
   showFile,
} = require("../controller/fileController");

// HOME PAGE
router.get("/", home);

// UPLOAD THR CSV FILE
router.post("/upload", uploadFile);

// DELETE A CSV FILE
router.get("/delete/:file", fileDelete);

// SHOW THE CSV FILE
router.get("/show", showFile);

module.exports = router;
