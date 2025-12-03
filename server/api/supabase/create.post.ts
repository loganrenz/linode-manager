import { createLinode } from '~/server/utils/linode';
import type { SupabaseConfig, EnvConfig } from '~/types/linode';
import { randomBytes } from 'crypto';

// Supabase setup stackscript - installs Docker and runs Supabase
const SUPABASE_STACKSCRIPT = `#!/bin/bash
# Supabase Self-Hosted Setup Script
set -e

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get install -y docker-compose-plugin

# Create supabase directory
mkdir -p /opt/supabase
cd /opt/supabase

# Clone Supabase Docker
git clone --depth 1 https://github.com/supabase/supabase /opt/supabase/supabase
cp -r /opt/supabase/supabase/docker/* /opt/supabase/

# Configure .env file
cat > /opt/supabase/.env << 'ENVEOF'
POSTGRES_PASSWORD=<UDF_POSTGRES_PASSWORD>
JWT_SECRET=<UDF_JWT_SECRET>
ANON_KEY=<UDF_ANON_KEY>
SERVICE_ROLE_KEY=<UDF_SERVICE_ROLE_KEY>
DASHBOARD_USERNAME=supabase
DASHBOARD_PASSWORD=<UDF_POSTGRES_PASSWORD>
ENVEOF

# Start Supabase
cd /opt/supabase
docker compose pull
docker compose up -d

echo "Supabase installation complete!"
`;

function generateSecureKey(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}

function generateJwtKey(): string {
  // Generate a 256-bit key for HS256
  return randomBytes(32).toString('base64url');
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SupabaseConfig>>(event);
  
  // Generate secure defaults if not provided
  const postgresPassword = body.postgresPassword || generateSecureKey(24);
  const jwtSecret = body.jwtSecret || generateJwtKey();
  const anonKey = body.anonKey || generateSecureKey(40);
  const serviceRoleKey = body.serviceRoleKey || generateSecureKey(40);
  
  const label = body.label || `supabase-dev-${Date.now()}`;
  const region = body.region || 'us-east';
  // g6-standard-2: 4GB RAM, 2 vCPUs - minimum for Supabase
  const type = body.type || 'g6-standard-2';
  
  // Create the Linode with Supabase configuration
  const linode = await createLinode({
    label,
    region,
    type,
    image: 'linode/ubuntu22.04',
    root_pass: postgresPassword,
    stackscript_data: {
      UDF_POSTGRES_PASSWORD: postgresPassword,
      UDF_JWT_SECRET: jwtSecret,
      UDF_ANON_KEY: anonKey,
      UDF_SERVICE_ROLE_KEY: serviceRoleKey
    }
  });
  
  // Generate the .env configuration for the client
  const envConfig: EnvConfig = {
    SUPABASE_URL: `http://${linode.ipv4[0]}:8000`,
    SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    POSTGRES_PASSWORD: postgresPassword,
    JWT_SECRET: jwtSecret
  };
  
  return {
    linode,
    envConfig,
    envFileContent: Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
  };
});
