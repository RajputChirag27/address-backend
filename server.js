const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/addressDB').then(console.log("App connected Successfully")).catch(console.log("Error in connectiong to the database"));

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String
});

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  addresses: [addressSchema]
});

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/users', async (req, res) => {
    const {userName, email, addresses} = req.body;
    const sanitizedBody = {userName, email, addresses};
  console.log(req.body)
  console.log(sanitizedBody)
  const user = new User(sanitizedBody);
  await user.save();
  res.send(user);
});

app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(user);
});

app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({ message: 'User deleted' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
