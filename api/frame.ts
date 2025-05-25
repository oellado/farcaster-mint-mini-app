import { VercelRequest, VercelResponse } from '@vercel/node';
import { nftCollection } from '../src/config';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get NFT ID from referer URL
    const referer = req.headers.referer;
    if (!referer) {
      console.log('No referer, using welcome image');
      res.redirect(307, nftCollection.welcomeImageUrl);
      return;
    }

    const url = new URL(referer);
    const nftId = url.searchParams.get('nft');
    console.log('Frame request for NFT ID:', nftId);
    
    // If no ID provided, use the default icon
    if (!nftId) {
      console.log('No NFT ID provided, using welcome image');
      res.redirect(307, nftCollection.welcomeImageUrl);
      return;
    }

    // Find the NFT in the collection
    const nft = nftCollection.nfts.find(n => n.id.toString() === nftId);
    console.log('Found NFT:', nft);
    
    // If NFT not found, use the default icon
    if (!nft) {
      console.log('NFT not found, using welcome image');
      res.redirect(307, nftCollection.welcomeImageUrl);
      return;
    }

    // Redirect to the NFT's image
    console.log('Redirecting to NFT image:', nft.imageUrl);
    res.redirect(307, nft.imageUrl);
  } catch (error) {
    console.error('Frame endpoint error:', error);
    res.status(500).send('Internal Server Error');
  }
} 