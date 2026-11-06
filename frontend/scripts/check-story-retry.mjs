import assert from 'node:assert/strict';

export async function exerciseRetry(page, read)
{
  const before = await read();
  const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
  const retry = page.getByRole('button', { name: 'Retry', exact: true });
  const input = page.getByLabel('Story input');
  await input.fill('Keep this input after stopping a replacement.');
  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  await retry.waitFor();
  await page.getByRole('status', { name: 'Draft status' }).getByText('Draft saved · Not accepted story.', { exact: true }).waitFor();
  const firstId = await proposal.getAttribute('data-turn-id');
  await retry.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('region', { name: 'Generating proposal' }).waitFor();
  assert.equal(await proposal.count(), 0, 'Retry removes old candidate immediately');
  assert.equal(await page.getByRole('button', { name: 'Accept turn', exact: true }).count(), 0);
  assert.equal(await input.isDisabled(), true);
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Stop generation');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(550);
  assert.equal(await proposal.count(), 0, 'Stopped replacement never restores old candidate');
  assert.equal(await input.inputValue(), 'Keep this input after stopping a replacement.');
  assert.equal(await input.evaluate(element => element === document.activeElement), true);
  assert.deepEqual(await read(), before);

  await page.getByRole('button', { name: 'Generate continuation', exact: true }).click();
  await retry.waitFor();
  const nextId = await proposal.getAttribute('data-turn-id');
  assert.notEqual(nextId, firstId);
  await retry.click();
  await page.getByRole('region', { name: 'Generating proposal' }).waitFor();
  await page.reload({ waitUntil: 'networkidle' });
  await input.waitFor();
  await page.waitForTimeout(550);
  assert.equal(await proposal.count(), 0, 'Reload abandons replacement');
  assert.equal(await input.inputValue(), 'Keep this input after stopping a replacement.', 'Saved authored input survives; generated candidates do not');
  assert.deepEqual(await read(), before);
  console.log('PASS: real browser keyboard Retry immediately invalidates; Stop retains input; reload restores saved input and abandons generated replacement');
}

export async function replaceProposal(page)
{
  const proposal = page.getByRole('region', { name: 'Proposed turn', exact: true });
  const originalId = await proposal.getAttribute('data-turn-id');
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await page.getByRole('button', { name: 'Accept turn', exact: true }).waitFor();
  const replacementId = await proposal.getAttribute('data-turn-id');
  assert.notEqual(replacementId, originalId, 'Fixed simulated prose still creates a fresh candidate');
  assert.equal(await proposal.count(), 1);
  assert.equal(await page.getByLabel('Story input').isDisabled(), true);
  return { originalId, replacementId };
}
