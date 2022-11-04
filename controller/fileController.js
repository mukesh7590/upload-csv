/****************IMPORTING PACKAGE/MODELS*************************/
const File = require("../models/fileModel");

const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const FILES_PATH = path.join("/uploads/files");

const asyncHandler = require("express-async-handler");

// HOME 
const home = asyncHandler(async (req, res) => {
   try {
      let files = await File.find({});
      res.render("home", {
         files: files,
      });
   } catch (err) {
      console.log(err);
   }
});

// UPLOADING THE FILE
const uploadFile = asyncHandler(async (req, res) => {
   /**********EXPORTING FUNCTION FOR Uploading ROUTE******************/
   try {
      //Use for uploading file with note
      File.uploadedFile(req, res, function (err) {
         if (err) {
            console.log("multer Error");
         }
         console.log(req.file);
         if (
            (req.file && req.file.mimetype == "application/vnd.ms-excel") ||
            (req.file && req.file.mimetype == "text/csv")
         ) {
            console.log("true");
            console.log(req.file);
            File.create(
               {
                  filePath: req.file.path,
                  originalName: req.file.originalname,
                  file: req.file.filename,
               },
               function (err) {
                  if (err) {
                     console.log(err);
                     return res.status(400).json({
                        message: "Error in creating Note or Uploading File",
                     });
                  }
                  // res.status(200).json({
                  //     message: "File Uploaded"

                  // });
                  return res.redirect("/");
               }
            );
         } else {
            console.log("Please Upload CSV Format file");

            // todo add alert
            return res.redirect("/");
         }
      });
   } catch (err) {
      console.log(err);
   }
});

// DELETING THE FILE
const fileDelete = asyncHandler(async (req, res) => {
   try {
      const filename = req.params.file;
      let isFile = await File.findOne({ file: filename });

      if (isFile) {
         await File.deleteOne({ file: filename });
         console.log("file is deleted ");
         return res.redirect("/");
      } else {
         console.log("file not found");
         return res.redirect("/");
      }
   } catch (error) {
      console.log(error);
      return res.statu(500).json({
         message: "Internal Server Error",
      });
   }
});

// SHOWING THE FILE
const showFile = asyncHandler(async (req, res) => {
   // FIND THE FILE BY ID
   let filePATH = await File.findById(req.query.file_id);

   const results = [];
   const header = [];

   // STREAMING THE FILE
   fs.createReadStream(filePATH.filePath)
      .pipe(csv())
      .on("headers", (headers) => {
         headers.map((head) => {
            header.push(head);
         });
         console.log("header => ", header);
      })
      .on("data", (data) => results.push(data))
      .on("end", () => {
         console.log(results.length);
         let page = req.query.page;
         console.log("page => ", req.query.page);
         let startSlice = (page - 1) * 100 + 1;
         let endSlice = page * 100;
         let sliceResults = [];
         let totalPages = Math.ceil(results.length / 100);

         if (endSlice < results.length) {
            sliceResults = results.slice(startSlice, endSlice + 1);
         } else {
            sliceResults = results.slice(startSlice);
         }

         res.render("file", {
            title: filePATH.originalName,
            head: header,
            data: sliceResults,
            length: results.length,
            page: req.query.page,
            totalPages: totalPages,
         });
      });
});

// EXPORTING THE ALL ACTIONS
module.exports = { home, uploadFile, fileDelete, showFile };
