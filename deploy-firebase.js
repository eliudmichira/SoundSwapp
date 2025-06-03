// Simple script to deploy Firebase Firestore security rules

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the firestore.rules file exists
if (!fs.existsSync('./firestore.rules')) {
  console.error('Error: firestore.rules file not found!');
  process.exit(1);
}

console.log('Setting up Firebase deployment...');
console.log('This will help deploy the security rules to your Firebase project.\n');

// Check if firebase-tools is installed
try {
  execSync('firebase --version', { stdio: 'ignore' });
  console.log('✅ Firebase CLI is already installed.');
} catch (error) {
  console.log('Installing Firebase CLI globally...');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    console.log('✅ Firebase CLI installed successfully.');
  } catch (installError) {
    console.error('❌ Failed to install Firebase CLI.');
    console.error('Please run: npm install -g firebase-tools');
    process.exit(1);
  }
}

// Create firebase.json if it doesn't exist
if (!fs.existsSync('./firebase.json')) {
  console.log('Creating firebase.json configuration...');
  const firebaseConfig = {
    firestore: {
      rules: "firestore.rules",
      indexes: "firestore.indexes.json"
    }
  };
  
  fs.writeFileSync('./firebase.json', JSON.stringify(firebaseConfig, null, 2));
  console.log('✅ Created firebase.json');
  
  // Create empty firestore.indexes.json if it doesn't exist
  if (!fs.existsSync('./firestore.indexes.json')) {
    fs.writeFileSync('./firestore.indexes.json', JSON.stringify({ indexes: [], fieldOverrides: [] }, null, 2));
    console.log('✅ Created firestore.indexes.json');
  }
}

// Deploy process
console.log('\n🔶 Deploying Firestore security rules...');
console.log('You may need to authenticate with Firebase if you haven\'t already.\n');

try {
  // Deploy only Firestore rules
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('\n✅ Successfully deployed Firestore security rules!');
  console.log('\nNow you can reload your application, and the permission errors should be resolved.');
} catch (deployError) {
  console.error('\n❌ Failed to deploy Firestore rules.');
  console.error('Make sure you\'re logged in to Firebase and have the correct permissions.');
  console.error('Run: firebase login');
} 