<template>
  <div>
    <el-container>
      <el-aside width="auto">
        <div class="title">
          <div class="title-box">
            <p v-if="isCollapse == true">WIDS</p>
            <p v-if="isCollapse == false">Ali-WIDS</p>
          </div>

        </div>
        <el-menu :router="true" background-color="#545c64" text-color="#fff" active-text-color="#409eff"
          :collapse="isCollapse" :default-active="activeIndex" class="el-menu-vertical">
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-setting"></i>
              <span>请求基础分析</span>
            </template>
            <el-menu-item index="/wids-web-component-protection"><span>组件检测</span></el-menu-item>
            <el-menu-item index="/wids-web-name-list"><span>名单匹配</span></el-menu-item>
            <el-menu-item index="/wids-web-rule-check"><span>规则检测</span></el-menu-item>
            <el-menu-item index="/"><span>白基线检测</span></el-menu-item>
            <el-menu-item index="/"><span>情报分析</span></el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template #title>
              <i class="el-icon-setting"></i>
          
              <span>请求关联分析</span>
            </template>
            <el-menu-item index="/wids-relate-component-check">组件关联分析</el-menu-item>
            <el-menu-item index="/wids-web-relate-rule-check">规则关联分析</el-menu-item>
          </el-submenu>
          <el-menu-item index="/node-monitor"><i class="el-icon-setting"></i><span>日志报表</span></el-menu-item>
          <el-menu-item index="/node-monitor"><i class="el-icon-setting"></i><span>情报查询</span></el-menu-item>
          <el-menu-item index="/node-monitor"><i class="el-icon-setting"></i><span>节点管理</span></el-menu-item>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-setting"></i>

              <span>系统管理</span>
            </template>
            <el-menu-item index="/sys-jxwaf-user"><span>基础配置</span></el-menu-item>
            <el-menu-item index="/sys-web-component-protection">组件检测配置</el-menu-item>
            <el-menu-item index="/sys-web-name-list">名单匹配配置</el-menu-item>
            <el-menu-item index="/sys-web-rule-check">规则检测配置</el-menu-item>
            <el-menu-item index="/">白基线检测配置</el-menu-item>
            <el-menu-item index="/sys-web-relate-component-check">请求关联组件检测</el-menu-item>
            <el-menu-item index="/sys-web-shared-dict">请求共享字典配置</el-menu-item>
            <el-menu-item index="/sys-web-relate-rule-check/single_rule">请求关联规则配置</el-menu-item> 
            <el-menu-item index="/sys-analysis-api"><span>分析API配置</span></el-menu-item>
            <el-menu-item index="/sys-action-api"><span>处置API配置</span></el-menu-item>
            <el-menu-item index="/sys-log-conf"><span>日志配置</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="left link" @click="onClickFolding">
            <span>
              <i class="el-icon-more"></i>
            </span>
          </div>
          <div class="right link">
            <a href="/logout" target="_self" class="link">退出</a>
          </div>
        </el-header>
        <el-main>
          <router-view keep-alive transition="fade" transition-mode="out-in"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

  <el-backtop :right="50" :bottom="50" />
</template>

<script>

import imgLogo from "./assets/images/logo1800.png";
import { useRouter } from 'vue-router';

