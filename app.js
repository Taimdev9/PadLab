/* ============================================================
   PadLab — Universal Controller Studio
   Supports: DualShock 4, DualSense (PS5), Xbox
   ============================================================ */

/* ---------- i18n ---------- */
const I18N = {
  en: {
    loading: "Preparing your controller lab…",
    continue: "Continue",
    notConnected: "Not connected",
    connectHint: "Connect your controller via USB or Bluetooth, then press any button.",
    skinTitle: "🎨 Controller Skin (visual)",
    skinNote: "Changes the on-screen controller only.",
    lightbarTitle: "💡 Real Lightbar (WebHID)",
    connectHid: "Connect via WebHID",
    hidNote: "Requires Chrome/Edge. USB recommended for reliable writes.",
    driftTitle: "🩺 Analog Drift Test",
    startDrift: "Start test (3s)",
    stopDrift: "Stop",
    driftIdle: "Test not started yet",
    driftNote: "Healthy < 0.05 — Warning 0.05–0.15 — Severe > 0.15",
    footer: "PadLab — built for the web. No data leaves your browser.",
    connected: "Connected",
    noGamepad: "No controller detected. Connect one and press a button.",
    hidUnsupported: "WebHID not supported. Use Chrome/Edge.",
    hidNoDevice: "No device selected.",
    hidConnected: "Connected — you can change the lightbar now.",
    hidError: "Connection failed: ",
    driftCollecting: "Collecting samples… do not touch the sticks.",
    driftNotEnough: "Not enough samples. Try again.",
    driftHealthy: "Healthy ✅",
    driftWarning: "Warning ⚠️",
    driftSevere: "Severe drift ❌",
    controllerPS4: "DualShock 4",
    controllerPS5: "DualSense (PS5)",
    controllerXbox: "Xbox Controller",
    controllerUnknown: "Controller",
    xboxNoLightbar: "Xbox controllers do not have an RGB lightbar.",
  },
  ar: {
    loading: "جارٍ تجهيز مختبر التحكم…",
    continue: "متابعة",
    notConnected: "غير متصل",
    connectHint: "وصّل اليد عبر USB أو البلوتوث، ثم اضغط أي زر.",
    skinTitle: "🎨 لون اليد (بصري)",
    skinNote: "يغيّر اليد على الشاشة فقط.",
    lightbarTitle: "💡 Lightbar الحقيقي (WebHID)",
    connectHid: "اتصال عبر WebHID",
    hidNote: "يتطلب Chrome/Edge. يُفضّل USB لضمان الكتابة.",
    driftTitle: "🩺 فحص انحراف الأنالوج",
    startDrift: "ابدأ الفحص (3 ثوانٍ)",
    stopDrift: "إيقاف",
    driftIdle: "لم يبدأ الفحص بعد",
    driftNote: "سليم < 0.05 — تحذير 0.05–0.15 — شديد > 0.15",
    footer: "PadLab — مبني للويب. لا تغادر بياناتك متصفحك.",
    connected: "متصل",
    noGamepad: "لا توجد يد متصلة. وصّل واحدة واضغط زرًا.",
    hidUnsupported: "WebHID غير مدعوم. استخدم Chrome/Edge.",
    hidNoDevice: "لم يتم اختيار جهاز.",
    hidConnected: "متصل — يمكنك تغيير Lightbar الآن.",
    hidError: "فشل الاتصال: ",
    driftCollecting: "جاري جمع العينات… لا تلمس الأنالوج.",
    driftNotEnough: "عينات غير كافية. حاول مرة أخرى.",
    driftHealthy: "سليم ✅",
    driftWarning: "تحذير ⚠️",
    driftSevere: "انحراف شديد ❌",
    controllerPS4: "DualShock 4",
    controllerPS5: "DualSense (PS5)",
    controllerXbox: "يد Xbox",
    controllerUnknown: "يد تحكم",
    xboxNoLightbar: "أيادي Xbox لا تحتوي على Lightbar RGB.",
  }
};

let currentLang = 'en'; // English is the default

function t(key) {
  return I18N[currentLang][key] || I18N.en[key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[lang][key]) el.textContent = I18N[lang][key];
  });
  document.getElementById('langToggle').textContent = lang === 'en' ? 'AR' : 'EN';
  // Update dynamic elements if they exist
  updateStatusUI();
  updateHidStatusUI();
  updateDriftResultUI();
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'ar' : 'en');
});

/* ---------- LOADER (5 seconds) ---------- */
(function initLoader() {
  const fill = document.getElementById('loaderFill');
  const continueBtn = document.getElementById('continueBtn');
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 2; // 2% every 100ms => 5s to reach 100%
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      continueBtn.classList.remove('hidden');
      fill.style.width = '100%';
    } else {
      fill.style.width = progress + '%';
    }
  }, 100);

  continueBtn.addEventListener('click', () => {
    loader.classList.add('fade-out');
    app.classList.remove('hidden');
    setTimeout(() => loader.remove(), 700);
  });
})();

