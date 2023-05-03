'use strict';

//  Test: npx babel --watch src --out-dir . --presets react-app/prod

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = {
  // Sim info
  MAP_DISPLAY_WIDTH: 800, // px
  ROBOT_SIZE: 0.274, // m, diameter
  ROBOT_DEFAULT_SIZE: 100, // px
  COLLISION_THRESHOLD: 0.4,

  // Display info
  MAP_COLOUR_HIGH: "#00274C", // Michigan blue
  MAP_COLOUR_LOW: "#ffffff", // White
  FIELD_COLOUR_HIGH: "#2F65A7",
  FIELD_COLOUR_LOW: "#ffffff", // White
  FIELD_ALPHA: "FF",
  PATH_COLOUR: "#00B2A9", // Taubman Teal
  VISITED_CELL_COLOUR: "#989C97", // Angell Hall Ash
  CLICKED_CELL_COLOUR: "#FFCB05", // Maize
  GOAL_CELL_COLOUR: "#00ff00",
  BAD_GOAL_COLOUR: "#ff0000",
  SMALL_CELL_SCALE: 0.8,

  // Drawing info
  PAINT_CELL_DELTA: 0.01,
  PAINTBRUSH_RADIUS: 3,

  // Field info
  FIELD_FILE_NAME: "field.txt"
};

function MapFileSelect(props) {
  return React.createElement(
    "div",
    { className: "file-input-wrapper" },
    React.createElement("input", { className: "file-input", type: "file", onChange: props.onChange })
  );
}

/*******************
 *     ROBOT
 *******************/

var DrawRobot = function (_React$Component) {
  _inherits(DrawRobot, _React$Component);

  function DrawRobot(props) {
    _classCallCheck(this, DrawRobot);

    var _this = _possibleConstructorReturn(this, (DrawRobot.__proto__ || Object.getPrototypeOf(DrawRobot)).call(this, props));

    _this.robotCanvas = null;
    _this.robotCtx = null;

    _this.robotPos = [config.MAP_DISPLAY_WIDTH / 2, config.MAP_DISPLAY_WIDTH / 2];
    _this.robotSize = config.ROBOT_DEFAULT_SIZE;
    _this.robotAngle = 0;

    _this.robotImage = new Image(config.ROBOT_DEFAULT_SIZE, config.ROBOT_DEFAULT_SIZE);
    _this.robotImage.src = 'assets/images/mbot.png';
    return _this;
  }

  _createClass(DrawRobot, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.robotCanvas = this.refs.robotCanvas;

      this.robotCtx = this.robotCanvas.getContext('2d');
      this.robotCtx.transform(1, 0, 0, -1, 0, 0);
      this.robotCtx.transform(1, 0, 0, 1, 0, -this.robotCanvas.width);

      // Apply the current transform since it will be cleared when first drawn.
      this.robotCtx.translate(this.robotPos[0], this.robotPos[1]);
      this.robotCtx.rotate(this.robotAngle);
    }
  }, {
    key: "drawRobot",
    value: function drawRobot() {
      // Clear the robot position.
      this.robotCtx.clearRect(-this.robotSize / 2, -this.robotSize / 2, this.robotSize, this.robotSize);

      // Reset the canvas since the last draw.
      this.robotCtx.rotate(-this.robotAngle);
      this.robotCtx.translate(-this.robotPos[0], -this.robotPos[1]);

      if (this.props.loaded) {
        // this updates position
        this.robotPos = [this.props.x, this.props.y];
        this.robotSize = config.ROBOT_SIZE * this.props.pixelsPerMeter;
        this.robotAngle = this.props.theta;
      }

      this.robotCtx.translate(this.robotPos[0], this.robotPos[1]);
      this.robotCtx.rotate(this.robotAngle);

      // TODO: Scale the image once instead of every time.
      this.robotCtx.drawImage(this.robotImage, -this.robotSize / 2, -this.robotSize / 2, this.robotSize, this.robotSize);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.drawRobot();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("canvas", { ref: "robotCanvas", width: config.MAP_DISPLAY_WIDTH, height: config.MAP_DISPLAY_WIDTH });
    }
  }]);

  return DrawRobot;
}(React.Component);

/*******************
 *     CANVAS
 *******************/

