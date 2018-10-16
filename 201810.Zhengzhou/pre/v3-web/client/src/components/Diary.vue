<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error" v-html="error">
    </div>

    <div v-if="diary" class="content">
      <h2 class="big-title">Diary</h2>
      <router-link to="/">
        <h3 class="back-button">返回</h3>
      </router-link>
      <h1 class="diary-title" v-html="diary.title">Loading...</h1>
      <h3 class="diary-date" v-html="diary.date">Loading...</h3>
      <div class="diary-content" v-html="diary.content">
        Loading...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Diary',
  data () {
    return {
      loading: false,
      post: null,
      error: null,
      diary: null
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true

      this.$http.get('/detail/diary/' + this.$route.params.id + '?token=' + this.$cookie.get('token')).then(response => {
        this.loading = false
        this.diary = JSON.parse(response.body.data)
        // this.diary = this.fakeData()
        let content = ''
        for (let line in this.diary.content.split('\n')) {
          content += '<p>' + this.diary.content.split('\n')[line] + '</p>'
        }
        this.diary.content = content
      }, response => {
        console.log(response.status)
        console.log(this)
        if (response.status === 403) this.$router.push('/login')
        this.error = 'http error:<br>' + JSON.stringify(response, null, 2).toString()
      })
    }
  }
}

</script>

<style scoped>
  html {
    background: linear-gradient(45deg, #EECDA3 0, #CCAB81 130%);
    box-shadow: inset 0 0 0 8px rgba(0, 0, 0, .5);
    min-height: 100vh;
    padding-bottom: 3em;
    line-height: 1.5;
    overflow: auto;
  }

  body {
    margin: 0;
  }

  .big-title {
    position: absolute;
    left: 10vw;
    top: 32px;
    text-align: left;
    display: inline-block;
    background-color: #6B14D3;
    color: white;
    padding: 10px 20px 12px 20px;
    background: linear-gradient(45deg, #6B14D3 0, #7A26E2 15%, #4962DD 120%);
    border-radius: 0 8px 8px 8px;
    box-shadow: inset 0 0 0 4px rgba(0, 0, 0, .2);
  }

  .back-button {
    position: absolute;
    left: 10vw;
    top: 96px;
    text-align: left;
    display: inline-block;
    background-color: #6B14D3;
    color: white;
    padding: 6px 14px 8px 14px;
    background: linear-gradient(45deg, #6B14D3 0, #7A26E2 15%, #4962DD 120%);
    border-radius: 6px;
    box-shadow: inset 0 0 0 4px rgba(0, 0, 0, .2);
  }

  .diary-title {
    position: absolute;
    right: 10vw;
    top: 32px;
    text-align: right;
    display: inline-block;
    background-color: #6B14D3;
    color: white;
    padding: 10px 20px 14px 20px;
    background: linear-gradient(45deg, #6B14D3 0, #7A26E2 15%, #4962DD 120%);
    border-radius: 8px 8px 0 8px;
    height: 2.25em;
    box-shadow: inset 0 0 0 4px rgba(0, 0, 0, .2);
  }

  .diary-date {
    position: absolute;
    right: 10vw;
    top: 105px;
    text-align: right;
    border-bottom: 4px solid rgba(0, 0, 0, .2);
    display: inline-block;
    background-color: #6B14D3;
    color: white;
    padding: 6px 14px 4px 14px;
    background: linear-gradient(45deg, #5A03C2 0, #6915D1 15%, #3851CC 120%);
    border-radius: 8px 0 8px 8px;
  }

  .diary-content {
    margin-top: 11em;
    font-size: 1.2em;
    text-indent: 2em;
    margin-left: 10vw;
    width: 80vw;
    margin-right: 10vw;
  }

  p {
    display: block;
    margin-bottom: .75em;
    font-weight: 300;
  }

  .loading, .error {
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    word-break: break-all;
    padding: 3em;
  }

  .error {
    background-color: rgba(255,0,0,0.4); /* Black w/ opacity */
    color: #fff;
    padding-top: 6em;
  }

  .loading {
    background-color: rgba(255, 100, 0, 0.4); /* Black w/ opacity */
    color: #fff;
  }
</style>
