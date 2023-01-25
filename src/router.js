import { createRouter, createWebHashHistory } from "vue-router";
const groupRule = () => import("./components/group-rule.vue")
const globalGroupRule = () => import("./components/global-group-rule.vue")
const sysWebComponentProtection = () => import("./components/sys-web-component-protection.vue")
const sysWebNameList = () => import("./components/sys-web-name-list.vue")
const sysWebNameListEdit = () => import("./components/sys-web-name-list-edit.vue")
const sysWebNameListItem = () => import("./components/sys-web-name-list-item.vue")
const sysWebRuleCheck = () => import("./components/sys-web-rule-check.vue")
const sysWebRuleCheckEdit = () => import("./components/sys-web-rule-check-edit.vue")
const sysWebSharedDict = () => import("./components/sys-web-shared-dict.vue")
const sysWebSharedDictEdit = () => import("./components/sys-web-shared-dict-edit.vue")
const sysWebRelateRuleCheck = () => import("./components/sys-web-relate-rule-check.vue")
const sysWebRelateRuleCheckEdit = () => import("./components/sys-web-relate-rule-check-edit.vue")
const sysglobalComponentProtection = () => import("./components/sys-global-component-protection.vue")
const sysGlobalAnalysisApi = () => import("./components/sys-global-analysis-api.vue")
const sysGlobalAnalysisApiEdit = () => import("./components/sys-global-analysis-api-edit.vue")
const sysGlobalNameList = () => import("./components/sys-global-name-list.vue")
const sysGlobalNameListEdit = () => import("./components/sys-global-name-list-edit.vue")
const sysGlobalNameListItem = () => import("./components/sys-global-name-list-item.vue")
const sysGlobalRuleCheck = () => import("./components/sys-global-rule-check.vue")
const sysGlobalRuleCheckEdit = () => import("./components/sys-global-rule-check-edit.vue")
const sysGlobalSharedDict = () => import("./components/sys-global-shared-dict.vue")
const sysGlobalSharedDictEdit = () => import("./components/sys-global-shared-dict-edit.vue")
const sysGlobalRelateRuleCheck = () => import("./components/sys-global-relate-rule-check.vue")
const sysGlobalRelateRuleCheckEdit = () => import("./components/sys-global-relate-rule-check-edit.vue")
const sysLogConf = () => import("./components/sys-log-conf.vue")
const sysGlobalOpenConf = () => import("./components/sys-global-open-conf.vue")
const sysActionApi = () => import("./components/sys-action-api.vue")
const sysActionApiEdit = () => import("./components/sys-action-api-edit.vue")
const sysAnalysisApi = () => import("./components/sys-analysis-api.vue")
const sysAnalysisApiEdit = () => import("./components/sys-analysis-api-edit.vue")
const widsWebComponentProtection = () => import("./components/wids-web-component-protection.vue")
const widsWebNameList = () => import("./components/wids-web-name-list.vue")
const widsWebRuleCheck = () => import("./components/wids-web-rule-check.vue")
const widsGlobalComponentProtection = () => import("./components/wids-global-component-protection.vue")
const widsGlobalAnalysisApi = () => import("./components/wids-global-analysis-api.vue")
const widsGlobalNameList = () => import("./components/wids-global-name-list.vue")
const widsGlobalRuleCheck = () => import("./components/wids-global-rule-check.vue")
const widsWebRelateRuleCheck = () => import("./components/wids-web-relate-rule-check.vue")
const widsGlobalRelateRuleCheck = () => import("./components/wids-global-relate-rule-check.vue")
const sysJxwafUser = () => import("./components/sys-jxwaf-user.vue")
const widsRelateComponentCheck = () => import("./components/wids-relate-component-check.vue")
const sysWebRelateComponentCheck = () => import("./components/sys-web-relate-component-check")

