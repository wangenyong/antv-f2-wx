import F2 from '@antv/f2';
// 第一步：加载插件 ScrollBar
const ScrollBar = require('@antv/f2/lib/plugin/scroll-bar');
// 第二步：注册插件 ScrollBar
F2.Chart.plugins.register(ScrollBar); // 这里进行全局注册，也可以给 chart 的实例注册

function wrapEvent(e) {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function () {};
  }
  return e;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onInit: {
      type: 'Function',
      value: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.f2-canvas')
      .fields({
        node: true,
        size: true
      })
      .exec(res => {
        const {
          node,
          width,
          height
        } = res[0];
        const context = node.getContext('2d');
        const pixelRatio = wx.getSystemInfoSync().pixelRatio;
        // 高清设置
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;

        const config = {
          context,
          width,
          height,
          pixelRatio
        };
        const chart = this.data.onInit(F2, config);
        if (chart) {
          this.chart = chart;
          this.canvasEl = chart.get('el');
          this.triggerEvent('on-chart-ready-event', {})
        }
      });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchstart', wrapEvent(e));
    },
    touchMove(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchmove', wrapEvent(e));
    },
    touchEnd(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchend', wrapEvent(e));
    },
    /**
     * 图表数据更新（前后数据结构不发生变化），需要马上更新图表。
     */
    changeData(data) {
      this.chart.changeData(data);
    },
  }
});
