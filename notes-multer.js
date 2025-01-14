// Dependencias necesarias
const express = require("express");
const multer = require("multer");
const app = express();

// Configuración de almacenamiento en disco
const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nombre único para el archivo
  },
});
const uploadDisk = multer({ storage: storageDisk });

// Configuración de almacenamiento en memoria
const storageMemory = multer.memoryStorage();
const uploadMemory = multer({ storage: storageMemory });

// Cargar un solo archivo
app.post("/upload-single", uploadDisk.single("archivo"), (req, res) => {
  res.send(`Archivo ${req.file.originalname} subido correctamente.`);
});

// Cargar múltiples archivos desde el mismo campo
app.post("/upload-array", uploadDisk.array("fotos", 5), (req, res) => {
  res.send(`${req.files.length} archivos subidos correctamente.`);
});

// Cargar archivos desde diferentes campos
app.post(
  "/upload-fields",
  uploadDisk.fields([
    { name: "documentos", maxCount: 2 },
    { name: "imagenes", maxCount: 3 },
  ]),
  (req, res) => {
    res.send("Archivos de diferentes campos subidos correctamente.");
  }
);

// Filtrar archivos según el tipo (solo imágenes PNG o JPEG)
const uploadFilter = multer({
  storage: storageDisk,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true); // Acepta solo imágenes PNG o JPEG
    } else {
      cb(new Error("Solo se permiten imágenes PNG o JPEG"));
    }
  },
});

// Limitar el tamaño de los archivos a 2MB
const uploadLimited = multer({
  storage: storageDisk,
  limits: { fileSize: 2 * 1024 * 1024 }, // Máximo 2MB
});

// Aceptar archivos de cualquier campo
app.post("/upload-any", uploadDisk.any(), (req, res) => {
  res.send("Archivos subidos desde cualquier campo.");
});

// No aceptar archivos, solo datos de formulario
app.post("/upload-none", uploadDisk.none(), (req, res) => {
  res.send("Solo datos de formulario recibidos.");
});

// Mostrar el tamaño del archivo subido
app.post("/upload-size", uploadDisk.single("archivo"), (req, res) => {
  res.send(`Tamaño del archivo: ${req.file.size} bytes.`);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
