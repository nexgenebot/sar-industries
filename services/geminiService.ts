import { GoogleGenAI, Type, Chat } from "@google/genai";
import { GeneratedContent, CompetitorInsight, BrandProfile, AutomationRule } from "../types";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only if key exists, though we assume strict env in this context
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateAdCreative = async (
  productName: string,
  targetAudience: string,
  platform: string,
  brandProfile?: BrandProfile,
  customTrustSignal?: string,
  format?: string
): Promise<GeneratedContent | null> => {
  if (!ai) {
    console.error("API Key missing");
    return null;
  }

  try {
    let systemInstructions = "You are a world-class copywriter for social media ads.";
    if (brandProfile) {
        systemInstructions += `
            Adhere strictly to the following Brand Identity:
            Brand Name: ${brandProfile.name}
            Voice/Tone: ${brandProfile.voice}
            Keywords to use: ${brandProfile.keywords.join(', ')}
        `;
    }

    const prompt = `
      Create an ad for the following:
      Product: ${productName}
      Target Audience: ${targetAudience}
      Platform: ${platform}
      Format: ${format || 'Feed'}
      ${customTrustSignal ? `Key Trust Signal to highlight: ${customTrustSignal}` : ''}
      ${brandProfile ? `Note: Ensure the copy aligns with the brand voice: ${brandProfile.voice}` : ''}

      ${(format === 'Story' || format === 'Reel') ? 'IMPORTANT: For Story/Reel, the headline should be short punchy overlay text (max 5 words) and the body should be a concise caption.' : ''}

      Return a JSON object with:
      - headline (short, punchy, max 40 chars)
      - body (engaging main text, max 280 chars)
      - callToAction (e.g., Shop Now, Learn More)
      - socialProof (a very short, punchy trust signal max 4-5 words, e.g. "Join 10k+ Users" or "Rated 5/5 Stars". Do not make it too long.)
      - imagePrompt (a detailed visual description of an image that would go well with this ad text${brandProfile ? `, using brand color ${brandProfile.primaryColor}` : ''})
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            socialProof: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["headline", "body", "callToAction", "socialProof", "imagePrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Error generating ad content:", error);
    return null;
  }
};

export const generateAdImage = async (prompt: string, aspectRatio: "1:1" | "9:16" | "16:9" = "1:1"): Promise<string | null> => {
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: { aspectRatio: aspectRatio }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};

export const generateImageIdeas = async (
  productName: string,
  targetAudience: string,
  platform: string,
  format?: string
): Promise<string[]> => {
  if (!ai) return ["High-quality product shot on a clean background.", "Lifestyle image of someone using the product happily.", "Minimalistic flat lay with vibrant colors."];

  try {
    const prompt = `
      Suggest 3 distinct, creative visual concepts for a ${format || 'Feed'} ad on ${platform}.
      Product: ${productName}
      Audience: ${targetAudience}
      
      Return a JSON array of 3 strings. Each string should be a concise visual description (e.g. "Split screen showing before/after results").
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (e) {
      console.error(e);
      return [];
  }
};

export const analyzeAdPerformance = async (campaignData: string): Promise<string> => {
    if (!ai) return "AI Service Unavailable";
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this ad performance data and give 3 bullet points of strategic advice: ${campaignData}`,
        });
        return response.text || "No analysis available.";
    } catch (e) {
        console.error(e);
        return "Failed to analyze data.";
    }
}

export const generatePerformanceReport = async (metrics: any): Promise<{ summary: string, wins: string[], improvements: string[] } | null> => {
    if (!ai) return null;

    try {
        const prompt = `
            Act as a Senior Marketing Data Analyst. Analyze the following campaign metrics and generate a concise executive summary report.
            Data: ${JSON.stringify(metrics)}

            Return valid JSON with:
            - summary: A 2-3 sentence overview of general health and performance.
            - wins: An array of 3 strings highlighting top performing areas.
            - improvements: An array of 3 strings highlighting risk areas or things to fix.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        wins: { type: Type.ARRAY, items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["summary", "wins", "improvements"]
                }
            }
        });

        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("Report generation failed", e);
        return null;
    }
}

export const generateAudienceSegments = async (description: string): Promise<{ name: string, interests: string[] } | null> => {
    if (!ai) return null;

    try {
        const prompt = `
            Based on this description of an ideal customer: "${description}"
            Generate a professional audience segment name and a list of 5 key targeting interests for Meta Ads.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "A catchy marketing name for this audience" },
                        interests: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "5 specific interests available in Meta Ads Manager"
                        }
                    },
                    required: ["name", "interests"]
                }
            }
        });

        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("Audience generation failed", e);
        return null;
    }
}

export const analyzeCompetitors = async (industry: string): Promise<CompetitorInsight[] | null> => {
    if (!ai) return null;

    try {
        const prompt = `
            Analyze the top 3 theoretical competitors in the "${industry}" market.
            For each competitor, provide:
            - Name
            - Estimated Market Share (0-100 number)
            - Key Strength
            - Key Weakness
            - Ad Strategy (a sentence describing their likely ad approach)

            Return as a JSON array.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            marketShare: { type: Type.NUMBER },
                            strength: { type: Type.STRING },
                            weakness: { type: Type.STRING },
                            adStrategy: { type: Type.STRING }
                        },
                        required: ["name", "marketShare", "strength", "weakness", "adStrategy"]
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("Competitor analysis failed", e);
        return null;
    }
};

