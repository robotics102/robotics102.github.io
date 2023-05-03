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

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;

      line = line.trim().split(/\s+/);

      if (line.length == 1) continue;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = line[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var ele = _step2.value;

          map.cells.push(parseInt(ele));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
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
    min_val = list[i] < min_val ? list[i] : min_val;
    max_val = list[i] > max_val ? list[i] : max_val;
  }

  // Normalize the values.
  for (var i = 0; i < list.length; i++) {
    list[i] = (list[i] - min_val) / (max_val - min_val);
  }

  return list;
}