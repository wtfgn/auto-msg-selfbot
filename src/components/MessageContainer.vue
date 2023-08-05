<template>
    <div id="message-container">
        <div class="col" id="message-col" ref="messageContainer">
            <Message v-for="msgData in msgDataList" :key="msgData.id" :msgData="msgData" />
        </div>
        <div class="col" id="message-actions-col">
        </div>
    </div>
</template>

<script setup>
import Message from './Message.vue';
import { ref, watch, toRef } from 'vue';
import { useStore } from './store';
import { nextTick } from 'vue';


const store = useStore();
const msgDataList = toRef(store, 'messages');
const messageContainer = ref(null);

/* When there is a new message, it should scroll to bottom automtically*/
watch(msgDataList, async () => {
    if (messageContainer.value === null) return;
    // Wait for the DOM to update before scrolling to the bottom of the container
    await nextTick();
    const lastMessage = messageContainer.value.lastElementChild;
    lastMessage.scrollIntoView();
}, { immediate: true , deep: true}
);

</script>

<style scoped>
/* If the message item overflow in y-axis, then the user should scroll, instread of expand the content box*/
/* When there is a new message, it should scroll to bottom automtically*/
#message-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    width: 100%;
    height: 65vh;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
    background-color: #36393f;
    color: white;
    border: 1px solid rgb(255, 255, 255);
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #202225 #2f3136;
}

#message-container::-webkit-scrollbar {
    width: 10px;
}

#message-container::-webkit-scrollbar-track {
    background: #2f3136;
}

#message-container::-webkit-scrollbar-thumb {
    background: #202225;
}

#message-container::-webkit-scrollbar-thumb:hover {
    background: #16171a;
}

#message-container .col {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    height: auto;
    padding: 5px;
    box-sizing: border-box;
}

#message-col {
    flex: 1;
}

#message-actions-col {
    position: fixed;
    flex: 0 0 50px;
}

</style>