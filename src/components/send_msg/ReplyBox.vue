<template>
    <div class="reply-detail">
        <div class="reply-detail-content">
            <div class="reply-detail-content-author">
                {{ replyingTo.author.username }}
            </div>
            <div class="reply-detail-content-msg">
                {{ trimmedReplyMsgContent }}
            </div>
        </div>
        <div class="reply-detail-close" @click="replyingTo = null">
            <svg aria-hidden="false" width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor"
                    d="M8.707 8l3.647 3.646a.5.5 0 0 1-.708.708L8 8.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 8 3.646 4.354a.5.5 0 1 1 .708-.708L8 7.293l3.647-3.646a.5.5 0 0 1 .708.708L8.707 8z">
                </path>
            </svg>
        </div>
    </div>
</template>

<script setup>
import { computed, toRef } from 'vue';
import { useStore } from '../store';

const store = useStore();
const replyingTo = toRef(store, 'selectedReplyMessage');

const trimmedReplyMsgContent = computed(() => {
    return replyingTo.value.content.length > 20 ? replyingTo.value.content.substring(0, 20) + '...' : replyingTo.value.content;
})
</script>

<style scoped>
.reply-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 5px;
    box-sizing: border-box;
    color: white;
    background-color: #2f3136;
    border-radius: 5px;
    margin-bottom: 5px;
}

.reply-detail-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    height: auto;
    padding: 5px;
    box-sizing: border-box;
}

.reply-detail-content-author {
    font-weight: bold;
}

.reply-detail-content-msg {
    font-size: 0.8rem;
}

.reply-detail-close {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #202225;
    cursor: pointer;
}

.reply-detail-close:hover {
    background-color: #36393f;
}

.reply-detail-close svg {
    width: 1rem;
    height: 1rem;
}

.reply-detail-close svg path {
    fill: white;
}
</style>