var DrawMap = function (_React$Component2) {
  _inherits(DrawMap, _React$Component2);

  function DrawMap(props) {
    _classCallCheck(this, DrawMap);

    var _this2 = _possibleConstructorReturn(this, (DrawMap.__proto__ || Object.getPrototypeOf(DrawMap)).call(this, props));

    _this2.mapGrid = new GridCellCanvas();
    return _this2;
  }

  _createClass(DrawMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mapGrid.init(this.refs.mapCanvas);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.cells !== this.props.cells;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.mapGrid.setSize(this.props.width, this.props.height);
      this.mapGrid.drawCells(this.props.cells, config.MAP_COLOUR_LOW, config.MAP_COLOUR_HIGH);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("canvas", { ref: "mapCanvas", width: config.MAP_DISPLAY_WIDTH, height: config.MAP_DISPLAY_WIDTH });
    }
  }]);

  return DrawMap;
}(React.Component);

var DrawCells = function (_React$Component3) {
  _inherits(DrawCells, _React$Component3);

  function DrawCells(props) {
    _classCallCheck(this, DrawCells);

    var _this3 = _possibleConstructorReturn(this, (DrawCells.__proto__ || Object.getPrototypeOf(DrawCells)).call(this, props));

    _this3.pathUpdated = true;
    _this3.clickedUpdated = true;
    _this3.goalUpdated = true;

    _this3.cellGrid = new GridCellCanvas();
    return _this3;
  }

  _createClass(DrawCells, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.cellGrid.init(this.refs.cellsCanvas);
    }
  }, {
    key: "drawPath",
    value: function drawPath() {
      for (var i in this.props.path) {
        this.cellGrid.drawCell(this.props.path[i], this.props.cellSize, config.PATH_COLOUR, config.SMALL_CELL_SCALE);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      this.pathUpdated = nextProps.path !== this.props.path;
      this.clickedUpdated = nextProps.clickedCell !== this.props.clickedCell;
      this.goalUpdated = nextProps.goalCell !== this.props.goalCell;

      if (this.clickedUpdated && this.props.clickedCell.length > 0) {
        this.cellGrid.clearCell(this.props.clickedCell, this.props.cellSize);
      }
      if (this.goalUpdated && this.props.goalCell.length > 0) {
        this.cellGrid.clearCell(this.props.goalCell, this.props.cellSize);
      }

      return this.pathUpdated || this.clickedUpdated || this.goalUpdated;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // The first time the visited cells are null, the map was reset. Clear the
      // canvas. Make sure this is only done once using this.clear.
      this.cellGrid.clear();

      // If the map has been loaded, we can draw the cells.
      if (this.props.loaded) {
        // Draw the found path.
        if (this.pathUpdated) {
          this.drawPath();
        }

        // If there's a clicked cell, draw it.
        if (this.props.clickedCell.length > 0) {
          this.cellGrid.drawCell(this.props.clickedCell, this.props.cellSize, config.CLICKED_CELL_COLOUR, config.SMALL_CELL_SCALE);
        }

        // If there's a goal cell, clear it in case it was clicked then draw it.
        if (this.props.goalCell.length > 0) {
          this.cellGrid.clearCell(this.props.goalCell, this.props.cellSize);
          var colour = this.props.goalValid ? config.GOAL_CELL_COLOUR : config.BAD_GOAL_COLOUR;
          this.cellGrid.drawCell(this.props.goalCell, this.props.cellSize, colour, config.SMALL_CELL_SCALE);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("canvas", { ref: "cellsCanvas", width: config.MAP_DISPLAY_WIDTH, height: config.MAP_DISPLAY_WIDTH });
    }
  }]);

  return DrawCells;
}(React.Component);

/*******************
 *   WHOLE PAGE
 *******************/

