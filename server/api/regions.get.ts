import { getRegions } from '../utils/linode';

export default defineEventHandler(async () => {
  const regions = await getRegions();
  return regions;
});