export default {
  //mixins: [mixin],
  data() {
    return {
      route: '',
      isCollapse: false,
      activeIndex: "/global-name-list",
      imgLogo: imgLogo,
      loadingPage: false,
    };
  },

  mounted() {
    var t = this;
    const { currentRoute } = useRouter();
    setTimeout(function () { 
      var url = currentRoute.value.path;
      var path = url.split("/")[1];
      var params = url.split("/")[3];
      t.activeMenu(path, params);
    }, 100)

  },

  watch: {
    $route(to, from) {
      var path = to.path.split("/")[1]; // web-rule-protection
      var params = to.path.split("/")[3]; // single_rule
      this.activeMenu(path, params);
    }
  },

  methods: {
    activeMenu(path, params) {
      var str = path;
      

      switch (str) {
        case "sys-web-component-protection":
          this.activeIndex = "/sys-web-component-protection"
          break;
        case "sys-global-component-protection":
          this.activeIndex = "/sys-global-component-protection"
          break;
        case "sys-global-open-conf":
          this.activeIndex = "/sys-global-open-conf"
          break;
        case "sys-log-conf":
          this.activeIndex = "/sys-log-conf"
          break;
        case "sys-web-name-list":
        case "sys-web-name-list-edit":
        case "sys-web-name-list-item":
          this.activeIndex = "/sys-web-name-list"
          break;
        case "sys-global-name-list":
        case "sys-global-name-list-edit":
        case "sys-global-name-list-item":
          this.activeIndex = "/sys-global-name-list"
          break;
        case "sys-web-rule-check":
        case "sys-web-rule-check-edit":
          this.activeIndex = "/sys-web-rule-check"
          break;
        case "sys-global-rule-check":
        case "sys-global-rule-check-edit":
          this.activeIndex = "/sys-global-rule-check"
          break;
        case "sys-web-shared-dict":
        case "sys-web-shared-dict-edit":
          this.activeIndex = "/sys-web-shared-dict"
          break;
        case "sys-global-shared-dict":
        case "sys-global-shared-dict-edit":
          this.activeIndex = "/sys-global-shared-dict"
          break;
        case "sys-web-relate-rule-check":
        case "group-rule":
        case "sys-web-relate-rule-check-edit/single_rule":
        case "sys-web-relate-rule-check-edit/group_rule":
        case "group-rule/sys-web-relate-rule-check":
          this.activeIndex = "/sys-web-relate-rule-check/single_rule"
          break;
        case "sys-global-relate-rule-check":
        case "sys-global-relate-rule-check-edit/single_rule":
        case "sys-global-relate-rule-check-edit/group_rule":
        case "global-group-rule/sys-global-relate-rule-check":
          this.activeIndex = "/sys-global-relate-rule-check/single_rule"
          break;
        case "sys-global-analysis-api":
        case "sys-global-analysis-api-edit":
          this.activeIndex = "/sys-global-analysis-api"
          break;
        case "sys-action-api":
        case "sys-action-api-edit":
          this.activeIndex = "/sys-action-api"
          break;
        case "sys-analysis-api":
        case "sys-analysis-api-edit":
          this.activeIndex = "/sys-analysis-api"
          break;
        case "wids-web-component-protection":
          this.activeIndex = "/wids-web-component-protection"
          break;
        case "wids-web-name-list":
          this.activeIndex = "/wids-web-name-list"
          break;
        case "wids-web-rule-check":
          this.activeIndex = "/wids-web-rule-check"
          break;
        case "wids-global-component-protection":
          this.activeIndex = "/wids-global-component-protection"
          break;
        case "wids-global-analysis-api":
          this.activeIndex = "/wids-global-analysis-api"
          break;
        case "wids-global-name-list":
          this.activeIndex = "/wids-global-name-list"
          break;
        case "wids-global-rule-check":
          this.activeIndex = "/wids-global-rule-check"
          break;
        case "wids-web-relate-rule-check":
          this.activeIndex = "/wids-web-relate-rule-check"
          break;
        case "wids-global-relate-rule-check":
          this.activeIndex = "/wids-global-relate-rule-check"
          break;
        case "sys-jxwaf-user":
          this.activeIndex = "/sys-jxwaf-user"
          break;
        case "wids-relate-component-check":
          this.activeIndex = "/wids-relate-component-check"
          break;
        case "sys-web-relate-component-check":
          this.activeIndex = "/sys-web-relate-component-check"
          break;
        default:
          this.activeIndex = "/wids-web-component-protection"
      }
    },
    onClickFolding() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  text-align: center;
  background: #4b5259;
}

.el-menu {
  text-align: left;
  border-right: none;
}

body > .el-container {
  margin-bottom: 40px;
}

.title {
  height: 60px;
  line-height: 60px;
  color: #fff;
  display: flex;
  justify-content: center;
}

.el-container {
  min-height: 100vh;
}
.el-header {
  padding: 0;
  font-size: 12px;
  text-align: left;
  background-color: #545c64;
}
.left,
.right {
  padding: 0 20px;
  cursor: pointer;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
.header-select {
  width: 95px;
  margin-right: 10px;
}
.header-select input {
  background-color: transparent;
  border: none;
  color: #66b1ff;
}
.header-select i {
  color: #66b1ff !important;
}
.title-box {
  display: flex;
}
.title img {
    width: 30px;
    height: 30px;
    top: 15px;
    position: relative;
    display: block;
    margin-right: 10px;
}
.init-check-content .item {
   padding: 10px 20px;
}
.init-check-status {
  margin-left: 10px;
}
</style>
