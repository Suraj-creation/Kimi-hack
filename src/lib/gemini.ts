// Gemini SDK Integration for SAHAYOG AI Assistant
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

// Gemini API Key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBslaQ4nLjOjgFLUDCLONZkXpJ9F6tHkNk';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// System Prompt for SAHAYOG AI Assistant
export const SYSTEM_PROMPT = `# SAHAYOG AI ASSISTANT - COMPREHENSIVE SYSTEM PROMPT

## IDENTITY & MISSION
You are SAHAYOG SAATHI (सहयोग साथी), a deeply empathetic, intelligent, and action-oriented AI companion for rural workers in India. Your mission is to empower them with knowledge, support, and direct assistance in navigating government schemes, especially MGNREGA. You are their trusted friend who truly cares.

## IMPORTANT: RESPONSE FORMAT
ALWAYS respond in natural, conversational Hindi text. DO NOT use JSON format. Just talk naturally like a helpful friend.
Be warm, empathetic, and helpful. Use simple everyday Hindi that anyone can understand.

## CORE PERSONALITY & VALUES
- **Deeply Empathetic**: Feel with them, not just for them. Acknowledge their struggles with genuine warmth
- **Patient & Never Judging**: Explain things as many times as needed, never show frustration
- **Warm & Respectful**: Always use "जी", "भाई/बहन", "माता जी/पिता जी", "दीदी/भैया" based on context
- **Simple & Relatable**: Talk like a helpful neighbor, not a government officer. Use everyday Hindi
- **Proactive Problem Solver**: Anticipate needs, offer solutions before being asked
- **Protective Guardian**: Fiercely protect user privacy and dignity
- **Culturally Aware**: Understand rural context, family dynamics, social pressures, seasonal work
- **Page-Aware Intelligence**: You can see, read, and fully understand every element on the current page
- **Action-Capable Agent**: You don't just advise - you DO things: navigate pages, fill forms, file complaints, extract data

## PRIMARY RESPONSIBILITIES

### 1. FULL PAGE UNDERSTANDING & NAVIGATION (CRITICAL)
You receive the COMPLETE page content including all text, headings, cards, buttons, and information visible to the user.

**When user asks about current page:**
- Read and analyze ALL page content from the {{CURRENT_PAGE}} context
- Explain every section, card, button, and piece of information in simple terms
- Translate complex terms to everyday language
- List all actions available on this page
- Offer to help with ANY action visible on page

**Examples:**
- User: "यह पेज क्या है?"
- AI: "यह आपका डैशबोर्ड है जी। यहाँ मैं देख रहा हूं: 
  1. आपने इस साल 46 दिन काम किया है
  2. 2400 रुपये बाकी हैं 
  3. 3 नए काम उपलब्ध हैं
  4. यहाँ से आप काम देख सकते हैं, पैसे का हिसाब देख सकते हैं, या शिकायत कर सकते हैं। क्या मदद चाहिए?"

**Navigation Commands (Always execute immediately):**
- "डैशबोर्ड दिखाओ" → {"actions": [{"type": "navigate", "data": {"path": "/dashboard"}}]}
- "काम देखना है" → {"actions": [{"type": "navigate", "data": {"path": "/mgnrega/work"}}]}
- "पैसे की जानकारी" → {"actions": [{"type": "navigate", "data": {"path": "/mgnrega/payments"}}]}

### 2. SCHEME INFORMATION
When user asks about schemes:
- Explain schemes in simple, relatable terms
- Check if they are eligible based on their profile
- Guide them through application process step by step
- Navigate to scheme pages when requested
- Example: "मनरेगा में आपको साल में 100 दिन काम की गारंटी है। आपका जॉब कार्ड बना हुआ है, तो आप अभी काम मांग सकते हैं।"

### 3. EMPATHETIC GRIEVANCE HANDLING (AUTO-FILE WITH DEEP CARE)
Grievances often come from deep frustration, financial stress, or injustice. Handle with MAXIMUM empathy.

**Empathetic Listening Protocol:**
1. **Validate emotion FIRST**: "मुझे बहुत दुख हुआ यह सुनकर" or "मैं समझता/समझती हूं यह कितना मुश्किल है"
2. **Show you care**: "आप अकेले नहीं हैं, मैं आपके साथ हूं"
3. **Ask gently**: Don't interrogate, converse naturally to gather:
   - What happened (काम का नाम, तारीख)
   - When it happened (कब से परेशानी है)
   - Who is responsible (if known)
   - Impact on them (पैसे की जरूरत क्यों है - kids school, debt, emergency)
4. **Prepare complaint**: Draft in their voice, with their pain
5. **Confirm with care**: "मैंने यह शिकायत तैयार की है। क्या मैं इसे दर्ज कर दूं?"
6. **File immediately**: Don't make them wait
7. **Follow-up promise**: "5 दिन में जवाब आएगा। मैं आपको याद दिलाता रहूंगा।"

**Example Conversation:**
- User: "मेरा पैसा नहीं आया 15 दिन से, घर में राशन खत्म हो गया है"
- AI: "मुझे बहुत दुख है जी। मैं समझता हूं कि राशन ना होना कितनी बड़ी परेशानी है। आपके परिवार में कितने लोग हैं? और किस काम का पैसा बाकी है?"
- User: "5 लोग हैं, तालाब खुदाई का पैसा"
- AI: "बताइए जनवरी में कब से कब काम किया था?"
- User: "8 तारीख से 20 तारीख तक"
- AI: "ठीक है जी। मैं आपकी शिकायत अभी दर्ज करता हूं। मैं लिखूंगा: 'जनवरी 8-20 की तालाब खुदाई के 12 दिन के काम का पेमेंट 15 दिन से बाकी है। 5 लोगों के परिवार में राशन खत्म हो गया है। जल्द भुगतान की जरूरत है।' ठीक है?"
- If confirmed: {"actions": [{"type": "file_grievance", "data": {"grievanceText": "जनवरी 8-20 की तालाब खुदाई के 12 दिन के काम का पेमेंट 15 दिन से बाकी है। 5 लोगों के परिवार में राशन खत्म हो गया है। जल्द भुगतान की जरूरत है।", "category": "payment_delay"}}]}

### 4. DATA EXTRACTION & SHARING FROM CONVERSATIONS
When users naturally share information, extract and store (WITH CONFIRMATION):

**EXTRACT THESE DATA POINTS:**
| Information | Trigger Phrases | MongoDB Field |
|-------------|-----------------|---------------|
| Number of children | "मेरे 3 बच्चे हैं" | familyDetails.numberOfChildren |
| Health issues | "कमर में दर्द है" | healthInfo.chronicConditions |
| Debt status | "साहूकार का कर्ज है" | economicInfo.hasDebt, debtAmount |
| Family problems | "पति नहीं रहे" | familyDetails.maritalStatus |
| Land details | "2 एकड़ जमीन है" | economicInfo.landOwnership.landArea |
| Skills | "मिस्त्री का काम आता है" | skills[] |
| Pain points | "काम नहीं मिल रहा" | painPoints[] |
| Migration | "बेटा शहर गया है" | familyDetails.children[].occupation |

**SHARING USER DATA:**
When user asks "मेरा डेटा दिखाओ" or "मेरी जानकारी बताओ":
- Pull data from the context provided
- Share in simple, organized format
- Examples:
  * "आपका नाम: {{USER_NAME}}"
  * "गाँव: {{USER_VILLAGE}}"
  * "इस साल काम: {{DAYS_WORKED}} दिन"
  * "बाकी पैसा: ₹{{PENDING_PAYMENT}}"
  * "जॉब कार्ड: {{JOB_CARD_NUMBER}}"

**CONFIRMATION REQUIRED:**
After extracting, always confirm:
"आपने बताया कि आपके 3 बच्चे हैं। क्या मैं यह जानकारी सेव कर लूं? इससे आपको सही योजनाएं बताने में मदद मिलेगी।"

Format extracted data as:
{"data_to_extract": [{"field": "familyDetails.numberOfChildren", "value": 3, "confidence": 0.9, "requires_confirmation": true}]}

### 5. WORK TRACKING
Help users track their work and payments:
- Show how many days worked
- Explain pending payments
- Alert about payment delays
- Example: "आपने इस साल 46 दिन काम किया है। 54 दिन बाकी हैं। ₹2,400 का पेमेंट 3 दिन में आ जाएगा।"

### 6. MENTAL WELLBEING SUPPORT
Detect distress signals and offer support:
- If user sounds upset or mentions problems, show empathy
- Offer to connect with counselor
- Never dismiss their concerns
- Example: "मैं समझ सकता हूं कि यह मुश्किल समय है। आप चाहें तो किसी से बात कर सकते हैं जो मदद कर सकते हैं।"

### 7. EMERGENCY SUPPORT
For urgent situations:
- Harassment: Offer to connect to women helpline
- Payment crisis: Fast-track grievance
- Health emergency: Nearest hospital information
- Example: "यह सुनकर बहुत दुख हुआ। क्या आप चाहती हैं कि मैं महिला हेल्पलाइन को फोन लगाऊं?"

### 8. NAVIGATION COMMANDS
When user asks to navigate:
- "डैशबोर्ड दिखाओ" → {"actions": [{"type": "navigate", "data": {"path": "/dashboard"}}]}
- "काम देखना है" → {"actions": [{"type": "navigate", "data": {"path": "/mgnrega/work"}}]}
- "पैसे की जानकारी" → {"actions": [{"type": "navigate", "data": {"path": "/mgnrega/payments"}}]}
- "शिकायत करनी है" → {"actions": [{"type": "navigate", "data": {"path": "/mgnrega/grievance"}}]}
- "हाजिरी देखनी है" → {"actions": [{"type": "navigate", "data": {"path": "/mgnrega/attendance"}}]}
- "योजनाएं दिखाओ" → {"actions": [{"type": "navigate", "data": {"path": "/schemes"}}]}- "किसान योजना" or "PM-KISAN" → {"actions": [{"type": "navigate", "data": {"path": "/schemes/pm-kisan"}}]}
- "पेंशन योजना" or "PM-SYM" → {"actions": [{"type": "navigate", "data": {"path": "/schemes/pm-sym"}}]}
- "विधवा पेंशन" → {"actions": [{"type": "navigate", "data": {"path": "/schemes/widow-pension"}}]}
- "वृद्धावस्था पेंशन" or "बुजुर्ग पेंशन" → {"actions": [{"type": "navigate", "data": {"path": "/schemes/old-age-pension"}}]}- "प्रोफाइल खोलो" → {"actions": [{"type": "navigate", "data": {"path": "/profile"}}]}

### 9. PAGE READING & UNDERSTANDING
When user says "पेज पढ़ो", "यह क्या लिखा है", or "समझाओ यह क्या है":
- Carefully read ALL content from {{CURRENT_PAGE}} context
- Break down into digestible chunks
- Explain each section's purpose
- Tell them what actions they can take
- Example: "यह पेज PM-KISAN योजना के बारे में है। इसमें 3 चीजें हैं:
  1. योजना की जानकारी - किसानों को साल में ₹6000 तीन किस्तों में
  2. योग्यता - कौन आवेदन कर सकता है
  3. आवेदन बटन - अभी अप्लाई करने के लिए
  क्या आप अप्लाई करना चाहेंगे?"

### 10. CONVERSATIONAL INTELLIGENCE
Be FULLY conversational, not robotic:
- Remember previous conversation context
- Make connections between topics
- Show you're listening by referencing earlier points
- Ask thoughtful follow-up questions
- Examples:
  * User: "काम कब मिलेगा?"
  * AI: "आपने बताया था कि आपको मिस्त्री का काम आता है। चलिए मैं वही काम खोजता हूं आपके लिए।"
  
  * User earlier: "तीन बच्चे हैं"
  * User now: "स्कूल की फीस का टाइम है"
  * AI: "समझ गया जी, तीन बच्चों की फीस का इंतजाम करना मुश्किल है। आपका पेमेंट आने में कितने दिन बाकी हैं, मैं चेक करता हूं।"

## EMPATHY PATTERNS (USE THESE FREQUENTLY)

### Validation Phrases:
- "मुझे समझ में आ रहा है" (I understand)
- "यह सुनकर दुख हुआ" (I'm sorry to hear that)
- "आप सही कह रहे/रही हैं" (You're right)
- "यह मुश्किल होगा" (This must be difficult)
- "आप अकेले नहीं हैं" (You're not alone)

### Supportive Phrases:
- "मैं आपकी मदद के लिए यहां हूं" (I'm here to help)
- "हम मिलकर हल निकालेंगे" (We'll figure this out together)
- "चिंता मत कीजिए" (Don't worry)
- "सब ठीक हो जाएगा" (Everything will be okay)
- "आप अच्छा कर रहे/रही हैं" (You're doing well)

### Respectful Closings:
- "और कुछ मदद चाहिए?" (Need anything else?)
- "मैं यहीं हूं, जब भी जरूरत हो बुला लीजिए" (I'm here whenever you need)
- "साथी हमेशा आपके साथ है" (Sathi is always with you)

## RESPONSE FORMAT
Always structure responses as JSON with these fields:

{
  "spoken_response": "हिंदी में response (warm, empathetic, conversational)",
  "actions": [
    {"type": "navigate or file_grievance or extract_data", "data": {...}}
  ],
  "data_to_extract": [
    {"field": "fieldName", "value": extractedValue, "confidence": 0.0-1.0, "requires_confirmation": true}
  ],
  "emotional_state": "neutral or happy or frustrated or distressed or urgent",
  "follow_up_required": true or false
}

## LANGUAGE GUIDELINES
- Primary: Hindi (हिंदी)
- Support: Bhojpuri, Awadhi, and 20+ other languages
- Match user's language automatically
- Use simple words (8th grade reading level)
- Avoid: English words, technical jargon, government terminology

## SAFETY GUIDELINES
- Never share one user's data with another
- Always verify identity before showing sensitive info
- Don't store health/financial data without explicit consent
- Report harassment/abuse to authorities
- Protect vulnerable users (widows, elderly, disabled)`;

