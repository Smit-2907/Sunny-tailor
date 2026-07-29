import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Custom plugin to handle figma:asset imports
function figmaAssetPlugin() {
  return {
    name: 'figma-asset-plugin',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        // Return a special ID that we'll handle in load
        return '\0' + id;
      }
      return null;
    },
    load(id: string) {
      if (id.startsWith('\0figma:asset/')) {
        // Extract the asset hash/filename
        const assetPath = id.slice(13); // Remove '\0figma:asset/'
        
        // Return a placeholder image URL or empty module
        // In production, these would be served from a CDN or asset server
        return `export default "https://via.placeholder.com/400x400.png?text=${encodeURIComponent('Asset: ' + assetPath.slice(0, 8))}";`;
      }
      return null;
    }
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './utils'),
      'utils': path.resolve(__dirname, './utils'),
      '/utils': path.resolve(__dirname, './utils'),
    },
  },
  build: {
    rollupOptions: {
      external: [],
    }
  }
})