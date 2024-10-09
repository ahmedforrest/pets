// Import the database configuration and connection from the 'db.js' file
const db = require('./db');

// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define the port number the server will listen on
const port = 3000;

// Middleware to parse JSON bodies from incoming requests
// This must come before your route handlers
app.use(express.json());

// Define a GET route for the root URL ('/')
app.get('/', (req, res) => {
  // Send a plain text response of 'Hello World!'
  res.send('welcome to the pets API check /pets and perform your CRUD');
});

// Start the server and have it listen on the specified port
app.listen(port, () => {
  // Log a message to the console indicating the server is running
  console.log(`Example app listening on port ${port}`);
});

// Create a new pet
// Define a POST route to handle creating a new pet
app.post('/pets', async (req, res) => {
  // Destructure 'name' and 'type' from the request body
  const { name, type } = req.body;

  // Check if 'name' or 'type' is missing from the request body
  if (!name || !type) {
    // Respond with a 400 Bad Request status code and an error message
    return res.status(400).json({ error: 'Name and type are required.' });
  }

  try {
    // Insert a new pet into the 'pets' table and get the generated ID
    const [id] = await db('pets').insert({ name, type });
    // Retrieve the newly created pet from the database
    const newPet = await db('pets').where({ id }).first();
    // Respond with a 201 Created status code and the new pet data in JSON format
    res.status(201).json(newPet);
  } catch (err) {
    // If an error occurs, respond with a 500 Internal Server Error status code and an error message
    res.status(500).json({ error: 'Failed to create pet.' });
  }
});

// Get all pets
// Define a GET route to retrieve all pets from the database
app.get('/pets', async (req, res) => {
  try {
    // Select all records from the 'pets' table
    const pets = await db('pets').select('*');
    // Respond with the list of pets in JSON format
    res.json(pets);
  } catch (err) {
    // If an error occurs, respond with a 500 Internal Server Error status code and an error message
    res.status(500).json({ error: 'Failed to retrieve pets.' });
  }
});

// Get a single pet by ID
// Define a GET route to retrieve a specific pet by its ID
app.get('/pets/:id', async (req, res) => {
  // Extract the 'id' parameter from the request URL
  const { id } = req.params;

  try {
    // Query the database for a pet with the specified ID
    const pet = await db('pets').where({ id }).first();

    // Check if the pet was found
    if (pet) {
      // Respond with the pet data in JSON format
      res.json(pet);
    } else {
      // If the pet was not found, respond with a 404 Not Found status code and an error message
      res.status(404).json({ error: 'Pet not found.' });
    }
  } catch (err) {
    // If an error occurs, respond with a 500 Internal Server Error status code and an error message
    res.status(500).json({ error: 'Failed to retrieve pet.' });
  }
});

// Update a pet by ID
// Define a PUT route to update a specific pet by its ID
app.put('/pets/:id', async (req, res) => {
  // Extract the 'id' parameter from the request URL
  const { id } = req.params;
  // Destructure 'name' and 'type' from the request body
  const { name, type } = req.body;

  // Check if neither 'name' nor 'type' is provided in the request body
  if (!name && !type) {
    // Respond with a 400 Bad Request status code and an error message
    return res.status(400).json({ error: 'At least one of name or type is required.' });
  }

  try {
    // Update the pet record with the specified ID in the database
    const updatedRows = await db('pets').where({ id }).update({ name, type });

    // Check if any records were updated
    if (updatedRows) {
      // Retrieve the updated pet data from the database
      const updatedPet = await db('pets').where({ id }).first();
      // Respond with the updated pet data in JSON format
      res.json(updatedPet);
    } else {
      // If the pet was not found, respond with a 404 Not Found status code and an error message
      res.status(404).json({ error: 'Pet not found.' });
    }
  } catch (err) {
    // If an error occurs, respond with a 500 Internal Server Error status code and an error message
    res.status(500).json({ error: 'Failed to update pet.' });
  }
});

// Delete a pet by ID
// Define a DELETE route to remove a specific pet by its ID
app.delete('/pets/:id', async (req, res) => {
  // Extract the 'id' parameter from the request URL
  const { id } = req.params;

  try {
    // Delete the pet record with the specified ID from the database
    const deletedRows = await db('pets').where({ id }).del();

    // Check if any records were deleted
    if (deletedRows) {
      // Respond with a success message in JSON format
      res.json({ message: 'Pet deleted successfully.' });
    } else {
      // If the pet was not found, respond with a 404 Not Found status code and an error message
      res.status(404).json({ error: 'Pet not found.' });
    }
  } catch (err) {
    // If an error occurs, respond with a 500 Internal Server Error status code and an error message
    res.status(500).json({ error: 'Failed to delete pet.' });
  }
});