/* ---------- CONTROLLER SVG TEMPLATES ---------- */
/* Shapes are simplified but recognizable. Inspired by open-source asset packs. */
const SVG_PS4 = `
<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bodyGrad" cx="50%" cy="28%" r="75%">
      <stop offset="0%"  stop-color="#4c4c58"/>
      <stop offset="45%" stop-color="#2c2c36"/>
      <stop offset="100%" stop-color="#111116"/>
    </radialGradient>
    <radialGradient id="bodyShine" cx="50%" cy="18%" r="42%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".16"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="stickBase"><stop offset="0%" stop-color="#050507"/><stop offset="75%" stop-color="#14141a"/><stop offset="100%" stop-color="#25252d"/></radialGradient>
    <radialGradient id="stickKnob" cx="38%" cy="32%"><stop offset="0%" stop-color="#52525e"/><stop offset="55%" stop-color="#2a2a32"/><stop offset="100%" stop-color="#0c0c11"/></radialGradient>
    <radialGradient id="buttonGrad" cx="40%" cy="35%"><stop offset="0%" stop-color="#40404c"/><stop offset="70%" stop-color="#1e1e26"/><stop offset="100%" stop-color="#0b0b10"/></radialGradient>
    <linearGradient id="touchpadGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a2a34"/><stop offset="100%" stop-color="#16161c"/></linearGradient>
    <linearGradient id="lightbarGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#154a7a"/><stop offset="50%" stop-color="#5ab0ff"/><stop offset="100%" stop-color="#154a7a"/></linearGradient>
  </defs>
  <path fill="url(#bodyGrad)" stroke="#000" stroke-width="2" d="M 400 125 C 450 118,500 122,540 135 C 590 152,630 180,655 220 C 680 260,690 300,700 350 C 708 395,705 435,685 455 C 665 472,635 472,615 458 C 590 440,570 410,555 385 C 535 355,510 348,480 348 C 445 348,420 355,400 375 C 380 355,355 348,320 348 C 290 348,265 355,245 385 C 230 410,210 440,185 458 C 165 472,135 472,115 455 C 95 435,92 395,100 350 C 110 300,120 260,145 220 C 170 180,210 152,260 135 C 300 122,350 118,400 125 Z"/>
  <ellipse cx="400" cy="225" rx="220" ry="80" fill="url(#bodyShine)"/>
  <!-- L2/R2 -->
  <g id="btn-L2" transform="translate(225,78) rotate(-22)"><rect x="-36" y="-18" width="72" height="32" rx="12" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><text x="0" y="2" text-anchor="middle" font-size="11" fill="#777" font-weight="700">L2</text></g>
  <g id="btn-R2" transform="translate(575,78) rotate(22)"><rect x="-36" y="-18" width="72" height="32" rx="12" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><text x="0" y="2" text-anchor="middle" font-size="11" fill="#777" font-weight="700">R2</text></g>
  <!-- L1/R1 -->
  <g id="btn-L1" transform="translate(248,118) rotate(-22)"><rect x="-38" y="-13" width="76" height="26" rx="9" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><text x="0" y="4" text-anchor="middle" font-size="11" fill="#777" font-weight="700">L1</text></g>
  <g id="btn-R1" transform="translate(552,118) rotate(22)"><rect x="-38" y="-13" width="76" height="26" rx="9" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><text x="0" y="4" text-anchor="middle" font-size="11" fill="#777" font-weight="700">R1</text></g>
  <!-- Lightbar -->
  <rect id="lightbarSvg" x="332" y="152" width="136" height="6" rx="3" fill="url(#lightbarGrad)"/>
  <!-- Touchpad -->
  <g id="btn-touchpad"><rect x="325" y="163" width="150" height="112" rx="10" fill="url(#touchpadGrad)" stroke="#050507" stroke-width="2"/><rect x="333" y="171" width="134" height="96" rx="7" fill="none" stroke="#000" stroke-width="1" opacity=".4"/></g>
  <!-- Share/Options -->
  <g id="btn-share"><rect x="292" y="176" width="22" height="12" rx="3" fill="url(#buttonGrad)" stroke="#0a0a0e"/></g>
  <g id="btn-options"><rect x="486" y="176" width="22" height="12" rx="3" fill="url(#buttonGrad)" stroke="#0a0a0e"/></g>
  <!-- PS -->
  <g id="btn-PS"><circle cx="400" cy="297" r="11" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.2"/><text x="400" y="300" text-anchor="middle" font-size="8.5" fill="#888" font-weight="800">PS</text></g>
  <!-- Left stick -->
  <g><circle id="btn-L3" cx="245" cy="250" r="48" fill="url(#stickBase)" stroke="#050507" stroke-width="2"/><g id="leftStickKnob" class="stick-knob"><circle cx="245" cy="250" r="34" fill="url(#stickKnob)"/><circle cx="245" cy="250" r="34" fill="none" stroke="#000" stroke-width="1.5"/></g></g>
  <!-- D-pad -->
  <g id="dpad-up"><rect x="232" y="340" width="26" height="42" rx="5" fill="url(#buttonGrad)" stroke="#0a0a0e"/></g>
  <g id="dpad-down"><rect x="232" y="388" width="26" height="42" rx="5" fill="url(#buttonGrad)" stroke="#0a0a0e"/></g>
  <g id="dpad-left"><rect x="205" y="372" width="42" height="26" rx="5" fill="url(#buttonGrad)" stroke="#0a0a0e"/></g>
  <g id="dpad-right"><rect x="243" y="372" width="42" height="26" rx="5" fill="url(#buttonGrad)" stroke="#0a0a0e"/></g>
  <!-- Face buttons -->
  <g id="btn-triangle"><circle cx="555" cy="205" r="15" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><path d="M555 197 L562 209 L548 209 Z" fill="none" stroke="#3eb863" stroke-width="2"/></g>
  <g id="btn-circle"><circle cx="595" cy="245" r="15" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><circle cx="595" cy="245" r="7" fill="none" stroke="#e5333b" stroke-width="2"/></g>
  <g id="btn-cross"><circle cx="555" cy="285" r="15" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><line x1="549" y1="279" x2="561" y2="291" stroke="#4a90e2" stroke-width="2.4"/><line x1="561" y1="279" x2="549" y2="291" stroke="#4a90e2" stroke-width="2.4"/></g>
  <g id="btn-square"><circle cx="515" cy="245" r="15" fill="url(#buttonGrad)" stroke="#0a0a0e" stroke-width="1.5"/><rect x="508" y="238" width="14" height="14" rx="1.5" fill="none" stroke="#e25a9d" stroke-width="2"/></g>
  <!-- Right stick -->
  <g><circle id="btn-R3" cx="555" cy="385" r="48" fill="url(#stickBase)" stroke="#050507" stroke-width="2"/><g id="rightStickKnob" class="stick-knob"><circle cx="555" cy="385" r="34" fill="url(#stickKnob)"/><circle cx="555" cy="385" r="34" fill="none" stroke="#000" stroke-width="1.5"/></g></g>
</svg>`;

