import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Log build configuration for debugging
console.log('Starting Vite configuration');
console.log('Current working directory:', process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to debug build process
    {
      name: 'debug-build',
      writeBundle(options, bundle) {
        console.log('Bundle output directory:', options.dir);
        console.log('Bundle entries:', Object.keys(bundle));
        
        // Write debug info to a file to verify build
        fs.writeFileSync(
          'dist/build-info.json', 
          JSON.stringify({ 
            outputDir: options.dir,
            entries: Object.keys(bundle),
            buildTime: new Date().toISOString()
          }, null, 2)
        );
      }
    }
  ],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure ES module format is used
    target: 'es2015',
    minify: 'esbuild', // Changed from terser to esbuild to avoid dependency issues
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        // Ensure proper file extensions and formats
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure we're generating modules
        format: 'es'
      }
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*',
    },
  },
});
