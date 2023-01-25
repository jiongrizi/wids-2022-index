<template>
    <div class="page-owasp-wrap">
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="24">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="12">
                        <h3>基础配置</h3>
                    </el-col>

                </el-row>
            </el-col>
        </el-row>
        <el-divider />
        <div class="margin-4x"></div>
        <el-row v-loading.fullscreen.lock="loadingPage">
            <el-col :span="24">
                <el-form :model="baseConfigForm" :rules="rules" ref="baseConfigForm" label-width="160px">
                    <el-form-item label="API_KEY" prop="api_key" key="1">
                        <el-input v-model="baseConfigForm.api_key" placeholder="请输入API_KEY" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="API_PASSWORD" prop="api_password" key="2">
                        <el-input v-model="baseConfigForm.api_password" placeholder="请输入API_PASSWORD"
                            class="global-pwd">
                        </el-input>
                        <el-button icon="el-icon-refresh" @click="onClickRefresh"></el-button>
                    </el-form-item>
                    
                </el-form>
                <div class="margin-4x"></div>
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="24">
                        <el-row type="flex" class="row-bg" justify="space-between">
                            <el-col :span="12">

                            </el-col>
                            <el-col :span="12" class="text-align-right">
                                <el-button type="primary" @click="onClickBaseConfigSubmit('baseConfigForm')"
                                    :loading="loading">保存</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
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
            loadingPage: false,
            loading: false,
            baseConfigForm: {},
        };
    },
    computed: {
        rules() {
            return {
                api_password: [
                    {
                        required: true,
                        message: '请输入API_PASSWORD',
                        trigger: ["blur", "change"],
                    },
                ],
                api_key: [
                    {
                        required: true,
                        message: '请输入API_KEY',
                        trigger: ["blur", "change"],
                    },
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
            var getUrl = "/sys/waf_get_sys_jxwaf_user";
            
            JXAjax(
                "post",
                getUrl,
                {},
                function (response) {
                    t.loadingPage = false;
                    t.baseConfigForm = response.data.message;
                },
                function () {
                    t.loadingPage = false;
                },
                "no-message"
            );
        },

        onClickBaseConfigSubmit(baseConfigForm) {
            var t = this;
            var postUrl = "/sys/waf_edit_sys_jxwaf_user";
            this.$refs[baseConfigForm].validate((valid) => {
                if (valid) {
                    t.loading = true;
                    JXAjax(
                        "post",
                        postUrl,
                        t.baseConfigForm,
                        function (response) {
                            t.loading = false;
                            t.getData();
                        },
                        function () {
                            t.loading = false;
                        }
                    );
                }
            });
        },
        onClickRefresh() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            function get_uuid() {
                return (
                    S4() +
                    S4() +
                    "-" +
                    S4() +
                    "-" +
                    S4() +
                    "-" +
                    S4() +
                    "-" +
                    S4() +
                    S4() +
                    S4()
                );
            }
            this.baseConfigForm.api_password = get_uuid();
        },
    },
};
</script>
<style>






.page-owasp-wrap {
    max-width: 800px;
    min-width: 400px;
}

.page-owasp-wrap .match-inline-block {
    width: 192px;
}
.engine-form .el-form-item__content{
   margin-left: 40px;
}
.page-owasp-wrap .global-pwd {
    width: calc(100% - 60px);
    margin-right: 4px;
}
</style>
