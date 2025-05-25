import { VercelRequest, VercelResponse } from '@vercel/node';
import { nftCollection } from '../src/config';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const nftId = req.query.nft as string;
    
    // If no ID provided, use the default icon
    if (!nftId) {
      res.redirect(307, nftCollection.welcomeImageUrl);
      return;
    }

    // Find the NFT in the collection
    const nft = nftCollection.nfts.find(n => n.id.toString() === nftId);
    
    // If NFT not found, use the default icon
    if (!nft) {
      res.redirect(307, nftCollection.welcomeImageUrl);
      return;
    }

    // Redirect to the NFT's image
    res.redirect(307, nft.imageUrl);
  } catch (error) {
    console.error('Preview endpoint error:', error);
    res.status(500).send('Internal Server Error');
  }
} 