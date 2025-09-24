const dataService = require("../services/dataService");

exports.getData = async (req, res) => {
  try {
    const result = await dataService.fetchExternalData();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
 
exports.postData = async (req, res) => {
  try {
    const { name, value } = req.body;

    if (!name || !value) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios: name, value" });
    }

    const saved = await dataService.saveData(name, value);

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

