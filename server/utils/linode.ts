import type { Linode, LinodeType, LinodeRegion, LinodeImage, CreateLinodeRequest, ApiResponse } from '~/types/linode';

const LINODE_API_BASE = 'https://api.linode.com/v4';

export async function linodeRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const config = useRuntimeConfig();
  const token = config.linodeApiToken;

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Linode API token not configured. Please run the setup script.'
    });
  }

  const response = await $fetch<T>(`${LINODE_API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  return response;
}

export async function getLinodes(): Promise<Linode[]> {
  const response = await linodeRequest<ApiResponse<Linode[]>>('/linode/instances');
  return response.data;
}

export async function getLinode(id: number): Promise<Linode> {
  return await linodeRequest<Linode>(`/linode/instances/${id}`);
}

export async function createLinode(data: CreateLinodeRequest): Promise<Linode> {
  return await linodeRequest<Linode>('/linode/instances', {
    method: 'POST',
    body: data
  });
}

export async function deleteLinode(id: number): Promise<void> {
  await linodeRequest(`/linode/instances/${id}`, { method: 'DELETE' });
}

export async function bootLinode(id: number): Promise<void> {
  await linodeRequest(`/linode/instances/${id}/boot`, { method: 'POST' });
}

export async function shutdownLinode(id: number): Promise<void> {
  await linodeRequest(`/linode/instances/${id}/shutdown`, { method: 'POST' });
}

export async function rebootLinode(id: number): Promise<void> {
  await linodeRequest(`/linode/instances/${id}/reboot`, { method: 'POST' });
}

export async function getLinodeTypes(): Promise<LinodeType[]> {
  const response = await linodeRequest<ApiResponse<LinodeType[]>>('/linode/types');
  return response.data;
}

export async function getRegions(): Promise<LinodeRegion[]> {
  const response = await linodeRequest<ApiResponse<LinodeRegion[]>>('/regions');
  return response.data;
}

export async function getImages(): Promise<LinodeImage[]> {
  const response = await linodeRequest<ApiResponse<LinodeImage[]>>('/images');
  return response.data;
}
