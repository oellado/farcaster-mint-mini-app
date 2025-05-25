import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { config, nftCollection } from "./src/config";

function fcFrameMeta(): Plugin {
  return {
    name: "inject-fc-frame-meta",
    transformIndexHtml(html: string) {
      const embedJson = JSON.stringify(config.embed);
      const metaTag = `<meta name="fc:frame" content='${embedJson}'>`;
      return html.replace('</head>', `${metaTag}\n</head>`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), fcFrameMeta()],
  server: {
    allowedHosts: true,
    proxy: {
      // Proxy /api/preview requests to handle them in middleware
      '/api/preview': {
        target: 'http://localhost:5173',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    middlewareMode: true,
    configureServer: (server) => {
      server.middlewares.use('/api/preview', (req, res, next) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const nftId = url.searchParams.get('id');
        
        // If no ID provided, use the default icon
        if (!nftId) {
          res.writeHead(307, { Location: nftCollection.welcomeImageUrl });
          res.end();
          return;
        }

        // Find the NFT in the collection
        const nft = nftCollection.nfts.find(n => n.id.toString() === nftId);
        
        // If NFT not found, use the default icon
        if (!nft) {
          res.writeHead(307, { Location: nftCollection.welcomeImageUrl });
          res.end();
          return;
        }

        // Redirect to the NFT's image
        res.writeHead(307, { Location: nft.imageUrl });
        res.end();
      });
    },
  },
});
