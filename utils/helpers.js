const Handlebars = require('handlebars');
// inserts a random image from the public directory
let previousRandomIndex = -1;

Handlebars.registerHelper('randomImage', function() {
    const images = ["/img/tech1.png", "/img/feature-1.png", "/img/tech2.png", "/img/tech5.png", "/img/tech3.png", "/img/tech4.png"];
    
    // Generate a new random index different from the previous one
    let randomIndex = previousRandomIndex;
    while (randomIndex === previousRandomIndex) {
        randomIndex = Math.floor(Math.random() * images.length);
    }
    
    // Update the previous random index
    previousRandomIndex = randomIndex;
    
    return images[randomIndex];
});