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

### V1.1.2

Highlights: 
- Add Two Factor Authentication.
- Complete Session revoke modal, it works fine now.
- `Admin` and `Super Admin` access error handling.

Improvements: 
- Add tooltips on upload and reset button.
- Auto hide `Rejudge` button on mobile screens.
- Redesign admin's navigation bar.
- Add link to release notes (click on the version name)

Performances: 
- Upgrade `bootstrap@5.0.0` to `bootstrap@latest`, rewrite scss file.
- remove unused packages in `packages.json`,
- Move `server.js` to `/server` and make its own package.

### To-dos
- i18n (Not necessary).
- Contest chart auto refresh animation, migrate from `chartjs@2.9.4` to `chartjs@latest`.
- Admin's navigation bar active display.