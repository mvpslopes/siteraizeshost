import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

// Plugin para copiar .htaccess após o build
const copyHtaccess = () => {
  return {
    name: 'copy-htaccess',
    closeBundle() {
      try {
        copyFileSync(
          join(process.cwd(), '.htaccess'),
          join(process.cwd(), 'dist', '.htaccess')
        );
        console.log('✓ .htaccess copiado para dist/');
      } catch (error) {
        console.warn('⚠ Aviso: Não foi possível copiar .htaccess:', error);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyHtaccess()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Usa esbuild que já vem com Vite (mais rápido que terser)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  base: './', // Importante para funcionar em subdiretórios se necessário
});
