import * as esbuild from 'esbuild';
import { readdirSync } from 'fs';
import { join, sep } from 'path';

// Define constants
const PRODUCTION = process.env.NODE_ENV === 'production';
const BUILD_DIRECTORY = 'dist';

const ENTRY_POINTS = ['./src/index-v4.2.ts']; // Same entry point for both Node.js and Browser

// Build for Node.js
esbuild
  .build({
    entryPoints: ENTRY_POINTS,
    bundle: true,
    outfile: './dist/index-v4.2.js',
    platform: 'browser',
    external: ['path', 'os', 'crypto'],
    inject: ['./shims.js'],
    minify: PRODUCTION,
  })
  .catch(() => process.exit(1));

// Log served files function
function logServedFiles() {
  const getFiles = (dirPath) => {
    const files = readdirSync(dirPath, { withFileTypes: true }).map((dirent) => {
      const path = join(dirPath, dirent.name);
      return dirent.isDirectory() ? getFiles(path) : path;
    });

    return files.flat();
  };

  const files = getFiles(BUILD_DIRECTORY);

  const filesInfo = files
    .map((file) => {
      if (file.endsWith('.map')) return;

      // Normalize path and create file location
      const paths = file.split(sep);
      const SERVE_ORIGIN = `http://localhost:3000`; // Set your own port
      paths[0] = SERVE_ORIGIN;

      const location = paths.join('/');

      // Create import suggestion
      const tag = location.endsWith('.css')
        ? `<link href="${location}" rel="stylesheet" type="text/css"/>`
        : `<script defer src="${location}"></script>`;

      return {
        'File Location': location,
        'Import Suggestion': tag,
      };
    })
    .filter(Boolean);
  console.table(filesInfo);
}

// Further logic can be added here, like calling logServedFiles
// based on the environment (production or development).
