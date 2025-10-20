import React, { useState } from 'react';
import axios from 'axios';

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const showStatus = (message, type = 'info') => {
    setStatus({ message, type });
  };

  const hideStatus = () => {
    setStatus({ message: '', type: '' });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetUI = () => {
    setVideoInfo(null);
    setDownloadUrl('');
    hideStatus();
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    if (e.target.value.trim()) {
      resetUI();
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      showStatus('Please enter a YouTube URL', 'error');
      return;
    }

    resetUI();
    setIsProcessing(true);

    try {
      // Step 1: Validate URL
      showStatus('Validating URL...', 'info');
      const validateResponse = await axios.post(`${API_BASE_URL}/validate`, {
        url,
      });
      const videoData = validateResponse.data;

      setVideoInfo({
        thumbnail: videoData.thumbnail,
        title: videoData.title,
        duration: `Duration: ${formatDuration(videoData.duration)}`,
      });

      // Step 2: Download
      showStatus('Downloading audio...', 'info');
      const downloadResponse = await axios.post(`${API_BASE_URL}/download`, {
        url,
      });
      const downloadData = downloadResponse.data;

      // Step 3: Show download link
      hideStatus();
      setFileName(downloadData.fileName);
      // Ensure no double slashes and no duplicate /api
      const base = API_BASE_URL.replace(/\/$/, '');
      const path = String(downloadData.downloadUrl || '').replace(/^\//, '');
      setDownloadUrl(`${base}/${path}`);
      showStatus('Download complete!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showStatus(error.response?.data?.error || 'An error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🎵 YouTube Music Downloader</h1>
        <p>Download your favorite music from YouTube</p>
      </header>

      <main>
        <div className="input-section">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Paste YouTube URL here..."
            aria-label="YouTube URL"
            disabled={isProcessing}
          />
          <button
            onClick={handleDownload}
            className="btn btn-primary"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Download Audio'}
          </button>
        </div>

        {videoInfo && (
          <div className="video-info">
            <img src={videoInfo.thumbnail} alt="Video thumbnail" />
            <div className="info-text">
              <h3>{videoInfo.title}</h3>
              <p>{videoInfo.duration}</p>
            </div>
          </div>
        )}

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        {isProcessing && !videoInfo && (
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        )}

        {downloadUrl && (
          <div className="download-link">
            <p>✅ Your file is ready!</p>
            <a
              href={downloadUrl}
              className="btn btn-success"
              download={fileName}
            >
              Download File
            </a>
          </div>
        )}
      </main>

      <footer>
        <p>⚠️ Only download content you have the right to use</p>
      </footer>
    </div>
  );
}

export default App;