const SVG_PS5 = `
<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bodyGrad" cx="50%" cy="30%" r="72%">
      <stop offset="0%"  stop-color="#f2f2f5"/>
      <stop offset="55%" stop-color="#dcdce2"/>
      <stop offset="100%" stop-color="#b8b8c2"/>
    </radialGradient>
    <radialGradient id="bodyShine" cx="50%" cy="16%" r="45%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".45"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="stickBase"><stop offset="0%" stop-color="#121216"/><stop offset="100%" stop-color="#2a2a32"/></radialGradient>
    <radialGradient id="stickKnob" cx="38%" cy="32%"><stop offset="0%" stop-color="#555"/><stop offset="100%" stop-color="#1a1a1e"/></radialGradient>
    <radialGradient id="buttonGrad" cx="40%" cy="35%"><stop offset="0%" stop-color="#555"/><stop offset="70%" stop-color="#222"/><stop offset="100%" stop-color="#111"/></radialGradient>
    <linearGradient id="touchpadGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eee"/><stop offset="100%" stop-color="#cfcfd6"/></linearGradient>
    <linearGradient id="lightbarGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1a4a6a"/><stop offset="50%" stop-color="#6ab8ff"/><stop offset="100%" stop-color="#1a4a6a"/></linearGradient>
  </defs>
  <!-- DualSense body: wider, white/black -->
  <path fill="url(#bodyGrad)" stroke="#888" stroke-width="2" d="M 400 120 C 460 112,520 116,565 132 C 615 150,655 182,675 225 C 695 268,705 310,710 360 C 715 405,705 445,685 462 C 665 478,635 476,615 460 C 590 440,570 408,555 382 C 535 352,510 345,480 345 C 445 345,420 352,400 372 C 380 352,355 345,320 345 C 290 345,265 352,245 382 C 230 408,210 440,185 460 C 165 476,135 478,115 462 C 95 445,85 405,90 360 C 95 310,105 268,125 225 C 145 182,185 150,235 132 C 280 116,340 112,400 120 Z"/>
  <ellipse cx="400" cy="220" rx="230" ry="85" fill="url(#bodyShine)"/>
  <!-- Black inner face plate -->
  <path fill="#1a1a1e" stroke="#000" stroke-width="2" d="M 300 190 C 340 170,460 170,500 190 C 530 205,545 240,540 275 C 535 310,500 330,460 335 C 430 338,370 338,340 335 C 300 330,265 310,260 275 C 255 240,270 205,300 190 Z" opacity=".92"/>
  <!-- Lightbar around touchpad -->
  <rect id="lightbarSvg" x="315" y="178" width="170" height="5" rx="2.5" fill="url(#lightbarGrad)"/>
  <!-- Touchpad -->
  <g id="btn-touchpad"><rect x="325" y="195" width="150" height="100" rx="14" fill="url(#touchpadGrad)" stroke="#888" stroke-width="1.5"/><rect x="335" y="205" width="130" height="80" rx="9" fill="none" stroke="#aaa" stroke-width="1" opacity=".5"/></g>
  <!-- Share/Options (small pill buttons) -->
  <g id="btn-share"><rect x="278" y="205" width="18" height="10" rx="4" fill="#222" stroke="#555"/></g>
  <g id="btn-options"><rect x="504" y="205" width="18" height="10" rx="4" fill="#222" stroke="#555"/></g>
  <!-- PS button (logo shape simplified) -->
  <g id="btn-PS"><circle cx="400" cy="315" r="9" fill="#222" stroke="#666"/><text x="400" y="318" text-anchor="middle" font-size="7" fill="#aaa" font-weight="800">PS</text></g>
  <!-- L2/R2 (adaptive triggers, bulkier) -->
  <g id="btn-L2" transform="translate(215,72) rotate(-18)"><rect x="-40" y="-20" width="80" height="36" rx="14" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><text x="0" y="2" text-anchor="middle" font-size="10" fill="#aaa" font-weight="700">L2</text></g>
  <g id="btn-R2" transform="translate(585,72) rotate(18)"><rect x="-40" y="-20" width="80" height="36" rx="14" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><text x="0" y="2" text-anchor="middle" font-size="10" fill="#aaa" font-weight="700">R2</text></g>
  <g id="btn-L1" transform="translate(240,112) rotate(-18)"><rect x="-42" y="-14" width="84" height="28" rx="10" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><text x="0" y="4" text-anchor="middle" font-size="10" fill="#aaa" font-weight="700">L1</text></g>
  <g id="btn-R1" transform="translate(560,112) rotate(18)"><rect x="-42" y="-14" width="84" height="28" rx="10" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><text x="0" y="4" text-anchor="middle" font-size="10" fill="#aaa" font-weight="700">R1</text></g>
  <!-- Left stick -->
  <g><circle id="btn-L3" cx="235" cy="255" r="50" fill="url(#stickBase)" stroke="#000" stroke-width="2"/><g id="leftStickKnob" class="stick-knob"><circle cx="235" cy="255" r="36" fill="url(#stickKnob)"/><circle cx="235" cy="255" r="36" fill="none" stroke="#000" stroke-width="2"/></g></g>
  <!-- D-pad (separated buttons) -->
  <g id="dpad-up"><rect x="222" y="345" width="26" height="40" rx="6" fill="#222" stroke="#555"/></g>
  <g id="dpad-down"><rect x="222" y="390" width="26" height="40" rx="6" fill="#222" stroke="#555"/></g>
  <g id="dpad-left"><rect x="196" y="370" width="40" height="26" rx="6" fill="#222" stroke="#555"/></g>
  <g id="dpad-right"><rect x="234" y="370" width="40" height="26" rx="6" fill="#222" stroke="#555"/></g>
  <!-- Face buttons (symbols) -->
  <g id="btn-triangle"><circle cx="565" cy="210" r="16" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><path d="M565 201 L572 214 L558 214 Z" fill="none" stroke="#3eb863" stroke-width="2"/></g>
  <g id="btn-circle"><circle cx="605" cy="250" r="16" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><circle cx="605" cy="250" r="7" fill="none" stroke="#e5333b" stroke-width="2"/></g>
  <g id="btn-cross"><circle cx="565" cy="290" r="16" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><line x1="559" y1="284" x2="571" y2="296" stroke="#4a90e2" stroke-width="2.4"/><line x1="571" y1="284" x2="559" y2="296" stroke="#4a90e2" stroke-width="2.4"/></g>
  <g id="btn-square"><circle cx="525" cy="250" r="16" fill="url(#buttonGrad)" stroke="#000" stroke-width="1.5"/><rect x="518" y="243" width="14" height="14" rx="1.5" fill="none" stroke="#e25a9d" stroke-width="2"/></g>
  <!-- Right stick -->
  <g><circle id="btn-R3" cx="565" cy="390" r="50" fill="url(#stickBase)" stroke="#000" stroke-width="2"/><g id="rightStickKnob" class="stick-knob"><circle cx="565" cy="390" r="36" fill="url(#stickKnob)"/><circle cx="565" cy="390" r="36" fill="none" stroke="#000" stroke-width="2"/></g></g>
</svg>`;

