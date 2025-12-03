import { deleteLinode } from '~/server/utils/linode';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid Linode ID'
    });
  }
  
  await deleteLinode(id);
  return { success: true, message: `Linode ${id} deleted` };
});
