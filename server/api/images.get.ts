import { getImages } from '~/server/utils/linode';

export default defineEventHandler(async () => {
  const images = await getImages();
  return images;
});
