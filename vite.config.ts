import path from 'path'
const pathSrc = path.resolve(__dirname, 'src')
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { UserConfig, ConfigEnv, loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     AutoImport({
//       // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
//       imports: ['vue'],
//       eslintrc: {
//         enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false
//         filepath: './.eslintrc-auto-import.json' // 指定自动导入函数 eslint 规则的文件
//       },
//       dts: path.resolve(pathSrc, 'types', 'auto-imports.d.ts') // 指定自动导入函数TS类型声明文件路径
//     }),
//     Components({
//       dts: path.resolve(pathSrc, 'types', 'components.d.ts') // 指定自动导入组件TS类型声明文件路径
//     })
//   ],
//   resolve: {
//     alias: {
//       '@': pathSrc
//     }
//   }
// })

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': pathSrc
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: Number(env.VITE_APP_PORT),
    //   open: true, // 运行是否自动打开浏览器
    //   // proxy: {
    //   //   // 反向代理解决跨域
    //   //   [env.VITE_APP_BASE_API]: {
    //   //     target: 'http://vapi.youlai.tech', // 线上接口地址
    //   //     // target: 'http://localhost:8989',  // 本地接口地址 , 后端工程仓库地址：https://gitee.com/youlaiorg/youlai-boot
    //   //     changeOrigin: true,
    //   //     rewrite: (path) =>
    //   //       path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '') // 替换 /dev-api 为 target 接口地址
    //   //   }
    //   // }
    // },
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', '@vueuse/core'],
        eslintrc: {
          enabled: false,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          IconsResolver({})
        ],
        vueTemplate: true,
        // 配置文件生成位置(false:关闭自动生成)
        dts: false
        // dts: "src/types/auto-imports.d.ts",
      }),

      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            // @iconify-json/ep 是 Element Plus 的图标库
            enabledCollections: ['ep']
          })
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ['src/**/components'],
        // 配置文件位置(false:关闭自动生成)
        dts: false
        // dts: "src/types/components.d.ts",
      }),

      Icons({
        // 自动安装图标库
        autoInstall: true
      }),

      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      })
    ]
  }
})
