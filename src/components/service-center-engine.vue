<template>
  <div class="custom-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>引擎更新</h3>
          </el-col>

        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-tabs v-loading.fullscreen.lock="loadingPage" class="tabs-no-bottom" @tab-click="handleTabClick"
      v-model="tabIndex">
      <el-tab-pane label="官方引擎" name="0">
        <el-row>
          <el-col :span="24">
            <div class="demo-block">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="引擎名称"></el-table-column>
                <el-table-column prop="detail" label="描述"></el-table-column>
                <el-table-column prop="engine_type" label="引擎类型"></el-table-column>
                <el-table-column label="来源">
                  <template #default="scope">
                    <div v-if="scope.source == 'JXWAF'">
                      官方
                    </div>
                    <div v-else>
                      个人
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="share_user" label="分享用户"> </el-table-column>

                <el-table-column label="操作" align="right">
                  <template #default="scope">
                    <el-button size="mini" @click="handleLoad(scope.row)" class="button-block" type="text"
                      :loading="scope.row.loading">加载</el-button>
                    <el-popover placement="top" width="160" v-model:visible="scope.row.isVisiblePopover">
                      <p>确定删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.isVisiblePopover = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row, 'jxwaf')"
                          :loading="loading">确定
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
      <el-tab-pane label="自定义引擎" name="1">
        <el-row>
          <el-col :span="24">
            <div class="demo-block">
              <el-table :data="tableDefaultData" style="width: 100%">
                <el-table-column prop="name" label="引擎名称"></el-table-column>
                <el-table-column prop="detail" label="描述"></el-table-column>
                <el-table-column prop="engine_type" label="引擎类型"></el-table-column>
                <el-table-column label="来源">
                  <template #default="scope">

                    <div v-if="scope.source == 'JXWAF'">
                      官方
                    </div>
                    <div v-else>
                      个人
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="分享用户">
                  <template #default="scope">
                    <div>
                      JXWAF：{{ scope.row.share_user }}
                    </div>
                    <div>
                      显示注册用户名：{{ scope.row.share_user }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align="right">
                  <template #default="scope">
                    <el-button size="mini" @click="handleLoad(scope.row)" class="button-block" type="text"
                      :loading="scope.row.loading">加载</el-button>
                    <el-popover placement="top" width="160" v-model:visible="scope.row.isVisiblePopover">
                      <p>确定删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.isVisiblePopover = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row, 'custom')"
                          :loading="loading">确定
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
      tableDefaultData: [],
    };
  },
  computed: {
    rules() {
      return {
        
      }
    }
  },
  mounted() {
    this.getData("jxwaf");
  },
  methods: {
    getData(type) {
      var t = this;
      var postUrl = "/waf/waf_get_remote_service_center_engine_list";
      var oData = { type: type };
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          t.loadingPage = false;
          if (type == "jxwaf") {
            t.tableData = response.data.message;
            t.tableData.forEach(item => {
              item.isVisiblePopover = false;
            })
          } else { 
            t.tableDefaultData = response.data.message;
            t.tableDefaultData.forEach(item => {
              item.isVisiblePopover = false;
            })
          }
          
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    handleTabClick(tab) {
      if (this.tableDefaultData.length == 0 && tab.index == 1) {
        this.getData("custom");
      }
      if (this.tableData.length == 0 && tab.index == 0) {
        this.getData("jxwaf");
      }
    },
    handleLoad(data) { 
      var t = this;
      data.loading = true;
      JXAjax(
        "post",
        "/waf/waf_load_remote_service_center_engine",
        data,
        function (response) {
          data.loading = false;
        },
        function () {
          data.loading = false;
        },
      );
    },
    handleDelete(data) {
      var t = this;
      t.loading = true;
      var postUrl = "/waf/waf_del_global_name_list";
      var oData = {
        name_list_uuid: data.name_list_uuid
      };
      
      JXAjax(
        "post",
        postUrl,
        oData,
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getData();
        },
        function () {
          t.loading = false;
        }
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
.box-card-rule {
  margin-bottom: 22px;
  border: 1px solid #409eff;
}
.box-card-rule .card-item {
  border-bottom: 1px solid #e0e3e9;
  margin-bottom: 20px;
}
</style>
