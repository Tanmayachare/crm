<template>
    <div class="h-full flex bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">

        <!-- Left Sidebar: Object List -->
        <div class="w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
            <div class="p-4 border-b border-gray-200 bg-white">
                <h2 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Object Manager</h2>
                <div class="flex flex-col gap-2">
                    <!-- <input v-model="newObjName" placeholder="New Object Name (e.g. Projects)"
                        class="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none w-full" /> -->
                    <!-- <button @click="createObject"
                        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded transition shadow-sm flex justify-center items-center gap-1 w-full">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4">
                            </path>
                        </svg>
                        Create Object
                    </button> -->
                    <router-link :to="'/createObj'"
                        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded transition shadow-sm flex justify-center items-center gap-1 w-full"
                        title="Create Object">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4">
                            </path>
                        </svg>
                        Create Object
                    </router-link>
                </div>
            </div>
            <ul class="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <li v-for="obj in Object.keys(objects)" :key="obj" @click="selectObject(obj)"
                    class="px-4 py-2.5 cursor-pointer border-b border-gray-100 flex justify-between items-center transition-colors text-sm"
                    :class="selectedObject === obj ? 'bg-blue-50 border-l-4 border-l-blue-600 font-semibold text-blue-800' : 'hover:bg-gray-50 text-gray-600 border-l-4 border-l-transparent'">
                    <span class="">{{ obj }}</span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </li>
            </ul>
        </div>

        <!-- Right Main Content: Field Manager -->
        <div class="flex-1 flex flex-col bg-white min-w-0">
            <div v-if="selectedObject" class="h-full flex flex-col">

                <!-- Object Header -->
                <div class="px-6 py-4 border-b border-gray-200 bg-white">
                    <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                            </path>
                        </svg>
                        {{ selectedObject }}
                        <span class="text-gray-400 text-sm font-medium ml-2 border-l pl-3 border-gray-300">Fields &
                            Relationships</span>
                    </h1>
                </div>

                <!-- Create Field Form Strip -->
                <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Create Custom Field
                    </h3>
                    <div class="flex flex-wrap md:flex-nowrap gap-3 items-end">

                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-xs text-gray-500 mb-1">Data Type</label>
                            <select v-model="newField.type"
                                class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none">
                                <option value="VARCHAR(255)">Text (String)</option>
                                <option value="INT">Number (Integer)</option>
                                <option value="EMAIL">Email</option>
                                <option value="DECIMAL(10,2)">Currency/Decimal</option>
                                <option value="DATE">Date</option>
                                <option value="BOOLEAN">Checkbox (Boolean)</option>
                                <option value="ENUM">Dropdown (Pick List)</option>
                                <option value="LOOKUP">Lookup Relationship</option>
                            </select>
                        </div>

                        <!-- Conditional Inputs based on explicitly chosen advanced types -->
                        <div v-if="newField.type === 'LOOKUP'" class="flex-1 min-w-[150px]">
                            <label class="block text-xs text-blue-600 font-medium mb-1">Related Object</label>
                            <select v-model="newField.relatedObj" @change="setDefaultName"
                                :class="{ 'text-gray-400': newField.relatedObj === '' }"
                                class="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none">
                                <option value="" disabled selected hidden>Select Object</option>
                                <option v-for="obj in objects" :key="obj">{{ obj }}</option>
                            </select>
                        </div>

                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-xs text-gray-500 mb-1">Field Name</label>
                            <input v-model="newField.name" placeholder="e.g. Assigned To"
                                class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>

                        <div v-if="newField.type === 'ENUM'" class="flex-1 min-w-[200px]">
                            <label class="block text-xs text-blue-600 font-medium mb-1">Pick List Options</label>
                            <input v-model="newField.options" placeholder="Option 1, Option 2, Option 3"
                                class="w-full px-3 py-1.5 text-sm border border-blue-300 rounded bg-blue-50 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>

                        <button @click="addField"
                            class="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px] text-sm font-medium py-1.5 px-4 rounded transition shadow-sm mb-0.5">
                            Save Field
                        </button>
                    </div>
                </div>

                <!-- High-Density Fields Table -->
                <div class="flex-1 overflow-auto custom-scrollbar p-6 bg-white">
                    <div class="border border-gray-200 shadow-sm rounded">
                        <table class="w-full text-left border-collapse whitespace-nowrap">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr class="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                    <th class="py-2.5 px-4 w-1/4 border-r border-gray-100">Field Name</th>
                                    <th class="py-2.5 px-4 w-1/2 border-r border-gray-100">Data Type</th>
                                    <th class="py-2.5 px-4 w-1/6 border-r border-gray-100 text-center">Primary Key?</th>
                                    <th class="py-2.5 px-4 w-1/12 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-700 text-sm">
                                <tr v-for="f in fields" :key="f.Field"
                                    class="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                    <td
                                        class="py-2.5 px-4 font-mono text-sm text-indigo-600 font-medium border-r border-gray-50">
                                        {{ f.Field }}</td>
                                    <td class="py-2.5 px-4 text-gray-600 border-r border-gray-50 truncate max-w-xs"
                                        :title="f.Type">{{ f.Type }}</td>
                                    <td class="py-2.5 px-4 text-center border-r border-gray-50">
                                        <span v-if="f.Key === 'PRI'"
                                            class="inline-flex items-center justify-center bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-2H2v-4h4.257a6 6 0 1111.743-.257zM8 10a2 2 0 100-4 2 2 0 000 4z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            PRI
                                        </span>
                                        <span v-else class="text-gray-300">-</span>
                                    </td>
                                    <td
                                        class="py-2 px-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button v-if="f.Key !== 'PRI'" @click="delteField(f.Field, f.Key)"
                                            class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition"
                                            title="Delete Field">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                </path>
                                            </svg>
                                        </button>
                                        <span v-else class="text-xs text-gray-400 italic">Locked</span>
                                    </td>
                                </tr>
                                <tr v-if="fields.length === 0">
                                    <td colspan="4" class="py-8 text-center text-gray-400">No custom fields created yet.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                </svg>
                <p class="text-lg font-medium text-gray-500">Select an object to manage its fields</p>
                <p class="text-sm mt-1">Or create a new object from the left sidebar.</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import axios from 'axios';
