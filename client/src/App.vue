<script setup>
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';
import { ref, onMounted } from 'vue';

const objects = ref([]);
const fetchObjectsNav = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/schema/objects');
    objects.value = res.data;
  }
  catch (err) {
    alert("Error while fetching objects");
    console.error("Error while fetching objects:", err);
  }
};

onMounted(() => {
  fetchObjectsNav();
});

</script>

<template>
  <div class="min-h-screen bg-gray-100 flex font-sans">

    <aside class="w-50 bg-slate-800 text-white flex flex-col md:flex">
      <div class="p-6">
        <h2 class="text-2xl font-bold tracking-wide">🚀 CRM Pro</h2>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <RouterLink to="/" active-class="bg-blue-600"
          class="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-slate-700">
          <span>📊</span> Dashboard
        </RouterLink>

        <RouterLink to="/leads" active-class="bg-blue-600"
          class="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-slate-700">
          <span>👥</span> Leads
        </RouterLink>

        <RouterLink to="/objects" active-class="bg-blue-600"
          class="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-slate-700">
          <span>🛠️</span> Object Manager
        </RouterLink>

        <RouterLink v-for="objs in objects" :key="objs" :to="'/view/' + objs" active-class="bg-blue-600"
          class="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-slate-700">
          <span>📋</span> {{ objs }}
        </RouterLink>

        <!-- <RouterLink to="/settings" active-class="bg-blue-600"
          class="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-slate-700">
          <span>⚙️</span> Settings
        </RouterLink> -->
        
      </nav>

      <div class="p-4 border-t border-slate-700">
        <button class="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col">

      <header class="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-700">Overview</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">Hello, Tanmay</span>
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">T
          </div>
        </div>
      </header>

      <div class="p-8 overflow-y-auto">
        <RouterView />
      </div>

    </main>
  </div>
</template>