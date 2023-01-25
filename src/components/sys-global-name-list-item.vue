<template>
  <el-row v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="24">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
              <h3>名单配置管理</h3>
            </el-col>
            <el-col :span="12" class="text-align-right">

            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="margin-4x"></div>
      <el-row class="text-align-right">
        <div class="domain-search-input">
          <el-input placeholder="请输入网站名进行搜索" prefix-icon="el-icon-search" v-model="dataSearch" @input="onChangeSearch">
          </el-input>
        </div>
        <el-button type="primary" @click="onClickCreateNameListItem()">添加条目</el-button>
        <a class="el-button el-button--primary is-plain" :href="'/#/sys-global-name-list'">返回</a>
      </el-row>
      <div class="demo-block">
        <el-table :data="tableData" style=" width: 100%">
          <el-table-column prop="name_list_item" label="条目名称"></el-table-column>
          <el-table-column prop="name_list_item_create_time" label="创建时间"></el-table-column>
          <el-table-column prop="name_list_item_expire_time" label="过期时间"></el-table-column>

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
        <el-pagination background layout="prev, pager, next" :total="count" :page-size="50"
          @current-change="onCurrentChange" v-model:currentPage="now_page" />
      </div>
    </el-col>

    <el-dialog title="新增条目" v-model="dialogNameListItemFormVisible" width="520px" :close-on-click-modal="false"
      @closed="dialogClose">
      <el-form class="form-tag-dialog" :model="listItemForm" size="mini" label-position="right" label-width="80px"
        :rules="rules" ref="listItemForm">
        <el-form-item label="条目名称" prop="name_list_item" key="1">
          <el-input placeholder="请输入名单条目的名称" v-model="listItemForm.name_list_item"></el-input>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="dialogNameListItemFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClickNameListItemSubmit('listItemForm')" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>
<script>
import { validatePort, mixin, JXAjax } from "../assets/scripts/common";
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      loadingPage: true,
      dialogNameListItemFormVisible: false,
      loading: false,
      listItemForm: {
        name_list_name: "",
        name_list_item: "",
      },
      tableData: [],
      count: 0,
      now_page: 1,
      dataSearch: "",
    };
  },
  computed: {
    rules() {
      return {
        
      }
    }
  },
  
  mounted() {
    const route = useRoute()
    this.uuid = route.params.uuid;
    this.getData(1);
  },
  methods: {
    getData(nowPage) {
      var t = this;
      t.dataSearch = "";
      JXAjax(
        "post",
        "/sys/waf_get_sys_global_name_list_item_list",
        { name_list_name: t.uuid, page: nowPage },
        function (response) {
          t.loadingPage = false;
          t.tableData = response.data.message;
          t.count = response.data.count;
          t.now_page = response.data.now_page;
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
    onCurrentChange() { 
      if (this.dataSearch == "") {
        this.getData(this.now_page)
      } else { 
        this.onChangeSearch()
      }
      
    },
    dialogClose() {
      this.listItemForm = {
        name_list_name: this.uuid,
        name_list_item: ""
      };
      this.$refs["listItemForm"].resetFields();
    },

    onClickCreateNameListItem() { 
      this.dialogNameListItemFormVisible = true;
    },
    onClickNameListItemSubmit(listItemForm) {
      var t = this;
      var postUrl = "/sys/waf_create_sys_global_name_list_item";
      t.listItemForm.name_list_name = t.uuid;
      this.$refs[listItemForm].validate((valid) => {
        if (valid) {
          t.loading = true;
          JXAjax(
            "post",
            postUrl,
            t.listItemForm,
            function (response) {
              t.loading = false;
              t.dialogNameListItemFormVisible = false;
              t.getData(1);
            },
            function () {
              t.loading = false;
            }
          );
        }
      });
    },
    onChangeSearch() { 
      var t = this;
      if (t.dataSearch) {
        JXAjax(
          "post",
          "/sys/waf_search_sys_global_name_list_item",
          { name_list_name: t.uuid, page: t.now_page, search_value: t.dataSearch },
          function (response) {
            t.loadingPage = false;
            t.tableData = response.data.message;
            t.count = response.data.count;
            t.now_page = response.data.now_page;
            t.tableData.forEach(item => {
              item.isVisiblePopover = false;
            })
          },
          function () {
            t.loadingPage = false;
          },
          "no-message"
        );
      } else { 
        t.getData(1)
      }
      
    },
    handleDelete(data) {
      var t = this;
      t.loading = true;
      JXAjax(
        "post",
        "/sys/waf_del_sys_global_name_list_item",
        { name_list_name: data.name_list_name, name_list_item: data.name_list_item },
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getData(1);
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
.domain-setting {
  float: right;
}
.domain-redirect {
  margin-top: 5px;
  margin-bottom: 0px !important;
}

.el-form-item.is-required .redirect-box .el-form-item__label:before {
  content: "";
}
.domain-search-input {
  display: block;
  float: left;
  text-align: left;
}
.domain-search-input .el-input {
  width: 100%;
}
.no-padding {
  padding: 0;
}
.node-detail span {
  font-size: 12px;
}
.domain-tabs {
  margin-bottom: 18px;
}
</style>
