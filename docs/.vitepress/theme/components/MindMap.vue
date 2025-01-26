<template>
    <div ref="mindMapContainer" class="mind-map-container"></div>
  </template>
  
  <script>
  import * as d3 from "d3";
  
  export default {
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        svg: null,
        g: null,
        root: null,
        tree: null,
        zoom: null,
      };
    },
    mounted() {
      this.initMindMap();
      this.renderMindMap();
      window.addEventListener("resize", this.handleResize);
    },
    beforeUnmount() {
      window.removeEventListener("resize", this.handleResize);
    },
    watch: {
      data: {
        handler() {
          this.updateMindMap();
        },
        deep: true,
      },
    },
    methods: {
      initMindMap() {
        // 获取容器尺寸
        const container = this.$refs.mindMapContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;
  
        // 创建 SVG 画布
        this.svg = d3
          .select(this.$refs.mindMapContainer)
          .append("svg")
          .attr("width", width)
          .attr("height", height);
  
        // 创建缩放行为
        this.zoom = d3.zoom().scaleExtent([0.5, 2]).on("zoom", this.zoomed);
  
        // 应用缩放行为到 SVG
        this.svg.call(this.zoom);
  
        // 创建分组用于缩放
        this.g = this.svg.append("g");
      },
      renderMindMap() {
        // 获取容器尺寸
        const container = this.$refs.mindMapContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;
  
        // 将数据转换为层次结构
        this.root = d3.hierarchy(this.data);
  
        // 创建树布局
        this.tree = d3.tree().size([height, width]); // 注意：d3.tree 的 size 是 [height, width]
  
        // 计算节点位置
        this.tree(this.root);
  
        // 绘制连线（使用直线）
        const link = this.g
          .selectAll(".link")
          .data(this.root.links())
          .enter()
          .append("line") // 使用 line 元素绘制直线
          .attr("class", "link")
          .attr("x1", (d) => d.source.y)
          .attr("y1", (d) => d.source.x)
          .attr("x2", (d) => d.target.y)
          .attr("y2", (d) => d.target.x)
          .attr("stroke", (d) => this.getLinkColor(d)); // 自定义线条颜色
  
        // 绘制节点
        const node = this.g
          .selectAll(".node")
          .data(this.root.descendants())
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", (d) => `translate(${d.y},${d.x})`);
  
        // 绘制节点圆圈
        node.append("circle").attr("r", 5);
  
        // 添加节点文本
        node
          .append("text")
          .attr("dy", "0.31em")
          .attr("x", (d) => (d.children ? -10 : 10))
          .style("text-anchor", (d) => (d.children ? "end" : "start"))
          .text((d) => d.data.name);
      },
      updateMindMap() {
        // 清除旧的节点和连线
        this.g.selectAll(".node").remove();
        this.g.selectAll(".link").remove();
  
        // 重新渲染思维导图
        this.renderMindMap();
      },
      zoomed(event) {
        this.g.attr("transform", event.transform);
      },
      handleResize() {
        // 调整 SVG 尺寸以适应容器
        const container = this.$refs.mindMapContainer;
        this.svg.attr("width", container.clientWidth).attr("height", container.clientHeight);
        this.updateMindMap();
      },
      getLinkColor(d) {
        // 自定义线条颜色逻辑
        // 例如：根据层级设置颜色
        const depth = d.source.depth;
        if (depth === 0) {
          return "#ff4757"; // 第一层线条颜色
        } else if (depth === 1) {
          return "#2ed573"; // 第二层线条颜色
        } else if (depth === 2) {
          return "#1e90ff"; // 第三层线条颜色
        } else {
          return "#ffa502"; // 其他层线条颜色
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .mind-map-container {
    width: 100%;
    height: 100vh; /* 占满整个视口高度 */
    border: 1px solid #ccc;
    overflow: hidden;
  }
  
  .link {
    stroke-width: 2px; /* 连线宽度 */
  }
  
  .node circle {
    fill: #fff;
    stroke: #999;
    stroke-width: 2px;
  }
  
  .node text {
    font-family: Arial, sans-serif;
    font-size: 12px;
    user-select: none; /* 防止文本被选中 */
  }
  </style>