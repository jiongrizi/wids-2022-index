<template>
  <div class="custom-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>防护引擎管理</h3>
          </el-col>
          <el-col :span="12" class="text-align-right">

          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-tabs v-loading.fullscreen.lock="loadingPage" class="tabs-no-bottom" @tab-click="handleTabClick"
      v-model="tabIndex">
      <el-tab-pane label="Web防护引擎管理" name="0">
        <el-row>
          <el-col :span="24">
            <div class=" demo-block">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="引擎名称"></el-table-column>
                <el-table-column prop="detail" label="描述"></el-table-column>
                <el-table-column prop="default" label="默认引擎">
                  <template #default="scope">
                    <el-switch v-model="scope.row.default" @change="handleEdit(scope.row)" active-value="true"
                      inactive-value="false" />
                  </template>
                </el-table-column>
                <el-table-column prop="update_time" label="更新时间"></el-table-column>

                <el-table-column label="操作" align="right">
                  <template #default="scope">
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
      <el-tab-pane label="流量防护引擎管理" name="1">
        <el-row>
          <el-col :span="24">
            <div class="demo-block">
              <el-table :data="tableDataFlow" style="width: 100%">

                <el-table-column prop="name" label="引擎名称"></el-table-column>
                <el-table-column prop="detail" label="描述"></el-table-column>
                <el-table-column prop="default" label="默认引擎">
                  <template #default="scope">
                    <el-switch v-model="scope.row.default" @change="handleEditFlow(scope.row)" active-value="true"
                      inactive-value="false" />
                  </template>
                </el-table-column>
                <el-table-column prop="update_time" label="更新时间"></el-table-column>

                <el-table-column label="操作" align="right">
                  <template #default="scopeGroup">
                    <el-popover placement="top" width="160" v-model:visible="scopeGroup.row.isVisiblePopover">
                      <p>确定删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scopeGroup.row.isVisiblePopover = false">取消
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleDeleteFlow(scopeGroup.row)"
                          :loading="loading">
                          确定
                        </el-button>
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
  </div>
</template>
<script>
import { mixin, JXAjax } from "../assets/scripts/common";

export default {
  mixins: [mixin],
  data() {
    return {
      loading: false,
      loadingPage: false,
      tableData: [],
      tableDataFlow: [],
      tabIndex: "0",
    };
  },
  computed: {
    rules() {
      return {
        
      };
    },
  },
  mounted() {
    this.loadingPage = false;
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_get_sys_web_engine_protection_list",
        {},
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

    handleTabClick(tab) { 
      if (this.tableDataFlow.length == 0 && tab.index == 1) { 
        this.getDataFlow();
      }
      if (this.tableData.length == 0 && tab.index == 0) { 
        this.getData();
      }
    },
    getDataFlow() { 
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_get_sys_flow_engine_protection_list",
        {},
        function (response) {
          t.loadingPage = false;
          t.tableDataFlow = response.data.message;
          t.tableDataFlow.forEach(item => {
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
      
      if (data.default == "true") { 
        t.$message({
          showClose: true,
          message: '默认引擎无法删除',
          type: "error",
        });
        return false;
      }
      t.loading = true;


      JXAjax(
        "post",
        "/waf/waf_delete_sys_web_engine_protection",
        {
          name: data.name
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
    handleDeleteFlow(data) {
      var t = this;
      
      if (data.default == "true") {
        t.$message({
          showClose: true,
          message: '默认引擎无法删除',
          type: "error",
        });
        return false;
      }
      t.loading = true;
      JXAjax(
        "post",
        "/waf/waf_delete_sys_flow_engine_protection",
        {
          name: data.name
        },
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getDataFlow();
        },
        function () {
          t.loading = false;
        }
      );
    },

    handleEdit(data) {
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_edit_sys_web_engine_protection",
        { name: data.name },
        function (response) {
          t.getData();
        },
        function () {
          t.getData();
        },
        "no-message"
      );

    },

    handleEditFlow(data) {
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_edit_sys_flow_engine_protection",
        { name: data.name },
        function (response) {
          t.getDataFlow()
        },
        function () {
          t.getDataFlow()
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
