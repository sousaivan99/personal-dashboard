<script setup lang="ts">

interface Props {
    title: string;
}

const { title } = defineProps<Props>();

</script>

<template>
    <div
        class="w-[250px] h-[250px] p-[12px] flex flex-col !aspect-square surface-container-high rounded-xl border border-color drop-shadow-md overflow-hidden">
        <div>
            <slot name="header">
                <div class="flex justify-between items-center ">
                    <span class="text-[16px]">{{ title }}</span>
                    <div
                        class="rounded-full p-1 hover:cursor-pointer hover:surface-container-highest duration-150 transition-all ease-in-out flex items-center justify-center w-[32px] !aspect-square">
                        <Icon name="material-symbols-light:fullscreen-rounded" class="w-full h-full" />
                    </div>
                </div>
            </slot>
        </div>
        <div class=" h-full">
            <slot />
        </div>
    </div>
</template>



<style scoped></style>