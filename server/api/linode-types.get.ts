import { getLinodeTypes } from '../utils/linode';

export default defineEventHandler(async () => {
  const types = await getLinodeTypes();
  return types;
});
