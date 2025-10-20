# Music Downloader Backend

Backend server for downloading YouTube videos as audio files (M4A format).

## Prerequisites

- Node.js (v16 or higher)
- The `youtube-dl-exec` package will automatically download yt-dlp binary on installation

## Installation

```bash
npm install
```

## Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on http://localhost:3001

## API Endpoints

### POST /api/validate

Validate a YouTube URL and get video information.

**Request:**

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**

```json
{
  "valid": true,
  "title": "Video Title",
  "duration": "240",
  "thumbnail": "thumbnail_url"
}
```

### POST /api/download

Download audio from YouTube video as M4A.

**Request:**

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**

```json
{
  "success": true,
  "downloadUrl": "/api/file/filename.m4a",
  "fileName": "Video_Title.m4a"
}
```

### GET /api/file/:fileName

Download the audio file.

### GET /api/health

Health check endpoint.

## Environment Variables

- `PORT` - Server port (default: 3001)

## Deployment

This backend can be deployed to:

- **Railway** - Direct deployment (Recommended - works out of the box)
- **Render** - Direct deployment
- **Heroku** - Direct deployment
- **DigitalOcean App Platform**

**Note:** Vercel and Netlify have limitations with binary executables, so Railway or Render are recommended for this app.

## Notes

- Downloaded files are automatically deleted after 1 hour
- Audio is downloaded in M4A format (best quality, widely supported)
- Uses yt-dlp which is more reliable than ytdl-core
- CORS is enabled for all origins in development
- The yt-dlp binary is automatically downloaded during installation