const SVG_XBOX = `
<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bodyGrad" cx="50%" cy="28%" r="72%">
      <stop offset="0%"  stop-color="#3a3a42"/>
      <stop offset="50%" stop-color="#1e1e24"/>
      <stop offset="100%" stop-color="#0a0a0e"/>
    </radialGradient>
    <radialGradient id="bodyShine" cx="50%" cy="16%" r="40%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".12"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="stickBase"><stop offset="0%" stop-color="#050507"/><stop offset="75%" stop-color="#14141a"/><stop offset="100%" stop-color="#25252d"/></radialGradient>
    <radialGradient id="stickKnob" cx="38%" cy="32%"><stop offset="0%" stop-color="#4a4a52"/><stop offset="55%" stop-color="#25252b"/><stop offset="100%" stop-color="#0c0c10"/></radialGradient>
    <radialGradient id="buttonGrad" cx="40%" cy="35%"><stop offset="0%" stop-color="#444"/><stop offset="70%" stop-color="#222"/><stop offset="100%" stop-color="#111"/></radialGradient>
  </defs>
  <!-- Xbox body: more rounded, split grips -->
  <path fill="url(#bodyGrad)" stroke="#000" stroke-width="2" d="M 400 118 C 455 110,510 115,550 132 C 595 152,630 185,650 225 C 670 265,680 305,685 350 C 690 395,680 435,660 455 C 640 472,610 472,590 455 C 565 435,545 405,530 380 C 510 350,490 342,460 342 C 430 342,410 350,390 370 C 370 350,350 342,320 342 C 290 342,270 350,250 380 C 235 405,215 435,190 455 C 170 472,140 472,120 455 C 100 435,90 395,95 350 C 100 305,110 265,130 225 C 150 185,185 152,230 132 C 270 115,340 110,400 118 Z"/>
  <ellipse cx="400" cy="215" rx="225" ry="82" fill="url(#bodyShine)"/>
  <!-- Top bumpers -->
  <g id="btn-L1" transform="translate(245,108) rotate(-20)"><rect x="-40" y="-12" width="80" height="24" rx="8" fill="url(#buttonGrad)" stroke="#000"/><text x="0" y="4" text-anchor="middle" font-size="9" fill="#777" font-weight="700">LB</text></g>
  <g id="btn-R1" transform="translate(555,108) rotate(20)"><rect x="-40" y="-12" width="80" height="24" rx="8" fill="url(#buttonGrad)" stroke="#000"/><text x="0" y="4" text-anchor="middle" font-size="9" fill="#777" font-weight="700">RB</text></g>
  <g id="btn-L2" transform="translate(220,72) rotate(-20)"><rect x="-38" y="-16" width="76" height="30" rx="10" fill="url(#buttonGrad)" stroke="#000"/><text x="0" y="2" text-anchor="middle" font-size="9" fill="#777" font-weight="700">LT</text></g>
  <g id="btn-R2" transform="translate(580,72) rotate(20)"><rect x="-38" y="-16" width="76" height="30" rx="10" fill="url(#buttonGrad)" stroke="#000"/><text x="0" y="2" text-anchor="middle" font-size="9" fill="#777" font-weight="700">RT</text></g>
  <!-- Xbox button (center) -->
  <g id="btn-PS"><circle cx="400" cy="200" r="14" fill="#222" stroke="#555" stroke-width="1.5"/><circle cx="400" cy="200" r="7" fill="none" stroke="#3eb863" stroke-width="2"/></g>
  <!-- View / Menu -->
  <g id="btn-share"><rect x="300" y="185" width="16" height="10" rx="3" fill="#333" stroke="#555"/></g>
  <g id="btn-options"><rect x="484" y="185" width="16" height="10" rx="3" fill="#333" stroke="#555"/></g>
  <!-- Left stick -->
  <g><circle id="btn-L3" cx="240" cy="255" r="48" fill="url(#stickBase)" stroke="#000" stroke-width="2"/><g id="leftStickKnob" class="stick-knob"><circle cx="240" cy="255" r="34" fill="url(#stickKnob)"/><circle cx="240" cy="255" r="34" fill="none" stroke="#000" stroke-width="1.5"/></g></g>
  <!-- D-pad -->
  <g id="dpad-up"><rect x="227" y="345" width="26" height="42" rx="5" fill="url(#buttonGrad)" stroke="#000"/></g>
  <g id="dpad-down"><rect x="227" y="393" width="26" height="42" rx="5" fill="url(#buttonGrad)" stroke="#000"/></g>
  <g id="dpad-left"><rect x="200" y="377" width="42" height="26" rx="5" fill="url(#buttonGrad)" stroke="#000"/></g>
  <g id="dpad-right"><rect x="238" y="377" width="42" height="26" rx="5" fill="url(#buttonGrad)" stroke="#000"/></g>
  <!-- Face buttons (colored letters) -->
  <g id="btn-cross"><circle cx="555" cy="205" r="16" fill="url(#buttonGrad)" stroke="#000"/><text x="555" y="211" text-anchor="middle" font-size="12" fill="#3eb863" font-weight="800">A</text></g>
  <g id="btn-circle"><circle cx="595" cy="245" r="16" fill="url(#buttonGrad)" stroke="#000"/><text x="595" y="251" text-anchor="middle" font-size="12" fill="#e5333b" font-weight="800">B</text></g>
  <g id="btn-square"><circle cx="555" cy="285" r="16" fill="url(#buttonGrad)" stroke="#000"/><text x="555" y="291" text-anchor="middle" font-size="12" fill="#4a90e2" font-weight="800">X</text></g>
  <g id="btn-triangle"><circle cx="515" cy="245" r="16" fill="url(#buttonGrad)" stroke="#000"/><text x="515" y="251" text-anchor="middle" font-size="12" fill="#facc15" font-weight="800">Y</text></g>
  <!-- Right stick -->
  <g><circle id="btn-R3" cx="555" cy="385" r="48" fill="url(#stickBase)" stroke="#000" stroke-width="2"/><g id="rightStickKnob" class="stick-knob"><circle cx="555" cy="385" r="34" fill="url(#stickKnob)"/><circle cx="555" cy="385" r="34" fill="none" stroke="#000" stroke-width="1.5"/></g></g>
</svg>`;

