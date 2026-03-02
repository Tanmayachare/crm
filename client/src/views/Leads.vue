<template>
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-700">Lead Management</h2>
            <input v-model="searchText" placeholder="🔍 Search leads..."
                class="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <form @submit.prevent="addLead"
            class="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input v-model="newLead.name" placeholder="Name" class="p-2 border rounded text-sm" required />
            <input v-model="newLead.company" placeholder="Company" class="p-2 border rounded text-sm" required />
            <input v-model="newLead.value" type="number" placeholder="Value" class="p-2 border rounded text-sm"
                required />
            <select v-model="newLead.status" class="p-2 border rounded text-sm">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
            </select>
            <button type="submit"
                class="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition text-sm">
                + Add Lead
            </button>
        </form>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-100 text-gray-600 uppercase text-xs leading-normal font-bold">
                    <th class="py-3 px-6">Name</th>
                    <th class="py-3 px-6">Company</th>
                    <th class="py-3 px-6">Status</th>
                    <th class="py-3 px-6">Value</th>
                    <th class="py-3 px-6 text-center">Actions</th>
                </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
                <tr v-for="lead in filteredLeads" :key="lead.id"
                    class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="py-3 px-6 font-medium text-gray-800">{{ lead.name }}</td>
                    <td class="py-3 px-6">{{ lead.company }}</td>
                    <td class="py-3 px-6">
                        <select v-model="lead.status" @change="updateLead(lead)"
                            class="bg-transparent font-bold py-1 px-2 rounded focus:outline-none cursor-pointer text-xs uppercase tracking-wide"
                            :class="{
                                'text-green-600 bg-green-50': lead.status === 'qualified',
                                'text-blue-600 bg-blue-50': lead.status === 'contacted',
                                'text-red-500 bg-red-50': lead.status === 'lost',
                                'text-gray-500 bg-gray-100': lead.status === 'new'
                            }">
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="lost">Lost</option>
                        </select>
                    </td>
                    <td class="py-3 px-6 font-mono">${{ Number(lead.value).toLocaleString() }}</td>
                    <td class="py-3 px-6 text-center">
                        <button @click="deleteLead(lead.id)" class="text-gray-400 hover:text-red-500 transition">
                            <span class="text-lg">🗑️</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="filteredLeads.length === 0" class="p-8 text-center text-gray-400">
            No leads found matching your search.
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';


const leads = ref([]);

const newLead = ref({
    name: '',
    company: '',
    status: 'new',
    value: 0,
});

const searchText = ref('');

const addLead = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/leads`, newLead.value);

        newLead.value = {
            name: '',
            company: '',
            status: 'new',
            value: 0,
        }
        fetchLead();
        alert("Lead added successfully!");
    }
    catch (err) {
        console.error("Error while adding lead:", err);
    }
}

const fetchLead = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/leads`)
        leads.value = res.data;
        // console.log(leads)
    }
    catch (err) {
        console.error("Error while fetching leads:", err);
    }

}

const deleteLead = async (id) => {
    if (confirm("Are you sure you want to delete this lead?")) {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/leads/${id}`);
            fetchLead();
            alert("Lead deleted successfully!");
        }
        catch (err) {
            console.error("Error while deleting lead:", err);
        }
    }
}

const updateLead = async (lead) => {
    try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/leads/${lead.id}`, {
            status: lead.status
        })
        alert("Status saved for " + lead.name)
    }
    catch (err) {
        console.error("Error while updating lead:", err);
    }
}


const filteredLeads = computed(() => {
    if (!searchText.value) return leads.value;
    return leads.value.filter(lead => {
        const nameMatch = lead.name.toLowerCase().includes(searchText.value.toLowerCase())
        const companyMatch = lead.company.toLowerCase().includes(searchText.value.toLowerCase())
        return nameMatch || companyMatch
    })
})

onMounted(() => {
    fetchLead();
});

</script>
<style scoped></style>