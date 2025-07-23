// Known broken image URLs that need to be replaced
const brokenImageUrls = [
    // Crescent Lunge - 403 Forbidden
    "https://firebasestorage.googleapis.com/v0/b/prophet-data.appspot.com/o/yogaPoses%2FLungeCrescent_L(1).png?alt=media&token=96a1b681-b00e-4128-8bc8-7ae4601bf041"
];

// Alternative image URLs or placeholder images
const imageReplacements = {
    "https://firebasestorage.googleapis.com/v0/b/prophet-data.appspot.com/o/yogaPoses%2FLungeCrescent_L(1).png?alt=media&token=96a1b681-b00e-4128-8bc8-7ae4601bf041": 
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
};

console.log("Broken images identified:", brokenImageUrls.length);
console.log("Replacements available:", Object.keys(imageReplacements).length);
