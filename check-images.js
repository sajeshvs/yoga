import fs from 'fs';
import { YOGA_POSES_DATA } from './poses-data.js';

async function checkImageUrls() {
    const brokenImages = [];
    const workingImages = [];
    
    console.log(`Checking ${YOGA_POSES_DATA.length} image URLs...`);
    
    for (let i = 0; i < YOGA_POSES_DATA.length; i++) {
        const pose = YOGA_POSES_DATA[i];
        const url = pose.imageUrl;
        
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                workingImages.push({
                    id: pose.id,
                    name: pose.englishName,
                    url: url,
                    status: response.status
                });
                console.log(`✅ ${pose.englishName}: ${response.status}`);
            } else {
                brokenImages.push({
                    id: pose.id,
                    name: pose.englishName,
                    url: url,
                    status: response.status
                });
                console.log(`❌ ${pose.englishName}: ${response.status}`);
            }
        } catch (error) {
            brokenImages.push({
                id: pose.id,
                name: pose.englishName,
                url: url,
                error: error.message
            });
            console.log(`💥 ${pose.englishName}: ${error.message}`);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`Working images: ${workingImages.length}`);
    console.log(`Broken images: ${brokenImages.length}`);
    
    if (brokenImages.length > 0) {
        console.log(`\n🚨 Broken Images:`);
        brokenImages.forEach(img => {
            console.log(`- ${img.name} (${img.id}): ${img.status || img.error}`);
        });
        
        // Save broken images to file
        fs.writeFileSync('broken-images.json', JSON.stringify(brokenImages, null, 2));
        console.log(`\nBroken images saved to broken-images.json`);
    }
}

checkImageUrls().catch(console.error);
