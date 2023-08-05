<template>
    <Picker :data="emojiIndex" set="twitter" @select="showEmoji" title="Pick one..." emoji="point_up" />
</template>

<script setup>
import { computed, toRef, inject } from 'vue'
import { useStore } from '../../store';
// Import data/twitter.json to reduce size, all.json contains data forall emoji sets.
import data from "emoji-mart-vue-fast/data/twitter.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";

const store = useStore();
const emojisOutput = inject('msgContent');
const emojis = toRef(store, 'emojis');

// Return an array of custom emoji objects
const custom = computed(() => {
    return emojis.value.map(emoji => {
        return {
            id: emoji.id,
            name: emoji.name,
            short_names: [emoji.id],
            text: '',
            colons: `${emoji.name}`,
            emoticons: [],
            keywords: [],
            imageUrl: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`,
            custom: true,
        }
    });
}, { deep: true, });

// Create an emoji index with the custom emojis
let emojiIndex = new EmojiIndex(data, { custom: custom.value });

const showEmoji = (emoji) => {
    if (emoji.custom) {
        emojisOutput.value += `<:${emoji.name}:${emoji.short_names[0]}>`;
    } else {
        emojisOutput.value += emoji.native;
    }
}
</script>

<style scoped>
</style>