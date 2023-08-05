<template>
    <div id="selection-box">
        <select id="guild-select" v-model="selectedGuild">
            <option v-for="guild in guilds" :key="guild.id" :value="guild.id">{{ guild.name }}</option>
        </select>

        <select id="channel-select" v-model="selectedChannel">
            <option v-for="channel in textChannels" :key="channel.id" :value="channel.id">{{ channel.name }}</option>
        </select>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, toRef, watch } from 'vue';
import axios from 'axios';
import { useStore } from './store';


// two-way ref that syncs with the original property.
// Therefore, if the value of the original property changes, the value of the ref will be updated, and vice-versa.
// Or you can simply use store.guilds to access the value of the ref, and store.setGuilds to update the value of the ref.
const store = useStore();
const guilds = toRef(store, 'guilds');
const channels = toRef(store, 'channels')
const textChannels = computed(() => channels.value.filter(channel => channel.type === 0 || channel.type === 2));
const roles = toRef(store, 'roles');
const emojis = toRef(store, 'emojis');
const messages = toRef(store, 'messages');
const selectedGuild = toRef(store, 'selectedGuildID');
const selectedChannel = toRef(store, 'selectedChannelID');

const getGuilds = async () => {
    // res returns a list of partial guild objects the current user is a member of.
    const res = await axios({
        method: 'get',
        url: 'http://localhost:3000/getGuilds',
    });
    guilds.value = res.data;
    selectedGuild.value = res.data[0].id; // Set the first guild as the default selected guild.
}

const getChannels = async () => {
    // res returns a list of guild channel objects.
    const res = await axios({
        method: 'post',
        url: 'http://localhost:3000/getChannels',
        data: {
            guildID: selectedGuild.value,
        }
    });
    channels.value = res.data;
    selectedChannel.value = textChannels.value[0].id; // Set the first text channel as the default selected channel.
}

const getRoles = async () => {
    // res returns a list of guild role objects.
    const res = await axios({
        method: 'post',
        url: 'http://localhost:3000/getRoles',
        data: {
            guildID: selectedGuild.value,
        }
    });
    roles.value = res.data;
}

const getEmojis = async () => {
    // res returns a list of guild emoji objects.
    const res = await axios({
        method: 'post',
        url: 'http://localhost:3000/getEmojis',
        data: {
            guildID: selectedGuild.value,
        }
    });
    emojis.value = res.data;
}

const getMsgHistory = async () => {
    // res returns a list of message objects.
    const res = await axios({
        method: 'post',
        url: 'http://localhost:3000/getMsgHistory',
        data: {
            channelID: store.selectedChannelID,
        }
    });
    messages.value = res.data.reverse(); // Reverse the array so that the latest message is at the bottom.
}
watch(selectedGuild, () => {
    getChannels();
    getRoles();
    getEmojis();
});

watch(selectedChannel, () => {
    getMsgHistory();
});

onBeforeMount(() => {
    getGuilds();
});

</script>

<style scoped>
* {
    box-sizing: border-box;
}

#selection-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    padding: 5px;
    box-sizing: border-box;
    color: white;
}

#guild-select {
    flex: 1;
    /* width: 100%; */
    height: 100%;
    border: 1px solid rgb(255, 255, 255);
    border-radius: 5px;
    padding: 5px;
    color: white;
    background-color: #36393f;
}
#channel-select {
    flex: 1;
    /* width: 100%; */
    height: 100%;
    border: 1px solid rgb(255, 255, 255);
    border-radius: 5px;
    padding: 5px;
    color: white;
    background-color: #36393f;
}
</style>