<template>
    <div>
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6 flex-col">
            <h1 class="text-3xl font-bold capitalize mb-3">{{ tableName }}</h1>
            <div class="flex justify-between items-center ">
                <input v-model="searchText" placeholder="🔍 Search"
                    class="w-full md:w-64 p-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <router-link :to="`/add/${tableName}`"
                    class="py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition text-sm">
                    + Add Item
                </router-link>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100 text-gray-600 uppercase text-xs leading-normal font-bold">
                        <th v-for="col in fieldName" :key="col" :class="['py-3 px-6']">
                            {{ col }}</th>
                        <th class="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm font-normal">
                    <tr v-for="row in filteredData" :key="row.id"
                        class="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td v-for="col in fieldName" :key="col" :class="['py-3 px-6']">
                            {{ row[col] }}</td>
                        <td class="py-3 px-6 text-center ">
                            <router-link :to="`/update/${tableName}/${row.id}`" ;
                                class="text-gray-400 hover:text-red-500 transition pr-3">
                                <span class="text-lg">🖊</span>
                            </router-link>
                            <button @click="deleteData(row.id)"
                                class="text-gray-400 hover:text-red-500 transition pl-3">
                                <span class="text-lg">🗑️</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="filteredData.length === 0" class="p-8 text-center text-gray-400">
                No data found
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
const searchText = ref('');
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
    if (!searchText.value) return table.value;
    return table.value.filter(row => {
        return col.some(field => {
            return row[field] && row[field].toString().toLowerCase().includes(searchText.value.toLowerCase())
        })
    })
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