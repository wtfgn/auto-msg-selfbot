<template>
    <div class="message-item">
        <div class="author">
            <img :src="userAvatarUrl" alt="avatar" />
            <span class="username">{{ author.username }}</span>
            <span class="timestamp">{{ parsedTimestamp }}</span>
        </div>
        <div class="replying-to" v-if="hasReferencedMessage">
            <Message :msgData="referencedMessage" :showButton="false" :is-referenced-message="true" />
        </div>
        <div class="content" v-if="showContent">
            <p v-for="msgElement in msgElements" :key="msgElement.id" :class="msgElement.type">
                <template v-if="msgElement.type === 'text'">
                    {{ msgElement.content }}
                </template>
                <template v-else-if="msgElement.type === 'emoji'">
                    <img :src="msgElement.url" alt="emoji" />
                </template>
                <template v-else-if="msgElement.type === 'user-mention'">
                    <span class="user-mention">@{{ msgElement.name }}</span>
                </template>
                <template v-else-if="msgElement.type === 'channel-mention'">
                    <span class="channel-mention">#{{ msgElement.name }}</span>
                </template>
                <template v-else-if="msgElement.type === 'role-mention'">
                    <span class="role-mention">@{{ msgElement.name }}</span>
                </template>
                <template v-else-if="msgElement.type === 'everyone-mention'">
                    <span class="everyone-mention">@{{ msgElement.type }}</span>
                </template>
            </p>
        </div>
        <div class="attachments" v-if="showAttachments">
            <MsgAttachment v-for="attachment in attachments" :key="attachment.id" :attachment="attachment" />
        </div>
        <SendMsgCompon type="edit" :msgContent="msgEditContent" v-if="showEditMsgInputBox">
            <template #actionButtonsContainer>
                <ActionButtonsContainer class="action-buttons-container" />
            </template>
        </SendMsgCompon>
        <div class="actions">
            <div class="action">
                <input type="button" class="action-button reply-button" @click="clickReplyButton" value="Reply"
                    v-if="showButton" />
                <input type="button" class="action-button edit-button" @click="clickEditButton" value="Edit"
                    v-if="showEditButton">
            </div>
        </div>
    </div>
</template>

<script setup>
import MsgAttachment from './MsgAttachment.vue';
import SendMsgCompon from './send_msg/SendMsgCompon.vue';
import ActionButtonsContainer from './message_actions/ActionButtonsContainer.vue';
import { computed, ref, toRef } from 'vue'
import { useStore } from './store'

const props = defineProps({ // Define props
    msgData: {
        type: Object,
        required: true,
    },
    showButton: {
        type: Boolean,
        default: true,
    },
    isReferencedMessage: {
        type: Boolean,
        default: false,
    }
})
const store = useStore();
const msgData = toRef(props, 'msgData');
const author = computed(() => msgData.value.author); // User object
const content = computed(() => msgData.value.content);
const timestamp = computed(() => msgData.value.timestamp);
const attachments = computed(() => msgData.value.attachments); // Attachment objects
const mentionUserList = computed(() => msgData.value.mentions); // User objects
const referencedMessage = computed(() => {
    return msgData.value.referenced_message;
}); // Message object
const imgBaseUrl = 'https://cdn.discordapp.com/';
const msgEditContent = ref('');
const selectedEditMessage = toRef(store, 'selectedEditMessage');

const userAvatarUrl = computed(() => {
    // Return the avatar url of the user
    if (author.value.avatar === null) {
        return imgBaseUrl + `embed/avatars/${author.value.discriminator % 5}.png`;
    }
    else {
        return imgBaseUrl + `avatars/${author.value.id}/${author.value.avatar}.png`;
    }
})

// Parse timestamp into a readable format
const parsedTimestamp = computed(() => {
    let date = new Date(timestamp.value);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
})

// Parse message content into elements of text, emojis, and mentions
// An example of emoji: <:OmegaStonks:723370807308582943>
// An example of animated emoji: <a:OmegaStonks:723370807308582943>
// An example of user mention: <@328412633176866827>
// An example of user mention with nickname: <@!328412633176866827>
// An example of channel mention: <#723370807308582943>
// An example of role mention: <@&723370807308582943>
// An example of everyone mention: @everyone

// An example of text object: { type: 'text', content: 'Hello World!' }
// An example of emoji object: { type: 'emoji', id: '723370807308582943', name: 'OmegaStonks', url: 'https://cdn.discordapp.com/emojis/723370807308582943.png' }
// An example of user mention object: { type: 'user-mention', id: '328412633176866827', name: 'OmegaStonks' }
// An example of channel mention object: { type: 'channel-mention', id: '723370807308582943', name: 'general' }
// An example of role mention object: { type: 'role-mention', id: '723370807308582943', name: 'Admin' }