/* ---------- GAMEPAD STATE ---------- */
const BTN_MAP = {
  0: 'btn-cross', 1: 'btn-circle', 2: 'btn-square', 3: 'btn-triangle',
  4: 'btn-L1', 5: 'btn-R1', 6: 'btn-L2', 7: 'btn-R2',
  8: 'btn-share', 9: 'btn-options', 10: 'btn-L3', 11: 'btn-R3',
  12: 'dpad-up', 13: 'dpad-down', 14: 'dpad-left', 15: 'dpad-right',
  16: 'btn-PS', 17: 'btn-touchpad'
};

const COLOR_MAP = { 0: 'hl-blue', 1: 'hl-red', 2: 'hl-pink', 3: 'hl-green' };
const MAX_TRAVEL = 13;
let prevPressed = {};
let currentPad = null;
let currentControllerType = 'unknown'; // 'ps4' | 'ps5' | 'xbox' | 'unknown'

/* ---------- DOM REFS ---------- */
const statusBadge = document.getElementById('statusBadge');
const controllerContainer = document.getElementById('controllerSvgContainer');
const hidStatusEl = document.getElementById('hidStatus');
const driftResult = document.getElementById('driftResult');
const driftMeterFill = document.getElementById('driftMeterFill');
const axisReadout = document.getElementById('axisReadout');

