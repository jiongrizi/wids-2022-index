<template>
  <div class="container">
    <!-- 创建一个canvas画布 npmn-js是通过canvas实现绘图的，并设置ref让vue获取到element -->
    <div class="bpmn-canvas" ref="canvas"></div>
    <!-- 工具栏显示的地方 -->
    <div class="bpmn-js-properties-panel" id="js-properties-panel"></div>


    <!-- 把操作按钮写在这里面 -->
    <!-- <div class="action">
      <el-upload action class="upload-demo" :before-upload="openBpmn">
        <el-button icon="el-icon-folder-opened"></el-button>
      </el-upload>
      <el-button class="new" icon="el-icon-circle-plus" @click="newDiagram"></el-button>
      <el-button icon="el-icon-download" @click="downloadBpmn"></el-button>
      <el-button icon="el-icon-picture" @click="downloadSvg"></el-button>

      <a hidden ref="downloadLink"></a>
    </div> -->
  </div>
</template>
<script>
import { validatePort, mixin } from "../assets/scripts/common";
import BpmnModeler from "bpmn-js/lib/Modeler";
// 工具栏相关
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import propertiesPanelModule from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

// 引入自定义palette
import customModule from './custom-palette/CustomPalette'

export default {
  mixins: [mixin],
  data() {
    return {
      bpmnModeler: null,
      canvas: null,
      bpmnTemplate: `
          <?xml version="1.0" encoding="UTF-8"?>
          <definitions 
              xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
              xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
              xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" 
              xmlns:camunda="http://camunda.org/schema/1.0/bpmn" 
              xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
              xmlns:activiti="http://activiti.org/bpmn" 
              id="m1577635100724" 
              name="" 
              targetNamespace="http://www.activiti.org/testm1577635100724"
            >
            <process id="process" processType="None" isClosed="false" isExecutable="true">
              <extensionElements>
                <camunda:properties>
                  <camunda:property name="a" value="1" />
                </camunda:properties>
              </extensionElements>
              <startEvent id="_2" name="start" />
            </process>
            <bpmndi:BPMNDiagram id="BPMNDiagram_leave">
              <bpmndi:BPMNPlane id="BPMNPlane_leave" bpmnElement="leave">
                <bpmndi:BPMNShape id="BPMNShape__2" bpmnElement="_2">
                  <omgdc:Bounds x="144" y="368" width="32" height="32" />
                  <bpmndi:BPMNLabel>
                    <omgdc:Bounds x="149" y="400" width="23" height="14" />
                  </bpmndi:BPMNLabel>
                </bpmndi:BPMNShape>
              </bpmndi:BPMNPlane>
            </bpmndi:BPMNDiagram>
          </definitions>
      `
    };
  },
  computed: {
    
  },
  
  mounted() {
    this.init();
    
  },
  methods: {
    getFilename(xml) {
      let start = xml.indexOf("process");
      let filename = xml.substr(start, xml.indexOf(">"));
      filename = filename.substr(filename.indexOf("id") + 4);
      filename = filename.substr(0, filename.indexOf('"'));
      return filename;
    },

    download({ name = "diagram.bpmn", data }) {
      // 这里就获取到了之前设置的隐藏链接
      const downloadLink = this.$refs.downloadLink;
      // 把输就转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);

      if (data) {
        // 将数据给到链接
        downloadLink.href =
          "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
        // 设置文件名
        downloadLink.download = name;
        // 触发点击事件开始下载
        downloadLink.click();
      }
    },

    async init() {
      // 获取画布 element
      this.canvas = this.$refs.canvas;

      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        // 设置bpmn的绘图容器为上门获取的画布 element
        container: this.canvas,

        // 加入工具栏支持
        propertiesPanel: {
          parent: "#js-properties-panel"
        },
        additionalModules: [
          // 左边工具栏及节点
          propertiesProviderModule, 
          // 自定义节点
          customModule,
          propertiesPanelModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      });

      await this.createNewDiagram(this.bpmnTemplate);
    },
    async createNewDiagram(bpmn) {
      // 将字符串转换成图显示出来;
      this.bpmnModeler.importXML(bpmn, err => {
        if (err) {
          this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        }
      });
    }
  },
};
</script>
<style>
.bpmn-canvas {
  width: 100%;
  height: 100vh;
}

.action {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
}
.upload-demo {
  margin-right: 10px;
}

.bpmn-js-properties-panel {
  position: absolute;
  top: 60px;
  right: 0px;
  width: 300px;
}
.bpp-textfield input {
    padding-right: 0px;
}
.bpmn-icon-task.red {
    color: #cc0000;
}
</style>
