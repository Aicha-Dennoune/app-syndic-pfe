const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config(); // Charge les variables d'environnement

let serviceAccount;

try {
  const base64Encoded = process.env.GOOGLE_CREDENTIALS_BASE64;

  if (!base64Encoded) {
    throw new Error("La variable d'environnement GOOGLE_CREDENTIALS_BASE64 est vide ou non définie.");
  }

  const jsonString = Buffer.from(base64Encoded, 'base64').toString('utf8');
  serviceAccount = JSON.parse(jsonString);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://pfe-project-97821.firebaseio.com`
  });

  console.log(' Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error(' Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();

db.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true
});

const testFirestoreConnection = async () => {
  try {
    await db.listCollections();
    console.log(' Successfully connected to Firestore');
    return true;
  } catch (error) {
    console.error(' Firestore connection error:', error.message);
    console.log('Assure-toi d\'avoir bien créé une base Firestore ici :');
    console.log('https://console.firebase.google.com/project/pfe-project-97821/firestore');
    return false;
  }
};

testFirestoreConnection();

module.exports = { admin, db };
