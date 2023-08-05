<template>
    <div class="attachment">
        <template v-if="attachmentType === 'image'">
            <img :src="attachment.url" />
        </template>
        <template v-else-if="attachmentType === 'file'">
            <a :href="attachment.url" target="_blank">{{ attachment.filename }}</a>
        </template>
        <template v-else>
            <p>Unknown attachment type</p>
        </template>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Example of the attachment object:
/* 1.
{
    "width":452,
    "url":"https://cdn.discordapp.com/attachments/1090499299953082398/1130770871607377941/image.png",
    "size":205217,
    "proxy_url":"https://media.discordapp.net/attachments/1090499299953082398/1130770871607377941/image.png",
    "id":"1130770871607377941",
    "height":362,
    "filename":"image.png",
    "content_type":"image/png"
}

2.
{
    "url":"https://cdn.discordapp.com/attachments/1090499299953082398/1130770871796117564/He_Was_Remarkably_Healthy_Until_Chronic_Diarrhea_Nearly_Killed_Him.docx",
    "size":55334,
    "proxy_url":"https://media.discordapp.net/attachments/1090499299953082398/1130770871796117564/He_Was_Remarkably_Healthy_Until_Chronic_Diarrhea_Nearly_Killed_Him.docx",
    "id":"1130770871796117564",
    "filename":"He_Was_Remarkably_Healthy_Until_Chronic_Diarrhea_Nearly_Killed_Him.docx",
    "content_type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}
*/
const props = defineProps({ // Define props
    attachment: {
        type: Object,
        required: true,
    }
})
const attachment = ref(props.attachment);

const attachmentType = computed(() => {
    if (attachment.value.hasOwnProperty('width')) {
        return 'image';
    } else if (attachment.value.hasOwnProperty('filename')) {
        return 'file';
    } else {
        return 'unknown';
    }
});
</script>

<style scoped>
/* attachment */
.attachment {
    margin: 0.5rem 0;
}
.attachment img {
    max-width: 100%;
    max-height: 20rem;
}
.attachment a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    word-wrap: break-word; /* Break words if they are too long */
    word-break: break-all; /* Break words if they are too long */
}
.attachment a:hover {
    text-decoration: underline;
}

/* attachment types */
.attachment.unknown {
    color: #fff;
    background-color: #000;
    padding: 0.5rem;
    border-radius: 0.5rem;
}
.attachment.unknown p {
    margin: 0;
}
.attachment.unknown p::before {
    content: 'Unknown attachment type: ';
    font-weight: bold;
}
.attachment.unknown p::after {
    content: ' (this is a bug)';
    font-weight: bold;
    font-style: italic;
}

.attachment.image {
    display: flex;
    justify-content: center;
}
.attachment.image img {
    max-width: 100%;
    max-height: 20rem;
}

.attachment.file {
    display: flex;
    justify-content: center;
}
.attachment.file a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
}
.attachment.file a:hover {
    text-decoration: underline;
}

.attachment.file a::before {
    content: 'Download ';
    font-weight: bold;
}
.attachment.file a::after {
    content: ' (click to download)';
    font-weight: bold;
    font-style: italic;
}

.attachment.file a[href$=".png"]::before,
.attachment.file a[href$=".jpg"]::before,
.attachment.file a[href$=".jpeg"]::before,
.attachment.file a[href$=".gif"]::before {
    content: 'View ';
    font-weight: bold;
}
.attachment.file a[href$=".png"]::after,
.attachment.file a[href$=".jpg"]::after,
.attachment.file a[href$=".jpeg"]::after,
.attachment.file a[href$=".gif"]::after {
    content: ' (click to view)';
    font-weight: bold;
    font-style: italic;
}

.attachment.file a[href$=".png"]::before {
    content: 'View PNG ';
    font-weight: bold;
}
.attachment.file a[href$=".png"]::after {
    content: ' (click to view PNG)';
    font-weight: bold;
    font-style: italic;
}

.attachment.file a[href$=".jpg"]::before {
    content: 'View JPG ';
    font-weight: bold;
}
.attachment.file a[href$=".jpg"]::after {
    content: ' (click to view JPG)';
    font-weight: bold;
    font-style: italic;
}

.attachment.file a[href$=".jpeg"]::before {
    content: 'View JPEG ';
    font-weight: bold;
}
.attachment.file a[href$=".jpeg"]::after {
    content: ' (click to view JPEG)';
    font-weight: bold;
    font-style: italic;
}

.attachment.file a[href$=".gif"]::before {
    content: 'View GIF ';
    font-weight: bold;
}
.attachment.file a[href$=".gif"]::after {
    content: ' (click to view GIF)';
    font-weight: bold;
    font-style: italic;
}

.attachment.file a[href$=".doc"]::before,
.attachment.file a[href$=".docx"]::before {
    content: 'View Word Document ';
    font-weight: bold;
}
.attachment.file a[href$=".doc"]::after,
.attachment.file a[href$=".docx"]::after {
    content: ' (click to view Word Document)';
    font-weight: bold;
    font-style: italic;
}


</style>