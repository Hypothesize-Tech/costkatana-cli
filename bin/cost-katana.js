#!/usr/bin/env node

// This file is the entry point for the CLI tool
// It will be compiled from TypeScript and placed in the bin directory

try {
  // Try to load the compiled JavaScript
  require('../dist/index.js');
} catch (error) {
  // If compiled version doesn't exist, try to run TypeScript directly
  try {
    require('ts-node/register');
    require('../src/index.ts');
  } catch (tsError) {
    console.error('Error: Could not start Cost Katana CLI');
    console.error('Please run "npm run build" to compile the TypeScript code');
    console.error('Or install ts-node: npm install -g ts-node');
    process.exit(1);
  }
}