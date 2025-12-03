// Linode API types
export interface Linode {
  id: number;
  label: string;
  region: string;
  type: string;
  status: 'running' | 'offline' | 'booting' | 'rebooting' | 'shutting_down' | 'provisioning' | 'deleting' | 'migrating' | 'rebuilding' | 'cloning' | 'restoring' | 'stopped';
  ipv4: string[];
  ipv6: string;
  created: string;
  updated: string;
  image: string | null;
  specs: {
    disk: number;
    memory: number;
    vcpus: number;
    transfer: number;
  };
}

export interface LinodeType {
  id: string;
  label: string;
  price: {
    hourly: number;
    monthly: number;
  };
  memory: number;
  disk: number;
  vcpus: number;
  transfer: number;
}

export interface LinodeRegion {
  id: string;
  label: string;
  country: string;
  status: string;
  capabilities: string[];
}

export interface LinodeImage {
  id: string;
  label: string;
  description: string;
  type: string;
  is_public: boolean;
  vendor: string | null;
}

export interface CreateLinodeRequest {
  label: string;
  region: string;
  type: string;
  image: string;
  root_pass: string;
  authorized_keys?: string[];
  stackscript_id?: number;
  stackscript_data?: Record<string, string>;
}

export interface SupabaseConfig {
  label: string;
  region: string;
  type: string;
  postgresPassword: string;
  jwtSecret: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  POSTGRES_PASSWORD: string;
  JWT_SECRET: string;
}

export interface ApiResponse<T> {
  data: T;
  page?: number;
  pages?: number;
  results?: number;
}
