<template>
    <div>
        <!-- <pre>{{ fields }}</pre> -->
        <form @submit.prevent="submitForm" id='add'
            class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div v-for="field in fields" :key="field.Field" class="mb-4 block">
                <template v-if="field.Field !== 'id' && field.Field !== 'created_at'">
                    <label class="block text-gray-700 text-sm font-bold mb-2 capitalize">{{ field.Field }}</label>
                    <select v-if="field.Type.includes('enum') || field.Type.includes('ENUM')"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required>
                        <option v-for="opt in opts[fields.indexOf(field)]" :value="opt">{{ opt }}</option>
                    </select>
                    <input v-else-if="getType(field.Type) === 'text'" type="text"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required />
                    <input v-else-if="getType(field.Type) === 'number'" type="number"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required />
                    <input v-else-if="getType(field.Type) === 'date'" type="date"
                        class="border py-2 mb-2 block w-full px-4" v-model="formData[field.Field]" required />
                </template>

                <div v-else>
                    <label class="block text-gray-700 text-sm font-bold mb-2 capitalize">{{ field.Field }}</label>
                    <input class="bg-gray-200 border py-2 mb-2 block w-full px-4" disabled />
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter();
const tableName = route.params.tableName;
const fields = ref([]);
const opts = ref([]);
let formData = ref({});


const getType = (type) => {
    if (type.includes("varchar")) return "text";
    if (type.includes("int") || type.includes("decimal")) return "number";
    if (type.includes("date") || type.includes("datetime")) return "date";

}

const fetchdata = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/schema/objects/${tableName}/fields`)
        fields.value = res.data;
    }
    catch (err) {
        alert("Error while fetching fields");
        console.error("Error while fetching fields:", err);
    }
    const result = fields.value.map(i => i.Type.match(/^enum\((.*)\)$/i));
    opts.value = result.map(i => i ? i[1].split(',').map(j => j.trim().replace(/'/g, "")) : null);
    //console.log(opts.value ? opts.value[3] : "No enum fields found");
}

const submitForm = async () => {
    try {
        if (formData.value == {} || Object.keys(formData.value).length === 0) {
            alert("Please fill the form before submitting");
            return;
        }
        await axios.post(`http://localhost:3000/api/data/${tableName}`, formData.value);
        alert("Form submitted successfully");
        formData = {};
        router.push(`/view/${tableName}`)
    }
    catch (err) {
        alert("Error while submitting form");
        console.error("Error while submitting form:", err);
    }
}

onMounted(() => {
    fetchdata();
});

</script>