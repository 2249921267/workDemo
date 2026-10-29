import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests',workers:1,timeout:45000,
  use:{baseURL:'http://127.0.0.1:4173/workDemo/',viewport:{width:1440,height:1000},reducedMotion:'reduce',launchOptions:{channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'},screenshot:'only-on-failure'},
  webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:4173/workDemo/',reuseExistingServer:!process.env.CI},reporter:'list'
});
