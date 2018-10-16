<template>
  <div class="content">
    <h1>cms.min.js</h1>
    <a-popconfirm title="非管理员账户。是否转到登录界面？" @confirm="comfirmGoAdmin" okText="是的" cancelText="不"
                  v-if="this.$cookie.get('role') !== 'admin'">
      <a-button class="admin" type="dashed" size="small">admin</a-button>
    </a-popconfirm>
    <router-link to="/admin/add" v-else>
      <a-button class="admin" type="dashed" size="small">admin</a-button>
    </router-link>
    <h2>日记<span class="title-description">公开</span></h2>
    <ul class="hello">
      <li v-for="diary in diaries" :key="diary.id">
        <router-link :to="getDiaryHref(diary.hash)" class="list-btn">
          {{ diary.title }} ({{ diary.date }})
        </router-link>
      </li>
      <a-alert message="暂无日记" v-if="this.diaries.length === 0" type="info" showIcon></a-alert>
    </ul>
    <hr>
    <h2>周总结<span class="title-description">需要输入密码</span></h2>
    <ul class="hello">
      <li v-for="week in weekly" :key="week.id">
        <router-link :to="getWeeklyHref(week.hash)" class="list-btn">
          {{ week.title }} ({{ week.date }})
        </router-link>
      </li>
      <a-alert message="暂无周总结报告" v-if="this.diaries.length === 0" type="info" showIcon></a-alert>
    </ul>
    <div v-if="typeof this.$cookie.get('role') === 'string'">
      <hr>
      <a-spin tip="Logging out..." :spinning="spinning">
        已登录为 <b>{{ this.$cookie.get('role') }}</b>。
        <a-button type="danger" @click="logout">登出</a-button>
      </a-spin>
    </div>
  </div>
</template>

<style>
  .list-btn {
    color: #1890ff;
    background-color: transparent;
    border-radius: 1px;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    padding: 3px 6px;
    transition: all .75s cubic-bezier(0.19, 1, 0.22, 1);
    line-height: 1.5;
  }

  .list-btn:after {
    content: "  ❭";
    position: relative;
    opacity: 0;
    left: -15px;
    font-size: 24px;
    top: 3px;
    font-weight: bolder;
    transition: all .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .list-btn:hover:after {
    color: #e7eeff;
    opacity: 1;
    left: 5px;
  }

  .list-btn:active:after {
    color: #e7eeff;
    opacity: 0;
    left: 25px;
  }

  .list-btn:hover {
    color: #e7eeff;
    background-color: #1890ff;
    box-shadow: 0 0 0 7px #1890ff;
  }

  .list-btn:active {
    color: #dde9ff !important;
    background-color: #1166b4 !important;
    box-shadow: 0 0 0 4px #1476d0 !important;
  }
</style>

<script>
export default {
  name: 'Index',
  data () {
    return {
      diaries: [],
      weekly: [],
      spinning: false
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  methods: {
    fetchData () {
      console.log(this)
      if (this.$cookie.get('token') === null) {
        this.$cookie.set('token', 'anonymous')
      }
      this.$http.get('http://localhost:3100/list?token=' + this.$cookie.get('token')).then(response => {
        this.diaries = JSON.parse(response.body.data).diary
        this.weekly = JSON.parse(response.body.data).weekly
      }, response => {
        console.log('http error:<br>' + JSON.stringify(response, null, 2).toString())
      })
    },
    getDiaryHref (id) {
      return '/diary/' + id
    },
    getWeeklyHref (id) {
      return '/weekly/' + id
    },
    logout () {
      this.$cookie.set('token', 'anonymous')
      this.$cookie.set('role', '', 0)
      this.spinning = true
      this.$http.get('/logout').then(response => {
        if (response.status === 200) {
          this.spinning = false
          this.$message.success('登出成功。正在刷新页面。 / status-' + response.status + ', resp: ' + response.body, 4)
          document.location = '/'
        }
      }, response => {
        this.spinning = false
        this.$message.error('登出失败。请稍后再试 / status-' + response.status + ', resp: ' + response.body, 4)
      })
    },
    comfirmGoAdmin () {
      this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  .content {
    padding: 3em;
  }

  .title-description {
    position: relative;
    top: -5px;
    margin-left: 8px;
    font-size: 60%;
    color: rgba(255, 255, 255, .75);
    background: linear-gradient(45deg, #000, #444);
    padding: 4px 6px 6px 6px;
    border-radius: 4px;
  }

  hr {
    border: 0;
    height: 2px;
    background: #FFEEEE;
    background: -webkit-linear-gradient(to right, #DDEFBB, #FFEEEE);
    background: linear-gradient(to right, #DDEFBB, #FFEEEE);
    margin: 2em 0;
    box-shadow: 0 0 4px 0 #FFEEEE;
  }

  .admin {
    position: absolute;
    top: 2em;
    right: 2em;
  }
</style>
