<template>
    <div class="page-owasp-wrap">
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="24">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="12">
                        <h3>全局分析开启配置</h3>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-divider />
        <div class="margin-4x"></div>
        <el-row v-loading.fullscreen.lock="loadingPage">
            <el-col :span="24">
                <el-form :model="baseConfigForm" :rules="rules" ref="baseConfigForm" label-width="200px">
                    <el-form-item label="kafka_bootstrap_servers" prop="kafka_bootstrap_servers" key="1">
                        <el-input v-model="baseConfigForm.kafka_bootstrap_servers" placeholder="请输入kafka_bootstrap_servers">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="kafka_topic" prop="kafka_topic" key="2">
                        <el-input v-model="baseConfigForm.kafka_topic" placeholder="请输入kafka_topic">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="kafka_producer_type"  prop="kafka_producer_type" key="3">
                        <el-input v-model="baseConfigForm.kafka_producer_type" placeholder="请输入kafka_producer_type">
                        </el-input>
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
                kafka_bootstrap_servers: [
                    {
                        required: true,
                        message: '请输入kafka_bootstrap_servers',
                        trigger: ["blur", "change"],
                    },
                ],
                kafka_topic: [
                    {
                        required: true,
                        message: '请输入kafka_topic',
                        trigger: ["blur", "change"],
                    },
                ],
                kafka_producer_type: [
                    {
                        required: true,
                        message: '请输入kafka_producer_type',
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
            var getUrl = "/sys/waf_get_sys_global_open_conf";
            
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
            var postUrl = "/sys/waf_edit_sys_global_open_conf";
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
