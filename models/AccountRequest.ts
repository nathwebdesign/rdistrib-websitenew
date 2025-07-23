import mongoose from 'mongoose'

const AccountRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  company_name: String,
  contact_person: { type: String, required: true },
  phone: String,
  address: String,
  postal_code: String,
  city: String,
  siret: String,
  message: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },
  rejection_reason: String,
  created_at: { type: Date, default: Date.now }
})

export default mongoose.models.AccountRequest || mongoose.model('AccountRequest', AccountRequestSchema)