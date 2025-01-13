const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // for parsing application/json
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Read the initial game state from file, or set it to an empty object if the file does not exist.
const gameStateFilePath = 'gameState_Fraunhofer-FAU.json';
let gameState = {};

// Load the initial game state from the file
  if (fs.existsSync(gameStateFilePath)) {
      const rawData = fs.readFileSync(gameStateFilePath);
      gameState = JSON.parse(rawData);
  } else {
      gameState = {
          "Conveyor1": {
              "sensor1": "0",
              "motor": "0",
              "speed": "7"
          },
          "Conveyor3": {
              "sensor3": "0",
              "motor": "0",
              "speed": "7"
          },
        "Conveyor4": {
              "sensor4": "0",
              "motor": "0",
              "speed": "7"
          
          },
          "Conveyor2": {
              "motor": "0",
              "speed": "7"
          },
          "mConveyor1":{
              "motor": "0"
          },
          "mConveyor2":{
              "motor": "0"
          },
          "mConveyor3":{
              "motor": "0"
          }
        
      };
      fs.writeFileSync(gameStateFilePath, JSON.stringify(gameState, null, 2));
  }
  
  // Function to save data to JSON file
  const saveDataToFile = (data) => {
      fs.writeFile(gameStateFilePath, JSON.stringify(data, null, 2), (err) => {
          if (err) {
              console.error('Error writing to file', err);
          } else {
              console.log('Data saved to', gameStateFilePath);
          }
      });
  };
  
  // Endpoint to retrieve all conveyors state
  app.get('/getConveyorsState', (req, res) => {
    res.json(gameState);
}); 


  // Initialize an empty array to store workspace data
  let storedWorkspaceData = [];
  
  // Initialize an empty array to store Scene2 elements
  let scene2Elements = [];
  
  // Initialize an empty array to store Conveyors elements
  let conveyorsElements = [];

 // Initialize an empty array to store Middle Conveyors elements
  let middleConveyorsElements = [];
  
  app.post('/Workspace', (req, res) => {
    const receivedWorkspaceData = req.body;
    
    // Assuming receivedWorkspaceData is an array of item names
    // Process the received data as needed
    console.log('Received Workspace data:', receivedWorkspaceData);
    
    // Store the received data in the array
    storedWorkspaceData = receivedWorkspaceData;
    
    // Respond with a success message
    res.json({ message: 'Workspace data received successfully' });
});

app.get('/Workspace', (req, res) => {
  // Retrieve and send the stored workspace data in the response
  res.json({ storedWorkspaceData });
});

// Endpoint to update the Scene2 Elements
app.post('/Workspace/Scene2', (req, res) => {
    const receivedScene2Elements = req.body;
  
    // Assuming receivedScene1Elements is an array of names scene elements
    // Process the received data as needed
    console.log('Received Scene2 data:', receivedScene2Elements);
  
    // Store the received data in the array
    scene2Elements = receivedScene2Elements;
  
    // Respond with a success message
    res.json({ message: 'Scene2 data received successfully' });
  });
  
  
  // Endpoint to update the Conveyors Elements
  app.post('/Workspace/Scene2/Conveyors', (req, res) => {
    const receivedConveyorsElements = req.body;
  
    // Assuming receivedConveyorsElements is an array of conveyors names
    // Process the received data as needed
    console.log('Received Conveyors data:', receivedConveyorsElements);
  
    // Store the received data in the array
    conveyorsElements = receivedConveyorsElements;
  
    // Respond with a success message
    res.json({ message: 'Conveyors data received successfully' });
  });
  
// Endpoint to update the Middle Conveyors Elements
  app.post('/Workspace/Scene2/MiddleConveyors', (req, res) => {
    const receivedMiddleConveyorsElements = req.body;
  
    // Assuming receivedConveyorsElements is an array of conveyors names
    // Process the received data as needed
    console.log('Received Middle Conveyors data:', receivedMiddleConveyorsElements);
  
    // Store the received data in the array
    middleConveyorsElements = receivedMiddleConveyorsElements;
  
    // Respond with a success message
    res.json({ message: 'Middle Conveyors data received successfully' });
  });
  
  // Endpoint to retrieve the Scene2 elements
  app.get('/Workspace/Scene2', (req, res) => {
    // Retrieve and send the stored scene2 names in the response
    res.json({ scene2Elements });
  });
  
  
  // Endpoint to retrieve the Conveyors elements
  app.get('/Workspace/Scene2/Conveyors', (req, res) => {
    // Retrieve and send the stored conveyors names in the response
    res.json({ conveyorsElements });
  });

// Endpoint to retrieve the Middle Conveyors names
app.get('/Workspace/Scene2/MiddleConveyors', (req, res) => {
  // Assuming `gameState` is defined globally or imported in this file
  // Extract only the names of middle conveyors
  const middleConveyorsNames = Object.keys(gameState)
    .filter(key => key.startsWith("mConveyor")); // Find keys starting with "mConveyor"

  // Send the filtered names in the response
  res.json({ middleConveyorsNames });
});



  // Endpoint to retrieve the Conveyors states
  app.get('/getConveyorsState', (req, res) => {
    // Retrieve and send the stored conveyors names in the response
    res.json({ conveyorsElements });
  });

