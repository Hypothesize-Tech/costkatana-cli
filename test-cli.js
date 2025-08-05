#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Cost Katana CLI...\n');

// Test 1: Help command
console.log('1. Testing help command...');
const helpTest = spawn('node', [path.join(__dirname, 'dist/index.js'), '--help'], {
  stdio: 'pipe'
});

helpTest.stdout.on('data', (data) => {
  console.log('✅ Help command works');
});

helpTest.stderr.on('data', (data) => {
  console.log('❌ Help command failed:', data.toString());
});

helpTest.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Help command completed successfully\n');
  } else {
    console.log('❌ Help command failed with code:', code, '\n');
  }
});

// Test 2: Version command
console.log('2. Testing version command...');
const versionTest = spawn('node', [path.join(__dirname, 'dist/index.js'), '--version'], {
  stdio: 'pipe'
});

versionTest.stdout.on('data', (data) => {
  console.log('✅ Version command works');
});

versionTest.stderr.on('data', (data) => {
  console.log('❌ Version command failed:', data.toString());
});

versionTest.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Version command completed successfully\n');
  } else {
    console.log('❌ Version command failed with code:', code, '\n');
  }
});

// Test 3: List commands
console.log('3. Testing list-models command (should fail without config)...');
const listTest = spawn('node', [path.join(__dirname, 'dist/index.js'), 'list-models'], {
  stdio: 'pipe'
});

listTest.stdout.on('data', (data) => {
  console.log('✅ List models command works');
});

listTest.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Missing configuration')) {
    console.log('✅ List models correctly detects missing configuration');
  } else {
    console.log('❌ Unexpected error:', output);
  }
});

listTest.on('close', (code) => {
  if (code !== 0) {
    console.log('✅ List models command failed as expected (no config)\n');
  } else {
    console.log('❌ List models command should have failed\n');
  }
});

console.log('🎉 CLI testing completed!');
console.log('\nTo use the CLI:');
console.log('1. Run: node dist/index.js init');
console.log('2. Follow the setup prompts');
console.log('3. Test with: node dist/index.js test');
console.log('4. Start chatting: node dist/index.js chat'); 