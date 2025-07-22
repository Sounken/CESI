-- CreateTable
CREATE TABLE "Vin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "cepage" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "prix" REAL NOT NULL,
    "quantiteStock" INTEGER NOT NULL,
    "description" TEXT,
    "imageURL" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
