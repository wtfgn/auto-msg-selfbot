<template>
	<div class="input">
		<slot name="replyBox" class="reply-box" v-if="props.type === 'normal' && store.selectedReplyMessage !== null">
		</slot>
		<InputBox @submit-msg="sendMsg" class="input-box" :type="props.type" />
		<slot name="actionButtonsContainer" class="action-buttons-container">
		</slot>
	</div>
</template>


<script setup>
import InputBox from './InputBox.vue';
import { provide, ref, toRef, watch } from 'vue'
import axios from 'axios'
import { useStore } from '../store';

const props = defineProps({
	type: {
		type: String,
		default: 'normal',
	},
	msgContent: {
		type: String,
		default: '',
	}
})

const store = useStore();

// Send the message to the server
const sendMsg = async (msg) => {
	switch (props.type) {
		case 'normal':
			await axios.post('http://localhost:3000/sendMsgToChannel', {
				content: msg,
				channelID: store.selectedChannelID,
				guildID: store.selectedGuildID,
				replyingTo: store.selectedReplyMessage
			});
			store.selectedReplyMessage = null; // Clear the selected reply message
			break;
		case 'edit':
			await axios.post('http://localhost:3000/editMsg', {
				content: msg,
				channelID: store.selectedChannelID,
				guildID: store.selectedGuildID,
				msgID: store.selectedEditMessage.id,
			});
			store.selectedEditMessage = null; // Clear the selected edit message
			break;
		default:
			break;
	}
}

provide('msgContent', toRef(props, 'msgContent'));
</script>


<style scoped>
* {
	box-sizing: border-box;
}

.input {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	/* width: 100%; */
	height: auto;
	border-radius: 5px;
	border: 1px solid rgb(255, 255, 255);
	background-color: #36393f;
	color: white;
	padding: 5px;
	box-sizing: border-box;
	margin: 5px;
}

.input-box {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	width: 100%;
	height: auto;
	padding: 5px;
	box-sizing: border-box;
}

.reply-box {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
	height: auto;
	padding: 5px;
	box-sizing: border-box;
}

.action-buttons-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: auto;
	height: auto;
	padding: 5px;
	box-sizing: border-box;
}
</style>

