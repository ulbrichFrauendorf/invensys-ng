import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    restoreMocks: true,
    unstubGlobals: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: process.env['CHROME_BIN']
          ? { executablePath: process.env['CHROME_BIN'] }
          : {},
      }),
      instances: [
        { browser: 'chromium', viewport: { width: 1280, height: 900 } },
      ],
    },
  },
});