/* ---------- UI UPDATERS ---------- */
function updateStatusUI() {
  if (!statusBadge) return;
  if (currentPad) {
    statusBadge.textContent = t('connected') + ' — ' + (currentControllerType === 'ps4' ? t('controllerPS4') : currentControllerType === 'ps5' ? t('controllerPS5') : currentControllerType === 'xbox' ? t('controllerXbox') : t('controllerUnknown'));
    statusBadge.className = 'status-badge connected';
  } else {
    statusBadge.textContent = t('notConnected');
    statusBadge.className = 'status-badge idle';
  }
}

function updateHidStatusUI() {
  if (!hidStatusEl) return;
  // handled in connectHID and elsewhere
}

function updateDriftResultUI() {
  // handled in finishDrift
}

/* ---------- DETECT CONTROLLER TYPE ---------- */
function detectControllerType(gamepad) {
  const id = (gamepad.id || '').toLowerCase();
  if (id.includes('dualsense') || id.includes('ps5') || id.includes('0ce6')) return 'ps5';
  if (id.includes('dualshock') || id.includes('ps4') || id.includes('05c4') || id.includes('09cc')) return 'ps4';
  if (id.includes('xbox') || id.includes('xinput')) return 'xbox';
  // Fallback: mapping standard and vendor
  if (gamepad.mapping === 'standard') {
    // Unknown standard gamepad, default to Xbox layout
    return 'xbox';
  }
  return 'unknown';
}

/* ---------- RENDER CONTROLLER SVG ---------- */
function renderController(type) {
  if (type === 'ps5') controllerContainer.innerHTML = SVG_PS5;
  else if (type === 'ps4') controllerContainer.innerHTML = SVG_PS4;
  else controllerContainer.innerHTML = SVG_XBOX; // default / unknown → Xbox layout

  // Re-apply skin color if custom
  applyBodyColor(currentSkinColor);
}

/* ---------- SKIN COLOR ---------- */
let currentSkinColor = '#2c2c36';

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}
function mix(hex1, hex2, p) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return `rgb(${Math.round(a.r + (b.r - a.r) * p)},${Math.round(a.g + (b.g - a.g) * p)},${Math.round(a.b + (b.b - a.b) * p)})`;
}
function applyBodyColor(baseHex) {
  currentSkinColor = baseHex;
  const grad = document.getElementById('bodyGrad');
  if (!grad) return;
  const stops = grad.querySelectorAll('stop');
  if (stops.length >= 3) {
    stops[0].setAttribute('stop-color', mix(baseHex, '#ffffff', .35));
    stops[1].setAttribute('stop-color', baseHex);
    stops[2].setAttribute('stop-color', mix(baseHex, '#000000', .55));
  }
}

/* Skin swatches */
document.querySelectorAll('.swatch').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const c = btn.dataset.color;
    document.getElementById('skinPicker').value = c;
    applyBodyColor(c);
  });
});
document.getElementById('skinPicker').addEventListener('input', e => {
  document.querySelectorAll('.swatch').forEach(b => b.classList.remove('active'));
  applyBodyColor(e.target.value);
});

/* ---------- GAMEPAD CONNECTION ---------- */
window.addEventListener('gamepadconnected', e => {
  currentPad = e.gamepad;
  currentControllerType = detectControllerType(e.gamepad);
  renderController(currentControllerType);
  updateStatusUI();
});

