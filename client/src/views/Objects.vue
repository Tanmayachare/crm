<template>
    <div class="flex h-screen bg-gray-100 border-r">
        <div class="w-1/3 bg-white border-r p-6 overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">Object Manager</h2>
            <div class="flex gap-2 mb-6">
                <input v-model="newObjName" placeholder="New Object Name (e.g. Projects)"
                    class="border p-2 rounded w-full" />
                <button @click="createObject" class="bg-blue-600 text-white px-4 rounded">+</button>
            </div>
            <ul>
                <li v-for="obj in objects" :key="obj" @click="selectObject(obj)"
                    class="p-3 cursor-pointer hover:bg-blue-50 border-b flex justify-between"
                    :class="{ 'bg-blue-100 font-bold': selectedObject === obj }">
                    <span>{{ obj }}</span>
                    <span>></span>
                </li>
            </ul>
        </div>

        <div class="w-2/3 px-5">
            <div v-if="selectedObject">
                <h1 class="text-3xl font-bold mb-3 capitalize">{{ selectedObject }}
                    <span class="text-gray-400 text-lg">Fields & Relationships</span>
                </h1>
                <div class="bg-white p-6 rounded shadow mb-4">
                    <h3 class="font-bold mb-4">Create Custom Field</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input v-model="newField.name" placeholder="Field Name (e.g. Budget)"
                            class="border p-2 rounded flex-1" />
                        <select v-model="newField.type" class="border p-2 rounded">
                            <option value="VARCHAR(255)">Text</option>
                            <option value="INT">Number (Integer)</option>
                            <option value="DECIMAL(10,2)">Currency/Decimal</option>
                            <option value="DATE">Date</option>
                            <option value="BOOLEAN">Checkbox(True/False)</option>
                            <option value="ENUM">Dropdown (pick List)</option>
                        </select>
                        <label v-if="newField.type === 'ENUM'">
                            <input v-model="newField.options" placeholder="Options (comma separated)"
                                class="border p-2 rounded flex-1 w-full" />
                        </label>
                        <button @click="addField"
                            class="bg-green-600 text-white py-2 px-6 rounded font-bold">Save</button>
                    </div>
                </div>
                <div class="bg-white rounded shadow overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="p-3 w-1/4">Field Name</th>
                                <th class="p-3 w-1/2">Type</th>
                                <th class="p-3 w-1/4">Primary Key?</th>
                                <th class="p-3 w-1/12 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="f in fields" :key="f.Field" class="border-b">
                                <td class="p-3 font-mono text-blue-600">{{ f.Field }}</td>
                                <td class="p-3 text-gray-500 text-wrap">{{ f.Type }}</td>
                                <td class="p-3">{{ f.Key === 'PRI' ? '🔑' : '' }}</td>
                                <td class="p-3"><button @click="delteField(f.Field)">🗑️</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="text-center text-gray-400 mt-20">
                <p class="text-xl">Select an object from the left to edit its fields.</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import fetchObjectsNav from '../App.vue';
const objects = ref([])
const selectedObject = ref(null)
const fields = ref([])
const newObjName = ref('')
const newField = ref({ name: '', type: 'VARCHAR(255)', options: '' })
// const emoji = ref(['🚗', '🛫', '🌏', '🏟', '🏡', '🌅', '🌄', '❄', '⚽', '🎓', '♟', '🏹', '☎'])


const fetchObjects = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects`);
        objects.value = res.data;
    }
    catch (err) {
        alert("Error while fetching objects");
    }
};

const createObject = async () => {
    if (!newObjName.value.trim()) return;
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schema/objects`, {
            tableName: newObjName.value.toLowerCase().replace(/\s/g, '_')
        })
        newObjName.value = '';
        fetchObjects();
        alert("Object created successfully!");
    }
    catch (err) {
        alert("Error while creating object");
    }
}

const selectObject = async (name) => {
    selectedObject.value = name;
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${name}/fields`);
    fields.value = res.data;
}

const addField = async () => {
    if (!newField.value.name.trim()) return;
    let finalType = newField.value.type;

    if (newField.value.type === 'ENUM') {
        if (!newField.value.options.trim()) return alert("Please provide options for ENUM type");

        const formatted = newField.value.options.split(',').map(i => i.trim()).join("','");
        finalType = `ENUM('${formatted}')`;
    }
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${selectedObject.value}/fields`, {
            fieldName: newField.value.name.toLowerCase().replace(/\s/g, '_'),
            fieldType: finalType,
        })
        newField.value = { name: '', type: 'VARCHAR(255)', options: '' };
        selectObject(selectedObject.value);
        alert("Field added successfully!");
    }
    catch (err) {
        alert("Error while adding field");
        console.log("Error while adding field:", err);
    }
}

const delteField = async (colName) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${selectedObject.value}/${colName}`)
        alert(`${colName} is deleted from ${selectedObject.value}`);
        selectObject(selectedObject.value);
    }
    catch (err) {
        alert("Error while deleting", err)
        console.log(err)
    }
}
onMounted(() => {
    fetchObjects();
});
// watch(objects, () => {
//     fetchObjects();
//     fetchObjectsNav();
// })
</script>
<style scoped></style>