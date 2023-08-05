<template>
    <div class="input-box">
        <textarea ref="msgInputBox" v-model="msgContent" @keydown.enter.exact="preSendMsg"
            class="msg-input" placeholder="Type your message here" autofocus></textarea>
    </div>
</template>

<script setup>
import { inject, onMounted, ref, toRef, watch } from 'vue'
import { useStore } from '../store';

const emit = defineEmits({
    submitMsg: (msg) => {
        return typeof msg === 'string';}
})
const props = defineProps({
    type: {
        type: String,
        default: 'normal',
    }
})


const store = useStore();
const msgInputBox = ref(null);
const msgContent = inject('msgContent');

const preSendMsg = async (e) => {
    try {
        if (e.key === 'Enter' && !e.shiftKey) { // Send the message if the user presses enter and not shift
            if (props.type === 'edit') {
                if (msgContent.value === store.selectedEditMessage.content) {
                    store.selectedEditMessage = null;
                    return;
                }
            }
            e.preventDefault(); // Prevent the textarea from adding a new line
            isValidMsg(msgContent.value); // Check if the message is valid
            emit('submitMsg', msgContent.value);
            msgContent.value = ''; // Clear the message
        }
    } catch (err) {
        alert(err);
    }
}

const isValidMsg = (msg) => {
    if (msg.trim() === '') {
        throw new Error('Message is empty');
    }
    else if (msg.length > 2000) {
        throw new Error('Message is too long');
    }
}

// const msgCommands = (msg) => {
//     // Example: /clear
//     if (msg.startsWith('/')) {
//         const command = msg.split(' ')[0].substring(1); // Remove the '/' from the command
//         const args = msg.split(' ').slice(1); // Remove the command from the args, Example: /clear 1 2 3 -> 1 2 3
//         switch (command) {
//             case 'clear':
//                 store.messages = [];
//                 break;
//             case 'help':
//                 alert('Commands:\n/clear - Clear the chat\n/help - Show this message');
//                 break;
//             default:
//                 alert('Invalid command');
//                 break;
//         }
//     }
// }

// Auto resize the textarea
watch(msgContent, () => {
    msgInputBox.value.style.height = 'auto'; // Reset the height, so it can auto resize
    msgInputBox.value.style.height = msgInputBox.value.scrollHeight + 'px'; // Set the height to the scroll height
});

onMounted(() => {
    msgInputBox.value.style.height = msgInputBox.value.scrollHeight + 'px';
    msgInputBox.value.focus();
});

</script>

<style scoped>
.msg-input {
    border: none;
    background-color: #36393f;
    color: white;
    padding: 5px;
    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    resize: none;
}

/* Remove the outline when the input is focused */
.msg-input:focus {
    outline: none;
}

/* Make the textarea auto resize */
.msg-input {
    overflow: hidden;
    word-wrap: break-word;
}

.msg-input::-webkit-scrollbar {
    width: 5px;
}

.msg-input::-webkit-scrollbar-track {
    background: #2f3136;
}

.msg-input::-webkit-scrollbar-thumb {
    background: #202225;
}

.msg-input::-webkit-scrollbar-thumb:hover {
    background: #202225;
}
</style>