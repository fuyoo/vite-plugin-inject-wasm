# vite-plugin-inject-wasm
vite@2  plugin to inject wasm!


**Note: this plugin only works serve**

## how to use

1. **install**

```hash
pnpm install @fuyoo/vite-plugin-inject-wasm
```

2. **config plugin at the vite.config.ts**

```js
import {defineConfig} from 'vite'
import {VitePluginInjectWasm} from '@fuyoo/vite-plugin-inject-wasm'

export default defineConfig({
    plugins: [vue(), VitePluginInjectWasm([{
        name: "@fuyoo/wasm-hasher", // this is package name
        where: "pkg/wasm_hasher_bg.wasm" // **.wasm file's relative path in the package
    }]
})
```

3. **use wasm package at .vue files `npm create vite@latest my-vue-app -- --template vue`**

```vue
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import hasher from "@fuyoo/wasm-hasher"
hasher().then(pkg => {
  console.log(pkg)
})
</script>

<template>
    <h1>hello vite-plugin-inject-wasm<h1>
</template>
```

4. **at .ts or .js file**
```ts
import hasher from "@fuyoo/wasm-hasher"
hasher().then(pkg => {
  console.log(pkg)
})
```

## LICENSE
[MIT LICENSE](./LICENSE)