window.addEventListener('gamepaddisconnected', () => {
  currentPad = null;
  currentControllerType = 'unknown';
  updateStatusUI();
  // Reset highlights
  Object.values(BTN_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hl', 'hl-red', 'hl-green', 'hl-blue', 'hl-pink');
  });
  const l = document.getElementById('leftStickKnob');
  const r = document.getElementById('rightStickKnob');
  if (l) l.setAttribute('transform', 'translate(0,0)');
  if (r) r.setAttribute('transform', 'translate(0,0)');
  resetDriftUI();
});

/* ---------- HIGHLIGHT & STICKS ---------- */
function applyHighlight(id, pressed, idx) {
  const el = document.getElementById(id);
  if (!el) return;
  const colorClass = COLOR_MAP[idx];
  if (pressed && !prevPressed[id]) {
    el.classList.add('hl');
    if (colorClass) el.classList.add(colorClass);
  } else if (!pressed && prevPressed[id]) {
    el.classList.remove('hl', 'hl-red', 'hl-green', 'hl-blue', 'hl-pink');
  }
  prevPressed[id] = pressed;
}

function updateSticks(pad) {
  const lx = pad.axes[0] || 0, ly = pad.axes[1] || 0;
  const rx = pad.axes[2] || 0, ry = pad.axes[3] || 0;
  const l = document.getElementById('leftStickKnob');
  const r = document.getElementById('rightStickKnob');
  if (l) l.setAttribute('transform', `translate(${(lx * MAX_TRAVEL).toFixed(2)},${(ly * MAX_TRAVEL).toFixed(2)})`);
  if (r) r.setAttribute('transform', `translate(${(rx * MAX_TRAVEL).toFixed(2)},${(ry * MAX_TRAVEL).toFixed(2)})`);
  if (axisReadout) axisReadout.textContent = `L: (${lx.toFixed(2)}, ${ly.toFixed(2)})  R: (${rx.toFixed(2)}, ${ry.toFixed(2)})`;
}

/* Main loop */
function loop() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let pad = null;
  for (const p of pads) { if (p) { pad = p; break; } }
  if (pad && pad !== currentPad) {
    currentPad = pad;
    currentControllerType = detectControllerType(pad);
    renderController(currentControllerType);
    updateStatusUI();
  }
  if (pad) {
    for (const [idx, id] of Object.entries(BTN_MAP)) {
      const b = pad.buttons[idx];
      applyHighlight(id, b && b.pressed, Number(idx));
    }
    updateSticks(pad);
  }
  requestAnimationFrame(loop);
}
loop();

/* ---------- WEBHID — REAL LIGHTBAR ---------- */
let hidDevice = null;
let ds4Instance = null;   // webhid-ds4 instance
let ds5Controller = null; // DualSense controller instance

document.getElementById('connectHidBtn').addEventListener('click', async () => {
  if (!navigator.hid) {
    hidStatusEl.textContent = t('hidUnsupported');
    return;
  }
  try {
    // Request both DS4 and DualSense
    const devices = await navigator.hid.requestDevice({
      filters: [
        { vendorId: 0x054c, productId: 0x09cc }, // DS4 v2
        { vendorId: 0x054c, productId: 0x05c4 }, // DS4 v1
        { vendorId: 0x054c, productId: 0x0ce6 }, // DualSense
      ]
    });
    if (!devices.length) {
      hidStatusEl.textContent = t('hidNoDevice');
      return;
    }
    hidDevice = devices[0];
    if (!hidDevice.opened) await hidDevice.open();

    // Try to initialize the right library
    const pid = hidDevice.productId;
    if (pid === 0x09cc || pid === 0x05c4) {
      // DualShock 4 → webhid-ds4
      const mod = await import('https://cdn.jsdelivr.net/npm/webhid-ds4@1.0.5/+esm');
      ds4Instance = new mod.DualShock4();
      await ds4Instance.init();
      hidStatusEl.textContent = t('hidConnected') + ' (DS4)';
    } else if (pid === 0x0ce6) {
      // DualSense → @proj-airi/input-playstation-dualsense-5
      const mod = await import('https://cdn.jsdelivr.net/npm/@proj-airi/input-playstation-dualsense-5@0.1.0/+esm');
      const device = await mod.requestDualSenseDevice(); // may request again, but okay
      if (device) {
        ds5Controller = new mod.DualSenseController(device);
        await ds5Controller.open();
        hidStatusEl.textContent = t('hidConnected') + ' (DualSense)';
      }
    }

    document.getElementById('realLightbarColor').disabled = false;
    document.getElementById('connectHidBtn').textContent = '✓ ' + t('connected');
    document.getElementById('connectHidBtn').classList.remove('primary');
    document.getElementById('connectHidBtn').classList.add('green');
  } catch (err) {
    console.error(err);
    hidStatusEl.textContent = t('hidError') + (err.message || err);
  }
});

