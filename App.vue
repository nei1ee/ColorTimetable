<script>
  import Vue from 'vue'
  export default {
    onLaunch: function() {
      uni.getSystemInfo({
        success: function(e) {
          Vue.prototype.statusBar = e.statusBarHeight
          const custom = uni.getMenuButtonBoundingClientRect()
          // Vue.prototype.custom = custom
          Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight
        }
      })
    },
    onShow: function() {},
    onHide: function() {}
  }
</script>

<style>
  /*每个页面公共css */
  @import url("./styles/icon.css");
</style>
