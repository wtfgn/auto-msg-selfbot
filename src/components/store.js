import { reactive, ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('main', () => {
    const _user = ref(null); // user object
    const _guilds = ref([]); // array of guild objects
    const _channels = ref([]); // array of channel objects
    const _messages = ref([]); // array of message objects
    const _roles = ref([]); // array of role objects
    const _emojis = ref([]); // array of emoji objects
    const _guildID = ref(''); // string of guild ID
    const _channelID = ref(''); // string of channel ID
    const _selectedReplyMessage = ref(null) // message object
    const _selectedEditMessage = ref(null) // message object

    const setUser = (user) => {
        _user.value = user;
        // console.log(`The current user is ${_user.value}`);
    };
    const setGuilds = (guilds) => {
        _guilds.value = guilds;
        // console.log(`The current guilds are ${_guilds.value}`);
    };
    const setChannels = (channels) => {
        _channels.value = channels;
        // console.log(`The current channels are ${_channels.value}`);
    };
    const setRoles = (roles) => {
        _roles.value = roles;
        // console.log(`The current roles are ${_roles.value}`);
    };
    const setEmojis = (emojis) => {
        _emojis.value = emojis;
        // console.log(`The current emojis are ${_emojis.value}`);
        // console.log(`The current emojis are ${JSON.stringify(_emojis.value[0])}`);
    };
    const addMessage = (message) => {
        _messages.value.push(message);
        // console.log(`The current messages are ${_messages.value}`);
    };
    const setMessages = (messages) => {
        _messages.value = messages;
        // console.log(`The current messages are ${_messages.value}`);
    };
    const setGuildID = (id) => {
        _guildID.value = id;
        // console.log(`The current guild ID is ${_guildID.value}`);
    };
    const setChannelID = (id) => {
        _channelID.value = id;
        // console.log(`The current channel ID is ${_channelID.value}`);
    };
    const setSelectedReplyMessage = (message) => {
        _selectedReplyMessage.value = message;
        // console.log(`The current selected message is ${_selectedMessage.value}`);
    };
    const setSelectedEditMessage = (message) => {
        _selectedEditMessage.value = message;
        // console.log(`The current selected message is ${_selectedMessage.value}`);
    };

    const user = computed({
        get: () => _user.value,
        set: (user) => setUser(user),
    });
    const guilds = computed({
        get: () => _guilds.value,
        set: (guilds) => setGuilds(guilds),
    });
    const channels = computed({
        get: () => _channels.value,
        set: (channels) => setChannels(channels),
    });
    const roles = computed({
        get: () => _roles.value,
        set: (roles) => setRoles(roles),
    });
    const emojis = computed({
        get: () => _emojis.value,
        set: (emojis) => setEmojis(emojis),
    });
    const messages = computed({
        get: () => _messages.value,
        set: (messages) => setMessages(messages),
    });
    const selectedGuildID = computed({
        get: () => _guildID.value,
        set: (id) => setGuildID(id),
    });
    const selectedChannelID = computed({
        get: () => _channelID.value,
        set: (id) => setChannelID(id),
    });
    const selectedReplyMessage = computed({
        get: () => _selectedReplyMessage.value,
        set: (message) => setSelectedReplyMessage(message),
    });
    const selectedEditMessage = computed({
        get: () => _selectedEditMessage.value,
        set: (message) => setSelectedEditMessage(message),
    });

    return {
        setUser,
        setGuilds,
        setChannels,
        setRoles,
        setEmojis,
        addMessage,
        setMessages,
        setGuildID,
        setChannelID,
        setSelectedReplyMessage,
        setSelectedEditMessage,
        user,
        guilds,
        channels,
        roles,
        emojis,
        messages,
        selectedGuildID,
        selectedChannelID,
        selectedReplyMessage,
        selectedEditMessage,
    };
});
