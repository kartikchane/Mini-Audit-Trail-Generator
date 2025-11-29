'use client';

import { Version } from '@/types';
import { getTimeAgo } from '@/lib/textDiff';

interface VersionHistoryProps {
  versions: Version[];
}

export default function VersionHistory({ versions }: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="version-history-empty">
        <p>No versions saved yet. Start editing and save your first version!</p>
      </div>
    );
  }

  // Reverse to show newest first
  const sortedVersions = [...versions].reverse();

  return (
    <div className="version-history">
      <h2>Version History ({versions.length})</h2>
      <div className="version-list">
        {sortedVersions.map((version, index) => (
          <div key={version.id} className="version-card">
            <div className="version-header">
              <span className="version-number">
                Version {versions.length - index}
              </span>
              <span className="version-time">
                {getTimeAgo(version.timestamp)}
              </span>
            </div>
            
            <div className="version-timestamp">
              {version.timestamp}
            </div>

            <div className="version-stats">
              <div className="stat">
                <span className="stat-label">Characters:</span>
                <span className="stat-value">
                  {version.oldLength} → {version.newLength}
                  {version.newLength > version.oldLength && (
                    <span className="stat-change positive">
                      +{version.newLength - version.oldLength}
                    </span>
                  )}
                  {version.newLength < version.oldLength && (
                    <span className="stat-change negative">
                      -{version.oldLength - version.newLength}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {version.addedWords.length > 0 && (
              <div className="word-changes">
                <div className="added-words">
                  <strong>Added words:</strong>
                  <div className="word-tags">
                    {version.addedWords.map((word, idx) => (
                      <span key={idx} className="word-tag added">
                        +{word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {version.removedWords.length > 0 && (
              <div className="word-changes">
                <div className="removed-words">
                  <strong>Removed words:</strong>
                  <div className="word-tags">
                    {version.removedWords.map((word, idx) => (
                      <span key={idx} className="word-tag removed">
                        -{word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {version.addedWords.length === 0 && version.removedWords.length === 0 && (
              <div className="no-changes">
                <em>No word changes detected</em>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
