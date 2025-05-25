import { type NextApiRequest, type NextApiResponse } from 'next';
import { nftCollection } from '../../config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the NFT ID from the query parameter
  const nftId = req.query.id;
  
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
} 