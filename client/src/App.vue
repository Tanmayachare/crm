<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import axios from 'axios';
import { ref, onMounted, watch, computed } from 'vue';

const route = useRoute();

const currentRouteName = computed(() => {
  if (route.path === '/') return 'Dashboard Overview';
  if (route.path === '/leads') return 'Lead Management';
  if (route.path === '/objects') return 'Object Manager';
  if (route.path.startsWith('/view/')) return `${objectName.value} Records`;
  return 'Workspace';
});


let objectName = ref('');
const getObjectName = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tab/objName/${route.params.tableName}`)
    objectName.value = res.data[0]?.label;
    // console.log(res.data)
    // console.log(objectName.value)
  }
  catch (err) {
    alert("Error while fetching table data");
    console.error("Error while fetching table data:", err);
  }
}

const objects = ref([]);
const standardObjects = computed(() => {
  return objects.value.filter(tablename => tablename.is_standard == 1 && tablename.is_visible == 1);
})
const customObjects = computed(() => {
  return objects.value.filter(tablename => tablename.is_standard == 0 && tablename.is_visible == 1);
})

const fetchObjectsNav = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tab/data`);
    objects.value = res.data;
  }
  catch (err) {
    alert("Error while fetching objects");
    console.error("Error while fetching objects:", err);
  }
};

onMounted(() => {
  getObjectName()
  fetchObjectsNav();
});

watch(() => route.params.tableName, () => getObjectName());
</script>

<template>
  <div class="h-screen bg-gray-50 flex font-sans overflow-hidden">

    <!-- Enterprise Sidebar -->
    <aside class="w-48 bg-[#1a202c] text-gray-300 flex flex-col flex-shrink-0 shadow-xl z-20">
      <div class="h-16 flex items-center px-6 border-b border-gray-700 bg-[#161b22]">
        <h2 class="text-xl font-bold tracking-wider text-white flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          CRM Pro
        </h2>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</div>

        <RouterLink to="/" active-class="bg-blue-600 text-white font-medium shadow-md"
          class="flex items-center gap-3 py-2 px-3 rounded-md transition duration-150 ease-in-out hover:bg-gray-800 hover:text-white group">
          <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
            </path>
          </svg>
          <span class="text-sm">Dashboard</span>
        </RouterLink>

        <!-- <RouterLink to="/leads" active-class="bg-blue-600 text-white font-medium shadow-md"
          class="flex items-center gap-3 py-2 px-3 rounded-md transition duration-150 ease-in-out hover:bg-gray-800 hover:text-white group">
          <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
          <span class="text-sm">Leads</span>
        </RouterLink> -->

        <RouterLink v-for="objs in standardObjects" :key="objs" :to="'/view/' + objs.api_name"
          active-class="bg-blue-600 text-white font-medium shadow-md"
          class="flex items-center gap-3 py-2 px-3 rounded-md transition duration-150 ease-in-out hover:bg-gray-800 hover:text-white group">
          <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="`${objs.icon}`"></path>
          </svg>
          <span class="text-sm truncate capitalize">{{ objs.label }}</span>
        </RouterLink>

        <div class="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration</div>

        <RouterLink to="/objects" active-class="bg-blue-600 text-white font-medium shadow-md"
          class="flex items-center gap-3 py-2 px-3 rounded-md transition duration-150 ease-in-out hover:bg-gray-800 hover:text-white group">
          <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
            </path>
          </svg>
          <span class="text-sm">Object Manager</span>
        </RouterLink>

        <div v-if="objects.length" class="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Custom Objects</div>
        <RouterLink v-for="objs in customObjects" :key="objs" :to="'/view/' + objs.api_name"
          active-class="bg-blue-600 text-white font-medium shadow-md"
          class="flex items-center gap-3 py-2 px-3 rounded-md transition duration-150 ease-in-out hover:bg-gray-800 hover:text-white group">
          <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="`${objs.icon}`"></path>
          </svg>
          <span class="text-sm truncate capitalize">{{ objs.label }}</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-gray-700 bg-[#161b22]">
        <button
          class="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 bg-gray-50">

      <!-- Enterprise Header -->
      <header class="h-16 bg-white border-b border-gray-200 px-6 flex justify-between items-center flex-shrink-0 z-10">
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-semibold text-gray-800 capitalize">{{ currentRouteName }}</h1>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded-md transition">
            <div class="text-right hidden md:block">
              <div class="text-sm font-medium text-gray-700 leading-tight">Tanmay</div>
              <div class="text-xs text-gray-500">Administrator</div>
            </div>
            <div
              class="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm border-2 border-white ring-2 ring-gray-100">
              T
            </div>
          </div>
        </div>
      </header>

      <!-- Pinned Tabs Navigation -->
      <!-- <div class="bg-white border-b border-gray-200 px-6 flex space-x-1 flex-shrink-0">
        <RouterLink to="/" active-class="border-b-2 border-blue-500 text-blue-600"
          class="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-colors whitespace-nowrap">
          Dashboard
        </RouterLink>
        <RouterLink to="/leads" active-class="border-b-2 border-blue-500 text-blue-600"
          class="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-colors whitespace-nowrap">
          Leads
        </RouterLink> -->
      <!-- Dynamically pin up to 3 custom objects for quick access -->
      <!-- <RouterLink v-for="objs in objects.slice(0, 3)" :key="'pin-' + objs" :to="'/view/' + objs"
          active-class="border-b-2 border-blue-500 text-blue-600"
          class="capitalize px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-colors whitespace-nowrap">
          {{ objs }}
        </RouterLink> -->
      <!-- </div> -->

      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-7xl mx-auto">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 20px;
}
</style>