// Import required libraries and modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Set up body-parser middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose (replace 'mongodb://localhost:27017/yourdb' with your MongoDB connection string)
mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose schema for user data
const userSchema = new mongoose.Schema({
  name: String,
  course: String,
  category: String,
  fees: Number,
  totalFees: Number,
});

// Create a Mongoose model for user data
const User = mongoose.model('User', userSchema);

// Define routes

// Route to display the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route to handle user registration
app.post('/register', (req, res) => {
  const { name, course, category, fees, totalFees } = req.body;

  // Create a new user document
  const newUser = new User({
    name,
    course,
    category,
    fees,
    totalFees,
  });

  // Save the user document to the database
  newUser.save()
    .then(() => {
      res.send('User registered successfully');
    })
    .catch(err => {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user');
    });
});

// Route to handle user search
app.post('/search', async (req, res) => {
  try {
    const { name } = req.body;

    // Search for a user by name in the database
    const formData = await User.findOne({ name });

    if (!formData) {
      console.log('No data found for the provided name:', name);
      res.send('No data found for the provided name.');
    } else {
      const remainingFees = formData.totalFees - formData.fees;
      res.render('searchResult', { formData, remainingFees });
    }
  } catch (error) {
    console.error('Error searching for data:', error);
    res.send('Error searching for data.');
  }
});

// Route to handle fee update
app.post('/updateFees', async (req, res) => {
  try {
    const { name, feesToAdd } = req.body;

    // Find the user by name
    const formData = await User.findOne({ name });

    if (!formData) {
      console.log('No data found for the provided name:', name);
      res.send('No data found for the provided name.');
    } else {
      // Update the fees
      formData.fees += parseInt(feesToAdd, 10);

      // Save the updated data to the database
      await formData.save();

      // Redirect to the search result page
      res.redirect(`/searchResult?name=${formData.name}`);
    }
  } catch (error) {
    console.error('Error updating fees:', error);
    res.send('Error updating fees.');
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
