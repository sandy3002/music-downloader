# YouTube Music Downloader

A full-stack web application for downloading YouTube videos as audio files. Built with Node.js/Express backend and vanilla JavaScript frontend. **Optimized for serverless deployment on Vercel and Netlify - no FFmpeg or homebrew dependencies required!**

## 🌟 Features

- Download YouTube videos as high-quality audio files (M4A format)
- Video information preview (title, duration, thumbnail)
- Clean and responsive UI
- Separate frontend and backend for easy deployment
- Automatic cleanup of old downloaded files
- URL validation
- **Uses yt-dlp** - the most reliable YouTube downloader
- More stable than ytdl-core alternatives

## 📁 Project Structure

```
music-downloader/
├── backend/          # Express.js server
│   ├── server.js     # Main server file
│   ├── package.json
│   └── README.md
├── frontend/         # Vite-powered frontend
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   ├── package.json
│   └── README.md
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)

### Installation

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server (in the `backend` directory):

```bash
npm run dev
```

Server will run on http://localhost:3001

2. Start the frontend (in the `frontend` directory):

```bash
npm run dev
```

Frontend will open at http://localhost:3000

## 🎯 Usage

1. Open the frontend at http://localhost:3000
2. Paste a YouTube video URL
3. Click "Download Audio"
4. Wait for the download to complete
5. Download your audio file (M4A format - high quality, universally compatible)

## 📦 Deployment

### Backend Deployment

The backend can be deployed to:

- **Vercel** (Recommended for serverless)
- **Netlify** (Using Netlify Functions)
- **Railway** (Easiest - direct Git deployment)
- **Render**
- **Heroku**

Make sure to:

1. Set the `PORT` environment variable if needed
2. Configure CORS for your frontend domain
3. For Vercel: May need to adapt to serverless functions
4. For Railway/Render: Direct deployment works out of the box

### Frontend Deployment

The frontend can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Steps:

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update `API_BASE_URL` in `main.js` to point to your backend

## ⚠️ Important Notes

- Only download content you have the right to use
- Downloaded files are automatically deleted after 1 hour
- Large videos may take longer to process
- Audio is downloaded in M4A format (AAC codec - best quality and compatibility)
- Uses yt-dlp which is more stable and actively maintained than ytdl-core
- First download after installation may take a moment as yt-dlp binary is set up

## 🛠️ Technologies Used

### Backend

- Express.js - Web framework
- @distube/ytdl-core - YouTube downloader (no FFmpeg needed)
- CORS - Cross-origin resource sharing

### Frontend

- Vite - Build tool
- Axios - HTTP client
- Vanilla JavaScript
- CSS3 with animations

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚡ Troubleshooting

**First download is slow:**
The yt-dlp binary needs to be set up on first run. Subsequent downloads will be faster.

**CORS errors:**
Check that the backend CORS configuration allows your frontend domain.

**Download fails:**
Some videos may be protected or unavailable. Try a different video. yt-dlp handles most cases better than alternatives.

**Port already in use:**
Change the port in the respective config files (backend: server.js, frontend: vite.config.js).

**M4A compatibility:**
M4A files work on all modern devices and media players (iOS, Android, Windows, macOS, Linux).
