import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all modules
import { LeadManager } from './modules/lead-manager.js';
import { PropertyManager } from './modules/property-manager.js';
import { ClientCommunication } from './modules/client-communication.js';
import { MarketAnalyzer } from './modules/market-analyzer.js';
import { AppointmentScheduler } from './modules/appointment-scheduler.js';
import { DocumentManager } from './modules/document-manager.js';
import { CommissionCalculator } from './modules/commission-calculator.js';
import { SocialMediaManager } from './modules/social-media-manager.js';
import { DatabaseManager } from './database/db-manager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Real Estate Agent Assistant - Main Application
 * Comprehensive productivity app for real estate professionals
 */
class RealEstateAgentApp {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;    
    // Initialize modules
    this.leadManager = new LeadManager();
    this.propertyManager = new PropertyManager();
    this.clientCommunication = new ClientCommunication();
    this.marketAnalyzer = new MarketAnalyzer();
    this.appointmentScheduler = new AppointmentScheduler();
    this.documentManager = new DocumentManager();
    this.commissionCalculator = new CommissionCalculator();
    this.socialMediaManager = new SocialMediaManager();
    this.databaseManager = new DatabaseManager();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, 'ui')));
  }

  setupRoutes() {
    // Dashboard route
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'ui', 'index.html'));
    });

    // API Routes
    this.app.use('/api/leads', this.createLeadRoutes());
    this.app.use('/api/properties', this.createPropertyRoutes());
    this.app.use('/api/clients', this.createClientRoutes());
    this.app.use('/api/market', this.createMarketRoutes());
    this.app.use('/api/appointments', this.createAppointmentRoutes());
    this.app.use('/api/documents', this.createDocumentRoutes());
    this.app.use('/api/commission', this.createCommissionRoutes());
    this.app.use('/api/social', this.createSocialRoutes());
  }

  createLeadRoutes() {
    const router = express.Router();
    
    router.get('/', async (req, res) => {      try {
        const leads = await this.leadManager.getAllLeads();
        res.json(leads);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    router.post('/', async (req, res) => {
      try {
        const lead = await this.leadManager.addLead(req.body);
        res.json(lead);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    router.put('/:id/status', async (req, res) => {
      try {
        const result = await this.leadManager.updateLeadStatus(req.params.id, req.body.status);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    router.post('/import-csv', async (req, res) => {
      try {
        const result = await this.leadManager.importFromCSV(req.body.csvPath);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    return router;
  }

  createPropertyRoutes() {
    const router = express.Router();
    
    router.get('/', async (req, res) => {