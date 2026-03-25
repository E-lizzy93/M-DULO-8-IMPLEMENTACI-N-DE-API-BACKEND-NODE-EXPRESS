const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      mensaje: "Debe adjuntar un archivo jpg o png",
    });
  }

  return res.status(200).json({
    ok: true,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
};

module.exports = {
  uploadFile,
};
