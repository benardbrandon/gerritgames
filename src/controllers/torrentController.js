// src/controllers/torrentController.js
// parse-torrent is an ESM-only package in v11+
// We dynamically import it to use from CommonJS

async function parseMagnet(magnetUri) {
  try {
    const { default: parseTorrent, toMagnetURI } = await import('parse-torrent');
    const parsed = await parseTorrent(magnetUri);
    return {
      infoHash: parsed.infoHash || null,
      name: parsed.name || null,
      files: (parsed.files || []).map(f => ({
        path: f.path,
        length: Number(f.length || 0)
      })),
      announce: parsed.announce || [],
      length: Number(parsed.length || 0)
    };
  } catch (err) {
    console.error('Magnet parse error:', err.message);
    return { infoHash: null, name: null, files: [], announce: [], length: 0 };
  }
}

async function parseTorrentFile(buffer) {
  try {
    const { default: parseTorrent } = await import('parse-torrent');
    const parsed = await parseTorrent(buffer);
    return {
      infoHash: parsed.infoHash,
      name: parsed.name,
      magnetUri: `magnet:?xt=urn:btih:${parsed.infoHash}&dn=${encodeURIComponent(parsed.name)}`,
      files: (parsed.files || []).map(f => ({
        path: f.path,
        length: Number(f.length || 0)
      })),
      totalSize: Number(parsed.length || 0),
      announce: parsed.announce || []
    };
  } catch (err) {
    throw new Error(`Failed to parse torrent: ${err.message}`);
  }
}

// Format bytes to human-readable string
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

module.exports = { parseMagnet, parseTorrentFile, formatBytes };
