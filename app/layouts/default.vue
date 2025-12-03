<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer>
      <header class="py-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-server-stack" class="w-8 h-8 text-primary" />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Linode Manager
            </h1>
          </div>
          <nav class="flex items-center gap-4">
            <UButton
              to="/"
              variant="ghost"
              icon="i-heroicons-home"
            >
              Dashboard
            </UButton>
            <UButton
              to="/create"
              variant="ghost"
              icon="i-heroicons-plus-circle"
            >
              Create
            </UButton>
            <UButton
              to="/supabase"
              variant="ghost"
              icon="i-heroicons-circle-stack"
            >
              Supabase
            </UButton>
            <UButton
              variant="ghost"
              :icon="colorModeIcon"
              @click="toggleColorMode"
            />
          </nav>
        </div>
      </header>
      
      <main class="py-8">
        <slot />
      </main>
      
      <footer class="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
        Linode Manager - Local Development Tool
      </footer>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const colorModeIcon = computed(() => 
  colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'
);

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>
