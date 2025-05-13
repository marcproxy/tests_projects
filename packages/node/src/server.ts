import express from "express";
import usersRouter from "./users"; // Vérifiez ce chemin

// Création de l'application Express
export const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes - vérifiez que ceci est appelé correctement
app.use("/users", usersRouter);

// Fonction exportée pour démarrer le serveur
export const startServer = (port = 3000) => {
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Ne pas exécuter le serveur lors des tests
if (require.main === module) {
  startServer();
}