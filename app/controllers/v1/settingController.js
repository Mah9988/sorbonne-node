const Setting = require("../../models/Setting");

// Create a new Qr
exports.createKey = async (req, res) => {
  try {
    const {key, value, type} = req.body;
    const createdDate = new Date();
    const keys = new Setting({
      key,
      type,
      value,
      createdDate,
      updatedDate: createdDate,
    });
    await keys.save()
    res.status(201).json({ keys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get All Qr
exports.getAllKey = async (req, res) => {
  try {
    const keyData = await Setting.find({});
    res.status(200).send(keyData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all settings");
  }
};
// Get QR By ID
exports.getKeyByName = async (req, res) => {
  const key = req.params.key;
  Setting.findOne({ key })
    .then((item) => {
      if (!item) {
        res.status(404).send("Key not found");
      } else {
        res.json(item);
      }
    })
    .catch((error) => {
      res.status(500).send("Error fetching Key");
    });
};
