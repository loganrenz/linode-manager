import { getImages } from '../utils/linode';

export default defineEventHandler(async () => {
  const images = await getImages();
  return images;
});
