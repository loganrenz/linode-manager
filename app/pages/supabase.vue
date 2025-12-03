<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Supabase Dev Instance
      </h2>
      <p class="text-gray-500 dark:text-gray-400">
        Quickly deploy a self-hosted Supabase instance for development testing.
        This creates a pre-configured Linode with Docker and Supabase.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
            <span class="font-medium">Configuration</span>
          </div>
        </template>

        <form @submit.prevent="createSupabase" class="space-y-4">
          <UFormField label="Instance Label">
            <UInput
              v-model="form.label"
              placeholder="supabase-dev"
              icon="i-heroicons-tag"
            />
          </UFormField>

          <UFormField label="Region">
            <USelectMenu
              v-model="form.region"
              :items="regionItems"
              placeholder="Select a region"
              icon="i-heroicons-globe-alt"
              :loading="pendingRegions"
            />
          </UFormField>

          <UFormField label="Instance Type">
            <USelectMenu
              v-model="form.type"
              :items="supabaseTypes"
              placeholder="Select instance type"
              icon="i-heroicons-cpu-chip"
              :loading="pendingTypes"
            />
          </UFormField>

          <UDivider label="Security (auto-generated if empty)" />

          <UFormField label="Postgres Password">
            <UInput
              v-model="form.postgresPassword"
              type="password"
              placeholder="Leave empty to auto-generate"
              icon="i-heroicons-key"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="creating"
            icon="i-heroicons-rocket-launch"
            block
          >
            Deploy Supabase Instance
          </UButton>
        </form>
      </UCard>

      <div class="space-y-6">
        <UCard v-if="result">
          <template #header>
            <div class="flex items-center gap-2 text-green-600">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
              <span class="font-medium">Deployment Successful!</span>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Instance Details</h4>
              <dl class="grid grid-cols-2 gap-2 text-sm">
                <dt class="text-gray-500">ID:</dt>
                <dd>{{ result.linode.id }}</dd>
                <dt class="text-gray-500">Label:</dt>
                <dd>{{ result.linode.label }}</dd>
                <dt class="text-gray-500">IP Address:</dt>
                <dd>{{ result.linode.ipv4[0] }}</dd>
                <dt class="text-gray-500">Status:</dt>
                <dd>
                  <UBadge :color="result.linode.status === 'running' ? 'success' : 'warning'">
                    {{ result.linode.status }}
                  </UBadge>
                </dd>
              </dl>
            </div>

            <UDivider />

            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">Environment Variables</h4>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-clipboard-document"
                  @click="copyEnv"
                >
                  Copy
                </UButton>
              </div>
              <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">{{ result.envFileContent }}</pre>
            </div>

            <UButton
              icon="i-heroicons-arrow-down-tray"
              variant="outline"
              block
              @click="downloadEnv"
            >
              Download .env File
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
              <span class="font-medium">What gets deployed?</span>
            </div>
          </template>

          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mt-0.5 text-green-500" />
              Ubuntu 22.04 LTS with Docker
            </li>
            <li class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mt-0.5 text-green-500" />
              Supabase self-hosted (PostgreSQL, Auth, Storage, Realtime)
            </li>
            <li class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mt-0.5 text-green-500" />
              Pre-generated secure keys and passwords
            </li>
            <li class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mt-0.5 text-green-500" />
              Ready-to-use .env file for your application
            </li>
          </ul>

          <template #footer>
            <p class="text-xs text-gray-500">
              Note: Supabase takes ~5-10 minutes to fully initialize after the Linode is running.
            </p>
          </template>
        </UCard>
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      icon="i-heroicons-x-circle"
      :title="error"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import type { LinodeType, LinodeRegion, Linode, EnvConfig } from '~/types/linode';

interface SupabaseResult {
  linode: Linode;
  envConfig: EnvConfig;
  envFileContent: string;
}

const form = reactive({
  label: '',
  region: 'us-east',
  type: 'g6-standard-2',
  postgresPassword: ''
});

const creating = ref(false);
const error = ref('');
const result = ref<SupabaseResult | null>(null);

const { data: regions, pending: pendingRegions } = await useFetch<LinodeRegion[]>('/api/regions');
const { data: types, pending: pendingTypes } = await useFetch<LinodeType[]>('/api/linode-types');

const regionItems = computed(() => 
  (regions.value || []).map(r => ({
    label: `${r.label} (${r.country})`,
    value: r.id
  }))
);

// Filter to types suitable for Supabase (at least 4GB RAM)
const supabaseTypes = computed(() => 
  (types.value || [])
    .filter(t => t.memory >= 4096 && (t.id.startsWith('g6') || t.id.startsWith('g7')))
    .sort((a, b) => a.price.monthly - b.price.monthly)
    .map(t => ({
      label: `${t.label} - $${t.price.monthly}/mo (${t.memory / 1024}GB RAM, ${t.vcpus} vCPUs)`,
      value: t.id
    }))
);

async function createSupabase() {
  error.value = '';
  result.value = null;
  creating.value = true;
  
  try {
    const response = await $fetch<SupabaseResult>('/api/supabase/create', {
      method: 'POST',
      body: form
    });
    
    result.value = response;
  } catch (err: unknown) {
    const fetchError = err as { data?: { message?: string } };
    error.value = fetchError.data?.message || 'Failed to create Supabase instance';
  } finally {
    creating.value = false;
  }
}

function copyEnv() {
  if (result.value) {
    navigator.clipboard.writeText(result.value.envFileContent);
  }
}

function downloadEnv() {
  if (result.value) {
    const blob = new Blob([result.value.envFileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.supabase';
    a.click();
    URL.revokeObjectURL(url);
  }
}
</script>
