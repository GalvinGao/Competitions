<template>
  <div class="post">
    <router-link to="/">
      <a-button type="primary"><a-icon type="left" />  返回</a-button>
    </router-link><br><br>
    <h1>Add new post</h1>
    <a-select defaultValue="dairy" style="width: 120px" v-model="type">
      <a-select-option value="dairy">Daily Report</a-select-option>
      <a-select-option value="weekly">Weekly Report</a-select-option>
    </a-select><br><br>
    <a-input type="text" id="title" v-model="inputTitle" placeholder="Title" /><br><br>
    <a-input type="text" id="date" v-model="inputDate" placeholder="Date" /><br><br>
    <a-textarea id="content" v-model="inputContent" placeholder="Content" :autosize="{ minRows: 3 }" /><br><br>
    <a-input type="text" id="pushtoken" v-model="pushToken" placeholder="Password Confirmation" /><br><br>
    <a-button type="primary" id="submit" @click="postNew">Submit</a-button>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data () {
    return {
      loading: false,
      post: null,
      error: null,
      diary: null,
      type: null,
      inputTitle: null,
      inputDate: null,
      inputContent: null,
      pushToken: null
    }
  },
  methods: {
    postNew () {
      this.error = this.post = null
      this.loading = true
      this.$http.post('/add?token=' + this.pushToken, {title: this.inputTitle, type: this.type, date: this.inputDate, content: this.inputContent}).then(response => {
        this.loading = false;
      }, response => {
        if (response.status === 403) this.$router.push('/login')
        this.error = 'http error:<br>' + JSON.stringify(response, null, 2).toString()
      })
    }
  }
}
</script>

<style scoped>
  .post {
    overflow: auto;
    font-size: 1.2em;
    width: 80vw;
    padding: 3em;
  }
</style>
