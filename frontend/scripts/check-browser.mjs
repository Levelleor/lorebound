import { firefox } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.GATE0_URL ?? 'http://127.0.0.1:18080';
const browser = await firefox.launch({ headless: true });
try {
  const page = await browser.newPage();
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), 200);
  await page.locator('#host-status').getByText('Connected to Lorebound Gate 0').waitFor({ timeout: 15000 });
  const connected = await page.locator('#host-status').innerText();
  console.log(`browser service response: ${connected}`);
  const before = await page.locator('#record-status').innerText();
  console.log(`browser read: ${before}`);
  await page.locator('#value').fill('browser-committed');
  await page.getByRole('button', { name: 'Save test record' }).click();
  await page.locator('#record-status').getByText('browser-committed').waitFor({ timeout: 15000 });
  const after = await page.locator('#record-status').innerText();
  console.log(`browser commit: ${after}`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#record-status').getByText('browser-committed').waitFor({ timeout: 15000 });
  console.log(`browser reload: ${await page.locator('#record-status').innerText()}`);
} finally {
  await browser.close();
}
