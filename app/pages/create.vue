<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Create New Linode
      </h2>
      <p class="text-gray-500 dark:text-gray-400">
        Configure and deploy a new Linode instance.
      </p>
    </div>

    <UCard>
      <form @submit.prevent="createLinode" class="space-y-6">
        <UFormField label="Label" required>
          <UInput
            v-model="form.label"
            placeholder="my-linode-instance"
            icon="i-heroicons-tag"
          />
        </UFormField>

        <UFormField label="Region" required>
          <USelectMenu
            v-model="form.region"
            :items="regionItems"
            placeholder="Select a region"
            icon="i-heroicons-globe-alt"
            :loading="pendingRegions"
          />
        </UFormField>

        <UFormField label="Instance Type" required>
          <USelectMenu
            v-model="form.type"
            :items="typeItems"
            placeholder="Select instance type"
            icon="i-heroicons-cpu-chip"
            :loading="pendingTypes"
          />
        </UFormField>

        <UFormField label="Image" required>
          <USelectMenu
            v-model="form.image"
            :items="imageItems"
            placeholder="Select an image"
            icon="i-heroicons-photo"
            :loading="pendingImages"
          />
        </UFormField>

        <UFormField label="Root Password" required>
          <UInput
            v-model="form.root_pass"
            type="password"
            placeholder="Strong password for root user"
            icon="i-heroicons-key"
          />
        </UFormField>

        <UFormField label="SSH Keys (optional)">
          <UTextarea
            v-model="sshKeysText"
            placeholder="Paste SSH public keys (one per line)"
            :rows="3"
          />
        </UFormField>

        <div class="flex gap-4">
          <UButton
            type="submit"
            :loading="creating"
            icon="i-heroicons-rocket-launch"
          >
            Create Linode
          </UButton>
          <UButton
            to="/"
            variant="ghost"
          >
            Cancel
          </UButton>
        </div>
      </form>
    </UCard>

    <UAlert
      v-if="error"
      color="error"
      icon="i-heroicons-x-circle"
      :title="error"
      class="mt-6"
    />

    <UAlert
      v-if="success"
      color="success"
      icon="i-heroicons-check-circle"
      title="Linode created successfully!"
      :description="`Your Linode '${success.label}' is being provisioned.`"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import type { Linode, LinodeType, LinodeRegion, LinodeImage } from '~/types/linode';

const router = useRouter();

const form = reactive({
  label: '',
  region: '',
  type: '',
  image: '',
  root_pass: ''
});

const sshKeysText = ref('');
const creating = ref(false);
const error = ref('');
const success = ref<Linode | null>(null);

const { data: regions, pending: pendingRegions } = await useFetch<LinodeRegion[]>('/api/regions');
const { data: types, pending: pendingTypes } = await useFetch<LinodeType[]>('/api/linode-types');
const { data: images, pending: pendingImages } = await useFetch<LinodeImage[]>('/api/images');

const regionItems = computed(() => 
  (regions.value || []).map(r => ({
    label: `${r.label} (${r.country})`,
    value: r.id
  }))
);

const typeItems = computed(() => 
  (types.value || [])
    .filter(t => t.id.startsWith('g6') || t.id.startsWith('g7'))
    .sort((a, b) => a.price.monthly - b.price.monthly)
    .map(t => ({
      label: `${t.label} - $${t.price.monthly}/mo (${t.memory / 1024}GB RAM, ${t.vcpus} vCPUs)`,
      value: t.id
    }))
);

const imageItems = computed(() => 
  (images.value || [])
    .filter(i => i.is_public && i.type === 'manual')
    .map(i => ({
      label: i.label,
      value: i.id
    }))
);

async function createLinode() {
  error.value = '';
  success.value = null;
  
  if (!form.label || !form.region || !form.type || !form.image || !form.root_pass) {
    error.value = 'Please fill in all required fields';
    return;
  }
  
  creating.value = true;
  
  try {
    const authorized_keys = sshKeysText.value
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    const result = await $fetch<Linode>('/api/linodes', {
      method: 'POST',
      body: {
        ...form,
        authorized_keys: authorized_keys.length > 0 ? authorized_keys : undefined
      }
    });
    
    success.value = result;
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (err: unknown) {
    const fetchError = err as { data?: { message?: string } };
    error.value = fetchError.data?.message || 'Failed to create Linode';
  } finally {
    creating.value = false;
  }
}
</script>
