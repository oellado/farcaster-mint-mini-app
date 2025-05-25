import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin, type Connect } from "vite";
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
  plugins: [
    react(), 
    tailwindcss(), 
    fcFrameMeta(),
    {
      name: 'preview-endpoint',
      configureServer(server) {
        const previewHandler: Connect.HandleFunction = (req, res) => {
          try {
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
          } catch (error) {
            console.error('Preview endpoint error:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
          }
        };

        server.middlewares.use('/api/preview', previewHandler);
      }
    }
  ],
  server: {
    allowedHosts: true
  }
});
