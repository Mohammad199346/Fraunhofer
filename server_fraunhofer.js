const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
//const port = 3000;
const port = process.env.PORT || 3000;


app.use(express.json()); // for parsing application/json

// Read the initial game state from file, or set it to an empty object if the file does not exist.
let gameState = {};
const gameStateFilePath = 'gameState_Fraunhofer.json';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to save data to JSON file
const saveDataToFile = (data) => {
  fs.writeFile(gameStateFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
          console.error('Error writing to file', err);
      } else {
          console.log('Data saved to conveyorStatus.json');
      }
  });
};

app.post('/updateConveyorsState', (req, res) => {
  const { Conveyor1 } = req.body;

  if (Conveyor1 && typeof Conveyor1.status === 'string') {
      console.log('Received previous conveyor status:', Conveyor1.status);

      // Save the received status to a file
      saveDataToFile({ Conveyor1: { status: Conveyor1.status } });

      res.status(200).json({ message: 'Conveyor status updated successfully!', receivedData: req.body });
  } else {
      console.log('Invalid data received:', req.body);
      res.status(400).json({ message: 'Invalid data received' });
  }
});

// Endpoint to retrieve conveyor state
app.get('/getConveyorsState', (req, res) => {
  fs.readFile(gameStateFilePath, (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          res.status(500).json({ message: 'Error reading file' });
      } else {
          const conveyorData = JSON.parse(data);
          res.json(conveyorData);
      }
  });
});