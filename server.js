const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data file path
const dataFile = path.join(__dirname, 'registrations.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Email configuration (update with your email details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Register endpoint
app.post('/api/register', (req, res) => {
    try {
        const { name, fatherName, mobile, class: studentClass, timestamp } = req.body;
        
        // Validation
        if (!name || !fatherName || !mobile || !studentClass) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Read existing data
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        
        // Add new registration
        const registration = {
            id: Date.now(),
            name,
            fatherName,
            mobile,
            class: studentClass,
            timestamp: timestamp || new Date().toISOString()
        };
        
        data.push(registration);
        
        // Save to file
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        
        // Send email notification (optional)
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@ntregistration.com',
            to: process.env.ADMIN_EMAIL || 'admin@example.com',
            subject: 'New NT Registration',
            html: `
                <h2>New Registration Received</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Father's Name:</strong> ${fatherName}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Class:</strong> ${studentClass}</p>
                <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            `
        };
        
        // Send email (if configured)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log('Email error:', error);
                else console.log('Email sent:', info.response);
            });
        }
        
        res.json({ success: true, message: 'Registration successful', data: registration });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all registrations (protected - add authentication in production)
app.get('/api/registrations', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error reading registrations' });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`NT Registration server running on port ${PORT}`);
});