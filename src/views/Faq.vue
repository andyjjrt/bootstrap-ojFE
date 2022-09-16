<template>
  <div class="container-fluid">
    <div class="card card-body">
      <div class="mb-3 fs-4">FAQ</div>
      <ul>
        <li class="fw-bold">Where is the input and the output?</li>
        <p class="p-2">
          Your program shall read input from <code>stdin</code> ('Standard
          Input') and write output to <code>stdout</code> ('Standard Output')
          For example,you can use <code>scanf</code> in C or <code>cin</code> in
          C++ to read from stdin,and use <coee>printf</coee> in C or
          <code>cout</code> in C++ to write to stdout. User programs are not
          allowed to read or write files, or you will get a
          <span class="badge bg-danger">Runtime Error</span> .
        </p>
        <li class="fw-bold">
          What's the meaning of the submission execution time?
        </li>
        <p class="p-2">
          The onlinejudge might test your code multiple times with different
          input files. If your code gives the correct answer within the time
          limit for each input file, the execution time displayed is the max of
          the time spent for each test case. Otherwise, the execution time will
          have no sense.
        </p>
        <li class="fw-bold">How can I use C++ Int64?</li>
        <p class="p-2">
          You should declare as <code>long long</code> and use with
          <code>cin/cout</code> or <code>%lld</code> , using
          <code>__int64</code> will result in
          <span class="badge bg-warning">Compile Error</span> .
        </p>
        <li class="fw-bold">Java specifications?</li>
        <p class="p-2">
          All programs must begin in a static main method in a
          <code>Main</code> class. Do not use public classes: even
          <code>Main</code> must be non public to avoid compile error.Use
          buffered I/O to avoid time limit exceeded due to excesive flushing.
        </p>
        <li class="fw-bold">About presentation error?</li>
        <p class="p-2">
          There is no presentation error in this oj.The judger will trim the
          blacks and wraps in your ouput's <strong>last line</strong>. if it's
          still different with the correct output, the result will be
          <span class="badge bg-danger">Wrong Answer</span> .
        </p>
        <li class="fw-bold">How to report bugs about this oj?</li>
        <p class="p-2">
          The onlinejudge is open source, you can open an issue in
          <a href="https://github.com/QingdaoU/OnlineJudge">Github</a> The
          details(like env, version..) about a bug is required, which will help
          us a lot to solve the bug. Certainly, we are very pleased to merge
          your pull requests.
        </p>
      </ul>
    </div>
    <br />
    <div class="card card-body">
      <p>
        Frontend redesign by <a href="https://github.com/andyjjrt">andyjjrt</a>,
        Backend supported by
        <a href="https://github.com/QingdaoU/OnlineJudge">OnlineJudge</a>.
      </p>
      <p>
        Frontend bug report please create issue in
        <a href="https://github.com/andyjjrt/bootstrap-ojFE/issues"
          >https://github.com/andyjjrt/bootstrap-ojFE/issues</a
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Judger",
};
</script>

<style></style>
