// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', // 加载 Tailwind CSS 模块
    '@pinia/nuxt',        // 加载 Pinia 模块
  ],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  }
})