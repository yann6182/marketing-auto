// utils.js
function generateRandomPassword() {
    return Math.random().toString(36).slice(-8); // Génère un mot de passe aléatoire
  }
  
  module.exports = {
    generateRandomPassword,
  };