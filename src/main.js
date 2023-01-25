import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/lib/theme-chalk/index.css';
import "./assets/styles/reset.css";
import "./assets/styles/common.css";
import "./assets/styles/iconfont.css"

import {
  ElContainer,
  ElCollapse,
  ElCollapseItem,
  ElCascader,
  ElAside,
  ElMenu,
  ElMain,
  ElMenuItem,
  ElSubmenu,
  ElSelect,
  ElHeader,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElIcon,
  ElRow,
  ElCol,
  ElCard,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElTag,
  ElPopover,
  ElDialog,
  ElForm,
  ElFormItem,
  ElCheckbox,
  ElCheckboxGroup,
  ElSwitch,
  ElRadio,
  ElRadioGroup,
  ElOption,
  ElSlider,
  ElTabs,
  ElTabPane,
  ElDivider,
  ElBacktop,
  ElPagination,
} from 'element-plus';
const components = [
  ElCollapse,
  ElCollapseItem,
  ElContainer,
  ElCascader,
  ElAside,
  ElMenu,
  ElMain,
  ElMenuItem,
  ElSubmenu,
  ElSelect,
  ElHeader,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElIcon,
  ElRow,
  ElCol,
  ElCard,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElTag,
  ElPopover,
  ElDialog,
  ElForm,
  ElFormItem,
  ElCheckbox,
  ElCheckboxGroup,
  ElSwitch,
  ElRadio,
  ElRadioGroup,
  ElOption,
  ElSlider,
  ElTabs,
  ElTabPane,
  ElDivider,
  ElBacktop,
  ElPagination,
]

const plugins = [
  ElLoading,
  ElMessage,
  ElMessageBox,
]


const app = createApp(App)

components.forEach(component => {
  app.component(component.name, component)
})

plugins.forEach(plugin => {
  app.use(plugin)
})

app.use(router)
app.mount('#app')
