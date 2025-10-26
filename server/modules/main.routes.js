import express from 'express';
import mainController from './main.controller.js';

const router = express.Router();

//http://localhost:3000/api/getData
router.get("/getData", mainController.getData);
//http://localhost:3000/api/event
router.get("/event", mainController.sendEvents);

export default router;