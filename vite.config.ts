import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, cpSync, mkdirSync } from 'fs';
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

// Plugin para copiar a pasta api/ inteira para dist/api/
const copyApiFolder = () => {
  return {
    name: 'copy-api-folder',
    closeBundle() {
      try {
        const src  = join(process.cwd(), 'api');
        const dest = join(process.cwd(), 'dist', 'api');
        mkdirSync(dest, { recursive: true });
        cpSync(src, dest, { recursive: true });
        console.log('✓ Pasta api/ copiada para dist/api/');
      } catch (error) {
        console.warn('⚠ Aviso: Não foi possível copiar a pasta api/:', error);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyHtaccess(), copyApiFolder()],
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
  base: '/', // Mantém assets/config.js na raiz, inclusive em rotas públicas como /pesquisa/:slug
});
