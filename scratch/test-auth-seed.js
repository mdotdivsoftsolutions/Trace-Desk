const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://mdotdiv_db_user:w5ZAGJaNJmHVyCko@cluster0.sa3lpwc.mongodb.net/trace_desk?retryWrites=true&w=majority';

async function testSeed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
    status: String,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const email = 'manum66466@gmail.com';
  let user = await User.findOne({ email });
  if (!user) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Manumanoj$14', salt);
    user = await User.create({
      name: 'Manu .M (M.Div SoftSolutions )',
      email,
      passwordHash,
      role: 'super_admin',
      status: 'active'
    });
    console.log('Seeded Super Admin User in MongoDB!');
  } else {
    console.log('Super Admin already exists:', user.email, user.role);
  }

  const isMatch = await bcrypt.compare('Manumanoj$14', user.passwordHash);
  console.log('Password verification:', isMatch);

  await mongoose.disconnect();
}

testSeed().catch(console.error);
