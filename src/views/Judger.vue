<template>
    <div class="container">
        <div data-v-bdf21a32="" class="card card-body">
            <ul data-v-bdf21a32="">
                <li data-v-bdf21a32="">C ( GCC 5.4 )
                    <pre data-v-bdf21a32="">/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}</pre>
                </li>
                <li data-v-bdf21a32="">C++ ( G++ 5.4 )
                    <pre data-v-bdf21a32="">/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}</pre>
                </li>
                <li data-v-bdf21a32="">Java ( OpenJDK 1.8 )
                    <pre data-v-bdf21a32="">/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8</pre>
                </li>
                <li data-v-bdf21a32="">Python2 ( Python 2.7 )
                    <pre data-v-bdf21a32="">/usr/bin/python -m py_compile {src_path}</pre>
                </li>
                <li data-v-bdf21a32="">Python3 ( Python 3.6 )
                    <pre data-v-bdf21a32="">/usr/bin/python3 -m py_compile {src_path}</pre>
                </li>
                <li data-v-bdf21a32="">Golang ( Golang 1.14 )
                    <pre data-v-bdf21a32="">/usr/bin/go build -o {exe_path} {src_path}</pre>
                </li>
            </ul>
        </div>
        <br>
        <div data-v-bdf21a32="" class="card card-body"><ul data-v-bdf21a32=""><li data-v-bdf21a32=""><b data-v-bdf21a32="">Pending &amp; Judging</b> : You solution will be judged soon, please wait for result.</li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">Compile Error</b> :	Failed to compile your source code. Click on the link to see compiler's output.
        </li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">Accepted</b> :	Congratulations. Your solution is correct.</li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">Wrong Answer</b> :	Your program's output doesn't match judger's answer.</li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">Runtime Error</b>
            :	Your program terminated abnormally. Possible reasons are: segment fault, divided by zero or exited with code other than 0.
            </li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">Time Limit Exceeded</b>
            :	The CPU time your program used has exceeded limit.
            </li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">Memory Limit Exceeded</b> :	The memory your program actually used has exceeded limit.</li> <li data-v-bdf21a32=""><b data-v-bdf21a32="">System Error</b> :	Oops, something has gone wrong with the judger. Please report this to administrator.
            </li></ul></div>
    </div>
</template>

<script>
export default {
    name:"Judger"
}
</script>

<style>

</style>