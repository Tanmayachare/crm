<template>
    <div class="flex items-center align-middle justify-between ">
        <div>
            <h2 class="text-base font-normal text-gray-600">{{ tableName }}</h2>
            <h1 class="text-2xl font-bold text-gray-800">{{ fName }}</h1>
        </div>
        <div>
            <router-link :to="`/update/${tableName}/${rowid}`"
                class="bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition whitespace-nowrap shadow-sm">
                Edit
            </router-link>
        </div>
    </div>
    <hr class="my-2 border-gray-300">
    <table class="my-4 w-1/2 text-left table-fixed">
        <thead>
            <tr>
                <th class="text-xs font-light text-gray-600" v-for="(item, index) in header" :key="index">{{ item }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-xs font-normal text-gray-800" v-for="(item, index) in headerVal" :key="index">{{ item }}
                </td>
            </tr>
        </tbody>
    </table>
    <!-- <hr> -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-2">
        <h1 class="py-2 px-3 font-semibold text-base text-gray-500">Details</h1>
        <hr>
        <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <div class="text-sm capitalize pt-1" v-for="(item, index) in fields" :key="index">
                <div class="grid grid-cols-2">
                    <div class="text-gray-800 font-medium">{{ item.Field }}</div>
                    <div class="text-gray-600 font-normal">{{ formData[item.Field] }}</div>
                </div>
                <hr class="my-1">
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

const fName = ref('');
const fields = ref([]);
const opts = ref([]);
const formData = ref({});
const tableName = route.params.tableName;
const rowid = route.params.id;

const header = ['Title', 'Company', 'Phone', 'Email'];
const headerVal = computed(() => {
    return header.map(val => formData.value[val.toLowerCase()]);
});

const fetchdata = async () => {
    try {
        const res1 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${tableName}/fields`)
        const res2 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data/${tableName}`)
        fields.value = res1.data;
        console.log(fields.value)
        formData.value = res2.data.find(f => f.id == rowid);
        fName.value = Object.values(formData.value)[1];
    }
    catch (err) {
        alert("Error while fetching fields");
        console.error("Error while fetching fields:", err);
    }
    const result = fields.value.map(i => i.Type.match(/^enum\((.*)\)$/i));
    opts.value = result.map(i => i ? i[1].split(',').map(j => j.trim().replace(/'/g, "")) : null);
}

onMounted(() => {
    fetchdata();
});
</script>
