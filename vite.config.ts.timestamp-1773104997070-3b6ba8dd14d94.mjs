// vite.config.ts
import { defineConfig } from "file:///C:/projetos/SiteRaizesHost/node_modules/vite/dist/node/index.js";
import react from "file:///C:/projetos/SiteRaizesHost/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { copyFileSync } from "fs";
import { join } from "path";
var copyHtaccess = () => {
  return {
    name: "copy-htaccess",
    closeBundle() {
      try {
        copyFileSync(
          join(process.cwd(), ".htaccess"),
          join(process.cwd(), "dist", ".htaccess")
        );
        console.log("\u2713 .htaccess copiado para dist/");
      } catch (error) {
        console.warn("\u26A0 Aviso: N\xE3o foi poss\xEDvel copiar .htaccess:", error);
      }
    }
  };
};
var vite_config_default = defineConfig({
  plugins: [react(), copyHtaccess()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    // Usa esbuild que já vem com Vite (mais rápido que terser)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"]
        }
      }
    }
  },
  base: "./"
  // Importante para funcionar em subdiretórios se necessário
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxwcm9qZXRvc1xcXFxTaXRlUmFpemVzSG9zdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamV0b3NcXFxcU2l0ZVJhaXplc0hvc3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2pldG9zL1NpdGVSYWl6ZXNIb3N0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgY29weUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG4vLyBQbHVnaW4gcGFyYSBjb3BpYXIgLmh0YWNjZXNzIGFwXHUwMEYzcyBvIGJ1aWxkXG5jb25zdCBjb3B5SHRhY2Nlc3MgPSAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2NvcHktaHRhY2Nlc3MnLFxuICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29weUZpbGVTeW5jKFxuICAgICAgICAgIGpvaW4ocHJvY2Vzcy5jd2QoKSwgJy5odGFjY2VzcycpLFxuICAgICAgICAgIGpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2Rpc3QnLCAnLmh0YWNjZXNzJylcbiAgICAgICAgKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1x1MjcxMyAuaHRhY2Nlc3MgY29waWFkbyBwYXJhIGRpc3QvJyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1x1MjZBMCBBdmlzbzogTlx1MDBFM28gZm9pIHBvc3NcdTAwRUR2ZWwgY29waWFyIC5odGFjY2VzczonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgY29weUh0YWNjZXNzKCldLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBtaW5pZnk6ICdlc2J1aWxkJywgLy8gVXNhIGVzYnVpbGQgcXVlIGpcdTAwRTEgdmVtIGNvbSBWaXRlIChtYWlzIHJcdTAwRTFwaWRvIHF1ZSB0ZXJzZXIpXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICBzdXBhYmFzZTogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYmFzZTogJy4vJywgLy8gSW1wb3J0YW50ZSBwYXJhIGZ1bmNpb25hciBlbSBzdWJkaXJldFx1MDBGM3Jpb3Mgc2UgbmVjZXNzXHUwMEUxcmlvXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1EsU0FBUyxvQkFBb0I7QUFDblMsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsWUFBWTtBQUdyQixJQUFNLGVBQWUsTUFBTTtBQUN6QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQ1osVUFBSTtBQUNGO0FBQUEsVUFDRSxLQUFLLFFBQVEsSUFBSSxHQUFHLFdBQVc7QUFBQSxVQUMvQixLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVEsV0FBVztBQUFBLFFBQ3pDO0FBQ0EsZ0JBQVEsSUFBSSxxQ0FBZ0M7QUFBQSxNQUM5QyxTQUFTLE9BQU87QUFDZCxnQkFBUSxLQUFLLDBEQUErQyxLQUFLO0FBQUEsTUFDbkU7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7QUFBQSxFQUNqQyxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixVQUFVLENBQUMsdUJBQXVCO0FBQUEsUUFDcEM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQTtBQUNSLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
