<template>
    <div class="rows">
        <div class="action-buttons-container row">
            <EmojiActionButton class="action-button" @click="showEmojiPicker = !showEmojiPicker">
                <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM11 7C10.45 7 10 7.45 10 8C10 8.55 10.45 9 11 9H13C13.55 9 14 8.55 14 8C14 7.45 13.55 7 13 7H11ZM8 11C7.45 11 7 11.45 7 12C7 12.55 7.45 13 8 13H16C16.55 13 17 12.55 17 12C17 11.45 16.55 11 16 11H8Z">
                    </path>
                </svg>
            </EmojiActionButton>
            <FileActionButton class="action-button">
                <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M4 4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H4ZM4 2H20C21.66 2 23 3.34 23 5V18C23 19.66 21.66 21 20 21H4C2.34 21 1 19.66 1 18V5C1 3.34 2.34 2 4 2ZM9 16C9 16.55 9.45 17 10 17H14C14.55 17 15 16.55 15 16C15 15.45 14.55 15 14 15H10C9.45 15 9 15.45 9 16ZM9 12C9 12.55 9.45 13 10 13H14C14.55 13 15 12.55 15 12C15 11.45 14.55 11 14 11H10C9.45 11 9 11.45 9 12ZM9 8C9 8.55 9.45 9 10 9H14C14.55 9 15 8.55 15 8C15 7.45 14.55 7 14 7H10C9.45 7 9 7.45 9 8Z">
                    </path>
                </svg>
            </FileActionButton>
        </div>
    </div>
    <Teleport to="#message-actions-col">
        <EmojiPicker class="emoji-picker" v-if="showEmojiPicker"/>
    </Teleport>
</template>

<script setup>
import EmojiActionButton from './buttons/EmojiActionButton.vue';
import FileActionButton from './buttons/FileActionButton.vue';
import EmojiPicker from './containers/EmojiPicker.vue';
import { useStore } from '../store';
import { storeToRefs } from 'pinia';
import { ref, toRef, watch } from 'vue';

const store = useStore();
const showEmojiPicker = ref(false);
const emojis = toRef(store, 'emojis');

watch(emojis, () => {
    showEmojiPicker.value = false;
})

</script>

<style scoped>
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

.action-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
    background-color: #36393f;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.action-button:hover {
    background-color: #2f3136;
}

.action-button:active {
    background-color: #202225;
}

.action-button:focus {
    outline: none;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: auto;
    padding: 5px;
    box-sizing: border-box;
}


.emoji-picker {
    position: sticky;
    z-index: 1000;
    top: 0;
    right: 0;
    height: 300px;
    box-sizing: border-box;
    background-color: #36393f;
    color: white;
    border-radius: 5px;
    border: 1px solid rgb(255, 255, 255);
    text-align: left;
}
</style>