/* Real lightbar color change */
document.getElementById('realLightbarColor').addEventListener('input', async (e) => {
  const hex = e.target.value;
  const { r, g, b } = hexToRgb(hex);

  // Update visual lightbar on screen too
  const lb = document.getElementById('lightbarSvg');
  if (lb) {
    lb.querySelectorAll('stop').forEach((s, i) => {
      s.setAttribute('stop-color', i === 0 ? mix(hex, '#fff', .4) : i === 1 ? hex : mix(hex, '#000', .4));
    });
  }

  try {
    if (ds4Instance && ds4Instance.lightbar) {
      await ds4Instance.lightbar.setColorRGB(r, g, b);
    } else if (ds5Controller) {
      const output = { lightbar: { red: r, green: g, blue: b } };
      await ds5Controller.sendOutput(output);
    } else if (hidDevice && (hidDevice.productId === 0x09cc || hidDevice.productId === 0x05c4)) {
      // Fallback: raw report for DS4
      await sendDS4LightbarReport(hidDevice, r, g, b);
    }
  } catch (err) {
    console.warn('Lightbar write error:', err);
  }
});

/* Fallback DS4 report (USB) */
async function sendDS4LightbarReport(device, r, g, b) {
  const reportId = 0x05;
  const buf = new Uint8Array(32);
  buf[0] = reportId;
  buf[1] = 0xff;
  buf[6] = r; buf[7] = g; buf[8] = b;
  await device.sendReport(reportId, buf);
}

/* ---------- DRIFT TEST ---------- */
let driftRunning = false;
let driftSamples = [];
let driftStartTime = 0;
const DRIFT_DURATION = 3000;
const DRIFT_OK = 0.05;
const DRIFT_WARN = 0.15;

const btnStart = document.getElementById('startDriftBtn');
const btnStop = document.getElementById('stopDriftBtn');

function resetDriftUI() {
  driftResult.className = 'drift-result idle';
  driftResult.textContent = t('driftIdle');
  driftMeterFill.style.width = '0%';
  driftSamples = [];
  driftRunning = false;
  btnStart.disabled = false;
  btnStop.disabled = true;
}

btnStart.addEventListener('click', () => {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let pad = null;
  for (const p of pads) { if (p) { pad = p; break; } }
  if (!pad) {
    driftResult.className = 'drift-result idle';
    driftResult.textContent = t('noGamepad');
    return;
  }
  driftSamples = [];
  driftStartTime = performance.now();
  driftRunning = true;
  btnStart.disabled = true;
  btnStop.disabled = false;
  driftResult.className = 'drift-result idle';
  driftResult.textContent = t('driftCollecting');

  function collect() {
    if (!driftRunning) return;
    const now = performance.now();
    const pads2 = navigator.getGamepads ? navigator.getGamepads() : [];
    let p2 = null;
    for (const q of pads2) { if (q) { p2 = q; break; } }
    if (p2) {
      driftSamples.push({
        lx: p2.axes[0] || 0, ly: p2.axes[1] || 0,
        rx: p2.axes[2] || 0, ry: p2.axes[3] || 0
      });
    }
    if (now - driftStartTime < DRIFT_DURATION) {
      requestAnimationFrame(collect);
    } else {
      finishDrift();
    }
  }
  collect();
});

btnStop.addEventListener('click', () => {
  driftRunning = false;
  finishDrift();
});

function finishDrift() {
  driftRunning = false;
  btnStart.disabled = false;
  btnStop.disabled = true;

  if (driftSamples.length < 10) {
    driftResult.className = 'drift-result idle';
    driftResult.textContent = t('driftNotEnough');
    return;
  }

  let sumL = 0, sumR = 0, n = driftSamples.length;
  let maxL = 0, maxR = 0;
  for (const s of driftSamples) {
    const magL = Math.sqrt(s.lx * s.lx + s.ly * s.ly);
    const magR = Math.sqrt(s.rx * s.rx + s.ry * s.ry);
    sumL += magL; sumR += magR;
    maxL = Math.max(maxL, magL);
    maxR = Math.max(maxR, magR);
  }
  const avgL = sumL / n, avgR = sumR / n;
  const worstAvg = Math.max(avgL, avgR);
  const worstMax = Math.max(maxL, maxR);

  let verdict, cls;
  if (worstAvg < DRIFT_OK) { verdict = t('driftHealthy'); cls = 'ok'; }
  else if (worstAvg < DRIFT_WARN) { verdict = t('driftWarning'); cls = 'warn'; }
  else { verdict = t('driftSevere'); cls = 'bad'; }

  driftResult.className = 'drift-result ' + cls;
  driftResult.textContent = `${verdict} — L:${avgL.toFixed(3)} R:${avgR.toFixed(3)} (max: ${worstMax.toFixed(3)})`;
  const pct = Math.min(100, (worstAvg / 0.30) * 100);
  driftMeterFill.style.width = pct + '%';
}

/* ---------- BOOT ---------- */
applyLanguage('en');
renderController('xbox'); // default visual until a controller connects