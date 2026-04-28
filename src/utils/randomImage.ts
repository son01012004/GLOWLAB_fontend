export const randomImages = [
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601049541289-9b1b7ecece5e?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556228720-1c2a466476e1?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477eb31f862?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&h=500&auto=format&fit=crop'
];

export const getRandomImage = (seedStr: string): string => {
  if (!seedStr) return randomImages[0];
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % randomImages.length;
  return randomImages[index];
};
