<template>
  <div class="custom-wrap">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <h3>全局共享字典配置</h3>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="margin-4x"></div>
    <el-row>
      <el-col :span="24">
        <el-row class="text-align-right">
          <div class="domain-search-input">
            <el-input placeholder="请输入名称进行搜索" prefix-icon="el-icon-search" v-model="domainSearch"></el-input>
          </div>
          <a class="el-button el-button--primary" :href="'/#/sys-global-shared-dict-edit/new'">新建共享字典</a>
        </el-row>
        <div class="demo-block">
          <el-table :data="
            tableData.filter(
              (data) =>
                !domainSearch ||
                data.shared_dict_name.toLowerCase().includes(domainSearch.toLowerCase())
            )
          " style="width: 100%">
            <el-table-column prop="shared_dict_name" label="共享字典名称"></el-table-column>
            <el-table-column prop="shared_dict_detail" label="共享字典详情"></el-table-column>
            <el-table-column label="加载状态">
              <template #default="scope">
                <p v-if="scope.row.status == 'true'">已加载</p>
                <p v-if="scope.row.status == 'false'">未加载</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
              <template #default="scope">
                <el-button size="mini" @click="handleEdit(scope.row)" class="button-block" type="text"
                  :loading="scope.row.loading">配置</el-button>
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
      domainSearch: "",
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      JXAjax(
        "post",
        "/sys/waf_get_sys_global_shared_dict_list",
        { },
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

    handleEdit(data) {
      window.location.href = "/#/sys-global-shared-dict-edit/" + data.shared_dict_name;
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
        "/sys/waf_del_sys_global_shared_dict",
        {
          shared_dict_name: data.shared_dict_name
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
