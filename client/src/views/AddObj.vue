<template>
    <div>
        <form @submit.prevent="createObject" id="add" class="space-y-4">
            <div v-for="value in tabsCol">
                <div v-if="value.Type !== 'tinyint'">
                    <label class="block text-sm font-bold text-gray-700 capitalize">{{ value.Field.replace(/_/g, " ")
                    }}</label>
                    <div v-if="value.Type === 'int'">
                        <input type="number" v-model="newObj[value.Field]"
                            class="w-full border p-2 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            required />
                    </div>
                    <div v-if="value.Type.includes('varchar')">
                        <input type="text" v-model="newObj[value.Field]"
                            class="w-full border p-2 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            required />
                    </div>
                </div>
                <div v-else class="flex items-center gap-2 mt-4">
                    <input type="checkbox" v-model="newObj[value.Field]" id="visibleToggle"
                        class="w-4 h-4 text-blue-600" />
                    <label class="block text-sm font-bold text-gray-700 capitalize">{{ value.Field.replace(/_/g, " ")
                        }}</label>
                </div>
            </div>
        </form>
        <div class="flex justify-center gap-4 mt-2">
            <button @click="$router.back()" type="button"
                class="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition text-sm">
                Cancel
            </button>
            <button type="submit" form="add"
                class="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition text-sm">
                Add
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter()
const newObj = ref({});
const tabsCol = ref([]);

const generateApiName = (objName) => {
    newObj.value.api_name = objName.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '_');
}
const createObject = async () => {
    try {
        if (newObj.value == {} || Object.keys(newObj.value).length === 0) {
            alert("Please fill the form before submitting");
            return;
        }
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schema/objects`, {
            tableName: newObj.value.api_name
        })
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tab/data`, newObj.value)
        // newObj.value = {};
        router.go(-1);
        alert("Object created successfully!");
    }
    catch (err) {
        alert("Error while creating object");
    }
}

const fetchTabsData = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tab/col`);
        tabsCol.value = res.data.filter(a => a.Field != 'id' && a.Field != 'is_standard' && a.Field != 'icon');
        console.log(tabsCol.value);
    }
    catch (err) {
        alert("Error while fetching objects");
        console.error("Error while fetching objects:", err);
    }
};

onMounted(
    fetchTabsData
)

watch(() => newObj.value.label, (newLabel) => {
    generateApiName(newLabel)
})
</script>