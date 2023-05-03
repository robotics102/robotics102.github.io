/*******************
 * MAP HELPERS
 *******************/

function parseMap(data) {
  var map = {};

  var lines = data.trim().split('\n');
  var header = lines.shift();
  header = header.split(/\s+/);

  map.origin = [parseFloat(header[0]), parseFloat(header[1])];
  map.width = parseFloat(header[2]);
  map.height = parseFloat(header[3]);
  map.meters_per_cell = parseFloat(header[4]);
  map.num_cells = map.width * map.height;

  map.cells = [];

  for (let line of lines) {
    line = line.trim().split(/\s+/);

    if (line.length == 1) continue;

    for (let ele of line) {
      map.cells.push(parseInt(ele));
    }
  }

  map.cells = normalizeList(map.cells);

  if (map.cells.length !== map.num_cells) {
    console.warn("Map has wrong number of cells:", map.cells.length, "!==", map.num_cells);
  }

  return map;
}

function normalizeList(list) {
  if (list.length < 1) return list;
  if (list.length === 1) return [1];

  // Find min and max values.
  // Note: Using JavaScript's Math.min(...) and Math.min(...) causes issues if
  // the array is too big to unpack.
  var min_val = list[0];
  var max_val = list[0];

  for (var i = 1; i < list.length; i++) {
    min_val =  list[i] < min_val ? list[i] : min_val;
    max_val =  list[i] > max_val ? list[i] : max_val;
  }

  // Normalize the values.
  for (var i = 0; i < list.length; i++) {
    list[i] = (list[i] - min_val) / (max_val - min_val);
  }

  return list;
}