// An example of a message: 'ExampleMessage:<:OmegaStonks:723370807308582943>GoodBye <@328412633176866827> <@!328412633176866827> <#723370807308582943> <@&723370807308582943> Hello World!'
/* Return a list of objects for each message: 
    [
        { type: 'text', content: 'ExampleMessage:' },
        { type: 'emoji', id: '723370807308582943', name: 'OmegaStonks', url: 'https://cdn.discordapp.com/emojis/723370807308582943.png' },
        { type: 'text', content: 'GoodBye ' },
        { type: 'user-mention', id: '328412633176866827', name: 'OmegaStonks' },
        { type: 'user-mention', id: '328412633176866827', name: 'OmegaStonks' },
        { type: 'channel-mention', id: '723370807308582943', name: 'general' },
        { type: 'role-mention', id: '723370807308582943', name: 'Admin' },
        { type: 'text', content: ' Hello World!' },
    ]
*/
const msgElements = computed(() => {
    // Split the message content into a list of strings (text, emojis, and mentions)
    // Note that the emoji could be like: '<:emoji_1:723370807308582943>'
    let msgElementList = content.value.split(/(<:[a-zA-Z0-9-_+]+:[0-9]+>|<a:[[a-zA-Z0-9-_+]+:[0-9]+>|<@[0-9]+>|<@![0-9]+>|<#[0-9]+>|<@&[0-9]+>|@everyone)/);
    // Remove empty strings from the list
    msgElementList = msgElementList.filter((msgElement) => {
        return msgElement !== undefined && msgElement !== '';
    });
    console.log(msgElementList);

    // Parse each element in the list into an object

    // Parse emojis
    msgElementList = msgElementList.map((msgElement) => {
        if (msgElement.startsWith('<:') && msgElement.endsWith('>')) {
            let emojiName = msgElement.split(':')[1];
            let emojiID = msgElement.split(':')[2].split('>')[0];
            return {
                type: 'emoji',
                id: emojiID,
                name: emojiName,
                url: imgBaseUrl + `emojis/${emojiID}.png`,
            }
        }
        if (msgElement.startsWith('<a:') && msgElement.endsWith('>')) {
            let emojiName = msgElement.split(':')[1];
            let emojiID = msgElement.split(':')[2].split('>')[0];
            return {
                type: 'emoji',
                id: emojiID,
                name: emojiName,
                url: imgBaseUrl + `emojis/${emojiID}.gif`,
            }
        }
        return msgElement;
    });

    // Parse user mentions
    msgElementList = msgElementList.map((msgElement) => {
        // Parse only string elements
        if (typeof msgElement !== 'string') return msgElement;
        // Check if the element strictly starts with '<@', followed by a number, and ends with '>',
        // Otherwise, it may confict with role mentions which also starts with '<@'
        if (/^<@[0-9]+>$/.test(msgElement)) {
            let userID = msgElement.split('@')[1].split('>')[0];
            let userName = mentionUserList.value.find((user) => {
                return user.id === userID;
            }).username;
            return {
                type: 'user-mention',
                id: userID,
                name: userName,
            }
        }
        return msgElement;
    });

    // Parse channel mentions
    msgElementList = msgElementList.map((msgElement) => {
        if (typeof msgElement !== 'string') return msgElement;
        if (msgElement.startsWith('<#') && msgElement.endsWith('>')) {
            let channelID = msgElement.split('#')[1].split('>')[0];
            let channelName = store.channels.find((channel) => {
                return channel.id === channelID;
            }).name;
            return {
                type: 'channel-mention',
                id: channelID,
                name: channelName,
            }
        }
        return msgElement;
    });

    // Parse role mentions
    msgElementList = msgElementList.map((msgElement) => {
        if (typeof msgElement !== 'string') return msgElement;
        if (msgElement.startsWith('<@&') && msgElement.endsWith('>')) {
            let roleID = msgElement.split('&')[1].split('>')[0];
            let roleName = store.roles.find((role) => {
                return role.id === roleID;
            }).name;
            return {
                type: 'role-mention',
                id: roleID,
                name: roleName,
            }
        }
        return msgElement;
    });

    // Parse everyone mentions
    msgElementList = msgElementList.map((msgElement) => {
        if (msgElement === '@everyone') {
            return {
                type: 'everyone-mention',
            }
        }
        return msgElement;
    });

    // // Parse text
    msgElementList = msgElementList.map((msgElement) => {
        if (typeof msgElement === 'string') {
            return {
                type: 'text',
                content: msgElement,
            }
        }
        return msgElement;
    });
    return msgElementList;
})

// Reply
const clickReplyButton = () => {
    store.selectedReplyMessage = msgData.value;
}
const hasReferencedMessage = computed(() => {
    return msgData.value.hasOwnProperty('referenced_message') && msgData.value.referenced_message !== null;
})


// Edit
const clickEditButton = () => {
    if (showEditMsgInputBox.value === false && // Only show the edit message input box if it is not already shown
        selectedEditMessage.value === null || selectedEditMessage.value.id !== msgData.value.id) {
        store.selectedEditMessage = msgData.value;
        msgEditContent.value = content.value;
    }
    else {
        store.selectedEditMessage = null;
    }
}

const showEditMsgInputBox = computed(() => {
    return selectedEditMessage.value !== null && selectedEditMessage.value.id === msgData.value.id // Only show the edit message input box if the message is selected
        && store.selectedReplyMessage === null // Only show the edit message input box if the user is not replying to a message
        && props.isReferencedMessage === false; // Only show the edit message input box if the message is not a referenced message
})

const showEditButton = computed(() => {
    // Only show the edit button if the message is sent by the user
    return props.showButton && author.value.id === store.user.id;
})

const showContent = computed(() => {
    return msgElements.value.length > 0 && showEditMsgInputBox.value === false;
})

const showAttachments = computed(() => {
    return attachments.value.length > 0 && showEditMsgInputBox.value === false;
})

</script>

<style scoped>
* {
    box-sizing: border-box;
}

.message-item {
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
    background-color: #2f3136;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    height: auto;
    color: white;
}

.author {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: auto;
}

.author img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
}

.author .username {
    margin-right: 5px;
}

.author .timestamp {
    font-size: 12px;
    color: rgb(134, 134, 134);
}

/* Text and emoji should be at one row
    They should also be aligned on the same line*/
.content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    height: auto;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    flex-wrap: wrap;
}

.content p {
    margin: 0;
    padding: 0;
    margin-right: 2px;
    margin-left: 2px;
    margin-top: 2px;
    margin-bottom: 2px;
    text-align: left;
}

.content p.text {
    display: inline;
    font-size: 20px;
    word-wrap: break-word;
    /* Break words if they are too long */
    word-break: break-all;
    /* Break words if they are too long */
}

.content p.emoji {
    display: inline;
    width: 20px;
    height: 20px;
}

.content p.emoji img {
    width: 100%;
    height: 100%;
}

/* Animation for emojis */
.content p.emoji {
    animation-name: emoji;
    animation-duration: 1s;
    animation-iteration-count: infinite;
}

@keyframes emoji {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

/* Emoji animation when hovering, emojis should spin */
.content p.emoji:hover {
    animation-name: emoji-hover;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
}

@keyframes emoji-hover {
    0% {
        transform: scale(1) rotate(0deg);
    }

    50% {
        transform: scale(1.2) rotate(180deg);
    }

    100% {
        transform: scale(1) rotate(360deg);
    }
}

/* Attachments */
.attachments {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    height: auto;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
}



/* Mentions */
.content p.user-mention,
.content p.channel-mention,
.content p.role-mention,
.content p.everyone-mention {
    color: rgb(114, 137, 218);
    cursor: pointer;
    background-color: rgba(114, 137, 218, 0.1);
    border-radius: 3px;
    padding: 1px;
    margin: 1px;
    transition: background-color 0.2s ease-in-out;
}

.content p.user-mention:hover,
.content p.channel-mention:hover,
.content p.role-mention:hover,
.content p.everyone-mention:hover {
    text-decoration: underline;
    background-color: rgba(114, 137, 218, 0.2);
}

.content p.user-mention::selection,
.content p.channel-mention::selection,
.content p.role-mention::selection,
.content p.everyone-mention::selection {
    background: transparent;
}

.actions {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: auto;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
}

.actions .action {
    margin-right: 5px;
}

.actions .action .action-button {
    padding: 5px;
    border-radius: 5px;
    background-color: #36393f;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.actions .action .action-button:hover {
    background-color: #2f3136;
}

.actions .action .action-button:active {
    background-color: #202225;
}

.actions .action .action-button:focus {
    outline: none;
}

.replying-to {
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
    background-color: #3a3c41;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    height: auto;
    color: white;
}

.replying-to .message-item {
    margin: 0;
    padding: 0;
    border-radius: 0;
    background-color: transparent;
}

.replying-to .message-item .author,
.replying-to .message-item .content,
.replying-to .message-item .attachments {
    margin: 0;
    padding: 0;
    border-radius: 0;
    background-color: transparent;
}

.replying-to .message-item .author .username,
.replying-to .message-item .content p {
    color: rgb(134, 134, 134);
    font-size: 14px;
}

.replying-to .message-item .author .timestamp {
    color: rgb(134, 134, 134);
    font-size: 12px;
}

.replying-to .message-item .content p.user-mention,
.replying-to .message-item .content p.channel-mention,
.replying-to .message-item .content p.role-mention,
.replying-to .message-item .content p.everyone-mention {
    color: rgb(114, 137, 218);
}

.replying-to .message-item .content p.user-mention:hover,
.replying-to .message-item .content p.channel-mention:hover,
.replying-to .message-item .content p.role-mention:hover,
.replying-to .message-item .content p.everyone-mention:hover {
    text-decoration: underline;
}

.replying-to .message-item .content p.user-mention::selection,
.replying-to .message-item .content p.channel-mention::selection,
.replying-to .message-item .content p.role-mention::selection,
.replying-to .message-item .content p.everyone-mention::selection {
    background: transparent;
}

.replying-to .message-item .content p.emoji {
    animation-name: emoji;
    animation-duration: 1s;
    animation-iteration-count: infinite;
}

.replying-to .message-item .content p.emoji:hover {
    animation-name: emoji-hover;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
}

.replying-to .message-item .content p.emoji img {
    width: 20px;
    height: 20px;
}

.replying-to .message-item .content p.text {
    font-size: 16px;
}

.replying-to .message-item .content p.emoji {
    width: 16px;
    height: 16px;
}
</style>