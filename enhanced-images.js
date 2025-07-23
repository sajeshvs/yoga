// Enhanced pose image system with high-resolution multi-step support

const ENHANCED_POSES_IMAGES = {
};

// Function to get enhanced image for a pose
function getEnhancedPoseImage(poseId, step = null) {
    const poseImages = ENHANCED_POSES_IMAGES[poseId];
    
    if (!poseImages) {
        return null; // Use original image
    }
    
    if (step !== null && poseImages.steps && poseImages.steps[step]) {
        return poseImages.steps[step];
    }
    
    return {
        url: poseImages.single,
        title: "Full Pose",
        description: "Complete pose expression"
    };
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.ENHANCED_POSES_IMAGES = ENHANCED_POSES_IMAGES;
    window.getEnhancedPoseImage = getEnhancedPoseImage;
}
