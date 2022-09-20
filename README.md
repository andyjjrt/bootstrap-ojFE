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
### V1.2.0-beta3
Fix:
- Fix Security page can't display.
- Fix visible switch problem.

Known error:
- Announce can't use code.

### V1.2.0-beta2

Fix:
- Adjust disabled buttons' text color.
- Adjust splash page when login (all-white).

Feature:
- Admin navbar refactor.
- Problem's code area now can be copied.

Performances:
- Upgrade `bootstrap` to `5.2`, brings quite a few UI change
- Add `prettier` to format old codes.

### V1.2.0-beta1

Fixed:
- Admin problem edit & create issue (URIEncode)

Performances:
- Upgrade `vue` from `2.6` to `2.7`, and migrate to `vite` to enhance building performances.

To-do:
- Redesign admin navbar

### To-dos
- i18n (Not necessary).
- Admin's navigation bar active display.
- Check ACM-contest Rank.