const taxonomyLevels = [
    "Domain", "Kingdom", "Phylum", "Class",
    "Order", "Family", "Genus", "Species"
];

// Shuffle the taxonomy levels
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', // Attach Phaser to the div
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.cameras.main.setBackgroundColor('#E3F2FD'); // Set background to lt blue
    this.load.image('treeBg', '../images/bgactive0001.png'); // Load the background tree image
}

function create() {
    // Add the background tree image (ensures it's behind everything)
    this.add.image(400, 300, 'treeBg').setDepth(-1);

    let shuffledLevels = shuffle([...taxonomyLevels]); // Shuffle the taxonomy list
    let dropZones = [];
    let dropZoneWidth = 250;
    let dropZoneHeight = 60;
    let dropZoneX = 500;
    let textOffsetY = 50;

    // Define Medium Light Moss Green color
    let mossGreen = 0x8A9A5B;

    // Create dashed box drop zones on the right
    taxonomyLevels.forEach((level, index) => {
        let yPos = textOffsetY + index * 70;

        // Draw the dashed box
        let graphics = this.add.graphics();
        graphics.lineStyle(3, mossGreen, 1);
        graphics.strokeRect(dropZoneX, yPos, dropZoneWidth, dropZoneHeight);

        // Create the drop zone (expanded by 2px in width & height)
        let dropZone = this.add.zone(
            dropZoneX + dropZoneWidth / 2,
            yPos + dropZoneHeight / 2,
            dropZoneWidth + 2,
            dropZoneHeight + 2
        ).setRectangleDropZone(dropZoneWidth + 2, dropZoneHeight + 2)
        .setData('expected', level);

        dropZones.push(dropZone);
    });

    // Create draggable taxonomy terms on the left
    shuffledLevels.forEach((level, index) => {
        let yPos = textOffsetY + index * 70;

        let dragItem = this.add.text(50, yPos, level, {
            fontSize: "24px",
            backgroundColor: "#4CAF50",
            padding: { x: 25, y: 15 },
            color: "#ffffff",
            align: "center"
        }).setInteractive();

        dragItem.setOrigin(0.5, 0.5);
        dragItem.x = 50 + dragItem.width / 2;

        this.input.setDraggable(dragItem);
        dragItem.originalX = dragItem.x;
        dragItem.originalY = dragItem.y;
        dragItem.taxonomy = level;
    });

    // Enable drag-and-drop functionality
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => {
        if (gameObject.taxonomy === dropZone.getData('expected')) {
            // ✅ Correct placement → Snap to the zone
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.setInteractive(false); // Lock it in place
            gameObject.setBackgroundColor("#388E3C"); // Change to darker green
        } else {
            // ❌ Incorrect placement → Return to the original position
            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 500,
                ease: 'Power2'
            });
        }
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
        if (!dropped) {
            // If dropped outside any zone, return to original position
            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 500,
                ease: 'Power2'
            });
        }
    });
}