export const getScheduleRecommendation = async (campaignGoal: string): Promise<string | null> => {
    if (!ai) return null;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `For a Facebook/Instagram ad campaign with the goal of "${campaignGoal}", suggest the 3 best days of the week and times of day to post/run ads for maximum conversion. Keep it concise.`,
        });
        return response.text;
    } catch (e) {
        return null;
    }
}

export const auditBrandProfile = async (profile: Partial<BrandProfile>): Promise<string> => {
    if (!ai) return "Service unavailable";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a Brand Strategist. Review this brand profile and write a short, inspiring "Brand Manifesto" (max 100 words).
            Profile: ${JSON.stringify(profile)}`
        });
        return response.text || "";
    } catch (e) {
        return "Could not generate audit.";
    }
}

export const generateSmartReplies = async (messageContext: string, tone: string = "Professional"): Promise<string[]> => {
    if (!ai) return ["Thank you for your message, we will get back to you shortly.", "Could you please provide more details?", "Yes, that is available."];
    try {
        const prompt = `
            You are a customer support agent. Generate 3 short, distinct, and helpful quick replies to the following user message.
            Context/Last Message: "${messageContext}"
            Tone: ${tone}

            Return a JSON array of 3 strings.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (e) {
        return [];
    }
};

export const generateImageTags = async (imageName: string): Promise<string[]> => {
    if (!ai) return ['Asset', 'Marketing'];
    try {
        const prompt = `Generate 4 single-word SEO tags for an image file named "${imageName}". Return a JSON array of strings.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        return JSON.parse(response.text || '[]');
    } catch(e) {
        return [];
    }
}

export const analyzeAudienceOverlap = async (audA: string, audB: string): Promise<{ percentage: number, insight: string } | null> => {
    if (!ai) return { percentage: 35, insight: "These audiences likely share key interests in Technology and Startups, but diverge on spending power." };
    try {
        const prompt = `
            Analyze the potential demographic and interest overlap between these two audience segments:
            Audience A: "${audA}"
            Audience B: "${audB}"

            Return JSON with:
            - percentage: A number between 0 and 100 representing estimated overlap.
            - insight: A single sentence explaining the commonality.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        percentage: { type: Type.NUMBER },
                        insight: { type: Type.STRING }
                    },
                    required: ["percentage", "insight"]
                }
            }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const generateAutomationRule = async (goal: string): Promise<Partial<AutomationRule> | null> => {
    if (!ai) return null;
    try {
        const prompt = `
            Create a logical advertising automation rule based on this user goal: "${goal}".
            Determine the Metric, Operator, Value, Timeframe and Action.
            
            Return JSON:
            - name: Short descriptive name
            - triggerMetric: "ROAS", "Spend", "CTR", or "CPM"
            - triggerOperator: ">", "<", or ">="
            - triggerValue: number
            - timeframe: string (e.g. "Last 7 Days")
            - action: "Pause Campaign", "Increase Budget", "Decrease Budget", or "Notify"
            - actionValue: number (optional, e.g. 10 for 10% increase)
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        triggerMetric: { type: Type.STRING, enum: ['ROAS', 'Spend', 'CTR', 'CPM'] },
                        triggerOperator: { type: Type.STRING, enum: ['>', '<', '>='] },
                        triggerValue: { type: Type.NUMBER },
                        timeframe: { type: Type.STRING },
                        action: { type: Type.STRING, enum: ['Pause Campaign', 'Increase Budget', 'Decrease Budget', 'Notify'] },
                        actionValue: { type: Type.NUMBER }
                    },
                    required: ["name", "triggerMetric", "triggerOperator", "triggerValue", "timeframe", "action"]
                }
            }
        });
        const text = response.text;
        if(!text) return null;
        return JSON.parse(text);
    } catch (e) {
        return null;
    }
}

export const scoreLead = async (leadData: any): Promise<{ score: number, reason: string }> => {
    if (!ai) return { score: 50, reason: "Moderate potential based on available data." };
    try {
        const prompt = `
            Analyze this lead and assign a Quality Score (0-100) and a short reason.
            Lead Data: ${JSON.stringify(leadData)}

            Return JSON with:
            - score: number (0-100)
            - reason: string
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        reason: { type: Type.STRING }
                    },
                    required: ["score", "reason"]
                }
            }
        });
        return JSON.parse(response.text || '{"score": 50, "reason": "Data incomplete"}');
    } catch (e) {
        return { score: 50, reason: "Scoring unavailable." };
    }
}

// Chat Assistant Service
let chatSession: Chat | null = null;

export const createChatSession = (systemContext: string) => {
    if (!ai) return null;
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `
                You are SarAI, a highly intelligent and professional AI assistant for Sar Industries Enterprise Command Center.
                You have access to the user's dashboard data provided in the context.
                
                Your capabilities:
                1. Answer questions about campaign performance, budgets, and audiences.
                2. Suggest optimization strategies for Facebook and Instagram ads.
                3. Help the user navigate the dashboard features.
                
                Tone: Professional, concise, data-driven, yet helpful and friendly.
                
                Current Context Data:
                ${systemContext}
            `
        }
    });
    return chatSession;
};

export const sendMessageToAssistant = async (message: string): Promise<string> => {
    if (!chatSession) return "SarAI is not connected. Please refresh.";
    try {
        const result = await chatSession.sendMessage({ message });
        return result.text || "I didn't quite catch that.";
    } catch (error) {
        console.error("Chat error", error);
        return "I encountered an error processing your request.";
    }
};