/*******************
 * DRAWING HELPERS
 *******************/

function colourStringToRGB(colour_str) {
  var rgb = [parseInt(colour_str.substring(1, 3), 16),
              parseInt(colour_str.substring(3, 5), 16),
              parseInt(colour_str.substring(5, 7), 16)];
  return rgb;
}

function getColor(prob, colour_low, colour_high) {
  // Takes a probability (number from 0 to 1) and converts it into a color code
  var colour_low_a = colourStringToRGB(colour_low);
  var colour_high_a = colourStringToRGB(colour_high);

  var hex = function(x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
  };

  var r = Math.ceil(colour_high_a[0] * prob + colour_low_a[0] * (1 - prob));
  var g = Math.ceil(colour_high_a[1] * prob + colour_low_a[1] * (1 - prob));
  var b = Math.ceil(colour_high_a[2] * prob + colour_low_a[2] * (1 - prob));

  var color = hex(r) + hex(g) + hex(b);
  return "#" + color;
}


class GridCellCanvas {
  constructor() {
    this.canvas = null;
    this.ctx = null;

    this.width = 0;
    this.height = 0;
    this.cellSize = 0;
  }

  init(canvas) {
    this.canvas = canvas;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.transform(1, 0, 0, -1, 0, 0);
    this.ctx.transform(1, 0, 0, 1, 0, -this.canvas.width);

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellSize = this.canvas.width / this.width;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.cellSize = this.canvas.width / this.width;
  }

  getCellIdx(i, j) {
    return i + j * this.width;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCell(cell, size, color, scale=1) {
    var i = cell[1];
    var j = cell[0];
    var shift = size * (1 - scale) / 2;
    var start_x = i * size + shift;
    var start_y = j * size + shift;

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(start_x, start_y, size * scale, size * scale);
  }

  drawCells(cells, colour_low, colour_high, alpha="ff") {
    if (cells.length !== this.width * this.height) {
      return;
    }

    this.clear();
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        var prob = cells[this.getCellIdx(i, j)];
        var color = getColor(prob, colour_low, colour_high);
        this.drawCell([j, i], this.cellSize, color + alpha);
      }
    }
  }

  clearCell(cell, size) {
    var start_x = cell[1] * size;
    var start_y = cell[0] * size;

    this.ctx.clearRect(start_x, start_y, size, size);
  }
}
