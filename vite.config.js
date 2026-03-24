import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': { target:'https://dashboard.isac.com.tr', changeOrigin:true, configure:(proxy)=>{proxy.on('error',()=>{});} } } }
});
