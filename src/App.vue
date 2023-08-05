<template>
	<MessageContainer ref="msgContainer" /> <br>
	<ChannelCompon />
	<SendMsgCompon ref="sendMsgCompon" :msgContent="msgContent">
		<template #replyBox >
			<ReplyBox class="reply-box"/>
		</template>
		<template #actionButtonsContainer>
			<ActionButtonsContainer class="action-buttons-container"/>
		</template>
	</SendMsgCompon>
</template>


<script setup>
import SendMsgCompon from './components/send_msg/SendMsgCompon.vue'
import ChannelCompon from './components/ChannelCompon.vue'
import MessageContainer from './components/MessageContainer.vue';
import ReplyBox from './components/send_msg/ReplyBox.vue';
import ActionButtonsContainer from './components/message_actions/ActionButtonsContainer.vue';
import { provide, ref, toRef } from 'vue'
import { useStore } from './components/store'

const msgContainer = ref(null);
const sendMsgCompon = ref(null);
const msgContent = ref('');
const store = useStore();
const msgDataList = toRef(store, 'messages');

const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
    console.log('Connected to the WebSocket server');
}
ws.onclose = () => {
    console.log('Disconnected from the WebSocket server');
}
ws.onerror = (err) => {
    console.log(err);
}
/* const res = {
        data: d,
        type: t,
    } 
*/
ws.onmessage = (msgRecievedEvent) => {
    const res = JSON.parse(msgRecievedEvent.data);
    const { data, type } = res;
    const msgIndex = msgDataList.value.findIndex(msg => msg.id === data.id);
    switch (type) {
        case 'READY' :
            store.user = data.user;
            break;
        case 'MESSAGE_CREATE':
            if (data.channel_id !== store.selectedChannelID ||
                data.guild_id !== store.selectedGuildID) return;
            msgDataList.value.push(data);
            break;
        case 'MESSAGE_DELETE':
            if (msgIndex === -1) return;
            msgDataList.value.splice(msgIndex, 1);
            break;
        case 'MESSAGE_UPDATE':
            if (msgIndex === -1) return; 
            msgDataList.value[msgIndex] = data;
            // When the original message is edited, the reply message should also be updated.
            // Find if there is any message that is replying to the original message.
            // Update the referenced message of the reply messages to the edited message.
            const replyMessages = msgDataList.value.filter(msg => {
                if (msg.referenced_message === null || msg.referenced_message === undefined) return false;
                return msg.referenced_message.id === data.id;
            });
            console.log(replyMessages);
            if (replyMessages.length === 0) return; // If there is no reply message, then return.
            replyMessages.forEach(msg => {
                msg.referenced_message = data;
            });
            break;
        default:
            break;
    }
}
provide('websocket', ws);
provide('msgContainer', msgContainer);
provide('sendMsgCompon', sendMsgCompon);
</script>


<style scoped>


</style>
