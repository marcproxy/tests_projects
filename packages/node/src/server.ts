import express from "express";
import usersRouter from "./users";

// Création de l'application Express
export const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes - montez le routeur users correctement
app.use("/users", usersRouter);

// Fonction exportée pour démarrer le serveur
export const startServer = (port: number | string = 3000) => {
  const portNumber = typeof port === 'string' ? parseInt(port, 10) : port;
  return app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}`);
  });
};

// Ne pas exécuter le serveur lors des tests
if (require.main === module) {
  startServer();
}