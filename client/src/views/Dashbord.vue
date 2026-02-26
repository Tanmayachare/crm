<template>
    <div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 class="text-gray-500 text-sm uppercase font-bold tracking-wider">Total Leads</h3>
                <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.total_leads }}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <h3 class="text-gray-500 text-sm uppercase font-bold tracking-wider">Pipeline Value</h3>
                <p class="text-3xl font-bold text-gray-800 mt-2">${{ Number(stats.total_value).toLocaleString() }}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                <h3 class="text-gray-500 text-sm uppercase font-bold tracking-wider">Total Objects</h3>
                <p class="text-3xl font-bold text-gray-800 mt-2">{{ objs.total_objects }}</p>
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

onMounted(() => {
    fetchStatus();
    fetchObject();
});

</script>

<!-- <style scoped>
select {
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
}

.status-green {
    border: 2px solid #10B981;
    color: #047857;
}

.status-red {
    border: 2px solid #EF4444;
    color: #B91C1C;
}

.status-blue {
    border: 2px solid #3B82F6;
    color: #1D4ED8;
}

.form-container {
    display: flex;
    gap: 20px;
    background: rgb(189, 189, 189);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
}

input,
select,
button {
    padding: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
}

button {
    background-color: #00A1E0;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #007bb0;
}

.stats-container {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
}

.card {
    background: white;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    margin-top: 10px;
    width: 200px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h3 {
    margin: 0;
    color: #666;
    font-size: 14px;
    text-transform: uppercase;
}

.big-number {
    font-size: 28px;
    font-weight: bold;
    margin: 10px 0 0 0;
    color: #333;
}
</style> -->
