class PotentialField {
  constructor(collision_thresh, color_low, color_high) {
    this.collision_thresh = collision_thresh;
    this.color_low = color_low;
    this.color_high = color_high;

    this.increase = false;
    this.brushRadius = 3;
    this.brushDelta = 0.01;

    this.cellOdds = [];
    this.field = [];

    this.fieldGrid = new GridCellCanvas();
    this.canvas = undefined;
  }

  init(canvas) {
    this.fieldGrid.init(canvas);
    this.canvas = canvas;

    this.hide();
  }

  hide() {
    this.canvas.style.display = 'none';
  }

  show() {
    this.canvas.style.display = 'block';
  }

  setDraw(increase) {
    this.increase = increase;
  }

  setBrush(radius, delta) {
    this.brushRadius = radius;
    this.brushDelta = delta;
  }

  setCells(cells, width, height) {
    this.cellOdds = cells;
    this.fieldGrid.setSize(width, height);
    this.reset();
  }

  reset() {
    this.field = Array(this.fieldGrid.width * this.fieldGrid.height).fill(1.0);
    this.drawField();
  }

  asString() {
    var data = this.fieldGrid.width + " " + this.fieldGrid.height + "\n";
    for (var i = 0; i < this.field.length; i++) {
      data += this.field[i];
      if ((i + 1) % this.fieldGrid.width == 0) {
        data += "\n";
      }
      else {
        data += " ";
      }
    }
    return data;
  }

  drawField() {
    if (this.cellOdds.length !== this.fieldGrid.width * this.fieldGrid.height) {
      return;
    }

    this.fieldGrid.clear();
    for (var i = 0; i < this.fieldGrid.width; i++) {
      for (var j = 0; j < this.fieldGrid.height; j++) {
        var idx = this.fieldGrid.getCellIdx(i, j);
        if (this.cellOdds[idx] > this.collision_thresh) continue;

        var prob = this.field[idx];
        var color = getColor(prob, this.color_low, this.color_high);
        this.fieldGrid.drawCell([j, i], this.fieldGrid.cellSize, color);
      }
    }
  }

  changeFieldCell(row, col) {
    for (var i = row - this.brushRadius; i <= row + this.brushRadius; i++) {
      for (var j = col - this.brushRadius; j <= col + this.brushRadius; j++) {
        // Skip cells outside a circle pattern.
        if (Math.pow(i - row, 2) + Math.pow(j - col, 2) > Math.pow(this.brushRadius - 0.5, 2)) continue;

        var idx = this.fieldGrid.getCellIdx(j, i);
        // Skip out of bounds indicies or indices in collision.
        if (idx < 0 || idx >= this.field.length) continue;
        if (this.cellOdds[idx] > this.collision_thresh) continue;

        var dir = this.increase ? 1 : -1;
        var delta = this.brushDelta * (1 - Math.sqrt(Math.pow(i - row, 2) + Math.pow(j - col, 2)) / this.brushRadius);
        this.field[idx] = Math.min(Math.max(this.field[idx] + dir * delta, 0), 1);

        var color = getColor(this.field[idx], this.color_low, this.color_high);
        this.fieldGrid.drawCell([i, j], this.fieldGrid.cellSize, color);
      }
    }
  }

  neighbors8(row, col) {
    var nbrs = [];
    for (var i = row - 1; i <= row + 1; i++) {
      for (var j = col - 1; j <= col + 1; j++) {
        if (i == row && j == col) continue;
        var idx = this.fieldGrid.getCellIdx(j, i);
        if (idx < 0 || idx >= this.field.length) continue;
        nbrs.push([i, j]);
      }
    }
    return nbrs;
  }

  gradientDescent(start) {
    var done = false;
    var current = start;
    var curr_idx = this.fieldGrid.getCellIdx(start[1], start[0]);
    var path = [start.slice()];
    while (!done) {
      // Get all neighbors.
      var nbrs = this.neighbors8(...current)

      // Find the neighbor with the largest delta to the current.
      var max_delta = 0;
      var max_idx = 0;
      for (var n = 0; n < nbrs.length; n++) {
        var idx = this.fieldGrid.getCellIdx(nbrs[n][1], nbrs[n][0]);
        if (this.cellOdds[idx] > this.collision_thresh) continue;

        var grad = this.field[idx] - this.field[curr_idx];
        if (grad < max_delta) {
          max_delta = grad;
          max_idx = n;
        }
      }

      // If there was a lower neighbor, that's the next one to explore.
      if (max_delta < 0) {
        current = nbrs[max_idx];
        curr_idx = this.fieldGrid.getCellIdx(current[1], current[0]);
        path.push(current.slice());
      }
      else done = true;
    }

    return path;
  }
}