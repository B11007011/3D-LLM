// Predefined responses with regex patterns for keyword matching
export const responses = [
  { 
    triggers: [/build|robot|game|project/i],
    reply: "I'd be happy to help with your Sci-Fi Robot project. What type of 3D asset are you creating? Is this for a video game, VR experience, or another platform?",
    ui: null
  },
  { 
    triggers: [/game|unity|unreal/i],
    reply: "Great choice! For game engines like Unity or Unreal, we should focus on optimized topology and efficient texturing workflows. I've initialized your Sci-Fi Robot project with appropriate settings for game development.",
    ui: 'projectSetup'
  },
  { 
    triggers: [/yes|setup|initialize|start/i],
    reply: "I've set up your project. I recommend breaking this down into milestones: 1) Base modeling, 2) High-detail sculpting, 3) Retopology, 4) UV unwrapping, 5) Texturing, 6) Rigging, and 7) Animation. Does this timeline work for you?",
    ui: 'projectSetup'
  },
  { 
    triggers: [/month|week|timeline|deadline|date/i],
    reply: "I've updated your project timeline based on a 2-month development cycle. Each milestone now has specific deadlines and dependencies. You can adjust these in the project dashboard or connect with project management tools like Jira or Trello for more detailed tracking.",
    ui: 'projectSetup'
  },
  { 
    triggers: [/milestone|object|texture|animation/i],
    reply: "I've configured your project with the milestones you mentioned. The Gantt chart visualization shows your critical path and dependencies. The 'Base modeling' milestone is scheduled for completion by the end of next week, with UV unwrapping starting immediately after.",
    ui: 'projectSetup'
  },
  { 
    triggers: [/team|teammate|member|collaboration|invite/i],
    reply: "I've added your team members to the project. John is assigned as the lead 3D modeler, and Alice will handle texturing. You can manage permissions, roles, and task assignments through the team dashboard. Would you like to set up automated progress reports for stakeholders?",
    ui: 'teamSetup'
  },
  { 
    triggers: [/tool|compare|software|blender|maya|zbrush/i],
    reply: "I've analyzed the optimal software stack for your project. For modeling, Blender offers the best cost-efficiency, while ZBrush excels at high-detail sculpting. Maya provides industry-standard rigging tools but at a higher cost. The comparison chart shows strengths and compatibility across these tools.",
    ui: 'toolsComparison'
  },
  { 
    triggers: [/file|files|manage|folder|asset|library/i],
    reply: "Your project file structure has been organized following industry best practices. The main assets are in the 'models' directory, with separate folders for textures, materials, and animations. Version control is enabled, allowing you to track changes and collaborate seamlessly with your team.",
    ui: 'fileManagement'
  },
  { 
    triggers: [/version|control|history|revision|git|changes/i],
    reply: "Version control is now active for your project. I've configured it to track both model and texture changes. You can view the full history, compare versions, and revert to previous states if needed. The system automatically creates backups before major changes to prevent data loss.",
    ui: 'versionControl'
  },
  { 
    triggers: [/graph|statistics|analytics|progress|metrics|performance/i],
    reply: "The analytics dashboard shows your project's progress metrics. You've completed 35% of planned tasks, with modeling ahead of schedule but texturing slightly behind. Resource utilization shows you might need additional texture artists to meet the final deadline. Would you like recommendations for optimizing your workflow?",
    ui: 'progressGraphs'
  },
  { 
    triggers: [/import|export|exchange|format|fbx|obj|gltf/i],
    reply: "I've configured your export settings for optimal compatibility. For Unity, I recommend using FBX with embedded textures. For web platforms, glTF 2.0 provides better compression and performance. Your robot model can be exported with various level-of-detail (LOD) meshes to optimize performance across platforms.",
    ui: 'importExport'
  },
  { 
    triggers: [/3d|view|preview|model|visualize|render/i],
    reply: "Opening the 3D viewer for your robot model. You can rotate, pan, and zoom to inspect the details. The wireframe mode shows clean topology with optimal edge flow for animation. Would you like to analyze the mesh for potential issues or optimization opportunities?",
    ui: '3dView'
  },
  { 
    triggers: [/texture|material|pbr|shader|uv/i],
    reply: "For your robot model, I suggest using a PBR (Physically Based Rendering) workflow with these maps: base color, metalness, roughness, normal, and ambient occlusion. This approach ensures consistent appearance across different lighting conditions and platforms. Your UV layout is optimized with a 97% space utilization.",
    ui: 'fileManagement'
  },
  { 
    triggers: [/animation|rig|skeleton|armature|pose|motion/i],
    reply: "Your robot model's rig is designed with an optimized skeleton hierarchy. It includes IK (Inverse Kinematics) controls for the arms and legs, making animations more intuitive. The rig is game-engine ready with properly weighted vertices and efficient bone count to ensure smooth performance.",
    ui: 'fileManagement'
  },
  { 
    triggers: [/poly|triangle|count|optimize|performance|mobile/i],
    reply: "Your robot model currently has approximately 15,000 triangles, which is well-optimized for modern game engines and platforms. For mobile or VR applications, I can generate a lower-poly version with normal maps to preserve detail while reducing the triangle count to about 5,000.",
    ui: '3dView'
  },
  { 
    triggers: [/light|render|realistic|presentation|portfolio/i],
    reply: "For portfolio-quality renders of your robot, I recommend a three-point lighting setup with rim lights to highlight the metallic edges. HDRI environment lighting will enhance the PBR materials, creating realistic reflections and ambient lighting that showcases your model's details.",
    ui: '3dView'
  },
  { 
    triggers: [/deadline|priority|critical|urgent|finish/i],
    reply: "I've highlighted the critical path in your project timeline. To meet your deadline, focus on completing the base modeling and UV unwrapping first, as these are blocking other tasks. I've color-coded tasks by priority to help you and your team focus on what matters most right now.",
    ui: 'progressGraphs'
  },
  { 
    triggers: [/budget|cost|client|contract|scope/i],
    reply: "Based on your project scope and timeline, I estimate approximately 120 work hours to complete this robot model with full texturing and basic animations. At industry standard rates, this translates to a budget range of $6,000-$8,400, depending on your team's experience level.",
    ui: 'projectSetup'
  },
  { 
    triggers: [/reference|concept|idea|inspiration/i],
    reply: "I've created a reference board with sci-fi robot designs that match your description. These references are organized by mechanical style, color scheme, and function. You can use these as inspiration while maintaining your unique vision and avoiding copyright issues.",
    ui: 'fileManagement'
  },
  { 
    triggers: [/help|stuck|problem|issue|error|troubleshoot/i],
    reply: "I notice you might be facing some challenges. Common issues at this stage include mesh topology problems, UV stretching, or texture resolution concerns. Would you like me to analyze your current model for specific issues, or do you have a particular area where you're stuck?",
    ui: null
  }
];
