<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Your Linodes
      </h2>
      <UButton
        icon="i-heroicons-arrow-path"
        :loading="refreshing"
        @click="refresh"
      >
        Refresh
      </UButton>
    </div>

    <UAlert
      v-if="!configStatus?.configured"
      color="warning"
      icon="i-heroicons-exclamation-triangle"
      title="Configuration Required"
      description="Linode API token not configured. Please run: npm run setup"
      class="mb-6"
    />

    <div v-if="error" class="mb-6">
      <UAlert
        color="error"
        icon="i-heroicons-x-circle"
        :title="error.message || 'Failed to load Linodes'"
      />
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else-if="linodes && linodes.length > 0" class="grid gap-4">
      <LinodeCard
        v-for="linode in linodes"
        :key="linode.id"
        :linode="linode"
        @action="handleAction"
      />
    </div>

    <UCard v-else-if="configStatus?.configured" class="text-center py-12">
      <UIcon name="i-heroicons-server-stack" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Linodes Found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Get started by creating your first Linode instance.
      </p>
      <UButton to="/create" icon="i-heroicons-plus-circle">
        Create Linode
      </UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Linode } from '~/types/linode';

const { data: configStatus } = await useFetch('/api/config/status');

const { 
  data: linodes, 
  pending, 
  error,
  refresh 
} = await useFetch<Linode[]>('/api/linodes', {
  default: () => []
});

const refreshing = ref(false);

async function handleAction(action: { type: string; id: number }) {
  refreshing.value = true;
  try {
    if (action.type === 'boot') {
      await $fetch(`/api/linodes/${action.id}/boot`, { method: 'POST' });
    } else if (action.type === 'shutdown') {
      await $fetch(`/api/linodes/${action.id}/shutdown`, { method: 'POST' });
    } else if (action.type === 'reboot') {
      await $fetch(`/api/linodes/${action.id}/reboot`, { method: 'POST' });
    } else if (action.type === 'delete') {
      await $fetch(`/api/linodes/${action.id}`, { method: 'DELETE' });
    }
    // Wait a moment for status to update
    await new Promise(resolve => setTimeout(resolve, 2000));
    await refresh();
  } catch (err) {
    console.error('Action failed:', err);
  } finally {
    refreshing.value = false;
  }
}
</script>
