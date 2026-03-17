<template>
    <div>
        <form @submit.prevent="update" id='update'
            class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div v-for="field in fields" :key="field.Field" class="mb-2  block">
                <template v-if="field.Field !== 'id' && field.Field !== 'created_at'">
                    <label class="block text-gray-700 text-sm font-bold mb-2 capitalize">{{ field.Field }}</label>
                    <select v-if="field.Type.includes('enum') || field.Type.includes('ENUM')"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required>
                        <option v-for="opt in opts[fields.indexOf(field)]">{{ opt }}</option>
                    </select>
                    <input v-else-if="getType(field.Type) === 'text'" type="text"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" />
                    <input v-else-if="getType(field.Type) === 'number'" type="number"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required />
                    <input v-else-if="getType(field.Type) === 'date'" type="date"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required />
                </template>

                <div v-else>
                    <label class="block text-gray-700 text-sm font-bold mb-2 capitalize">{{ field.Field }}</label>
                    <input class="bg-gray-200 border py-2 mb-2 block w-full px-4" :value="formData[field.Field]"
                        disabled />
                </div>
            </div>
        </form>
        <div class="flex justify-center gap-4 mt-2">
            <button @click="$router.back()" type="button"
                class="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition text-sm">
                Cancel
            </button>
            <button type="submit" form="update"
                class="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition text-sm">
                Update
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter();
const tableName = route.params.tableName;
const rowid = route.params.id;
const fields = ref([]);
const opts = ref([]);
const formData = ref({});

const getType = (type) => {
    if (type.includes("varchar")) return "text";
    if (type.includes("int") || type.includes("decimal")) return "number";
    if (type.includes("date") || type.includes("datetime")) return "date";
}

const fetchdata = async () => {
    try {
        const res1 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${tableName}/fields`)
        const res2 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data/${tableName}`)
        fields.value = res1.data;
        // console.log(fields.value)
        formData.value = res2.data.find(f => f.id == rowid);
        // console.log(formData.value)
    }
    catch (err) {
        alert("Error while fetching fields");
        console.error("Error while fetching fields:", err);
    }
    const result = fields.value.map(i => i.Type.match(/^enum\((.*)\)$/i));
    opts.value = result.map(i => i ? i[1].split(',').map(j => j.trim().replace(/'/g, "")) : null);
}
const update = async () => {
    try {
        if (formData.value == {} || Object.keys(formData.value).length === 0) {
            alert("Please fill the form before submitting");
            return;
        }
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/data/${tableName}/${rowid}`, formData.value);
        alert("Record updated successfully")
        router.push(`/view/${tableName}`)
    } catch (err) {
        alert("Error while updating record");
        console.log(err);
    }
}
onMounted(() => {
    fetchdata();
});

</script>