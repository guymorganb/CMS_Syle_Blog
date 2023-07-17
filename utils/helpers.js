/**
 * Registering helper function 
 * this function is being used in homepage.handlebars as {{randomImage}}
 */
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

Handlebars.registerHelper('randomGif', function() {
    const images = ["https://i.gifer.com/yy3.gif", "https://i.gifer.com/SUV4.gif", "https://i.gifer.com/A3bi.gif", "https://i.gifer.com/6os.gif", "https://i.gifer.com/9viJ.gif", "https://i.gifer.com/bfR.gif", "https://i.gifer.com/o6m.gif", "https://i.gifer.com/4FB4.gif"];
    
    // Generate a new random index different from the previous one
    let randomIndex = previousRandomIndex;
    while (randomIndex === previousRandomIndex) {
        randomIndex = Math.floor(Math.random() * images.length);
    }
    // Update the previous random index
    previousRandomIndex = randomIndex;
    return images[randomIndex];
});

// this help give handlebars the ability to have logical operators in its #ifCond statments
Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});