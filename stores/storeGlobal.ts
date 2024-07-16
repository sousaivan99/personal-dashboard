import { defineStore } from "pinia"
export const useGlobalStore = defineStore("GlobalStore", () => {
  const title = ref<string | null>(null)
  const tabs = ref({})

  return { title, tabs }
})
