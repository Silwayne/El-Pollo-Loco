/**
 * Creates and configures a new game level with all game objects
 * Constructs a complete Level instance with enemies, environment, collectibles, and background
 * Uses seamless tiling for infinite scrolling background
 * @returns {Level} A fully configured Level instance ready for gameplay
 */
function createNewLevel() {
  return new Level(
    [
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
      new Cloud(), 
      new Cloud(),
      new Cloud()
    ],

    [
      new Bottle("ground"),
      new Bottle("ground"),
      new Bottle("ground"),
      new Bottle("ground"),
      new Bottle("air"),
      new Bottle("air"),
      new Bottle("air"),
      new Bottle("air")
    ],

    [
      new Coin("ground"),
      new Coin("ground"),
      new Coin("ground"),
      new Coin("ground"),
      new Coin("air"),
      new Coin("air"),
      new Coin("air"),
      new Coin("air")
    ],

    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
    ]
  );
}