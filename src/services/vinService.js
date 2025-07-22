import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAllVins = async () => {
  try {
    const vins = await prisma.vin.findMany();
    return vins;
  } catch (error) {
    console.error('Erreur Prisma dans findAllVins:', error);
    throw error;
  }
};

export const findVinById = async (id) => {
  try {
    const vin = await prisma.vin.findUnique({
      where: { id },
    });
    return vin;
  } catch (error) {
    console.error('Erreur Prisma dans findVinById:', error);
    throw error;
  }
};

export const createVin = async (vinData) => {
  const { nom, cepage, annee, prix, quantiteStock, description, imageURL } = vinData;

  const parsedAnnee = parseInt(annee);
  const parsedPrix = parseFloat(prix);
  const parsedQuantiteStock = parseInt(quantiteStock);

  if (isNaN(parsedAnnee) || isNaN(parsedPrix) || isNaN(parsedQuantiteStock)) {
      const error = new Error("Données numériques invalides pour l'année, le prix ou la quantité en stock.");
      error.code = 'INVALID_NUMBER_FORMAT';
      console.error("Erreur de validation de type dans createVin service (pré-Prisma):", error.message);
      throw error;
  }

  try {
    const newVin = await prisma.vin.create({
      data: {
        nom,
        cepage,
        annee: parsedAnnee,
        prix: parsedPrix,
        quantiteStock: parsedQuantiteStock,
        description,
        imageURL,
      },
    });
    return newVin;
  } catch (error) {
    console.error('Erreur CATCHED par Prisma dans createVin du service:', error);
    throw error;
  }
};

export const updateVin = async (id, vinData) => {
  const updateData = {};
  if (vinData.nom !== undefined) updateData.nom = vinData.nom;
  if (vinData.cepage !== undefined) updateData.cepage = vinData.cepage;
  if (vinData.annee !== undefined) updateData.annee = parseInt(vinData.annee);
  if (vinData.prix !== undefined) updateData.prix = parseFloat(vinData.prix);
  if (vinData.quantiteStock !== undefined) updateData.quantiteStock = parseInt(vinData.quantiteStock);
  if (vinData.description !== undefined) updateData.description = vinData.description;
  if (vinData.imageURL !== undefined) updateData.imageURL = vinData.imageURL;

  try {
    const updatedVin = await prisma.vin.update({
      where: { id },
      data: updateData,
    });
    return updatedVin;
  } catch (error) {
    console.error('Erreur Prisma dans updateVin:', error);
    throw error;
  }
};

export const deleteVin = async (id) => {
  try {
    await prisma.vin.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Erreur Prisma dans deleteVin:', error);
    throw error;
  }
};
