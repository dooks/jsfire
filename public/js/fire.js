window.canvas  = document.getElementById("canvas_main");
window.context = canvas.getContext("2d");
window.context.font = "10px Georgia";
window.fps     = 60;

// Create pre-defined color gradient
window.gradient = [];
{
  var g1 = jsgradient.generateGradient("#000000", "#FF0000", 33);
  var g2 = jsgradient.generateGradient("#FF0000", "#FFA500", 33);
  var g3 = jsgradient.generateGradient("#FFA500", "#FFFFFF", 34);
  window.gradient = window.gradient.concat(g1, g2, g3);
}


// FireCellGrid manager
function FireCellGrid(fire_size, cell_size) {
  // TODO: initialize constructor
  //    @fire_size: height and width of fire
  //    @cell_size: height and width of cell

  // Initialize this.cells with FireCell objects
  this.cells  = new Array(fire_size);
  for(var j = 0; j < fire_size; j++) { // Set y
    this.cells[j] = new Array(fire_size);
    for(var i = 0; i < fire_size; i++) { // Set x
      this.cells[j][i] = 0;
    }
  }
  this.fire_size = fire_size;
  this.cell_size = cell_size;
}

FireCellGrid.prototype.drawGrid = function(canvas, context) {
  // wipe canvas... necessary?
  context.fillStyle = window.gradient[0];
  context.clearRect(0, 0, canvas.width, canvas.height);

  for(var j = 0; j < this.fire_size; j++) {
    for(var i = 0; i < this.fire_size; i++) {
      var cell = this.cells[j][i];
      context.fillStyle = window.gradient[cell];
      context.fillRect(
        i*this.cell_size,
        j*this.cell_size,
        this.cell_size,
        this.cell_size
      );

      // Draw cell value
      //context.fillStyle = "white";
      //context.fillText(cell, i * this.cell_size, j * this.cell_size);
    }
  }
}

FireCellGrid.prototype.updateGrid = function() {
  // Iterate, ignoring last row
  var cell = undefined;

  // Reignite bottom row with new values
  this.ignite();

  for(var j = 0; j < this.fire_size - 1; j++) { // SKIP LAST ROW
    for(var i = 0; i < this.fire_size; i++) {
      var x_old = this.cells[j][i];
      this.cells[j][i] = Math.floor((x_old + this.sumBelow(i, j)) / 4);
    }
  }
}

FireCellGrid.prototype.ignite = function() {
  // "Light up" bottom row
  // a.k.a initialize bottom row with values
  for(var i = 0; i < this.fire_size; i++) {
    if(i % Math.floor(this.fire_size / 4) == 0) { // add some hotspots
      this.cells[this.fire_size - 1][i] = 100;
    } else {
      this.cells[this.fire_size - 1][i] = Math.floor(Math.random() * 100);
    }
  }
}

FireCellGrid.prototype.sumBelow = function(x, y) {
  // Get sum of 3 values below this cell

  // If this cell is in the bottom row, return undefined
  if(y >= this.fire_size - 1) {
    throw "Cannot average below bottom row.";
  }

  var retval = 0;

  // push left pixel
  if(x <= 0) { retval +=0; } // Left border, push 0
  else { retval += this.cells[y + 1][x - 1]; }

  // push middle pixel
  if(x <= 0) { retval +=0; }
  else { retval += this.cells[y + 1][x]; }

  // push right pixel
  if(x >= this.fire_size - 1) { retval += 0; } // Left border, push 0
  else { retval += this.cells[y + 1][x + 1]; }

  return retval;
}


// Main logic
var fire_grid = new FireCellGrid(100, 4);
fire_grid.updateGrid();
fire_grid.drawGrid(window.canvas, window.context);

function canvasDraw() {
  setTimeout(
    function timeOut() {
      requestAnimationFrame(canvasDraw);
      fire_grid.updateGrid();
      fire_grid.drawGrid(window.canvas, window.context);
    },
    1000 / fps
  );
}

canvasDraw();
