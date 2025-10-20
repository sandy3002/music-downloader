import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// Clean up old files (older than 5 minutes)
const cleanupOldFiles = () => {
  const files = fs.readdirSync(downloadsDir);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  files.forEach((file) => {
    const filePath = path.join(downloadsDir, file);
    try {
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > fiveMinutes) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old file: ${file}`);
      }
    } catch (err) {
      console.error(`Error checking/removing file ${file}:`, err);
    }
  });
};

// Run cleanup every 1 minute
setInterval(cleanupOldFiles, 1 * 60 * 1000);

// Helper function to validate YouTube URL
function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}

// Validate YouTube URL
app.post('/api/validate', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // Get video info using yt-dlp
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    });

    res.json({
      valid: true,
      title: info.title,
      duration: info.duration,
      thumbnail: info.thumbnail,
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Failed to fetch video information' });
  }
});

// Download audio
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // Get video info first
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
    });

    const title = info.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    const fileName = `${uuidv4()}_${title}.m4a`;
    const outputPath = path.join(downloadsDir, fileName);

    // Download best audio using yt-dlp
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: 'm4a',
      audioQuality: 0, // Best quality
      output: outputPath,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    });

    console.log(`Download completed: ${fileName}`);
    res.json({
      success: true,
      downloadUrl: `/file/${fileName}`,
      fileName: `${title}.m4a`,
    });
  } catch (error) {
    console.error('Download error:', error);
    res
      .status(500)
      .json({ error: 'Failed to download audio: ' + error.message });
  }
});

// Serve downloaded file
app.get('/api/file/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(downloadsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Get clean filename without UUID
  const cleanFileName = fileName.substring(37); // Remove UUID and underscore

  res.download(filePath, cleanFileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
