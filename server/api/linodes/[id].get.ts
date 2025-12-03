import { getLinode } from '../../utils/linode';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid Linode ID'
    });
  }
  
  const linode = await getLinode(id);
  return linode;
});
