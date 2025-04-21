/**
 * LLM Service - Handles interactions with the AI model
 * For the demo, we're using pre-defined responses and patterns, but this would
 * connect to an actual LLM API in production.
 */

import { responses } from "./responses";

export interface LLMRequestOptions {
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  systemPrompt?: string;
}

export interface LLMResponse {
  text: string;
  ui?: string | null;
  tokens: number;
  processingTime: number;
}

const defaultOptions: LLMRequestOptions = {
  maxTokens: 512,
  temperature: 0.7,
  timeout: 30000, // 30 seconds
  systemPrompt: "You are an AI assistant specialized in 3D modeling and project management."
};

// Specialized responses for different contexts
const domainSpecificResponses = {
  modeling: [
    "The topology of your mesh is crucial for animation. I recommend using edge loops around joints and ensuring even quad distribution.",
    "For organic models, start with a base mesh and use sculpting for details. For mechanical models like your robot, precision modeling with boolean operations works best.",
    "Your model's level of detail should match its intended use. For close-up shots, higher polygon counts are acceptable, but for real-time applications, aim for efficiency."
  ],
  texturing: [
    "PBR (Physically Based Rendering) texturing would work best for your robot. You'll need at minimum: base color, metalness, roughness, and normal maps.",
    "For efficient UV unwrapping, prioritize texture space for visible areas and minimize stretching on curved surfaces. Your robot's mechanical parts can share texture space effectively.",
    "Consider using tileable textures for repeated elements like panels or mechanical parts to save texture memory while maintaining high quality."
  ],
  animation: [
    "A well-designed rig with IK/FK switching would give you the control needed for both precise and natural robot movements.",
    "For a mechanical character like your robot, procedural animations can be combined with keyframed sequences for the most realistic movement.",
    "Consider using motion capture as a reference, even for mechanical movements. It can add subtle imperfections that make the animation feel more realistic."
  ],
  projectManagement: [
    "Breaking your project into specific milestones with clear deliverables will help track progress. For your robot, I recommend: concept, blockout, high-poly, retopology, UVs, texturing, rigging, and animation.",
    "For team collaboration, consider using asset management systems like Perforce or Git LFS to handle your large 3D files efficiently.",
    "Time estimation for 3D projects should account for iterations and revisions. A good rule is to allocate 30% of your timeline for refinements and unexpected challenges."
  ]
};

// Keywords to detect context in user queries
const contextPatterns = {
  modeling: /model|topology|mesh|sculpt|polygon|vertex|edge|boolean|subdivision|hard surface/i,
  texturing: /texture|material|uv|unwrap|pbr|normal map|roughness|metalness|specular|albedo|diffuse/i,
  animation: /animate|animation|rig|bone|skeleton|keyframe|motion|pose|blend shape|morph target/i,
  projectManagement: /project|timeline|milestone|team|collaboration|deadline|budget|scope|client|deliverable/i
};

/**
 * Process a user message and generate a response
 * This is a demo implementation with predefined responses
 */
export async function processMessage(
  message: string, 
  context: { previousMessages: Array<{role: string, content: string}> } = { previousMessages: [] },
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  // In a real implementation, this would call an API endpoint
  // For now, we'll simulate a delay and use our predefined responses
  const startTime = Date.now();
  
  // Simulate network latency - faster for demo purposes
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // First check for exact matches from predefined responses
  const matchedResponse = responses.find(r => 
    r.triggers.some(regex => regex.test(message))
  );
  
  if (matchedResponse) {
    const processingTime = Date.now() - startTime;
    const estimatedTokens = Math.ceil(matchedResponse.reply.length / 4);
    
    return {
      text: matchedResponse.reply,
      ui: matchedResponse.ui,
      tokens: estimatedTokens,
      processingTime
    };
  }
  
  // If no exact match, try to detect the context and provide a relevant response
  let responseText = "I'll help with your 3D project. Could you provide more specific details about what you're trying to accomplish?";
  let uiAction = null;
  
  // Check which context the message most likely belongs to
  const detectedContexts = Object.entries(contextPatterns)
    .filter(([_, pattern]) => pattern.test(message))
    .map(([context]) => context);
  
  if (detectedContexts.length > 0) {
    // Pick the first detected context and select a random response from that domain
    const primaryContext = detectedContexts[0];
    const domainResponses = domainSpecificResponses[primaryContext as keyof typeof domainSpecificResponses];
    
    if (domainResponses && domainResponses.length > 0) {
      const randomIndex = Math.floor(Math.random() * domainResponses.length);
      responseText = domainResponses[randomIndex];
      
      // Set appropriate UI action based on context
      switch (primaryContext) {
        case 'modeling':
          uiAction = '3dView';
          break;
        case 'texturing':
          uiAction = 'fileManagement';
          break;
        case 'animation':
          uiAction = '3dView';
          break;
        case 'projectManagement':
          uiAction = 'projectSetup';
          break;
      }
    }
  }
  
  // If query contains a question about the model, show 3D view
  if (/show|view|see|look at|display|3d|model/i.test(message)) {
    uiAction = '3dView';
    responseText = "Here's the 3D model of your robot. You can rotate, zoom, and examine the details. The model has clean topology suitable for animation, with optimized edge flow around joint areas.";
  }
  
  const processingTime = Date.now() - startTime;
  const estimatedTokens = Math.ceil(responseText.length / 4);
  
  return {
    text: responseText,
    ui: uiAction,
    tokens: estimatedTokens,
    processingTime
  };
}

/**
 * Get a suggestion for the user based on their project context
 */
export async function getSuggestion(
  projectContext: {
    files: number;
    modelType: string;
    projectStage: string;
  }
): Promise<string> {
  // In a real implementation, this would be a specialized API call
  // that takes into account the project state
  
  const { files, modelType, projectStage } = projectContext;
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (files === 0) {
    return "Try uploading your first 3D model to get started.";
  }
  
  if (modelType === "character" && projectStage === "modeling") {
    return "Consider adding a skeleton rig to your character model for animation.";
  }
  
  if (projectStage === "texturing") {
    return "Use PBR materials for more realistic rendering results.";
  }
  
  return "Consider breaking down your project into smaller milestones for better tracking.";
} 