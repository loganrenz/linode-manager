<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          <UIcon name="i-heroicons-server" class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">
            {{ linode.label }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ linode.region }} • {{ linode.type }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <UBadge :color="statusColor" size="lg">
          {{ linode.status }}
        </UBadge>
        
        <div class="flex gap-2">
          <UButton
            v-if="linode.status === 'offline' || linode.status === 'stopped'"
            icon="i-heroicons-play"
            color="success"
            variant="soft"
            size="sm"
            @click="emit('action', { type: 'boot', id: linode.id })"
          >
            Boot
          </UButton>
          
          <UButton
            v-if="linode.status === 'running'"
            icon="i-heroicons-arrow-path"
            color="warning"
            variant="soft"
            size="sm"
            @click="emit('action', { type: 'reboot', id: linode.id })"
          >
            Reboot
          </UButton>
          
          <UButton
            v-if="linode.status === 'running'"
            icon="i-heroicons-stop"
            color="neutral"
            variant="soft"
            size="sm"
            @click="emit('action', { type: 'shutdown', id: linode.id })"
          >
            Shutdown
          </UButton>
          
          <UButton
            icon="i-heroicons-trash"
            color="error"
            variant="soft"
            size="sm"
            @click="confirmDelete"
          >
            Delete
          </UButton>
        </div>
      </div>
    </div>
    
    <USeparator class="my-4" />
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span class="text-gray-500 dark:text-gray-400">IPv4</span>
        <p class="font-mono">{{ linode.ipv4[0] || 'N/A' }}</p>
      </div>
      <div>
        <span class="text-gray-500 dark:text-gray-400">Memory</span>
        <p>{{ formatMemory(linode.specs.memory) }}</p>
      </div>
      <div>
        <span class="text-gray-500 dark:text-gray-400">vCPUs</span>
        <p>{{ linode.specs.vcpus }}</p>
      </div>
      <div>
        <span class="text-gray-500 dark:text-gray-400">Disk</span>
        <p>{{ formatDisk(linode.specs.disk) }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Linode } from '~/types/linode';

const props = defineProps<{
  linode: Linode;
}>();

const emit = defineEmits<{
  action: [{ type: string; id: number }];
}>();

const statusColor = computed(() => {
  switch (props.linode.status) {
    case 'running':
      return 'success';
    case 'offline':
    case 'stopped':
      return 'neutral';
    case 'booting':
    case 'rebooting':
    case 'provisioning':
      return 'warning';
    case 'shutting_down':
    case 'deleting':
      return 'error';
    default:
      return 'info';
  }
});

function formatMemory(mb: number): string {
  return `${(mb / 1024).toFixed(0)} GB`;
}

function formatDisk(mb: number): string {
  return `${(mb / 1024).toFixed(0)} GB`;
}

function confirmDelete() {
  if (confirm(`Are you sure you want to delete "${props.linode.label}"? This action cannot be undone.`)) {
    emit('action', { type: 'delete', id: props.linode.id });
  }
}
</script>
