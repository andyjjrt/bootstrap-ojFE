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
### V1.2.1
Feature:
- Migrate to `bootstrap@5.3.0-beta1`, introduce dark mode.
- Upgrade some packages.
- Add support of `javascript` and `rust`

Bug Fixed: 
- Judger page will not change.

Known error:
- Some areas are always light.

### To-dos
- i18n (Not necessary).
- Admin's navigation bar active display.
- Check ACM-contest Rank.