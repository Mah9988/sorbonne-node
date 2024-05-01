const Qr = require("../../models/Qr");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const Child = require("../../models/Child");
const ITEMS_PER_PAGE = 10; // Set the number of items per page

// Create a new Qr
exports.createQR = async (req, res) => {
  try {
    const count = req.body.value || 100;
    const qrCodeItem = [];
    for (let index = 0; index < count; index++) {
      const uuid = uuidv4(); // Generate a new UUID for each QR code
      const existingQRCode = await Qr.findOne({
        qrCode: "https://staging.sewara-jo.com/child/" + uuid,
      });
      if (existingQRCode) {
        console.log(`QR code with UUID ${uuid} already exists. Skipping...`);
        continue;
      }

      // Generate the QR code image data
      const qrCode = await QRCode.toDataURL(
        "https://staging.sewara-jo.com/child/" + uuid
      );

      // Save the QR code in MongoDB
      const qrCodeData = new Qr({
        qrCode: "https://staging.sewara-jo.com/child/" + uuid,
        image: qrCode,
      });
      qrCodeItem.push(qrCodeData);
    }

    await Qr.insertMany(qrCodeItem);

    res.status(201).json({ qrCode: qrCodeItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get All Qr
exports.getAllQR = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the request query parameters
    const totalCount = await Qr.countDocuments({});
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const QrData = await Qr.find({}).skip(skip).limit(ITEMS_PER_PAGE);

    // const QrData = await Qr.find({});
    return res.json({
      data: QrData,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching All Qr");
  }
};
// Get QR By ID
exports.getQRById = async (req, res) => {
  const qrCode = req.params.id;
  Qr.findOne({ qrCode })
    .then((item) => {
      if (!item) {
        res.status(404).send("Qr not found");
      } else {
        res.json(item);
      }
    })
    .catch((error) => {
      res.status(500).send("Error fetching Qr");
    });
};

// Get child data by QR ID :
exports.getChildDataByQr = async (req, res) => {
  const qrID = req.params.id;

  try {
    const child = await Child.findOne({ qrID });
    if (!child) {
      return res.status(404).json({ message: "child not found" });
    }
    return res.status(200).json({ message: "success", child });
  } catch (error) {
    return res.status(500).json({ message: "error", error });
  }
};
// check qr code for test
exports.checkQrCode = async (req, res) => {
  const checkUniqueQRCodes = async (qrCodeArray) => {
    const seenQRCodes = new Set();

    for (const qrCodeObj of qrCodeArray) {
      const qrCodeValue = qrCodeObj.qrCode;

      if (seenQRCodes.has(qrCodeValue)) {
        return qrCodeValue; // Return the duplicate QR code
      }

      seenQRCodes.add(qrCodeValue);
    }

    return null; // No duplicate QR codes found
  };
  try {
    const qrCodeArray = await this.getAllQR(); // Fetch your QR codes data

    const duplicateQRCode = await checkUniqueQRCodes(qrCodeArray);

    if (duplicateQRCode) {
      console.log("Duplicate QR code found:", duplicateQRCode);
      res.status(400).json({ duplicateQRCode });
    } else {
      console.log("All QR codes are unique.");
      res.status(200).json({ message: "All QR codes are unique." });
    }
  } catch (error) {
    console.error("Error checking QR codes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get QR Used
exports.getQRUesd = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the request query parameters
    const totalCount = await Child.countDocuments({});
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const childData = await Child.find({})
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .populate("qrID");
    const returnQR = await childData?.map((item) => {
      return item?.qrID;
    });
    return res.json({
      data: returnQR,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching All Qr Used");
  }
};
// get qr not used
exports.getNotUsed = async (req, res, pageSize = 1) => {
  try {
    let incrementPage;
    const page = parseInt(req.query.page) || incrementPage || pageSize; // Get the page number from the request query parameters
    const totalCount = await Qr.countDocuments({});
    const totalPages = Math.ceil(totalCount / 20);
    const skip = (page - 1) * 20;
    const QrData = await Qr.find({}).skip(skip).limit(20);
    const childData = await Child.find({}).populate("qrID");
    const childDataCount = await Child.countDocuments({});

    const filterQRNotUsed = filterNotUsed(QrData, childData);
    if (filterQRNotUsed.length === 0) {
      return res.json({
        data: filterQRNotUsed,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
      });
    } else {

      return res.json({
        data: filterQRNotUsed,
        currentPage: page,
        totalPages: totalPages,
        totatItems: totalCount - childDataCount,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching All Qr Not Used");
  }
};

const filterNotUsed = (QrData, childData) => {
  const filterQRNotUsed = QrData.filter((itemQr) => {
    const isUsed = childData.some((childItem) => {
      return (
        childItem.qrID &&
        childItem.qrID._id.toString() === itemQr._id.toString()
      );
    });

    return !isUsed;
  });
  return filterQRNotUsed;
};
