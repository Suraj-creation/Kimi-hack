/**
 * 🎯 QUICK DEMO SCRIPT
 * Run this to verify conversational AI is working
 */

console.log('='.repeat(60));
console.log('🎤 CONVERSATIONAL AI - QUICK VERIFICATION');
console.log('='.repeat(60));
console.log('');

// Check 1: Environment Setup
console.log('📋 CHECK 1: Environment Setup');
console.log('-'.repeat(60));

const hasGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log(`✓ Gemini API Key: ${hasGeminiKey ? '✅ FOUND' : '❌ MISSING'}`);

if (!hasGeminiKey) {
  console.log('⚠️  Add VITE_GEMINI_API_KEY to .env file');
}
console.log('');

// Check 2: Speech Recognition Support
console.log('📋 CHECK 2: Browser Support');
console.log('-'.repeat(60));

const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
console.log(`✓ Speech Recognition: ${hasSpeechRecognition ? '✅ SUPPORTED' : '❌ NOT SUPPORTED'}`);

if (!hasSpeechRecognition) {
  console.log('⚠️  Use Chrome or Edge browser');
}
console.log('');

// Check 3: Wake Word Detection
console.log('📋 CHECK 3: Wake Word Detection');
console.log('-'.repeat(60));
console.log('🎤 Listening for wake word: "साथी" (Sathi)');
console.log('');
console.log('👉 TO TEST:');
console.log('   1. Make sure microphone permissions are granted');
console.log('   2. Say clearly: "साथी" or "Sathi"');
console.log('   3. AI assistant should open automatically');
console.log('   4. Toast notification: "साथी सुन रहा है! 🎤"');
console.log('');

// Check 4: Page Context
console.log('📋 CHECK 4: Page Context Extraction');
console.log('-'.repeat(60));

const currentPath = window.location.pathname;
const mainContent = document.querySelector('main');
const hasContent = mainContent && mainContent.textContent.length > 0;

console.log(`✓ Current Page: ${currentPath}`);
console.log(`✓ Main Content: ${hasContent ? '✅ FOUND' : '❌ EMPTY'}`);
console.log(`✓ Content Length: ${mainContent?.textContent?.length || 0} characters`);
console.log('');

// Check 5: Quick Tests
console.log('📋 CHECK 5: Quick Functionality Tests');
console.log('-'.repeat(60));
console.log('');
console.log('TEST 1: Wake Word Activation');
console.log('  Say: "साथी"');
console.log('  Expected: AI opens, starts listening');
console.log('');
console.log('TEST 2: Page Explanation');
console.log('  Say: "साथी"');
console.log('  Then say: "यह पेज क्या है?"');
console.log('  Expected: AI explains current page content');
console.log('');
console.log('TEST 3: Database Query');
console.log('  Say: "साथी"');
console.log('  Then say: "मेरी जानकारी बताओ"');
console.log('  Expected: AI shows your profile data (name, village, work days)');
console.log('');
console.log('TEST 4: Conversation Context');
console.log('  Say: "साथी"');
console.log('  Say: "मैंने कितना काम किया?"');
console.log('  Then say: "और कितना बाकी है?"');
console.log('  Expected: AI calculates remaining days (100 - worked)');
console.log('');
console.log('TEST 5: Empathetic Grievance');
console.log('  Say: "साथी"');
console.log('  Say: "मेरा पैसा नहीं आया"');
console.log('  Expected: Empathetic response with follow-up questions');
console.log('');

// Results Summary
console.log('='.repeat(60));
console.log('📊 SYSTEM STATUS');
console.log('='.repeat(60));

const allChecks = [
  hasGeminiKey,
  hasSpeechRecognition,
  hasContent,
];

const passedChecks = allChecks.filter(Boolean).length;
const totalChecks = allChecks.length;
const passRate = Math.round((passedChecks / totalChecks) * 100);

console.log(`✓ Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`✓ Pass Rate: ${passRate}%`);
console.log('');

if (passRate === 100) {
  console.log('🎉 ALL SYSTEMS GO! Ready for testing.');
  console.log('');
  console.log('👉 NEXT STEPS:');
  console.log('   1. Grant microphone permissions');
  console.log('   2. Say "साथी" to activate');
  console.log('   3. Start conversing naturally');
  console.log('   4. Test on different pages');
} else {
  console.log('⚠️  SOME CHECKS FAILED');
  console.log('');
  console.log('👉 FIX REQUIRED:');
  if (!hasGeminiKey) console.log('   - Add VITE_GEMINI_API_KEY to .env');
  if (!hasSpeechRecognition) console.log('   - Use Chrome or Edge browser');
  if (!hasContent) console.log('   - Wait for page to load completely');
}

console.log('');
console.log('='.repeat(60));
console.log('📖 Full testing guide: tests/README.md');
console.log('📝 Manual checklist: tests/manual-test-checklist.md');
console.log('='.repeat(60));

export default {
  hasGeminiKey,
  hasSpeechRecognition,
  hasContent,
  passRate,
};
