'use client';

import { useState, useEffect } from 'react';
import { Version } from '@/types';
import VersionHistory from '@/components/VersionHistory';

export default function Home() {
  const [content, setContent] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load versions on mount
  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/versions');
      const data = await response.json();
      
      if (data.success) {
        setVersions(data.versions);
        // Load the latest content into the editor
        if (data.versions.length > 0) {
          const latestVersion = data.versions[data.versions.length - 1];
          setContent(latestVersion.content);
        }
      }
    } catch (error) {
      console.error('Error loading versions:', error);
      showMessage('Failed to load versions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVersion = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/save-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.success) {
        setVersions([...versions, data.version]);
        showMessage('Version saved successfully!', 'success');
      } else {
        showMessage(data.message || 'Failed to save version', 'error');
      }
    } catch (error) {
      console.error('Error saving version:', error);
      showMessage('Failed to save version', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(`${type}:${text}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const messageType = message.split(':')[0];
  const messageText = message.split(':')[1];

  return (
    <main className="container">
      <header className="header">
        <h1>📝 Mini Audit Trail Generator</h1>
        <p className="subtitle">
          Track every change to your text with automatic version history
        </p>
      </header>

      {message && (
        <div className={`message message-${messageType}`}>
          {messageText}
        </div>
      )}

      <div className="layout">
        <section className="editor-section">
          <div className="editor-header">
            <h2>Content Editor</h2>
            <div className="editor-info">
              <span className="char-count">
                {content.length} character{content.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <textarea
            className="content-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your content here... 

Try making changes and saving versions to see the audit trail in action!

Example:
- Add new words
- Remove existing words
- See the difference tracked automatically"
            disabled={isLoading}
          />

          <div className="editor-actions">
            <button
              className="btn btn-primary"
              onClick={handleSaveVersion}
              disabled={isSaving || isLoading}
            >
              {isSaving ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                '💾 Save Version'
              )}
            </button>
            <span className="help-text">
              Click to create a snapshot of your current content
            </span>
          </div>
        </section>

        <section className="history-section">
          {isLoading ? (
            <div className="loading">
              <span className="spinner"></span>
              Loading versions...
            </div>
          ) : (
            <VersionHistory versions={versions} />
          )}
        </section>
      </div>

      <footer className="footer">
        <p>
          Built for full-stack intern assessment • Custom diff algorithm • No templates used
        </p>
      </footer>
    </main>
  );
}
