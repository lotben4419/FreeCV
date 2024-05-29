const bcrypt = require('bcrypt');

const password = 'NouveauMotDePasse'; // Le mot de passe en clair que vous voulez hacher

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});
