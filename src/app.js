import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

import vinRoutes from './routes/vinRoutes.js';
app.use('/api/vins', vinRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connecté à la base de données !');
    app.listen(PORT, () => {
      console.log(`Serveur full-stack démarré sur le port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données ou du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Déconnecté de la base de données.');
});
