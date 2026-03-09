<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 tracking-tight">Key Metrics</h2>
            <button @click="refreshData" class="bg-white border border-gray-300 text-gray-700 text-sm font-medium py-1.5 px-3 rounded shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
                <svg class="w-4 h-4" :class="{'animate-spin text-blue-500': isRefreshing}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Refresh Data
            </button>
        </div>

        <!-- High-Density Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative overflow-hidden group">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Leads</h3>
                    <span class="text-blue-500 bg-blue-50 text-xs px-2 py-0.5 rounded-full font-medium">+12%</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total_leads }}</p>
            </div>
            
            <div class="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative overflow-hidden group">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pipeline Value</h3>
                    <span class="text-green-600 bg-green-50 text-xs px-2 py-0.5 rounded-full font-medium">High</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">${{ Number(stats.total_value).toLocaleString() }}</p>
            </div>
            
            <div class="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative overflow-hidden group">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Objects</h3>
                    <span class="text-gray-400 text-xs">Active</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ objs.total_objects }}</p>
            </div>
            
            <!-- Additional placeholder metric for a denser grid -->
            <div class="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative overflow-hidden group">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider">Win Rate</h3>
                    <span class="text-orange-600 bg-orange-50 text-xs px-2 py-0.5 rounded-full font-medium">Avg</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">24.5%</p>
            </div>

        </div>
        
        <!-- Placeholder for future dense data tables or charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div class="lg:col-span-2 bg-white rounded-md shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400 text-sm">
                [ Revenue Chart Placeholder ]
            </div>
            <div class="bg-white rounded-md shadow-sm border border-gray-200 h-64 flex flex-col">
                <div class="p-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Recent Activity</div>
                <div class="flex-1 p-4 flex items-center justify-center text-gray-400 text-sm">
                    [ Activity Stream Placeholder ]
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
    total_leads: 0,
    total_value: 0
})

const isRefreshing = ref(false);

const objs = ref({
    total_objects: 0,
})

const fetchStatus = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard-status1`);
        stats.value = res.data;
        if (!stats.value.total_leads) {
            stats.value.total_leads = 0;
        }
    }
    catch (err) {
        console.error("Error while fetching status:", err);
    }
}

const fetchObject = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard-status2`);
        objs.value = res.data;
    }
    catch (err) {
        console.error("Error while fetching status:", err);
    }
}

const refreshData = async () => {
    isRefreshing.value = true;
    await Promise.all([fetchStatus(), fetchObject()]);
    setTimeout(() => {
        isRefreshing.value = false;
    }, 500);
}

onMounted(() => {
    fetchStatus();
    fetchObject();
});

</script>
