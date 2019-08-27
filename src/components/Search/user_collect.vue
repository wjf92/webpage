<template>
  <Modal v-model="showcollect"  title="sql查询收藏夹" @on-ok="ok" @on-cancel="cancel">
    <p>对话框内容</p>
    <p>对话框内容</p>
    <p>对话框内容</p>
  </Modal>
</template>

<script>
    export default {
        name: 'usercollect',
        props: {
          showcollect: {
            type: Boolean
         }
      },
      methods: {
        ok () {
          this.$Message.info('点击了确定');
        },
        cancel () {
          this.$Message.info('点击了取消');
        }
      }
    }
</script>

<style scoped>

</style>