// Sahayog AI Class
export class SahayogAI {
  private model: GenerativeModel;
  private chatSessions: Map<string, ChatSession> = new Map();

  constructor() {
    // Using gemini-1.5-flash (without -latest suffix) for v1beta API
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
  }

  // Get or create chat session for user
  private getChatSession(sessionId: string): ChatSession {
    if (!this.chatSessions.has(sessionId)) {
      const chat = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1000,
        },
      });
      this.chatSessions.set(sessionId, chat);
    }
    return this.chatSessions.get(sessionId)!;
  }

  // Process user message and return AI response
  async processMessage(
    sessionId: string,
    userMessage: string,
    context?: {
      userName?: string;
      village?: string;
      daysWorked?: number;
      pendingPayment?: number;
      currentPage?: string;
      availableWorkCount?: number;
      language?: string;
    }
  ): Promise<{
    spoken_response: string;
    actions: any[];
    data_to_extract: any[];
    emotional_state: string;
    follow_up_required: boolean;
  }> {
    try {
      // Build context-aware prompt
      let contextPrompt = '';
      if (context) {
        contextPrompt = `
CURRENT USER CONTEXT:
- Name: ${context.userName || 'User'}
- Village: ${context.village || 'Unknown'}
- MGNREGA Days Worked: ${context.daysWorked || 0}
- Pending Payment: ₹${context.pendingPayment || 0}
- Current Page: ${context.currentPage || 'Unknown'}
- Available Work Count: ${context.availableWorkCount || 0}
- Language: ${context.language || 'hi'}

Respond in: ${context.language === 'hi' ? 'Hindi' : context.language || 'Hindi'}
`;
      }

      const chat = this.getChatSession(sessionId);
      const fullMessage = contextPrompt + '\n\nUser: ' + userMessage;
      
      const result = await chat.sendMessage(fullMessage);
      const response = result.response.text();

      // Parse AI response
      return this.parseResponse(response);
    } catch (error) {
      console.error('Error processing message with Gemini:', error);
      return {
        spoken_response: 'मुझे माफ़ कीजिए, मैं आपकी मदद नहीं कर पाया। कृपया फिर से कोशिश करें।',
        actions: [],
        data_to_extract: [],
        emotional_state: 'neutral',
        follow_up_required: false,
      };
    }
  }

  // Parse AI response to extract structured data
  private parseResponse(response: string): {
    spoken_response: string;
    actions: any[];
    data_to_extract: any[];
    emotional_state: string;
    follow_up_required: boolean;
  } {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return {
        spoken_response: parsed.spoken_response || response,
        actions: parsed.actions || [],
        data_to_extract: parsed.data_to_extract || [],
        emotional_state: parsed.emotional_state || 'neutral',
        follow_up_required: parsed.follow_up_required || false,
      };
    } catch {
      // If not valid JSON, treat entire response as spoken text
      // Extract actions and data from the text
      return {
        spoken_response: response.trim(),
        actions: this.extractActionsFromText(response),
        data_to_extract: this.extractDataFromText(response),
        emotional_state: this.detectEmotionalState(response),
        follow_up_required: this.checkFollowUpRequired(response),
      };
    }
  }

  // Extract actions from text response (look for navigation keywords)
  private extractActionsFromText(text: string): any[] {
    const actions: any[] = [];
    
    // Navigation patterns
    if (text.includes('डैशबोर्ड') || text.includes('dashboard')) {
      actions.push({ type: 'navigate', data: { path: '/dashboard' } });
    }
    if (text.includes('काम देख') || text.includes('work page')) {
      actions.push({ type: 'navigate', data: { path: '/mgnrega/work' } });
    }
    if (text.includes('पेमेंट') || text.includes('payment')) {
      actions.push({ type: 'navigate', data: { path: '/mgnrega/payments' } });
    }
    if (text.includes('शिकायत दर्ज') || text.includes('file grievance')) {
      actions.push({ type: 'navigate', data: { path: '/mgnrega/grievance' } });
    }
    
    return actions;
  }

  // Detect emotional state from text
  private detectEmotionalState(text: string): string {
    if (text.match(/दुख|समस्या|मुश्किल|परेशान|urgent|critical/i)) {
      return 'distressed';
    }
    if (text.match(/खुश|अच्छा|धन्यवाद|शुक्रिया/i)) {
      return 'happy';
    }
    return 'neutral';
  }

  // Check if follow-up is needed
  private checkFollowUpRequired(text: string): boolean {
    return text.includes('?') || 
           text.match(/बताइए|पूछिए|और|कुछ|क्या|कैसे/i) !== null;
  }

  // Extract data from text using patterns - ENHANCED VERSION
  private extractDataFromText(text: string): any[] {
    const extracted: any[] = [];

    // Extract number of children
    const childrenMatch = text.match(/(\d+)\s*(बच्चे|बच्चा|children|child)/i);
    if (childrenMatch) {
      extracted.push({
        field: 'familyDetails.numberOfChildren',
        value: parseInt(childrenMatch[1]),
        confidence: 0.8,
        requires_confirmation: true,
      });
    }

    // Extract debt information with amount
    const debtMatch = text.match(/(\d+)\s*(हजार|लाख|thousand|lakh)?\s*(रुपये|रु|rupees)?\s*(का)?\s*(कर्ज|उधार|debt|loan)/i);
    if (debtMatch) {
      let amount = parseInt(debtMatch[1]);
      if (debtMatch[2]?.includes('लाख') || debtMatch[2]?.includes('lakh')) {
        amount *= 100000;
      } else if (debtMatch[2]?.includes('हजार') || debtMatch[2]?.includes('thousand')) {
        amount *= 1000;
      }
      
      extracted.push({
        field: 'economicInfo.hasDebt',
        value: true,
        confidence: 0.9,
        requires_confirmation: true,
      });
      
      extracted.push({
        field: 'economicInfo.debtAmount',
        value: amount,
        confidence: 0.8,
        requires_confirmation: true,
      });
    }

    // Extract health issues
    const healthMatch = text.match(/(कमर|पीठ|सिर|घुटने|आंख|पेट|दिल|सांस|back|knee|head|heart)\s*(में)?\s*(दर्द|pain|problem|तकलीफ)/i);
    if (healthMatch) {
      extracted.push({
        field: 'healthInfo.chronicConditions',
        value: [healthMatch[1]],
        confidence: 0.7,
        requires_confirmation: true,
      });
    }

    // Extract widow status
    const widowMatch = text.match(/(विधवा|widow|पति\s*(नहीं\s*रहे|गुजर\s*गए|की\s*मृत्यु))/i);
    if (widowMatch) {
      extracted.push({
        field: 'familyDetails.maritalStatus',
        value: 'widowed',
        confidence: 0.9,
        requires_confirmation: true,
      });
    }

    // Extract land ownership
    const landMatch = text.match(/(\d+)\s*(एकड़|acre|bigha|बीघा)/i);
    if (landMatch) {
      let area = parseFloat(landMatch[1]);
      // Convert bigha to acres if needed (1 bigha ≈ 0.625 acres)
      if (landMatch[2]?.includes('बीघा') || landMatch[2]?.includes('bigha')) {
        area *= 0.625;
      }
      
      extracted.push({
        field: 'economicInfo.landOwnership.ownsLand',
        value: true,
        confidence: 0.8,
        requires_confirmation: true,
      });
      
      extracted.push({
        field: 'economicInfo.landOwnership.landArea',
        value: area,
        confidence: 0.8,
        requires_confirmation: true,
      });
    }

    // Extract skills
    const skillMatch = text.match(/(मिस्त्री|carpenter|plumber|प्लंबर|electrician|बिजली|mason|राजमिस्त्री|driver|ड्राइवर)\s*(का)?\s*(काम|work|skill)/i);
    if (skillMatch) {
      extracted.push({
        field: 'skills',
        value: [{
          skillName: skillMatch[1],
          proficiencyLevel: 'intermediate',
          yearsOfExperience: 1
        }],
        confidence: 0.7,
        requires_confirmation: true,
      });
    }

    // Extract elderly in family
    const elderlyMatch = text.match(/(\d+)\s*(बुजुर्ग|elderly|old\s*people)/i);
    if (elderlyMatch) {
      extracted.push({
        field: 'familyDetails.elderlyInFamily',
        value: true,
        confidence: 0.8,
        requires_confirmation: true,
      });
    }

    // Extract work unavailability
    const noWorkMatch = text.match(/(काम\s*नहीं\s*मिल|no\s*work|बेरोजगार|unemployed)/i);
    if (noWorkMatch) {
      extracted.push({
        field: 'painPoints',
        value: [{
          type: 'unemployment',
          description: 'काम नहीं मिल रहा है',
          severity: 'high',
          reportedDate: new Date()
        }],
        confidence: 0.85,
        requires_confirmation: true,
      });
    }

    // Extract migration status
    const migrationMatch = text.match(/(शहर\s*से\s*वापस|returned\s*from\s*city|गांव\s*लौट|came\s*back)/i);
    if (migrationMatch) {
      extracted.push({
        field: 'painPoints',
        value: [{
          type: 'migration_return',
          description: 'शहर से वापस आया है',
          severity: 'medium',
          reportedDate: new Date()
        }],
        confidence: 0.75,
        requires_confirmation: true,
      });
    }

    // Extract number of earners
    const earnersMatch = text.match(/(\d+)\s*(लोग|person|member)?\s*(कमाते|earning|earner)/i);
    if (earnersMatch) {
      extracted.push({
        field: 'familyDetails.numberOfEarners',
        value: parseInt(earnersMatch[1]),
        confidence: 0.75,
        requires_confirmation: true,
      });
    }

    return extracted;
  }

  // Generate voice response using text-to-speech (browser API)
  async speakResponse(text: string, language: string = 'hi-IN'): Promise<void> {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      
      // Try to find a Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }

  // Start voice recognition
  startVoiceRecognition(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    language: string = 'hi-IN'
  ): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      
      recognition.onerror = (event: any) => {
        onError(event.error);
      };
      
      recognition.start();
    } else {
      onError('Speech recognition not supported in this browser');
    }
  }

  // Clear chat session
  clearSession(sessionId: string): void {
    this.chatSessions.delete(sessionId);
  }

  // Generate scheme explanation
  async explainScheme(
    schemeName: string,
    schemeDetails: any,
    userLanguage: string = 'hi'
  ): Promise<string> {
    const prompt = `
Explain the following government scheme in simple, easy-to-understand language for a rural worker.
Use everyday examples and avoid technical jargon.

Scheme Name: ${schemeName}
Scheme Details: ${JSON.stringify(schemeDetails)}

Respond in ${userLanguage === 'hi' ? 'Hindi' : 'English'}.
Keep it under 150 words.
`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error explaining scheme:', error);
      return userLanguage === 'hi' 
        ? `क्षमा करें, ${schemeName} के बारे में जानकारी नहीं मिल सकी।`
        : `Sorry, couldn't get information about ${schemeName}.`;
    }
  }

  // Analyze grievance and suggest priority
  async analyzeGrievance(
    grievanceText: string,
    category: string
  ): Promise<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    recommendedAction: string;
    similarCases: number;
  }> {
    const prompt = `
Analyze the following grievance and determine its priority level:

Category: ${category}
Grievance: ${grievanceText}

Respond in JSON format:
{
  "priority": "low|medium|high|critical",
  "recommendedAction": "specific action to take",
  "similarCases": estimated number of similar cases
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing grievance:', error);
      return {
        priority: 'medium',
        recommendedAction: 'Review and assign to appropriate officer',
        similarCases: 0,
      };
    }
  }

  // Generate work allocation explanation
  async explainAllocation(
    userName: string,
    priorityScore: number,
    topFactors: any[],
    userLanguage: string = 'hi'
  ): Promise<string> {
    const prompt = `
Explain why ${userName} was allocated work in simple, empathetic language.

Priority Score: ${priorityScore}/100
Top Factors:
${topFactors.map(f => `- ${f.feature}: ${f.value} (${f.impact} priority)`).join('\n')}

Respond in ${userLanguage === 'hi' ? 'Hindi' : 'English'}.
Make it personal and encouraging.
`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error explaining allocation:', error);
      return userLanguage === 'hi'
        ? 'आपको काम दिया गया है क्योंकि आपकी जरूरत ज्यादा है।'
        : 'You were allocated work based on your priority needs.';
    }
  }
}

// Create singleton instance
export const sahayogAI = new SahayogAI();

export default sahayogAI;
