window.canvas_fire   = document.getElementById("canvas_fire");
window.canvas_water  = document.getElementById("canvas_water");
window.canvas_grass  = document.getElementById("canvas_grass");
window.context_fire  =  canvas_fire.getContext("2d");
window.context_water = canvas_water.getContext("2d");
window.context_grass = canvas_grass.getContext("2d");

window.fps     = 60;
window.color_range = 200;

// Create pre-defined color gradient
window.gradient_fire  = [];
{
  var g1 = jsgradient.generateGradient("#000000", "#FF0000", 65);
  var g2 = jsgradient.generateGradient("#FF0000", "#FFA500", 45);
  var g3 = jsgradient.generateGradient("#FFA5FF", "#FFFFFF", 95);
  window.gradient_fire = window.gradient_fire.concat(g1, g2, g3);
}

window.gradient_water = [];
{
  var g1 = jsgradient.generateGradient("#000000", "#0000FF", 65);
  var g2 = jsgradient.generateGradient("#0000FF", "#00A5FF", 45);
  var g3 = jsgradient.generateGradient("#FFA5FF", "#FFFFFF", 95);
  window.gradient_water = window.gradient_water.concat(g1, g2, g3);
}

window.gradient_grass = [];
{
  var g1 = jsgradient.generateGradient("#000000", "#00FF00", 65);
  var g2 = jsgradient.generateGradient("#00FF00", "#00FFA5", 45);
  var g3 = jsgradient.generateGradient("#A5FFA5", "#FFFFFF", 95);
  window.gradient_grass = window.gradient_grass.concat(g1, g2, g3);
}


// FireCellGrid manager
function FireCellGrid(fire_width, fire_height, cell_size) {
  // TODO: initialize constructor
  //    @fire_size: height and width of fire
  //    @cell_size: height and width of cell

  // Initialize this.cells with FireCell objects
  this.cells  = new Array(fire_height + 2);
  for(var j = 0; j < fire_height + 2; j++) { // Set y
    this.cells[j] = new Array(fire_width);
    for(var i = 0; i < fire_width; i++) { // Set x
      this.cells[j][i] = 0;
    }
  }

  this.fire_width  = fire_width;
  this.fire_height = fire_height;
  this.cell_size   = cell_size;
}

FireCellGrid.prototype.drawGrid = function(gradient, canvas, context) {
  // wipe canvas... necessary?
  context.fillStyle = "#000000";
  context.clearRect(0, 0, canvas.width, canvas.height);

  for(var j = 0; j < this.fire_height; j++) {
    for(var i = 0; i < this.fire_width; i++) {
      var cell = this.cells[j][i];
      context.fillStyle = gradient[cell];
      context.fillRect(
        (i-4)*this.cell_size,
        j*this.cell_size,
        this.cell_size,
        this.cell_size
      );
    }
  }
}

FireCellGrid.prototype.updateGrid = function() {
  // Iterate, ignoring last row
  var cell  = undefined;
  var cells = this.cells;

  // Reignite bottom two rows with new values
  for(var i = 0; i < this.fire_width; i++) {
    cells[this.fire_height - 2][i] = Math.floor(Math.random() * window.color_range);
    cells[this.fire_height - 1][i] = Math.floor(Math.random() * window.color_range);

    if(i % Math.floor(this.fire_width / 4) == 0) {
      // define hotspots
      cells[this.fire_height - 2][i] = window.color_range;
      cells[this.fire_height - 1][i] = window.color_range;
    }
  }

  for(var j = 0; j < this.fire_height - 1; j++) {  // SKIP LAST ROW
    for(var i = 1; i < this.fire_width - 1; i++) { // SKIP BORDERS
      cells[j][i] = Math.floor(
        (cells[j][i] + cells[j+1][i-1] + cells[j+1][i] + cells[j+1][i+1]) / 4
      );
    }
  }
}

// Main logic
var fire_grid  = new FireCellGrid(110, 60, 1); // Offset to look prettier
var water_grid = new FireCellGrid(110, 60, 1); // Offset to look prettier
var grass_grid = new FireCellGrid(110, 60, 1); // Offset to look prettier

function canvasDraw() {
  setTimeout(
    function timeOut() {
      requestAnimationFrame(canvasDraw);

      fire_grid.updateGrid();
      water_grid.updateGrid();
      grass_grid.updateGrid();

      fire_grid.drawGrid( window.gradient_fire,  window.canvas_fire,  window.context_fire);
      water_grid.drawGrid(window.gradient_water, window.canvas_water, window.context_water);
      grass_grid.drawGrid(window.gradient_grass, window.canvas_grass, window.context_grass);
    },
    1000 / fps
  );
}

canvasDraw();
