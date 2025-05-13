import express from "express";
import usersRouter from "./users";

// Création de l'application Express
export const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/users", usersRouter);

// Fonction exportée pour démarrer le serveur
export const startServer = (port?: number | string) => {
  // Déterminer le port
  const portNumber = typeof port === 'undefined' 
    ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000)
    : (typeof port === 'string' ? parseInt(port, 10) : port);
  
  // Démarrer le serveur
  return app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}`);
  });
};

// Ne pas exécuter le serveur lors des tests
/* istanbul ignore next */
if (require.main === module) {
  startServer();
}
