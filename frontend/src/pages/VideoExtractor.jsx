import React, { useState } from 'react';
import { Loader2, Youtube, FileText, Clock, Globe, Key } from 'lucide-react';
import "./VideoExtractor.css"; // 

export default function VideoExtractor() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
  if (!url.trim()) {
    setError('Please enter a YouTube URL');
    return;
  }

  setLoading(true);
  setError('');
  setResult(null);

  try {
    const response = await fetch(
      'https://pretty-youth-production-58a8.up.railway.app/extract',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to extract content');
    }

    setResult(data);
  } catch (err) {
    setError(err.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="header-title">
            <Youtube size={48} color="#ff0000" className="icon" />
            <h1>Video Content Extractor</h1>
          </div>
          <p className="subtitle">
            Extract transcripts, summaries, and key points from YouTube videos
          </p>
        </div>

        {!result && (
          <div className="card input-card">
            <label className="label">YouTube Video URL</label>
            <div className="input-group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://www.youtube.com/watch?v=..."
                className="input"
                disabled={loading}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <span className="btn-content">
                    <Loader2 size={20} className="spin" />
                    Processing...
                  </span>
                ) : (
                  'Extract'
                )}
              </button>
            </div>

            {error && (
              <div className="error-box">
                <p className="error-title">Error</p>
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="loading-box">
                <div className="loading-content">
                  <Loader2 size={24} className="spin" />
                  <span>Processing video... This may take 30-60 seconds</span>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="results">
            <div className="card">
              <h2 className="video-title">
                <Youtube size={24} color="#ff0000" />
                {result.title}
              </h2>
              
              <div className="meta-info">
                <div className="meta-item">
                  <Globe size={16} />
                  <span className="meta-label">Language:</span>
                  <span className="meta-value">{result.language.toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span className="meta-label">Duration:</span>
                  <span className="meta-value">{result.duration}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">
                <FileText size={20} color="#9333ea" />
                Summary
              </h3>
              <p className="summary-text">{result.summary}</p>
            </div>

            <div className="card">
              <h3 className="section-title">
                <Key size={20} color="#2563eb" />
                Key Points
              </h3>
              <ul className="keypoints-list">
                {result.keypoints.map((point, idx) => (
                  <li key={idx} className="keypoint-item">
                    <span className="keypoint-number">{idx + 1}</span>
                    <p className="keypoint-text">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="section-title">Full Transcript</h3>
              <div className="transcript-box">
                <p className="transcript-text">{result.transcript}</p>
              </div>
            </div>

            <div className="action-center">
              <button onClick={handleReset} className="btn btn-primary">
                Extract Another Video
              </button>
            </div>
          </div>
        )}

        <div className="footer">
          <p>Powered by Whisper AI & Python</p>
        </div>
      </div>
    </div>
  );
}