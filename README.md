# NT Registration Website

A simple and elegant registration form for NT (National Test) students to submit their information.

## Features

- **Simple Registration Form** - Collect student name, father's name, mobile number, and current class
- **Data Storage** - Saves all registrations to a JSON file
- **Email Notifications** - Optional email notifications to admin when new registrations come in
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Local Storage** - Browser-based storage for form data

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Run Locally
```bash
npm start
```
The server will run on `http://localhost:3000`

### Environment Variables
Create a `.env` file with:
```
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com
```

## File Structure

- `index.html` - Frontend registration form
- `server.js` - Backend server to handle registrations
- `package.json` - Project dependencies
- `registrations.json` - Stored registration data

## API Endpoints

### POST /api/register
Submit a new registration

**Request Body:**
```json
{
  "name": "Student Name",
  "fatherName": "Father Name",
  "mobile": "1234567890",
  "class": "10th"
}
```

### GET /api/registrations
Retrieve all registrations (admin access)

## Deployment

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to GitHub Pages (Frontend only)
```bash
git subtree push --prefix . origin gh-pages
```

## License

MIT
