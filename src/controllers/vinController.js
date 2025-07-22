import * as vinService from '../services/vinService.js';

export const getAllVins = async (req, res) => {
  try {
    const vins = await vinService.findAllVins();
    res.status(200).json(vins);
  } catch (error) {
    console.error('Erreur lors de la récupération des vins (contrôleur):', error);
    res.status(500).json({ message: 'Erreur interne du serveur lors de la récupération des vins.', details: error.message });
  }
};

export const getVinById = async (req, res) => {
  try {
    const { id } = req.params;
    const vin = await vinService.findVinById(id);
    if (vin) {
      res.status(200).json(vin);
    } else {
      res.status(404).json({ message: 'Vin non trouvé.' });
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du vin avec l'ID ${req.params.id} (contrôleur):`, error);
    res.status(500).json({ message: 'Erreur interne du serveur lors de la récupération du vin.', details: error.message });
  }
};

export const createVin = async (req, res) => {
  try {
    const vinData = req.body;
    const newVin = await vinService.createVin(vinData);
    res.status(201).json(newVin);
  } catch (error) {
    console.error('Erreur lors de la création du vin (contrôleur):', error);
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Un vin avec des propriétés similaires existe déjà.' });
    } else if (error.code === 'INVALID_NUMBER_FORMAT') {
      res.status(400).json({ message: error.message });
    }
    else {
      res.status(400).json({ message: 'Données de vin invalides.', details: error.message });
    }
  }
};

export const updateVin = async (req, res) => {
  try {
    const { id } = req.params;
    const vinData = req.body;
    const updatedVin = await vinService.updateVin(id, vinData);
    res.status(200).json(updatedVin);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du vin avec l'ID ${req.params.id} (contrôleur):`, error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Vin non trouvé pour la mise à jour.' });
    } else {
      res.status(400).json({ message: 'Données de mise à jour invalides.', details: error.message });
    }
  }
};

export const deleteVin = async (req, res) => {
  try {
    const { id } = req.params;
    await vinService.deleteVin(id);
    res.status(204).send();
  } catch (error) {
    console.error(`Erreur lors de la suppression du vin avec l'ID ${req.params.id} (contrôleur):`, error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Vin non trouvé pour la suppression.' });
    } else {
      res.status(500).json({ message: 'Erreur interne du serveur lors de la suppression du vin.', details: error.message });
    }
  }
};