<script setup lang="ts">
const store = useGlobalStore();
const tabs = store.tabs;

const changeActiveTab = (key: string) => {
    Object.keys(tabs).forEach((tabKey) => {
        if (tabKey !== key) {
            tabs[tabKey].active = false;
        }
    });
    tabs[key].active = !tabs[key].active;
}

</script>
<template>
    <div class="w-full h-full flex flex-col surface-container rounded-3xl  overflow-hidden">
        <div class="w-full flex items-center justify-center">
            <template v-for="(tab, key, index) in tabs" :key="index">
                <div @click="changeActiveTab(key)"
                    class="w-full h-11 cursor-pointer flex justify-center hover:surface-container-highest  items-center px-4 "
                    :class="{
                        'secondary-text': !tab.active,
                        'on-surface-text surface-container-high': tab.active,
                    }">
                    <span>{{ tab.name }}</span>
                </div>
            </template>


        </div>
        <div class="h-[1px] w-full bg-border"></div>
        <div class="p-4 w-full h-full overflow-hidden">
            <template v-for="(tab, key, index) in tabs" :key="index">
                <slot v-if="tab.active" :name="key" :tab="tab">
                    <div class="flex on-surface-text items-center justify-center w-full h-full">No Content</div>
                </slot>
            </template>
        </div>
    </div>
</template>


<style scoped></style>