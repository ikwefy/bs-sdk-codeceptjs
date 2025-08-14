# bs-sdk-test

-  install node 18.17.0
- `npm install -g pnpm` or `brew install pnpm` or `volta install pnpm` (then add `export VOLTA_FEATURE_PNPM=1` to your terminal startup script ~/.zshrc to enable pnpm support in volta.)
- `cd e2e`
- `pnpm install`
- `pnpm exec playwright install chromium`
- to run test without bs-sdk `pnpm e2e cert:@test:chrome`
- to run test with bs-sdk `pnpm e2e-browserstack cert:@test:chrome`
- to run tests on bs automate:
    enter YOUR_USERNAME and YOUR_PASSWORD here `e2e/config/getBrowserProfiles.js`
    - For SDK run the following `pnpm e2e-browserstack cert:@test:chrome`
    - For legacy run choose one of 3 available profiles `safariBrowserstack / firefoxBrowserstack / edgeBrowserstack / chromeBrowserstack` and run the following `pnpm e2e cert:@test:safariBrowserstack`
- to reproduce issue with `page.getAccessibilityResults is not a function` set `isAccessibilityRun` under line 23 `e2e/config/getProfileDetails.js` to true and run the following `pnpm e2e-browserstack cert:@test:chrome`
