const mongoose = require("mongoose");
const Child = require("../../models/Child");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const Qr = require("../../models/Qr");

exports.getAllChild = async (req, res) => {
  try {
    const childs = await Child.find({}).populate("qrID");
    res.json(childs);
  } catch (error) {
    res.status(500).send("Error fetching All childs");
  }
};
exports.getOneChild = async (req, res) => {
  const childID = req.params.id;
  try {
    const child = await Child.findById(childID).exec();
    res.json(child);
  } catch (error) {
    res.status(500).send("Error fetching child");
  }
};
exports.createChild = async (req, res) => {
  const {
    name,
    birthDate,
    schoolName,
    fatherName,
    motherName,
    childrenDiseases,
    safetyMeasures,
    bloodType,
    fatherPhone,
    motherPhone,
    city,
    area,
    streetName,
    buildingNumber,
    specialMarque,
    profilePicture,
    confirmRoles,
    isPublic,
    userID,
    qrID,
  } = req.body;
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the expiration date by adding one year
    const expiration_date = new Date(currentDate);
    expiration_date.setFullYear(currentDate.getFullYear() + 1);

    if (!qrID && !userID) {
      res
        .status(404)
        .json({ message: "QR ID and user ID its required", code: -5 });
    }
    const checkQR = await Qr.findOne({ qrCode: qrID });
    if (!checkQR) {
      res.status(404).json({ message: "QR not from sewara company", code: -6  });
    }
    if (checkQR) {
      const checkChild = await Child.findOne({ qrID: checkQR._id });
      if (checkChild) {
        res.status(404).json({ message: "this QR have a child data", code: -7  });
      }
    }

    let imageUpload = null;
    if (profilePicture) {
      const s3 = new AWS.S3();
      const fileName = `${qrID}-${uuidv4()}.jpg`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(profilePicture, "base64"), // Assuming profilePicture is a base64-encoded image
        ContentType: "image/jpeg", // Change the content type as needed
      };

      imageUpload = await s3.upload(params).promise();
    }

    const childs = new Child({
      name,
      birthDate,
      schoolName,
      fatherName,
      motherName,
      childrenDiseases,
      safetyMeasures,
      bloodType,
      fatherPhone,
      motherPhone,
      city,
      area,
      streetName,
      buildingNumber,
      specialMarque,
      profilePicture: imageUpload ? imageUpload.Location : null,
      isPublic,
      confirmRoles,
      userID,
      expirationDate: expiration_date,
      isActive: true,
      qrID: checkQR._id,
    });
    await childs.save().then((item) => {
      return res.status(200).json({
        message: "Success",
        child: item,
      });
    });
  } catch (error) {
    res.status(500).send(`Error when create a new childs ${error}`);
  }
};
// Get child data from user id
exports.getChildDataByUserId = (req, res) => {
  const userID = req.params.id;
  const today = new Date(); // Get the current date
  let childIfUpdated = null;
  Child.find({ userID: userID })
    .then(async (child) => {
      if (!child) {
        res.status(404).send("child not found");
      } else {
        for (let index = 0; index < child.length; index++) {
          const element = child[index];
          if (element?.expirationDate <= today) {
            await Child.findByIdAndUpdate(element._id, {
              isActive: false,
            });
            childIfUpdated = await Child.find({ userID: userID })
          } 
        }
        res.send(childIfUpdated ? childIfUpdated : child);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error get child by user id");
    });
};

// update child :
exports.updateChild = async (req, res) => {
  const childId = req.params.id;
  const updateFields = req.body;
  try {
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "Please check your data before sent" });
    }
    updateFields.updatedDate = new Date();
    if (updateFields.profilePicture) {
      const s3 = new AWS.S3();
      // const s3 = new AWS.S3({
      //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      // });
      // Generate a unique filename for the updated image
      const fileName = `${childId}-${uuidv4()}.jpg`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(updateFields.profilePicture, "base64"), // Assuming profilePicture is a base64-encoded image
        ContentType: "image/jpeg", // Change the content type as needed
      };
      const uploadedImage = await s3.upload(params).promise();
      // Update the profilePicture URL in the updateFields
      updateFields.profilePicture = uploadedImage.Location;
    }
    const childData = await Child.findById(childId)
    if (!childData) {
      return res.status(404).json({ error: "Child not found", code:-8 });
    }
    if (!childData.isActive) {
      return res.status(400).json({ code:-10,message: "You cannot edit this child because it is not activated" });

    }

    const updatedChild = await Child.findByIdAndUpdate(childId, updateFields, {
      new: true,
    });


    res.status(200).json(updatedChild);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error when updating child " });
  }
};

// check if the QR Code is exists and return children data
exports.checkQRById = async (req, res) => {
  const qrCode = req.body.qrCode;
  Qr.findOne({ qrCode })
    .then((item) => {
      if (!item) {
        res
          .status(404)
          .json({ message: "QR not from sewara company", code: -2 });
      } else {
        Child.findOne({ qrID: item._id })
          .then((child) => {
            if (!child) {
              res.status(404).json({ message: "QR not have data", code: -3 });
              return;
            }
            if (!child.isActive) {
              res.status(404).json({
                message: "QR is not active you can't show this children data",
                code: -5,
              });
              return;
            }
            if (!child.isPublic) {
              res.status(404).json({
                message: "QR is private you can't show this children data",
                code: -4,
              });
              return;
            }
            res.json(child);
          })
          .catch((error) => {
            res.status(500).send("Error fetching Qr");
          });
      }
    })
    .catch((error) => {
      res.status(500).send("Error fetching Qr");
    });
};
