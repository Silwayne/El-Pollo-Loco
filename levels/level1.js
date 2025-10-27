/**
 * Creates and configures a new game level with all game objects
 * Constructs a complete Level instance with enemies, environment, collectibles, and background
 * Uses seamless tiling for infinite scrolling background
 * @returns {Level} A fully configured Level instance ready for gameplay
 */
function createNewLevel() {
  return new Level(
    [
      // Enemy configuration: 6 regular chickens and 3 little chickens
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken()  
    ],

    [
      // Cloud decoration for atmospheric background
      new Cloud(), 
      new Cloud(),
      new Cloud()
    ],

    [
      // Collectible bottles: 2 on ground, 3 floating in air
      new Bottle("ground"),
      new Bottle("ground"),
      new Bottle("air"),
      new Bottle("air"),
      new Bottle("air")
    ],

    [
      // Collectible coins: 2 on ground, 3 floating in air  
      new Coin("ground"),
      new Coin("ground"),
      new Coin("air"),
      new Coin("air"),
      new Coin("air")
    ],

    [
      // Background layers with seamless tiling for infinite scrolling
      // Each segment contains 4 layers (air, third, second, first) at specific x positions
      
      // Segment 1: Position -719 (left of start)
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

      // Segment 2: Position 0 (starting area)
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      // Segment 3: Position 719 (right of start)
      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

      // Segment 4: Position 1438 (2 * 719, further right)
      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),

      // Segment 5: Position 2157 (3 * 719, even further right)
      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
    ]
  );
}