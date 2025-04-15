import express from 'express';
import { handleGetStatus, handlePythonJob } from '../controller/compiler';

const router = express.Router();

router.post('/code', handlePythonJob);
router.get('/status/:id', handleGetStatus);

export default router;
