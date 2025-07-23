import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    contact_person: String,
    company_name: String,
    phone: String,
    address: String,
    postal_code: String,
    city: String,
    siret: String
  },
  is_approved: { type: Boolean, default: true },
  is_admin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)