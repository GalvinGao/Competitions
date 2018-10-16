<template>
  <div class="login">
    <h1>Authentication Required / 需要用户身份验证</h1>
    <a-alert message="提供两种演示账号，分别对应两种用户：'admin' 可添加记录以及访问周总结；'demo' 仅可访问周总结。" type="info" showIcon />
    <br>
    <a-spin :spinning="spinning" :delay="delayTime">
      <a-input type="text" id="title" v-model="token" placeholder="密码" /><br><br>
      <a-button type="primary" id="submit" @click="login">登录</a-button>
    </a-spin>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      token: '',
      spinning: false,
      delayTime: 500
    }
  },
  methods: {
    login () {
      this.error = this.post = null
      this.spinning = true
      this.$http.get('/auth?token=' + this.token).then(response => {
        if (response.status === 200) {
          this.$cookie.set('token', this.token)
          this.$cookie.set('role', JSON.parse(response.body.data).role)
          this.$message.success('User has been successfully authenticated. / 用户验证成功。', 3)
          this.$message.success('token: ' + this.token + '; role: ' + JSON.parse(response.body.data).role, 2)
          this.spinning = false
          this.$router.push('/')
        } else {
          this.$message.error('Authentication failed due to invalid token. / 由于用户密码非法，权限验证失败。 / status-' + response.status, 10)
          this.spinning = false
        }
      }, response => {
        this.error = 'http error:<br>' + JSON.stringify(response, null, 2).toString()
      })
    }
  }
}
</script>

<style scoped>
  .login {
    overflow: auto;
    font-size: 1.2em;
    width: 80vw;
    padding: 3em;
  }
</style>
