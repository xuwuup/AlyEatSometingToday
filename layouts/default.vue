<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-green-600 dark:text-green-400">
          艾力今天吃啥呢?
        </NuxtLink>
        <div class="space-x-4">
          <NuxtLink to="/" class="text-gray-600 dark:text-gray-300 hover:text-green-600">
            
          </NuxtLink>
          <NuxtLink to="/foods" class="text-gray-600 dark:text-gray-300 hover:text-green-600">
            我的食物
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="flex-grow container mx-auto p-4">
      <slot /> <!-- 页面内容将在这里渲染 -->
    </main>

    <footer class="text-center text-sm text-gray-500 py-4">
      Powered by Nuxt 3 & Cloudflare Pages
    </footer>
  </div>
</template>