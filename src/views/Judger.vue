<template>
  <div class="container-fluid">
    <div class="card card-body">
      <ul>
        
        <li v-for="language in languages" :key="language.name">
          {{ language.name }} ({{ language.description   }})
          <pre>{{ language.config.compile.compile_command }}</pre>
        </li>
      </ul>
    </div>
    <br />
    <div class="card card-body">
      <ul>
        <li>
          <b>Pending &amp; Judging</b> : You solution will be judged soon,
          please wait for result.
        </li>
        <li>
          <b>Compile Error</b> : Failed to compile your source code. Click on
          the link to see compiler's output.
        </li>
        <li><b>Accepted</b> : Congratulations. Your solution is correct.</li>
        <li>
          <b>Wrong Answer</b> : Your program's output doesn't match judger's
          answer.
        </li>
        <li>
          <b>Runtime Error</b>
          : Your program terminated abnormally. Possible reasons are: segment
          fault, divided by zero or exited with code other than 0.
        </li>
        <li>
          <b>Time Limit Exceeded</b>
          : The CPU time your program used has exceeded limit.
        </li>
        <li>
          <b>Memory Limit Exceeded</b> : The memory your program actually used
          has exceeded limit.
        </li>
        <li>
          <b>System Error</b> : Oops, something has gone wrong with the judger.
          Please report this to administrator.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Judger",
  computed: {
    languages() {
      return this.$store.state.languages.data.languages;
    },
  },
};
</script>

<style></style>
