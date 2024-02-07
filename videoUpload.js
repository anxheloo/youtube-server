const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;

//Define a destination "dir" on where to store the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("This is file.filename:", file.filename);
    console.log("This is file.fieldname:", file.fieldname);

    console.log("This is file.mimetype:", file.mimetype);

    const rootDirectory = path.dirname(require.main.filename);
    console.log("This is rootDirectory:", rootDirectory);

    if (file.fieldname === "video") {
      // Get the root directory of the application
      const rootDirectory = path.dirname(require.main.filename);

      // Set the destination path for video uploads
      cb(null, path.join(rootDirectory, "public/").concat("videos"));
    } else if (file.fieldname === "image") {
      // Get the root directory of the application
      const rootDirectory = path.dirname(require.main.filename);

      // Set the destination path for video uploads
      cb(null, path.join(rootDirectory, "public/").concat("images"));
    }
  },

  // Define the filename for the uploaded video
  filename: (req, file, cb) => {
    const extension = file.mimetype.startsWith("image/")
      ? file.mimetype.split("/")[1]
      : "mp4";
    const id = uuid();
    cb(null, file.fieldname + "_" + id + "." + extension);
  },
});

// Define a file filter to only accept video files with the "video/mp4" mimetype
const fileFilter = (req, file, cb) => {
  //   if (file.mimetype === "video/mp4" || file.mimetype.startsWith("image")) {
  if (
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Create the multer middleware with the defined storage and fileFilter
// exports.videoUpload = multer({ storage, fileFilter });

// Create the multer middleware with the defined storage and fileFilter
exports.videoUpload = multer({ storage, fileFilter });

// .fields([
//     { name: "video", maxCount: 1 },
//     { name: "image", maxCount: 1 },
//   ]);
