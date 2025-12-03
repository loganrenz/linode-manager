import { getRegions } from '~/server/utils/linode';

export default defineEventHandler(async () => {
  const regions = await getRegions();
  return regions;
});
