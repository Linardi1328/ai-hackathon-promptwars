import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = '/Users/richie/.gemini/antigravity/brain/4d88b979-8edf-4938-8777-0bbec9cbdc50';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 5174; // or 5173

async function runVisualReview() {
  console.log('🚀 Launching Headless Chrome for Visual Review...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleMessages.push({ type: 'pageerror', text: err.message }));

  // Set Desktop 1440px
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log(`🌐 Navigating to http://localhost:${PORT}...`);
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

  // 1. Organizer - Healthy
  console.log('📸 1. Capturing Organizer - Healthy (1440px)...');
  const healthyPath = path.join(ARTIFACT_DIR, 'organizer_healthy_1440.png');
  await page.screenshot({ path: healthyPath, fullPage: false });

  // 2. Trigger Disruption
  console.log('⚡ Triggering Disruption...');
  const triggerBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Trigger Judge 3 Dropout'));
  });
  await triggerBtn.click();
  await new Promise(r => setTimeout(r, 400));

  console.log('📸 2. Capturing Organizer - Disrupted (1440px)...');
  const disruptedPath = path.join(ARTIFACT_DIR, 'organizer_disrupted_1440.png');
  await page.screenshot({ path: disruptedPath, fullPage: false });

  // 3. Apply Recovery Plan
  console.log('⚡ Applying Recovery Plan...');
  const recoveryBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Apply Recovery Plan'));
  });
  await recoveryBtn.click();
  await new Promise(r => setTimeout(r, 400));

  console.log('📸 3. Capturing Organizer - Recovered (1440px)...');
  const recoveredPath = path.join(ARTIFACT_DIR, 'organizer_recovered_1440.png');
  await page.screenshot({ path: recoveredPath, fullPage: false });

  // 4. Judge Portal
  console.log('⚡ Switching to Judge Portal...');
  const judgeRoleBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button[role="tab"]'));
    return buttons.find(b => b.textContent.includes('Judge Portal'));
  });
  await judgeRoleBtn.click();
  await new Promise(r => setTimeout(r, 400));

  console.log('📸 4. Capturing Judge Portal (1440px)...');
  const judgePath = path.join(ARTIFACT_DIR, 'judge_portal_1440.png');
  await page.screenshot({ path: judgePath, fullPage: false });

  // 5. Participant Hub
  console.log('⚡ Switching to Participant Hub...');
  const participantRoleBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button[role="tab"]'));
    return buttons.find(b => b.textContent.includes('Participant Hub'));
  });
  await participantRoleBtn.click();
  await new Promise(r => setTimeout(r, 400));

  console.log('📸 5. Capturing Participant Hub (1440px)...');
  const participantPath = path.join(ARTIFACT_DIR, 'participant_hub_1440.png');
  await page.screenshot({ path: participantPath, fullPage: false });

  // 6. Mobile Organizer View
  console.log('⚡ Switching back to Organizer & setting Mobile viewport (390px)...');
  const organizerRoleBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button[role="tab"]'));
    return buttons.find(b => b.textContent.includes('Organizer View'));
  });
  await organizerRoleBtn.click();
  await new Promise(r => setTimeout(r, 400));

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 400));

  console.log('📸 6. Capturing Mobile Organizer View (390px)...');
  const mobilePath = path.join(ARTIFACT_DIR, 'organizer_mobile_390.png');
  await page.screenshot({ path: mobilePath, fullPage: false });

  console.log('\n📊 Browser Console Summary:');
  const errors = consoleMessages.filter(m => m.type === 'error' || m.type === 'pageerror');
  console.log(`Total messages: ${consoleMessages.length}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
  console.log('✅ All 6 visual captures saved successfully.');
}

runVisualReview().catch(console.error);