let routes = [
  { path: "/", component: sysWebComponentProtection },


  { path: "/sys-web-component-protection", component: sysWebComponentProtection },
  { path: "/sys-web-name-list", component: sysWebNameList },
  { path: "/sys-web-name-list-edit/:uuid", component: sysWebNameListEdit },
  { path: "/sys-web-name-list-item/:uuid", component: sysWebNameListItem },
  { path: "/sys-web-rule-check", component: sysWebRuleCheck },
  { path: "/sys-web-rule-check-edit/:uuid", component: sysWebRuleCheckEdit },
  { path: "/sys-web-shared-dict", component: sysWebSharedDict },
  { path: "/sys-web-shared-dict-edit/:uuid", component: sysWebSharedDictEdit },
  { path: "/sys-web-relate-rule-check/:ruleType", component: sysWebRelateRuleCheck },
  { path: "/sys-web-relate-rule-check-edit/:uuid/:ruleType/:type", component: sysWebRelateRuleCheckEdit },
  { path: "/group-rule/:ruleGroupUuid/:backUrl", component: groupRule },
  { path: "/global-group-rule/:ruleGroupUuid/:backUrl", component: globalGroupRule },
  { path: "/sys-global-component-protection", component: sysglobalComponentProtection },
  { path: "/sys-global-analysis-api", component: sysGlobalAnalysisApi },
  { path: "/sys-global-analysis-api-edit/:uuid", component: sysGlobalAnalysisApiEdit },
  { path: "/sys-global-name-list", component: sysGlobalNameList },
  { path: "/sys-global-name-list-edit/:uuid", component: sysGlobalNameListEdit },
  { path: "/sys-global-name-list-item/:uuid", component: sysGlobalNameListItem },
  { path: "/sys-global-rule-check", component: sysGlobalRuleCheck },
  { path: "/sys-global-rule-check-edit/:uuid", component: sysGlobalRuleCheckEdit },
  { path: "/sys-global-shared-dict", component: sysGlobalSharedDict },
  { path: "/sys-global-shared-dict-edit/:uuid", component: sysGlobalSharedDictEdit },
  { path: "/sys-global-relate-rule-check/:ruleType", component: sysGlobalRelateRuleCheck },
  { path: "/sys-global-relate-rule-check-edit/:uuid/:ruleType/:type", component: sysGlobalRelateRuleCheckEdit },
  { path: "/sys-global-relate-rule-check/:ruleType", component: sysGlobalRelateRuleCheck },
  { path: "/sys-global-relate-rule-check-edit/:uuid/:ruleType/:type", component: sysGlobalRelateRuleCheckEdit },
  { path: "/sys-log-conf", component: sysLogConf },
  { path: "/sys-global-open-conf", component: sysGlobalOpenConf },
  { path: "/sys-action-api", component: sysActionApi },
  { path: "/sys-action-api-edit/:uuid", component: sysActionApiEdit },
  { path: "/sys-analysis-api", component: sysAnalysisApi },
  { path: "/sys-analysis-api-edit/:uuid", component: sysAnalysisApiEdit },
  { path: "/wids-web-component-protection", component: widsWebComponentProtection },
  { path: "/wids-web-name-list", component: widsWebNameList },
  { path: "/wids-web-rule-check", component: widsWebRuleCheck },
  { path: "/wids-global-component-protection", component: widsGlobalComponentProtection },
  { path: "/wids-global-analysis-api", component: widsGlobalAnalysisApi },
  { path: "/wids-global-name-list", component: widsGlobalNameList },
  { path: "/wids-global-rule-check", component: widsGlobalRuleCheck },
  { path: "/wids-web-relate-rule-check", component: widsWebRelateRuleCheck },
  { path: "/wids-global-relate-rule-check", component: widsGlobalRelateRuleCheck },
  { path: "/sys-jxwaf-user", component: sysJxwafUser },
  { path: "/wids-relate-component-check", component: widsRelateComponentCheck },
  { path: "/sys-web-relate-component-check", component: sysWebRelateComponentCheck },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router