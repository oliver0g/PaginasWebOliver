const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta del archivo de puntuaciones
const scoresFile = path.join(__dirname, "scores.json");

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Servir frontend completo

// --- FUNCIONES AUXILIARES ---
const readScores = () => {
  try {
    if (!fs.existsSync(scoresFile)) {
      fs.writeFileSync(scoresFile, "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync(scoresFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo el archivo de puntuaciones:", error);
    return [];
  }
};

const writeScores = (scores) => {
  try {
    fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2), "utf8");
  } catch (error) {
    console.error("Error escribiendo en el archivo de puntuaciones:", error);
  }
};

// --- RUTAS DE LA API ---
// Obtener todas las puntuaciones
app.get("/api/scores", (req, res) => {
  const scores = readScores();
  res.json(scores);
});

// Guardar nueva puntuación
app.post("/api/scores", (req, res) => {
  const scores = readScores();
  const newScore = {
    name: req.body.name,
    score: req.body.score,
    level: req.body.level || 1,
    date: new Date().toISOString(),
  };

  // Validar datos
  if (!newScore.name || typeof newScore.score !== "number" || typeof newScore.level !== "number") {
    return res.status(400).json({ message: "Datos de puntuación inválidos." });
  }

  scores.push(newScore);
  // Ordenar de mayor a menor
  scores.sort((a, b) => b.score - a.score);

  writeScores(scores);

  res.status(201).json({ message: "Puntuación guardada con éxito", score: newScore });
});

// --- RUTAS DE FRONTEND ---
// Landing Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Servir prácticas dinámicamente
app.get("/practicas/:practica", (req, res) => {
  const practica = req.params.practica;
  const filePath = path.join(__dirname, `../frontend/practicas/${practica}/index.html`);
  res.sendFile(filePath);
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor combinado corriendo en http://localhost:${PORT}`));
