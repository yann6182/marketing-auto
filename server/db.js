const { MongoClient } = require('mongodb');
require('dotenv').config();

// Configuration de la base de données
const config = {
  url: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
};

// Fonction pour se connecter à la base de données et initialiser les collections si nécessaire
async function connectAndInitializeDatabase() {
  let client;

  try {
    // Connexion à la base de données
    client = new MongoClient(config.url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(config.dbName);

    // Vérification et création des collections si elles n'existent pas
    await createCollections(db);

    console.log("All collections checked/created");
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    // Fermez la connexion à la base de données
    if (client) {
      await client.close();
    }
  }
}

// Fonction pour créer les collections si elles n'existent pas
async function createCollections(db) {
  try {
    // Vérifier si la collection 'users' existe et créer l'index si nécessaire
    const usersCollection = await db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("Index 'email' created on collection 'users'");

    // Vérifier si la collection 'clients' existe et créer l'index si nécessaire
    const clientsCollection = await db.collection('clients');
    await clientsCollection.createIndex({ user_id: 1 });
    console.log("Index 'user_id' created on collection 'clients'");

    // Vérifier si la collection 'campaigns' existe et créer l'index si nécessaire
    const campaignsCollection = await db.collection('campaigns');
    await campaignsCollection.createIndex({ user_id: 1 });
    console.log("Index 'user_id' created on collection 'campaigns'");
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Appel de la fonction pour se connecter à la base de données et initialiser les collections
connectAndInitializeDatabase();

// Export des fonctions ou objets nécessaires pour être utilisés dans d'autres parties du code si nécessaire
module.exports = {
  connectAndInitializeDatabase, // Vous pouvez exporter cette fonction pour l'utiliser dans d'autres parties de votre application si nécessaire
};
