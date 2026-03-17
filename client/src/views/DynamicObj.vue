<template>
    <div>
        <!-- Toolbar Layer -->
        <div
            class="px-4 py-3 flex flex-col md:flex-row gap-3 justify-between items-center bg-gray-50 border-b border-gray-200">
            <div class="flex items-center gap-3 w-full md:w-auto">
                <h2 class="text-base font-semibold text-gray-800 tracking-tight capitalize">{{ tableName }}</h2>
                <div class="h-4 w-px bg-gray-300"></div>
                <span class="text-xs text-gray-500 font-medium">{{ filteredData.length }} items</span>
            </div>

            <div class="flex items-center gap-3">
                <div class="relative">
                    <input type="text" v-model="localSearchText" placeholder="Local search..."
                        class="w-64 pl-9 pr-4 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
                    <svg class="absolute left-3 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <router-link :to="`/add/${tableName}`"
                    class="bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition whitespace-nowrap shadow-sm">
                    + Add Item
                </router-link>
            </div>
        </div>

        <!-- High-Density Data Table -->
        <div class="flex-1 overflow-auto bg-white custom-scrollbar">
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead class="sticky top-0 bg-gray-50 z-10 shadow-sm">
                    <tr class="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                        <th class="py-2.5 px-4 font-medium w-10 text-center border-r border-gray-100">#</th>
                        <th v-for="col in fieldName" :key="col"
                            class="py-2.5 px-4 font-medium border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition">
                            {{ col }}
                        </th>
                        <th class="py-2.5 px-4 font-medium text-center w-24">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700 text-sm">
                    <tr v-for="(row, index) in filteredData" :key="row.id"
                        class="border-b border-gray-100 hover:bg-blue-50 transition-colors group cursor-default">
                        <td class="py-2 px-4 text-center text-gray-400 text-xs border-r border-gray-50">{{ index + 1 }}
                        </td>
                        <td v-for="(col, cindex) in fieldName" :key="col" class="py-2 px-4 border-r border-gray-50"
                            :class="{ 'text-blue-500': cindex === 0 }">
                            <router-link :to="`/detailview/${tableName}/${row.id}`" v-if="cindex === 0">{{ row[col]
                                }}</router-link>
                            <span v-else>{{ row[col] }}</span>
                        </td>
                        <td class="py-1 px-4 text-center opacity-100 transition-opacity flex justify-center gap-2">
                            <router-link :to="`/update/${tableName}/${row.id}`"
                                class="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-100 transition"
                                title="Edit record">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                    </path>
                                </svg>
                            </router-link>
                            <button @click="deleteData(row.id)"
                                class="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                                title="Delete record">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="filteredData.length === 0" class="flex flex-col items-center justify-center p-12 text-gray-400">
                <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
                    </path>
                </svg>
                <p class="text-sm">No data found matching your criteria.</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'

const route = useRoute()

const table = ref([]);
const fields = ref([]);
let tableName = route.params.tableName;
const localSearchText = ref('');
let col = ref([]);
let fieldName = ref([])

const fetchTables = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data/${tableName}`)
        table.value = res.data;
        // console.log(table.value)
    }
    catch (err) {
        alert("Error while fetching table data");
        console.error("Error while fetching table data:", err);
    }
}

const fetchdata = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${tableName}/fields`)
        fields.value = res.data;
        col = fields.value.filter(f => f.Type.includes("varchar")).map(i => i.Field)
        // console.log(fields.value);
        fieldName = fields.value.map(f => f.Field).filter(f => f !== 'id' && f !== 'created_at');
        // console.log(fieldName)
    }
    catch (err) {
        alert("Error while fetching fields");
        console.error("Error while fetching fields:", err);
    }
}

const deleteData = async (id) => {
    if (confirm("Are you sure you want to delete this data?")) {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/data/${tableName}/${id}`);
            fetchTables();
            alert("Data deleted successfully!");
        }
        catch (err) {
            console.error("Error while deleting data:", err);
        }
    }
}

const filteredData = computed(() => {
    let result = table.value;
    // Search Filter
    if (localSearchText.value && result.length > 0) {
        const lowerLocal = localSearchText.value.toLowerCase();
        result = result.filter(row => {
            return Object.values(row).some(val =>
                String(val).toLowerCase().includes(lowerLocal)
            );
        });
    }
    return result;
})

const loadPage = async () => {
    tableName = route.params.tableName
    await fetchdata()
    await fetchTables()
}

onMounted(async () => {
    await fetchdata()
    await fetchTables()
});

watch(() => route.params.tableName, () => {
    loadPage();
})
</script>