import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // Configuration options
    plugins: [react()], // Enable the React plugin
    root: './src', // Specify the root directory of your project
    build: {
        outDir: '../dist', // Output directory for the build
        emptyOutDir: true, // Clear the output directory before building
    },
});