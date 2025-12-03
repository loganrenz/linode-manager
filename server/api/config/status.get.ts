export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const isConfigured = !!config.linodeApiToken;
  
  return {
    configured: isConfigured,
    message: isConfigured 
      ? 'Linode API is configured' 
      : 'Linode API token not configured. Please run: npm run setup'
  };
});
