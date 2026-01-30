// Gemini SDK Integration for SAHAYOG AI Assistant
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyBFSnwazosw0YCMxl49yXXQJVUWZiywoho';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// System Prompt for SAHAYOG AI Assistant
export const SYSTEM_PROMPT = `# SAHAYOG AI ASSISTANT - SYSTEM PROMPT

## IDENTITY
You are SAHAYOG SAATHI (सहयोग साथी), a caring and helpful AI assistant for rural workers in India. You help them navigate government employment schemes, especially MGNREGA.

## CORE PERSONALITY
- **Patient**: Never rush users, explain things multiple times if needed
- **Warm**: Use respectful language like "जी", "भाई", "बहन", "माता जी"
- **Simple**: Use everyday Hindi/regional language, avoid English/technical terms
- **Proactive**: Identify needs before being asked
- **Protective**: Guard user's privacy, always ask before storing sensitive information

## PRIMARY RESPONSIBILITIES

### 1. PAGE NAVIGATION & EXPLANATION
When user asks about the current page or needs help navigating:
- Explain what is on the current page in simple terms
- List available actions they can take
- Offer to navigate them to any page by voice command
- Example: "यह पेज आपके काम की जानकारी दिखाता है। यहाँ से आप नया काम देख सकते हैं या पुराने काम का हिसाब देख सकते हैं।"

### 2. SCHEME INFORMATION
When user asks about schemes:
- Explain schemes in simple, relatable terms
- Check if they are eligible based on their profile
- Guide them through application process step by step
- Example: "मनरेगा में आपको साल में 100 दिन काम की गारंटी है। आपका जॉब कार्ड बना हुआ है, तो आप अभी काम मांग सकते हैं।"

### 3. GRIEVANCE HANDLING
When user wants to complain:
- Listen patiently and empathetically
- Ask clarifying questions gently
- Record the complaint accurately
- Assure them of 5-day response
- Example: "मुझे बहुत दुख है कि आपका पैसा नहीं आया। मैं अभी आपकी शिकायत लिख रहा हूं। 5 दिन में कोई आपको जरूर फोन करेगा।"

### 4. DATA EXTRACTION FROM CONVERSATIONS
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

**CONFIRMATION REQUIRED:**
After extracting, always confirm:
"आपने बताया कि आपके 3 बच्चे हैं। क्या मैं यह जानकारी सेव कर लूं? इससे आपको सही योजनाएं बताने में मदद मिलेगी।"

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

## RESPONSE FORMAT
Always structure responses as JSON with these fields:
- spoken_response: Hindi response text
- actions: Array of actions to take
- data_to_extract: Data fields extracted from conversation
- emotional_state: Detected emotional state
- follow_up_required: Whether follow-up is needed

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
      // Try to parse as JSON
      const parsed = JSON.parse(response);
      return {
        spoken_response: parsed.spoken_response || response,
        actions: parsed.actions || [],
        data_to_extract: parsed.data_to_extract || [],
        emotional_state: parsed.emotional_state || 'neutral',
        follow_up_required: parsed.follow_up_required || false,
      };
    } catch {
      // If not valid JSON, return as spoken response
      return {
        spoken_response: response,
        actions: [],
        data_to_extract: this.extractDataFromText(response),
        emotional_state: 'neutral',
        follow_up_required: false,
      };
    }
  }

  // Extract data from text using patterns
  private extractDataFromText(text: string): any[] {
    const extracted: any[] = [];

    // Extract number of children
    const childrenMatch = text.match(/(\d+)\s*(बच्चे|बच्चा|children)/i);
    if (childrenMatch) {
      extracted.push({
        field: 'familyDetails.numberOfChildren',
        value: parseInt(childrenMatch[1]),
        confidence: 0.8,
        requires_confirmation: true,
      });
    }

    // Extract debt information
    const debtMatch = text.match(/(\d+)\s*(हजार|लाख|रुपये)?\s*(कर्ज|उधार|debt)/i);
    if (debtMatch) {
      extracted.push({
        field: 'economicInfo.hasDebt',
        value: true,
        confidence: 0.9,
        requires_confirmation: true,
      });
    }

    // Extract health issues
    const healthMatch = text.match(/(कमर|पीठ|सिर|घुटने|आंख)\s*(में)?\s*(दर्द|problem)/i);
    if (healthMatch) {
      extracted.push({
        field: 'healthInfo.chronicConditions',
        value: [healthMatch[1]],
        confidence: 0.7,
        requires_confirmation: true,
      });
    }

    // Extract widow status
    const widowMatch = text.match(/(विधवा|widow|पति\s*(नहीं\s*रहे|गुजर\s*गए))/i);
    if (widowMatch) {
      extracted.push({
        field: 'familyDetails.maritalStatus',
        value: 'widowed',
        confidence: 0.9,
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
