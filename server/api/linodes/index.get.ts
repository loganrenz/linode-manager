import { getLinodes } from '../../utils/linode';

export default defineEventHandler(async () => {
  const linodes = await getLinodes();
  return linodes;
});
