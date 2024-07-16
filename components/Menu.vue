<script setup lang="ts">

const navigation = ref([
    {
        icon: 'mdi:home',
        text: 'Home',
        to: '/'
    },
    {
        icon: 'material-symbols-light:account-balance-rounded',
        text: 'Banking',
        to: '/profile'
    },
    {
        icon: 'material-symbols-light:code',
        text: 'Github',
        to: '/github'
    },
    {
        icon: 'material-symbols-light:music-note-rounded',
        text: 'Music',
        to: '/music'
    }
])

</script>
<template>
    <div class="w-[80px] h-full surface flex flex-col items-center">
        <!-- logo -->
        <div class="w-full min-h-[80px] flex flex-col items-center justify-center">
            <div class="w-[38px]">
                <Logo />
            </div>
            <div
                class="w-full opacity-70 h-[24px] text-[10px] font-bold uppercase flex items-center justify-center on-surface-text">
                Hyperion
            </div>
        </div>
        <!-- logo END -->
        <!-- menu -->
        <div class="w-full h-full px-[12px] flex flex-col gap-[12px] py-[8px]">
            <template v-for="link in navigation">
                <NuxtLink :to="link.to" class="group">
                    <div class="w-[56px] h-[56px] flex flex-col items-center">
                        <div
                            class="group-hover:w-full group-hover:bg-white  w-[35px] duration-150 transition-all ease-in-out h-[32px]  rounded-full flex items-center justify-center">
                            <Icon :name="link.icon"
                                class="min-w-[25px] min-h-[25px] max-w-[25px] max-h-[25px]  group-hover:on-surface-text-inverse on-surface-text" />
                        </div>
                        <div
                            class="group-hover:opacity-100 duration-150 transition-all ease-in-out w-full h-[24px] opacity-70 text-[12px] flex items-center justify-center on-surface-text">
                            {{ link.text }}
                        </div>
                    </div>
                </NuxtLink>
            </template>
        </div>
        <!-- menu END -->
        <!-- footer -->
        <div class="w-full h-[80px]  flex items-center justify-center">
            <Icon name="mdi:logout" class="h-[25px] w-[25px] on-surface-text" />
        </div>
        <!-- footer END -->
    </div>
</template>


<style scoped></style>