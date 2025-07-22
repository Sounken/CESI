import express from 'express';
import {
  getAllVins,
  getVinById,
  createVin,
  updateVin,
  deleteVin
} from '../controllers/vinController.js';

const router = express.Router();

router.route('/')
  .get(getAllVins)
  .post(createVin);

router.route('/:id')
  .get(getVinById)
  .put(updateVin)
  .delete(deleteVin);

export default router;