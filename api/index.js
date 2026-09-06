'use strict';

const path = require('node:path');

// Local `vercel dev` / smoke tests: load backend/.env when Vercel env is not injected.
if (!process.env.JWT_SECRET) {
  require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
}

const appModule = require('../backend/dist/app.js');
const app = appModule.default ?? appModule;

module.exports = app;