var SceneView = function (_React$Component4) {
  _inherits(SceneView, _React$Component4);

  function SceneView(props) {
    _classCallCheck(this, SceneView);

    // React state.
    var _this4 = _possibleConstructorReturn(this, (SceneView.__proto__ || Object.getPrototypeOf(SceneView)).call(this, props));

    _this4.state = {
      cells: [],
      width: 0,
      height: 0,
      num_cells: 0,
      origin: [0, 0],
      metersPerCell: 0,
      pixelsPerMeter: 0,
      cellSize: 0,
      mapLoaded: false,
      x: config.MAP_DISPLAY_WIDTH / 2,
      y: config.MAP_DISPLAY_WIDTH / 2,
      theta: 0,
      mapfile: null,
      path: [],
      clickedCell: [],
      goalCell: [],
      goalValid: true,
      showField: false,
      isRobotClicked: false,
      isUserDrawing: false,
      drawFieldIncrease: false,
      brushRadius: config.PAINTBRUSH_RADIUS
    };

    _this4.field = new PotentialField(config.COLLISION_THRESHOLD, config.FIELD_COLOUR_LOW, config.FIELD_COLOUR_HIGH);
    _this4.field.setBrush(config.PAINTBRUSH_RADIUS, config.PAINT_CELL_DELTA);
    return _this4;
  }

  _createClass(SceneView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.field.init(this.refs.fieldCanvas);
    }
  }, {
    key: "posToPixels",
    value: function posToPixels(x, y) {
      var u = x * this.state.cellSize;
      var v = y * this.state.cellSize;

      return [u, v];
    }
  }, {
    key: "updateMap",
    value: function updateMap(result) {
      var loaded = result.cells.length > 0;
      this.setState({ cells: result.cells,
        width: result.width,
        height: result.height,
        num_cells: result.num_cells,
        origin: result.origin,
        metersPerCell: result.meters_per_cell,
        cellSize: config.MAP_DISPLAY_WIDTH / result.width,
        pixelsPerMeter: config.MAP_DISPLAY_WIDTH / (result.width * result.meters_per_cell),
        mapLoaded: loaded,
        path: [],
        clickedCell: [],
        goalCell: [] });

      this.field.setCells(this.state.cells, this.state.width, this.state.height);
      this.field.drawField();
    }
  }, {
    key: "onFileChange",
    value: function onFileChange(event) {
      this.setState({ mapfile: event.target.files[0] });
    }
  }, {
    key: "onFileUpload",
    value: function onFileUpload() {
      var _this5 = this;

      if (this.state.mapfile === null) return;

      var fr = new FileReader();
      fr.onload = function (evt) {
        var map = parseMap(fr.result);
        _this5.updateMap(map);
      };
      fr.readAsText(this.state.mapfile);
    }
  }, {
    key: "onDownload",
    value: function onDownload() {
      var element = document.createElement("a");
      var file = new Blob([this.field.asString()], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = config.FIELD_FILE_NAME;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  }, {
    key: "onMapClick",
    value: function onMapClick(x, y) {
      if (!this.state.mapLoaded) return;
      if (this.state.showField) return;

      var row = Math.floor(y / this.state.cellSize);
      var col = Math.floor(x / this.state.cellSize);
      this.setState({ clickedCell: [row, col] });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
      this.rect = this.refs.clickCanvas.getBoundingClientRect();
      var x = event.clientX - this.rect.left;
      var y = this.rect.bottom - event.clientY;
      var robotRadius = config.ROBOT_SIZE * this.state.pixelsPerMeter / 2;
      // if click is near robot, set isDown as true
      if (x < this.state.x + robotRadius && x > this.state.x - robotRadius && y < this.state.y + robotRadius && y > this.state.y - robotRadius) {
        this.setState({ isRobotClicked: true });
      } else if (this.state.showField) {
        this.setState({ isUserDrawing: true });
        var row = Math.floor(y / this.state.cellSize);
        var col = Math.floor(x / this.state.cellSize);

        this.field.changeFieldCell(row, col);
      } else {
        this.onMapClick(x, y);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      if (this.state.isRobotClicked) {
        var x = event.clientX - this.rect.left;
        var y = this.rect.bottom - event.clientY;
        this.setState({ x: x, y: y });
      } else if (this.state.isUserDrawing) {
        var x = event.clientX - this.rect.left;
        var y = this.rect.bottom - event.clientY;
        var row = Math.floor(y / this.state.cellSize);
        var col = Math.floor(x / this.state.cellSize);

        this.field.changeFieldCell(row, col);
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      if (!this.state.isRobotClicked && !this.state.isUserDrawing) return;
      // this moves the robot along the path
      this.setState({ isRobotClicked: false, isUserDrawing: false });
    }
  }, {
    key: "timer",
    value: function timer() {
      var length = this.state.path.length;
      if (length > this.i) {
        //move robot to the next spot
        this.findDirection();
        this.i = this.i + 1;
      } else {
        clearInterval(this.interval);
      }
    }
  }, {
    key: "findDirection",
    value: function findDirection() {
      var newCoord = [];
      newCoord = this.posToPixels(this.state.path[this.i][1], this.state.path[this.i][0]);
      if (newCoord[0] == this.state.x && newCoord[1] == this.state.y) return;
      this.setState({ x: newCoord[0], y: newCoord[1] });
    }
  }, {
    key: "onFieldClear",
    value: function onFieldClear() {
      this.field.reset();
      this.setState({ clickedCell: [],
        goalCell: [],
        path: [] });
    }
  }, {
    key: "setGoal",
    value: function setGoal(goal) {
      if (goal.length === 0) return false;

      var idx = goal[1] + goal[0] * this.state.width;
      var valid = this.state.cells[idx] < 0.5;

      this.setState({ goalCell: goal, goalValid: valid });

      return valid;
    }
  }, {
    key: "onStart",
    value: function onStart() {
      var start_row = Math.floor(this.state.y / this.state.cellSize);
      var start_col = Math.floor(this.state.x / this.state.cellSize);

      var path = this.field.gradientDescent([start_row, start_col]);
      this.setState({ path: path });

      // Start robot motion.
      this.i = 0;
      this.interval = setInterval(this.timer.bind(this), 100);
    }
  }, {
    key: "onFieldCheck",
    value: function onFieldCheck() {
      if (!this.state.showField) {
        this.field.show();
      } else {
        this.field.hide();
        this.field.setDraw(false);
      }

      this.setState({ showField: !this.state.showField, drawFieldIncrease: false });
    }
  }, {
    key: "onIncreaseCheck",
    value: function onIncreaseCheck() {
      this.field.setDraw(!this.state.drawFieldIncrease);
      this.setState({ drawFieldIncrease: !this.state.drawFieldIncrease });
    }
  }, {
    key: "onBrushChange",
    value: function onBrushChange(evt) {
      this.setState({ brushRadius: evt.target.value });
      this.field.setBrush(evt.target.value, config.PAINT_CELL_DELTA);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var canvasStyle = {
        width: config.MAP_DISPLAY_WIDTH + "px",
        height: config.MAP_DISPLAY_WIDTH + "px"
      };

      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "select-wrapper" },
          React.createElement(MapFileSelect, { onChange: function onChange(event) {
              return _this6.onFileChange(event);
            } })
        ),
        React.createElement(
          "div",
          { className: "button-wrapper" },
          React.createElement(
            "button",
            { className: "button", onClick: function onClick() {
                return _this6.onFileUpload();
              } },
            "Upload Map"
          ),
          React.createElement(
            "button",
            { className: "button", onClick: function onClick() {
                return _this6.onDownload();
              } },
            "Download Field"
          ),
          React.createElement(
            "button",
            { className: "button", onClick: function onClick() {
                return _this6.onFieldClear();
              } },
            "Clear Field"
          ),
          React.createElement(
            "button",
            { className: "button", onClick: function onClick() {
                return _this6.onStart();
              } },
            "Start!"
          )
        ),
        React.createElement(
          "div",
          { className: "draw-wrapper" },
          React.createElement(
            "div",
            { className: "field-toggle-wrapper" },
            "Show Field:",
            React.createElement(
              "label",
              { className: "switch" },
              React.createElement("input", { type: "checkbox", onClick: function onClick() {
                  return _this6.onFieldCheck();
                } }),
              React.createElement("span", { className: "slider round" })
            )
          ),
          this.state.showField && React.createElement(
            "div",
            { className: "increase-toggle-wrapper" },
            "Increase Field:",
            React.createElement(
              "label",
              { className: "switch" },
              React.createElement("input", { type: "checkbox", onClick: function onClick() {
                  return _this6.onIncreaseCheck();
                } }),
              React.createElement("span", { className: "slider round" })
            )
          ),
          this.state.showField && React.createElement(
            "div",
            { className: "slider-wrapper" },
            "Brush Size:",
            React.createElement(
              "label",
              { className: "range-slider" },
              React.createElement("input", { className: "range", type: "range", min: "1", max: "10",
                value: this.state.brushRadius,
                onChange: function onChange(evt) {
                  return _this6.onBrushChange(evt);
                } })
            )
          )
        ),
        React.createElement(
          "div",
          { className: "canvas-container", style: canvasStyle },
          React.createElement(DrawMap, { cells: this.state.cells, width: this.state.width, height: this.state.height }),
          React.createElement("canvas", { ref: "fieldCanvas", width: config.MAP_DISPLAY_WIDTH, height: config.MAP_DISPLAY_WIDTH }),
          React.createElement(DrawCells, { loaded: this.state.mapLoaded, path: this.state.path, clickedCell: this.state.clickedCell,
            goalCell: this.state.goalCell, goalValid: this.state.goalValid,
            cellSize: this.state.cellSize }),
          React.createElement(DrawRobot, { x: this.state.x, y: this.state.y, theta: this.state.theta,
            loaded: this.state.mapLoaded, pixelsPerMeter: this.state.pixelsPerMeter,
            posToPixels: function posToPixels(x, y) {
              return _this6.posToPixels(x, y);
            } }),
          React.createElement("canvas", { ref: "clickCanvas", width: config.MAP_DISPLAY_WIDTH, height: config.MAP_DISPLAY_WIDTH,
            onMouseDown: function onMouseDown(e) {
              return _this6.handleMouseDown(e);
            },
            onMouseMove: function onMouseMove(e) {
              return _this6.handleMouseMove(e);
            },
            onMouseUp: function onMouseUp() {
              return _this6.handleMouseUp();
            } })
        )
      );
    }
  }]);

  return SceneView;
}(React.Component);

ReactDOM.render(React.createElement(SceneView, null), document.getElementById('app-root'));