Travail pour le cesi : application en codefirst nodeJS avec PRISMA et des migrations pour gérer un site de eCommerce de vin.

# Installation et démarrage
créer un fichier `.env` à la racine du projet avec les variables d'environnement nécessaires:
```plaintext
DATABASE_URL="file:./dev.db"
PORT=3000
```

# Lancer l'application
```bash
npm install
npx prisma generate
npx prisma migrate dev --name vin_model
npm start
```