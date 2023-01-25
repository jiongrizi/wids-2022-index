<template>
  <div class="custom-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>请求关联规则配置</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">

          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-tabs v-loading.fullscreen.lock="loadingPage" class="tabs-no-bottom" @tab-click="handleTabClick"
      v-model="tabIndex">
      <el-tab-pane label="规则" name="0">
        <el-row>
          <el-col :span="24">
            <el-row class="text-align-right">
              <a class="el-button el-button--primary"
                :href="'/#/sys-web-relate-rule-check-edit/' + rule_name+ '/single_rule/new'">新建规则</a>
            </el-row>
            <div class=" demo-block">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="rule_name" label="规则名称"></el-table-column>
                <el-table-column prop="rule_detail" label="规则描述"></el-table-column>
                <el-table-column label="加载状态">
                  <template #default="scope">
                    <p v-if="scope.row.status == 'true'">已加载</p>
                    <p v-if="scope.row.status == 'false'">未加载</p>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align="right">
                  <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)" class="button-block" type="text">编辑
                    </el-button>

                    <el-popover placement="top" width="160" v-model:visible="scope.row.isVisiblePopover">
                      <p>确定删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.isVisiblePopover = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row)" :loading="loading">确定
                        </el-button>
                      </div>
                      <template #reference>
                        <el-button type="text" size="mini" @click="scope.row.isVisiblePopover = true">删除</el-button>
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="规则组" name="1">
        <el-row>
          <el-col :span="24">
            <el-row class="text-align-right">
              <el-button type="primary" @click="onClickCreateGroup()" :loading="loadingCreateGroup">新建规则组</el-button>
            </el-row>
            <div class="demo-block">
              <el-table :data="tableDataGroup" style="width: 100%">

                <el-table-column prop="rule_group_name" label="规则组名称"></el-table-column>
               
                <el-table-column prop="rule_group_detail" label="规则组描述"></el-table-column>
                <el-table-column label="加载状态">
                  <template #default="scope">
                    <p v-if="scope.row.status == 'true'">已加载</p>
                    <p v-if="scope.row.status == 'false'">未加载</p>
                  </template>
                </el-table-column>
                <el-table-column prop="rule_count" label="规则数量"></el-table-column>

                <el-table-column label="操作" align="right">
                  <template #default="scopeGroup">
                    <a class="el-button el-button--text el-button--mini button-block"
                      :href="'/#/group-rule/' + scopeGroup.row.rule_group_name + '/sys-web-relate-rule-check'">查看规则</a>
                    <el-button size="mini" @click="handleEditGroup(scopeGroup.row)" class="button-block" type="text">编辑
                    </el-button>
                    <el-popover placement="top" width="160" v-model:visible="scopeGroup.row.isVisiblePopover">
                      <div v-if="scopeGroup.row.rule_count == 0">
                      <p>确定删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scopeGroup.row.isVisiblePopover = false">取消
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleDeleteGroup(scopeGroup.row)"
                          :loading="loading">
                          确定
                        </el-button>
                      </div>
                      </div>
                      <div v-else>
                        <p>请先删除规则组内规则</p>
                        <div style="text-align: right; margin-top: 10px;">
                          <el-button type="primary" size="mini" @click="scopeGroup.row.isVisiblePopover = false">好的
                          </el-button>
                        </div>
                      </div>
                      <template #reference>
                        <el-button type="text" size="mini" @click="scopeGroup.row.isVisiblePopover = true">删除
                        </el-button>
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="groupTitle" v-model="dialogGroupFormVisible" width="520px" :close-on-click-modal="false"
      @close="dialogClose">
      <el-form :model="groupForm" size="mini" label-position="left" label-width="120px" :rules="rules" ref="groupForm"
        class="form-tag-dialog">
        <el-form-item label="规则组名称" prop="rule_group_name" key="1">
          <el-input v-model="groupForm.rule_group_name" placeholder="请输入字母或数字，如group_1"></el-input>
          <p class="form-info-color">
            （请输入以字母开头，仅支持下划线“_”及中横线“-”两种特殊字符）
          </p>
        </el-form-item>
        <el-form-item label="规则组描述" key="2">
          <el-input v-model="groupForm.rule_group_detail" placeholder="请输入规则组描述" :rows="2" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="dialogGroupFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClickgroupSubmit('groupForm')" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mixin, JXAjax,validateRuleName } from "../assets/scripts/common";
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      loading: false,
      loadingPage: false,
      loadingCreateGroup: false,
      rule_name: 'new',
      tableData: [],
      tableDataGroup: [],
      domain: "",
      ruleType: "single_rule",
      tabIndex: "0",
      groupTitle: "新建规则组",
      groupType: "new",
      dialogGroupFormVisible: false,
      groupForm: {
        rule_group_name: "",
        rule_group_detail: ""
      },
    };
  },
  computed: {
    rules() {
      return {
        rule_group_name: [
          {
            required: true,
            message: "请输入以字母开头的字符串，仅支持“_”及“-”两种特殊字符",
            trigger: ["blur", "change"],
          },
          {
            validator: validateRuleName,
            trigger: ["blur", "change"],
          },
        ],
      };
    },
  },
  mounted() {
    this.loadingPage = false;
    const route = useRoute()
    this.ruleType = route.params.ruleType;
    if (this.ruleType == "single_rule") {
      this.tabIndex = "0";
      this.getData();
    } else { 
      this.tabIndex = "1";
      this.getDataGroup();
    }
  },
  methods: {
    getData() {
      var t = this;
      JXAjax(
        "post",
        "/sys/waf_get_sys_web_relate_rule_check_list",
        { rule_type: 'single_rule'},
        function (response) {
          t.loadingPage = false;
          t.tableData = response.data.message;
          t.tableData.forEach(item => { 
            item.isVisiblePopover = false;
          })
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    onClickCreateGroup() { 
      var t = this;
      t.groupTitle = "新建规则组";
      t.groupType = "new";
      t.dialogGroupFormVisible = true;
    },
    handleEdit(data) {
      window.location.href = "/#/sys-web-relate-rule-check-edit/" + data.rule_name + "/single_rule/edit";
    },
    handleTabClick(tab) { 
      if (this.tableDataGroup.length == 0 && tab.index == 1) { 
        this.getDataGroup();
      }
      if (this.tableData.length == 0 && tab.index == 0) { 
        this.getData();
      }
    },
    getDataGroup() { 
      var t = this;
      JXAjax(
        "post",
        "/sys/waf_get_sys_web_relate_rule_check_group_list",
        {},
        function (response) {
          t.loadingPage = false;
          t.tableDataGroup = response.data.message;
          t.tableDataGroup.forEach(item => {
            item.isVisiblePopover = false;
          })
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    handleDelete(data) {
      var t = this;
      if (data.status == 'true') { 
        t.$message({
          showClose: true,
          message: '该项是加载状态，无法删除',
          type: "error",
        });
        return false;
      }
      t.loading = true;

      JXAjax(
        "post",
        "/sys/waf_del_sys_web_relate_rule_check",
        {
          rule_name: data.rule_name
        },
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getData()
        },
        function () {
          t.loading = false;
        }
      );
    },
    handleDeleteGroup(data) {
      var t = this;
      if (data.status == 'true') { 
        t.$message({
          showClose: true,
          message: '该项是加载状态，无法删除',
          type: "error",
        });
        return false;
      }
      t.loading = true;

      JXAjax(
        "post",
        "/sys/waf_del_sys_web_relate_rule_check_group",
        {
          rule_group_name: data.rule_group_name
        },
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getDataGroup();
        },
        function () {
          t.loading = false;
        }
      );
    },

    dialogClose() {
      this.groupForm = {
        rule_group_name: "",
        rule_group_detail: ""
      };
      this.$refs["groupForm"].resetFields();
    },

    onClickgroupSubmit(groupForm) {
      var t = this;
      var postUrl = "/sys/waf_create_sys_web_relate_rule_check_group";
      if (t.groupType == "edit") {
        postUrl = "/sys/waf_edit_sys_web_relate_rule_check_group";
      }

      this.$refs[groupForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.groupForm,
            function (response) {
              t.loading = false;
              t.dialogGroupFormVisible = false;
              t.getDataGroup();
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
    handleEditGroup(data) {
      var t = this;
      JXAjax(
        "post",
        "/sys/waf_get_sys_web_relate_rule_check_group",
        { rule_group_name: data.rule_group_name },
        function (response) {
          data.loading = false;
          t.groupForm = response.data.message;
          t.groupTitle = "编辑规则组";
          t.groupType = "edit";
          t.dialogGroupFormVisible = true;
        },
        function () {
          data.loading = false;
        },
        "no-message"
      );

    },
  },
};
</script>
<style>

.custom-wrap {
  /* max-width: 800px;
  min-width: 400px; */
}
.el-button.button-block {
  display: block;
  margin-left: 0px;
  text-align: right;
  width: 100%;
}

.custom-wrap .rule-matchs-content .match-box-title {
  display: inline-block;
  text-align: left;
  font-size: 14px;
  color: #909399;
  padding: 0 5px;
  box-sizing: border-box;
}
.custom-wrap .rule-matchs-content .match-box-title:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.custom-wrap .match-inline-block {
  width: 192px;
}
.custom-wrap .match-inline-block-small {
  width: 150px;
}
.tabs-no-bottom {

}
</style>
