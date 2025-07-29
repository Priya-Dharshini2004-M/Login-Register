const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // to allow requests from frontend
app.use(bodyParser.json()); // to parse JSON bodies

mongoose.connect('mongodb+srv://drpdharshini2000:drpdharshini2000@cluster0.lqnzgra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
.then(()=>{
    console.log("DB is connected...!")
})
.catch((err)=>{
    console.log(err)
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10); // hash password
  const user = new User({ username, password: hashedPass });
  await user.save();
  res.send({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send({ message: 'Invalid credentials' });

  res.send({ message: 'Login successful' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
