/**
 * Utility functions for handling file operations in the 3D-LLM platform
 */

/**
 * Supported file types and their extensions
 */
export const SUPPORTED_FILE_TYPES = {
  // 3D Models
  model: [
    '.obj', '.fbx', '.gltf', '.glb', '.stl', '.dae', '.3ds', '.blend'
  ],
  // Textures
  texture: [
    '.jpg', '.jpeg', '.png', '.tga', '.tif', '.tiff', '.bmp', '.exr', '.hdr'
  ],
  // Materials
  material: [
    '.mtl', '.mat', '.json'
  ],
  // Animation
  animation: [
    '.anim', '.fbx', '.bvh', '.json'
  ],
  // Documents
  document: [
    '.pdf', '.doc', '.docx', '.txt', '.md'
  ],
  // Code
  code: [
    '.js', '.ts', '.cs', '.c', '.cpp', '.py', '.shader', '.glsl'
  ],
  // Other
  other: [
    '.zip', '.rar', '.7z'
  ]
};

/**
 * Get file type from extension
 */
export function getFileType(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  const extWithDot = `.${extension}`;
  
  for (const [type, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
    if (extensions.includes(extWithDot)) {
      return type;
    }
  }
  
  return 'other';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Parse and validate a 3D model file
 * This is a placeholder for future implementation
 */
export async function validateModelFile(file: File): Promise<{valid: boolean, message: string}> {
  // In a real implementation, this would check file integrity,
  // possibly use a library like Three.js to validate the model format
  
  if (!file) {
    return { valid: false, message: 'No file provided' };
  }
  
  const fileType = getFileType(file.name);
  if (fileType !== 'model') {
    return { valid: false, message: 'File is not a supported 3D model format' };
  }
  
  // For large files, add a size warning
  if (file.size > 50 * 1024 * 1024) { // 50MB
    return { 
      valid: true, 
      message: 'Warning: This file is quite large and may cause performance issues'
    };
  }
  
  return { valid: true, message: 'File is valid' };
}

/**
 * Generate a thumbnail for a 3D model
 * This is a placeholder for future implementation
 */
export async function generateModelThumbnail(file: File): Promise<string> {
  // In a real implementation, this would use Three.js to render a preview
  // and return a data URL or blob URL
  
  // For now, return a placeholder
  return '/placeholder-model-thumbnail.png';
}

/**
 * Estimate processing time for a 3D model based on size and complexity
 */
export function estimateProcessingTime(fileSize: number): number {
  // This is a very simplistic estimate
  // In reality, it would depend on file format, complexity, server load, etc.
  
  // Return an estimate in seconds
  return Math.ceil(fileSize / (1024 * 1024) * 2); // ~2 seconds per MB
} 