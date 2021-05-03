<template>
    <div class="container text-center">
        <h1>404 Not Found</h1>
        <h5>
            親愛的用戶您好<br>目測您做了一些不該做的事情才會看到我
        </h5>
        <br>
        <img src="https://www.ebg.tw/img/err/coni.jpg">
        <br>
        <br>
        <div class="d-grid gap-2 col-6 mx-auto">
            <button class="btn btn-primary" type="button" @click="$router.push({ name: 'Home'})">Back to Home</button>
        </div>
    </div>
</template>

<script>
export default {
    name:"NullPage"
}
</script>

<style>

</style>