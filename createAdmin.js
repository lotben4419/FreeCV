const bcrypt = require('bcrypt');
const { Admin } = require('./src/models');

async function createAdmin() {
    const email = 'admin@example.com';
    const password = 'NouveauMotDePasse'; // Changez ceci par le mot de passe désiré
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const admin = await Admin.create({
            email,
            password: hashedPassword
        });
        console.log('Admin created:', admin);
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

createAdmin();
