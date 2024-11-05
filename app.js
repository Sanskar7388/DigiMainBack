const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
app.use(express.json());

// Connecting to MongoDB
const db_link = 'mongodb+srv://admin:0flIojNBKiH3GWqz@cluster0.pmzyv0q.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
    .then(() => {
        console.log('db_connected');
        // insertDummyData(); // Insert dummy data after DB connection
    })
    .catch(err => console.log(err));

// Creating User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const UserData = mongoose.model("DigiUsers", userSchema);

// Creating Device schema
const deviceSchema = new mongoose.Schema({
    deviceName: String,
    deviceType: String,
    status: { type: String, default: "offline" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "DigiUsers" } // Reference to the user who owns the device
});
const Device = mongoose.model("Devices", deviceSchema);
// Creatinng the result Schema
const resultSchema= new mongoose.Schema({
    name:String,
    opticalResolution:String,
    iss:String,
    concentration:String,
    brix:String,
    ploPercent:String,
    purity:String,
    date:String,

});
const DeviceResult = mongoose.model("result",resultSchema);

// Define a route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Register User
app.post('/register', async (req, res) => {
    try {
        const newUser = new UserData(req.body);  // Create a new user from request body
        await newUser.save();  // Save the new user to MongoDB
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(400).json({ error: 'Error creating user', details: err.message });
    }
});

// Login User
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    UserData.findOne({ email: email })
        .then(user => {
            if (user) {
                // Check if password matches
                if (user.password === password) {
                    res.json({ message: "Success", userId: user._id , userName:user.name});  // Send userId to frontend
                } else {
                    res.json({ message: "The password is incorrect" });
                }
            } else {
                res.json({ message: "No user exists" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error finding user" });
        });
});

// Add Device for a User
app.post('/api/user/devices/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        const newDevice = new Device({ ...req.body, userId });  // Create a new device with userId
        await newDevice.save();  // Save the device to MongoDB
        res.status(201).json({ success: "Device added successfully", device: newDevice });
    } catch (err) {
        res.status(400).json({ error: 'Error adding device', details: err.message });
    }
});

app.post('/api/user/devices/:name', async (req, res) => {
    const {  name } = req.params;
});
// Fetch Devices for a Specific User
app.get('/api/user/devices/:id', async (req, res) => {
    const userId = req.params.id;  // Extract userId from the route parameter

    try {
        const devices = await Device.find({ userId: userId });  // Find devices for the user
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch devices" });
    }
});


// Route to insert 10 manual DeviceResult records
app.get('/api/devices/results/dummy', async (req, res) => {
    console.log("updationg")
    try {
        const dummyData = [
            {
                "name": "Sanskar Sengar",
                "opticalResolution": "12.612",
                "iss": "72.645",
                "concentration": "18.912",
                "brix": "19",
                "ploPercent": "17.68",
                "purity": "92.1",
                "date": "19-10-2024",
                "time":"10:30:20"
            },
            {
                "name": "Tasty Cotton Chair",
                "opticalResolution": "12.281",
                "iss": "70.738",
                "concentration": "18.321",
                "brix": "18.6",
                "ploPercent": "16.87",
                "purity": "91.4",
                "date": "15-10-2024",
                "time":"15:22:34"
            },
            {
                "name": "Handcrafted Rubber Table",
                "opticalResolution": "13.612",
                "iss": "78.405",
                "concentration": "20.461",
                "brix": "20.3",
                "ploPercent": "18.93",
                "purity": "92.6",
                "date": "15-10-2024",
                "time":"15:12:02"
            },
            {
                "name": "Licensed Steel Car",
                "opticalResolution": "13.291",
                "iss": "76.556",
                "concentration": "3.87",
                "brix": "19.9",
                "ploPercent": "18.35",
                "purity": "92",
                "date": "14-10-2024",
                "time":"13:11:33"
            },
            {
                "name": "Ergonomic Plastic Hat",
                "opticalResolution": "12.551",
                "iss": "72.293",
                "concentration": "2.43",
                "brix": "19.3",
                "ploPercent": "18.35",
                "purity": "90.2",
                "date": "14-10-2024",
                "time":"14:11:23"
            },
            {
                "name": "Unbranded Concrete Shoes",
                "opticalResolution": "82.44",
                "iss": "9.23",
                "concentration": "4.65",
                "brix": "13.67",
                "ploPercent": "47.20",
                "purity": "95.05",
                "date": "2022-09-19"
            },
            {
                "name": "Incredible Wooden Pizza",
                "opticalResolution": "65.87",
                "iss": "7.01",
                "concentration": "2.99",
                "brix": "9.78",
                "ploPercent": "53.45",
                "purity": "88.56",
                "date": "2023-06-30"
            },
            {
                "name": "Fantastic Soft Keyboard",
                "opticalResolution": "58.12",
                "iss": "8.75",
                "concentration": "3.23",
                "brix": "11.11",
                "ploPercent": "46.82",
                "purity": "94.20",
                "date": "2021-08-05"
            },
            {
                "name": "Practical Cotton Gloves",
                "opticalResolution": "75.39",
                "iss": "6.12",
                "concentration": "4.12",
                "brix": "17.89",
                "ploPercent": "49.75",
                "purity": "80.42",
                "date": "2022-12-11"
            },
            {
                "name": "Small Soft Chair",
                "opticalResolution": "70.98",
                "iss": "5.89",
                "concentration": "3.54",
                "brix": "14.33",
                "ploPercent": "37.20",
                "purity": "91.10",
                "date": "2021-04-21"
            }
        ];

          // Insert the dummy records
        res.status(201).json({ message: "10 manual dummy records added", data: dummyData });
    } catch (error) {
        res.status(500).json({ error: "Error adding dummy data", details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
