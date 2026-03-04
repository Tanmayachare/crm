<template>
    <div class="h-full flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm">
        
        <!-- Toolbar Layer -->
        <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <h2 class="text-lg font-semibold text-gray-800">Leads</h2>
                <span class="text-sm text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full font-medium">{{ filteredLeads.length }} items</span>
            </div>
            
            <div class="flex items-center gap-2 w-full md:w-auto">
                <div class="relative w-full md:w-64">
                    <input v-model="localSearchText" placeholder="Local search..."
                        class="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
                    <svg class="absolute left-2.5 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>
        </div>

        <!-- Inline Quick Add Form (Enterprise Style) -->
        <div class="px-4 py-2 bg-white border-b border-gray-200">
            <form @submit.prevent="addLead" class="flex flex-wrap md:flex-nowrap gap-2 items-center">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2 hidden md:block">Quick Add:</span>
                <input v-model="newLead.name" placeholder="Name" class="flex-1 min-w-[120px] px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" required />
                <input v-model="newLead.company" placeholder="Company" class="flex-1 min-w-[120px] px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" required />
                <div class="relative flex-1 min-w-[100px]">
                    <span class="absolute left-2 top-1 text-gray-500 text-sm">$</span>
                    <input v-model="newLead.value" type="number" placeholder="Value" class="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" required />
                </div>
                <select v-model="newLead.status" class="flex-1 min-w-[100px] px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                </select>
                <button type="submit" class="bg-blue-600 text-white font-medium px-4 py-1 rounded text-sm hover:bg-blue-700 transition whitespace-nowrap shadow-sm">
                    Add Lead
                </button>
            </form>
        </div>

        <!-- High-Density Data Table -->
        <div class="flex-1 overflow-auto bg-white custom-scrollbar">
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead class="sticky top-0 bg-gray-50 z-10 shadow-sm">
                    <tr class="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                        <th class="py-2.5 px-4 font-medium w-10 text-center border-r border-gray-100">#</th>
                        <th class="py-2.5 px-4 font-medium border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition">Name</th>
                        <th class="py-2.5 px-4 font-medium border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition">Company</th>
                        <th class="py-2.5 px-4 font-medium border-r border-gray-100">Status</th>
                        <th class="py-2.5 px-4 font-medium border-r border-gray-100 text-right cursor-pointer hover:bg-gray-100 transition">Value</th>
                        <th class="py-2.5 px-4 font-medium text-center w-16">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700 text-sm">
                    <tr v-for="(lead, index) in filteredLeads" :key="lead.id"
                        class="border-b border-gray-100 hover:bg-blue-50 transition-colors group cursor-default">
                        <td class="py-2 px-4 text-center text-gray-400 text-xs border-r border-gray-50">{{ index + 1 }}</td>
                        <td class="py-2 px-4 font-medium text-gray-900 border-r border-gray-50">{{ lead.name }}</td>
                        <td class="py-2 px-4 border-r border-gray-50">{{ lead.company }}</td>
                        <td class="py-1.5 px-4 border-r border-gray-50">
                            <!-- Enterprise Style Status Pill Dropdown -->
                            <div class="relative inline-block w-full max-w-[120px]">
                                <select v-model="lead.status" @change="updateLead(lead)"
                                    class="w-full appearance-none pr-6 py-0.5 pl-2 rounded-full cursor-pointer text-xs font-semibold uppercase tracking-wide border-transparent focus:ring-2 focus:ring-blue-300 transition-all outline-none"
                                    :class="{
                                        'text-green-800 bg-green-100 hover:bg-green-200 border-green-200': lead.status === 'qualified',
                                        'text-blue-800 bg-blue-100 hover:bg-blue-200 border-blue-200': lead.status === 'contacted',
                                        'text-red-800 bg-red-100 hover:bg-red-200 border-red-200': lead.status === 'lost',
                                        'text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-200': lead.status === 'new'
                                    }">
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="lost">Lost</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </td>
                        <td class="py-2 px-4 font-mono text-right text-gray-600 border-r border-gray-50">${{ Number(lead.value).toLocaleString() }}</td>
                        <td class="py-1 px-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="deleteLead(lead.id)" class="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition" title="Delete record">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="filteredLeads.length === 0" class="flex flex-col items-center justify-center p-12 text-gray-400">
                <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p class="text-sm">No leads found matching your criteria.</p>
            </div>
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

const localSearchText = ref('');

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
    let result = leads.value;
    
    // 1. Local Search Filter
    if (localSearchText.value) {
        const term = localSearchText.value.toLowerCase();
        result = result.filter(lead => 
            lead.name.toLowerCase().includes(term) ||
            lead.company.toLowerCase().includes(term) ||
            lead.status.toLowerCase().includes(term)
        );
    }
    
    return result;
})

onMounted(() => {
    fetchLead();
});

</script>
<style scoped></style>