const objects = reactive({})
const selectedObjApi = ref(null)
const selectedObject = ref(null)
const fields = ref([])
// const newObjName = ref('')
const newField = ref({ name: '', type: 'VARCHAR(255)', options: '', relatedObj: '', validation: '' })
// const emoji = ref(['🚗', '🛫', '🌏', '🏟', '🏡', '🌅', '🌄', '❄', '⚽', '🎓', '♟', '🏹', '☎'])

const setDefaultName = () => {
    if (newField.value.relatedObj) {
        newField.value.name = newField.value.relatedObj + '_id';
    }
}

// const fetchObjects = async () => {
//     try {
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects`);
//         objects.value = res.data;
//     }
//     catch (err) {
//         alert("Error while fetching objects");
//     }
// };

const fetchObjects = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tab/data`);
        res.data.forEach(element => {
            objects[element.label] = element.api_name;
        });
        // console.log(objects)
    }
    catch (err) {
        alert("Error while fetching objects");
        console.error("Error while fetching objects:", err);
    }
};


// const createObject = async () => {
//     if (!newObjName.value.trim()) return;
//     try {
//         await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schema/objects`, {
//             tableName: newObjName.value.toLowerCase().replace(/\s/g, '_')
//         })
//         newObjName.value = '';
//         fetchObjects();
//         alert("Object created successfully!");
//     }
//     catch (err) {
//         alert("Error while creating object");
//     }
// }

const selectObject = async (name) => {
    selectedObject.value = name;
    selectedObjApi.value = objects[name];
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${selectedObjApi.value}/fields`);
    fields.value = res.data;
}

const addField = async () => {
    if (!newField.value.name.trim()) return;
    let finalType = newField.value.type;
    // console.log(newField.value);

    if (newField.value.type === 'EMAIL') {
        newField.value.validation = '%@%.%';
        finalType = 'varchar(225)';
    }

    if (newField.value.type === 'BOOLEAN') {
        finalType = "ENUM('true', 'false')";
    }

    if (newField.value.type === 'ENUM') {
        if (!newField.value.options.trim()) return alert("Please provide options for ENUM type");
        const formatted = newField.value.options.split(',').map(i => i.trim()).join("','");
        finalType = `ENUM('${formatted}')`;
    }
    else if (newField.value.type === 'LOOKUP') {
        if (!newField.value.relatedObj.trim()) return alert("Please provide Object Name for Lookup Relation");
    }
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${selectedObjApi.value}/fields`, {
            fieldName: newField.value.name.toLowerCase().replace(/\s/g, '_'),
            fieldType: finalType,
            refObj: newField.value.relatedObj,
        })
        newField.value = { name: '', type: 'VARCHAR(255)', options: '', relatedObj: '' };
        selectObject(selectedObject.value);
        alert("Field added successfully!");
    }
    catch (err) {
        alert("Error while adding field");
        console.log("Error while adding field:", err);
    }
}

const delteField = async (colName, keyType) => {
    if (confirm("Are you sure you want to delete this data?")) {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/schema/objects/${selectedObjApi.value}/${colName}`, {
                data: { key: keyType }
            })
            alert(`${colName} is deleted from ${selectedObject.value}`);
            selectObject(selectedObject.value);
        }
        catch (err) {
            alert("Error while deleting", err)
            console.log(err)
        }
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