// Endpoint to retrieve the Middle Conveyors states
  app.get('/getMiddleConveyorsState', (req, res) => {
    // Retrieve and send the stored conveyors names in the response
    res.json({ middleConveyorsElements });
  });



  // Endpoint to update conveyor motor status, speed and interval
  app.put('/Workspace/Scene2/Conveyors/:id', (req, res) => {
      const conveyorId = req.params.id;
      const conveyorData = req.body[conveyorId]; // Adjusted to access the specific conveyor data
  
      if (gameState[conveyorId]) {
          if (conveyorData) { // Check if conveyorData is not undefined
              // Preserve existing values if not provided in the request
              gameState[conveyorId].motor = conveyorData.motor !== undefined ? conveyorData.motor : gameState[conveyorId].motor;
              gameState[conveyorId].speed = conveyorData.speed !== undefined ? conveyorData.speed : gameState[conveyorId].speed;
              //gameState[conveyorId].interval = conveyorData.interval !== undefined ? conveyorData.interval : gameState[conveyorId].interval;
  
              // Save the updated state to the file
              saveDataToFile(gameState);
              return res.status(200).json({ message: `${conveyorId} motor status, speed and status updated successfully!`, receivedData: req.body });
          } else {
              return res.status(400).json({ message: `Invalid data structure for conveyor ${conveyorId}` });
          }
      } else {
          res.status(404).json({ message: `Conveyor ${conveyorId} not found` });
      }
  });

// Endpoint to update middle conveyor motor status
  app.put('/Workspace/Scene2/MiddleConveyors/:id', (req, res) => {
      const middleConveyorId = req.params.id;
      const middleConveyorData = req.body[middleConveyorId]; // Adjusted to access the specific conveyor data
  
      if (gameState[middleConveyorId]) {
          if (middleConveyorData) { // Check if conveyorData is not undefined
              // Preserve existing values if not provided in the request
              gameState[middleConveyorId].motor = middleConveyorData.motor !== undefined ? middleConveyorData.motor : gameState[middleConveyorId].motor;
              //gameState[conveyorId].speed = conveyorData.speed !== undefined ? conveyorData.speed : gameState[conveyorId].speed;
              //gameState[conveyorId].interval = conveyorData.interval !== undefined ? conveyorData.interval : gameState[conveyorId].interval;
  
              // Save the updated state to the file
              saveDataToFile(gameState);
              return res.status(200).json({ message: `${middleConveyorId} motor status updated successfully!`, receivedData: req.body });
          } else {
              return res.status(400).json({ message: `Invalid data structure for middle conveyor ${middleConveyorId}` });
          }
      } else {
          res.status(404).json({ message: `Conveyor ${middleConveyorId} not found` });
      }
  });

  // Endpoint to update sensor statuses
  app.post('/updateConveyorsSensorsStates', (req, res) => {
    const { Conveyor1, Conveyor3, Conveyor4 } = req.body;

    if (Conveyor1 && Conveyor1.sensor !== undefined) {
        gameState.Conveyor1.sensor = Conveyor1.sensor;
    }
    if (Conveyor3 && Conveyor3.sensor !== undefined) {
        gameState.Conveyor3.sensor = Conveyor3.sensor;
    }
    if (Conveyor4 && Conveyor4.sensor !== undefined) {
        gameState.Conveyor4.sensor = Conveyor4.sensor;
    }

    // Save the updated state to the file
    saveDataToFile(gameState);

    res.status(200).json({ message: 'Sensor statuses updated successfully!', receivedData: req.body });
});

// Endpoint to retrieve the specific conveyor data
app.get('/Workspace/Scene2/Conveyors/:id', (req, res) => {
    const conveyorId = req.params.id;

    if (gameState[conveyorId]) {
        // Retrieve and send the data for the specific conveyor in the response
        const conveyorData = {
            name: conveyorId,
            sensor: gameState[conveyorId].sensor || 'Sensor not available',
            motor: gameState[conveyorId].motor || 'Motor not available',
            speed: gameState[conveyorId].speed || 'Speed not available'
            //interval: gameState[conveyorId].interval || 'Interval not available'
        };
        res.json(conveyorData);
    } else {
        res.status(404).json({ message: `Conveyor ${conveyorId} not found` });
    }
});

// Endpoint to retrieve the sensor data for a specific conveyor
app.get('/Workspace/Scene2/Conveyors/:id/sensor', (req, res) => {
    const conveyorId = req.params.id;

    if (gameState[conveyorId]) {
        // Retrieve and send only the sensor data for the specific conveyor in the response
        const sensorData = {
            name: conveyorId,
            sensor: gameState[conveyorId].sensor || 'Sensor not available'
        };
        res.json(sensorData);
    } else {
        res.status(404).json({ message: `Conveyor ${conveyorId} not found` });
    }
});


// Endpoint to retrieve the specific middle conveyor data
app.get('/Workspace/Scene2/MiddleConveyors/:id', (req, res) => {
    const middleConveyorId = req.params.id;

    if (gameState[middleConveyorId]) {
        // Retrieve and send the data for the specific conveyor in the response
        const middleConveyorData = {
            name: middleConveyorId,
            //sensor: gameState[conveyorId].sensor || 'Sensor not available',
            motor: gameState[middleConveyorId].motor || 'Motor not available',
            //speed: gameState[conveyorId].speed || 'Speed not available',
            //interval: gameState[conveyorId].interval || 'Interval not available'
        };
        res.json(middleConveyorData);
    } else {
        res.status(404).json({ message: `Conveyor ${middleConveyorId} not found` });
    }
});

// Server listener
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});