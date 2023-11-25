const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const UserFormData = require('./models/formData');
const app = express();

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

 //Create a Mongoose Schema and Model

const FormData = mongoose.model('FormData', {
  name: String,
  course: String,  
  category: String,
  fees: Number
});

mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', async (req, res) => {
    const { name, course, category, fees } = req.body;
    const formData = new FormData({ name, course, category, fees });
  
    try {
      await formData.save();
      res.send('Data saved successfully');
    } catch (error) {
      console.error(error);
      res.send('Error saving data');
    }
  });

 

  // Search and Update Route
app.get('/search', (req, res) => {
    res.render('search');
  });
  
  app.post('/search', async (req, res) => {
    const { name } = req.body;
  
    try {
        const formData = await FormData.findOne({ name });
      if (!formData) {
        return res.send('No data found for the provided name.');
      }
  
      // Calculate remaining fees
      const remainingFees = 20000 - formData.fees;
  
      res.render('searchResult', { formData, remainingFees });
    } catch (error) {
      console.error(error);
      res.send('Error searching for data.');
    }
  });
  
  app.post('/updateFees', async (req, res) => {
    const { name, feesToAdd } = req.body;
  
    try {
        const formData = await FormData.findOne({ name });
      if (!formData) {
        return res.send('No data found for the provided name.');
      }
  
      // Update fees
      formData.fees += parseInt(feesToAdd, 10);
      await formData.save();
  
      res.send('Fees updated successfully.');
    } catch (error) {
      console.error(error);
      res.send('Error updating fees.');
    }
  });
  

// Start the server

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
