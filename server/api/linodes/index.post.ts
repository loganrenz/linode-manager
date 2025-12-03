import { createLinode } from '../../utils/linode';
import type { CreateLinodeRequest } from '../../../types/linode';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateLinodeRequest>(event);
  
  if (!body.label || !body.region || !body.type || !body.image || !body.root_pass) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: label, region, type, image, root_pass'
    });
  }
  
  const linode = await createLinode(body);
  return linode;
});
