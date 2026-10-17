import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: process.env['CHROME_BIN']
          ? { executablePath: process.env['CHROME_BIN'] }
          : {},
      }),
      instances: [
        {
          browser: 'chromium',
          name: 'desktop',
          viewport: { width: 1280, height: 900 },
        },
        {
          browser: 'chromium',
          name: 'touch',
          viewport: { width: 390, height: 844 },
          contextOptions: { hasTouch: true, isMobile: true },
        },
      ],
    },
  },
});
