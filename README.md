# bootstrap-ojFE

More responsive web page for [Online Judge](https://github.com/QingdaoU/OnlineJudge) using Bootstrap5 and Vue 2

### Run in local for modification
```
npm install
npm run serve
```
You can install `express` and use `server.js` for proxy transfer.
Modify nginx config to fit port number.

### Build for production
```
npm run build
```

### V1.1.1
- The first stable version.
- Remove most test utilities.
- Add file upload button in problem page.
- Add copy button for every output sample.
- Remove `<img>` adjustment tool (node-html-parser), you need to turn ur problem template from `html` to `md` format.

### To-dos
- Comfirm dialog for session deleting.
- i18n (Not necessary)
- Contest chart auto refresh animation, migrate from `chartjs@2.9.4` to `chartjs@latest`