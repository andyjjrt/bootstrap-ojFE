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

### V1.1.3

Highlights: 
- Add search area in tags, you can quickly find specific tag.
- Redesign problems's statistic area, now it gives the percentage of status. (Feedbacks)
- Fixed flashing chart render when auto refresh
Improvements: 
- Little adjustment on user profile.
- Button's actions now all shows white text.
- When searching in status list, now it auto route to first page.
- IPV6 shows properly in session page

Performances: 
- Migrate `chartjs@2.9.4` to `chartjs@3.7.1`, discard `vue-chartjs` wrapper, and brings more self-defined tools.
- Remove old scss files.

### To-dos
- i18n (Not necessary).
- Admin's navigation bar active display.
- Check ACM-contest Rank.