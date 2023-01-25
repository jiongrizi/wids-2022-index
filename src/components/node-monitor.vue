<template>
  <el-row v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
          <h3>节点管理</h3>
        </el-col>
        <el-col :span="12" class="text-align-right">

        </el-col>
      </el-row>
      <div class="margin-4x"></div>
      <el-row>
        <el-col :span="24">
          <el-row class="text-align-right">
            <div class="ssl-search-input">
              <el-input placeholder="请输入名称进行搜索" prefix-icon="el-icon-search" v-model="dataSearch"></el-input>
            </div>

          </el-row>
          <div class="demo-block">
            <el-table
              :data="tableData.filter((data) => !dataSearch || data.ssl.toLowerCase().includes(dataSearch.toLowerCase()))"
              style="width: 100%">
              <el-table-column prop="node_uuid" label="节点UUID"></el-table-column>
              <el-table-column label="节点描述">
                <template #default="scope">
                  <div>
                    节点IP地址：
                    <p>{{ scope.row.node_ip }}</p>
                  </div>
                  <div>
                    节点主机名称：
                    <p>{{ scope.row.node_hostname }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="配置更新状态">
                <template #default="scope">
                
                  <p>
                    &nbsp;WAF配置更新：
                    <el-switch v-model="scope.row.node_waf_conf_update" @change="onChanageSetUpdate(scope.row)"
                      active-value="true" inactive-value="false" />
                  </p>
                  <p>
                    &nbsp;名单数据更新：
                    <el-switch v-model="scope.row.node_name_list_data_update" @change="onChanageSetUpdate(scope.row)"
                      active-value="true" inactive-value="false" />
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="配置更新时间">
                <template #default="scope">
                  <div>
                    WAF配置更新时间：
                    <p>{{ scope.row.node_waf_conf_update_time }}</p>
                  </div>
                  <div>
                    名单数据更新时间：
                    <p>{{ scope.row.node_name_list_data_update_time }}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="node_status" label="节点健康状态">
                <template #default="scope">
                  <div v-if="scope.row.node_status == 'true'">
                    <i class="el-icon-circle-check icon-success"></i>正常
                  </div>
                  <div v-else>
                    <i class="el-icon-circle-close icon-error"></i>异常
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="node_status_update_time" label="最新心跳时间"></el-table-column>

              <el-table-column label="操作" align="right">
                <template #default="scope">
                  <el-popover placement="top" width="160" v-model="scope.row.isVisiblePopover">
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
    </el-col>
  </el-row>
</template>
<script>
import { mixin, JXAjax } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      dataSearch: "",
      loadingPage: false,
      loading: false,
      tableData: [],
    };
  },
  computed: {
    rules() {
      return {
        conf: [
          { required: true, message: '请输入', trigger: "blur" },
        ],
      }
    }
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_node_monitor_list",
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
        }
      );
    },

    onChanageSetUpdate(data) {
      var t = this;
      JXAjax(
        "post",
        "/waf/waf_edit_node_conf_status",
        { node_uuid: data.node_uuid, node_waf_conf_update: data.node_waf_conf_update, node_name_list_data_update: data.node_name_list_data_update },
        function (response) {
          t.getData()
        },
        function () {
          t.getData()
        },
        
      );
    },


    handleDelete(data) {
      var t = this;
      t.loading = true;
      JXAjax(
        "post",
        "/waf/waf_del_node_monitor",
        { node_uuid: data.node_uuid },
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
.el-button.button-block {
  display: block;
  margin-left: 0px;
  text-align: right;
  width: 100%;
}

.icon-success {
  color: #67c23a;
  margin-right: 5px;
}

.icon-error {
  color: #f56c6c;
  margin-right: 5px;
}

.icon-warning {
  color: #e6a23c;
  margin-right: 5px;
}

.ssl-setting {
  float: right;
}

.ssl-redirect {
  margin-top: 5px;
  margin-bottom: 0px !important;
}

.el-form-item.is-required .redirect-box .el-form-item__label:before {
  content: "";
}

.ssl-search-input {
  display: block;
  float: left;
  text-align: left;
}

.ssl-search-input .el-input {
  width: 100%;
}

.no-padding {
  padding: 0;
}

.node-detail span {
  font-size: 12px;
}
</style>
