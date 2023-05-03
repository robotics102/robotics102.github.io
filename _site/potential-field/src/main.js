'use strict';

//  Test: npx babel --watch src --out-dir . --presets react-app/prod

var config = {
  // Sim info
  MAP_DISPLAY_WIDTH: 800,   // px
  ROBOT_SIZE: 0.274,        // m, diameter
  ROBOT_DEFAULT_SIZE: 100,  // px
  COLLISION_THRESHOLD: 0.4,

  // Display info
  MAP_COLOUR_HIGH: "#00274C",      // Michigan blue
  MAP_COLOUR_LOW: "#ffffff",       // White
  FIELD_COLOUR_HIGH: "#2F65A7",
  FIELD_COLOUR_LOW: "#ffffff",     // White
  FIELD_ALPHA: "FF",
  PATH_COLOUR: "#00B2A9",          // Taubman Teal
  VISITED_CELL_COLOUR: "#989C97",  // Angell Hall Ash
  CLICKED_CELL_COLOUR: "#FFCB05",  // Maize
  GOAL_CELL_COLOUR: "#00ff00",
  BAD_GOAL_COLOUR: "#ff0000",
  SMALL_CELL_SCALE: 0.8,

  // Drawing info
  PAINT_CELL_DELTA: 0.01,
  PAINTBRUSH_RADIUS: 3,

  // Field info
  FIELD_FILE_NAME: "field.txt",
};


function MapFileSelect(props) {
  return (
    <div className="file-input-wrapper">
      <input className="file-input" type="file" onChange={props.onChange} />
    </div>
  );
}

/*******************
 *     ROBOT
 *******************/

class DrawRobot extends React.Component {
  constructor(props) {
    super(props);

    this.robotCanvas = null;
    this.robotCtx = null;

    this.robotPos = [config.MAP_DISPLAY_WIDTH / 2, config.MAP_DISPLAY_WIDTH / 2];
    this.robotSize = config.ROBOT_DEFAULT_SIZE;
    this.robotAngle = 0;

    this.robotImage = new Image(config.ROBOT_DEFAULT_SIZE, config.ROBOT_DEFAULT_SIZE);
    this.robotImage.src = 'assets/images/mbot.png';
  }

  componentDidMount() {
    this.robotCanvas = this.refs.robotCanvas;

    this.robotCtx = this.robotCanvas.getContext('2d');
    this.robotCtx.transform(1, 0, 0, -1, 0, 0);
    this.robotCtx.transform(1, 0, 0, 1, 0, -this.robotCanvas.width);

    // Apply the current transform since it will be cleared when first drawn.
    this.robotCtx.translate(this.robotPos[0], this.robotPos[1]);
    this.robotCtx.rotate(this.robotAngle);
  }

  drawRobot() {
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

  componentDidUpdate() {
    this.drawRobot();
  }

  render() {
    return (
      <canvas ref="robotCanvas" width={config.MAP_DISPLAY_WIDTH} height={config.MAP_DISPLAY_WIDTH}>
      </canvas>
    );
  }
}

/*******************
 *     CANVAS
 *******************/

 class DrawMap extends React.Component {
  constructor(props) {
    super(props);

    this.mapGrid = new GridCellCanvas();
  }

  componentDidMount() {
    this.mapGrid.init(this.refs.mapCanvas);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cells !== this.props.cells;
  }

  componentDidUpdate() {
    this.mapGrid.setSize(this.props.width, this.props.height);
    this.mapGrid.drawCells(this.props.cells, config.MAP_COLOUR_LOW, config.MAP_COLOUR_HIGH);
  }

  render() {
    return (
      <canvas ref="mapCanvas" width={config.MAP_DISPLAY_WIDTH} height={config.MAP_DISPLAY_WIDTH}>
      </canvas>
    );
  }
}

class DrawCells extends React.Component {
  constructor(props) {
    super(props);

    this.pathUpdated = true;
    this.clickedUpdated = true;
    this.goalUpdated = true;

    this.cellGrid = new GridCellCanvas();
  }

  componentDidMount() {
    this.cellGrid.init(this.refs.cellsCanvas);
  }

  drawPath() {
    for (var i in this.props.path) {
      this.cellGrid.drawCell(this.props.path[i], this.props.cellSize,
                             config.PATH_COLOUR, config.SMALL_CELL_SCALE);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.pathUpdated = nextProps.path !== this.props.path;
    this.clickedUpdated = nextProps.clickedCell !== this.props.clickedCell;
    this.goalUpdated = nextProps.goalCell !== this.props.goalCell;

    if (this.clickedUpdated && this.props.clickedCell.length > 0) {
      this.cellGrid.clearCell(this.props.clickedCell, this.props.cellSize)
    }
    if (this.goalUpdated && this.props.goalCell.length > 0) {
      this.cellGrid.clearCell(this.props.goalCell, this.props.cellSize)
    }

    return (this.pathUpdated || this.clickedUpdated || this.goalUpdated);
  }

  componentDidUpdate() {
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
        this.cellGrid.drawCell(this.props.clickedCell, this.props.cellSize,
                               config.CLICKED_CELL_COLOUR, config.SMALL_CELL_SCALE);
      }

      // If there's a goal cell, clear it in case it was clicked then draw it.
      if (this.props.goalCell.length > 0) {
        this.cellGrid.clearCell(this.props.goalCell, this.props.cellSize);
        var colour = this.props.goalValid ? config.GOAL_CELL_COLOUR : config.BAD_GOAL_COLOUR;
        this.cellGrid.drawCell(this.props.goalCell, this.props.cellSize,
                               colour, config.SMALL_CELL_SCALE);
      }
    }
  }

  render() {
    return (
      <canvas ref="cellsCanvas" width={config.MAP_DISPLAY_WIDTH} height={config.MAP_DISPLAY_WIDTH}>
      </canvas>
    );
  }
}


/*******************
 *   WHOLE PAGE
 *******************/

class SceneView extends React.Component {
  constructor(props) {
    super(props);

    // React state.
    this.state = {
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
      brushRadius: config.PAINTBRUSH_RADIUS,
    };

    this.field = new PotentialField(config.COLLISION_THRESHOLD, config.FIELD_COLOUR_LOW, config.FIELD_COLOUR_HIGH)
    this.field.setBrush(config.PAINTBRUSH_RADIUS, config.PAINT_CELL_DELTA);
  }

  componentDidMount() {
    this.field.init(this.refs.fieldCanvas);
  }

  posToPixels(x, y) {
    var u = (x * this.state.cellSize);
    var v = (y * this.state.cellSize);

    return [u, v];
  }

  updateMap(result) {
    var loaded = result.cells.length > 0;
    this.setState({cells: result.cells,
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
                   goalCell: []});

    this.field.setCells(this.state.cells, this.state.width, this.state.height);
    this.field.drawField();
  }

  onFileChange(event) {
    this.setState({ mapfile: event.target.files[0] });
  }

  onFileUpload() {
    if (this.state.mapfile === null) return;

    var fr = new FileReader();
    fr.onload = (evt) => {
      var map = parseMap(fr.result);
      this.updateMap(map);
    }
    fr.readAsText(this.state.mapfile);
  };

  onDownload() {
    const element = document.createElement("a");
    const file = new Blob([this.field.asString()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = config.FIELD_FILE_NAME;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  onMapClick(x, y) {
    if (!this.state.mapLoaded) return;
    if (this.state.showField) return;

    var row = Math.floor(y / this.state.cellSize);
    var col = Math.floor(x / this.state.cellSize);
    this.setState({ clickedCell: [row, col] });
  }

  handleMouseDown(event) {
    this.rect = this.refs.clickCanvas.getBoundingClientRect();
    var x = event.clientX - this.rect.left;
    var y = this.rect.bottom - event.clientY;
    var robotRadius = config.ROBOT_SIZE * this.state.pixelsPerMeter / 2;
    // if click is near robot, set isDown as true
    if (x < this.state.x + robotRadius && x > this.state.x - robotRadius &&
        y < this.state.y + robotRadius && y > this.state.y - robotRadius) {
      this.setState({ isRobotClicked: true });
    }
    else if (this.state.showField) {
      this.setState({ isUserDrawing: true });
      var row = Math.floor(y / this.state.cellSize);
      var col = Math.floor(x / this.state.cellSize);

      this.field.changeFieldCell(row, col);
    }
    else {
      this.onMapClick(x, y);
    }
  }

  handleMouseMove(event) {
    if (this.state.isRobotClicked) {
      var x = event.clientX - this.rect.left;
      var y = this.rect.bottom - event.clientY;
      this.setState({x: x, y: y});
    }
    else if (this.state.isUserDrawing) {
      var x = event.clientX - this.rect.left;
      var y = this.rect.bottom - event.clientY;
      var row = Math.floor(y / this.state.cellSize);
      var col = Math.floor(x / this.state.cellSize);

      this.field.changeFieldCell(row, col);
    }
  }

  handleMouseUp() {
    if (!this.state.isRobotClicked && !this.state.isUserDrawing) return;
    // this moves the robot along the path
    this.setState({isRobotClicked: false, isUserDrawing: false});
  }

  timer() {
    var length = this.state.path.length;
    if(length > this.i) {
      //move robot to the next spot
      this.findDirection();
      this.i = this.i + 1;
    }
    else {
      clearInterval(this.interval);
    }
  }

  findDirection(){
    var newCoord = [];
    newCoord = this.posToPixels(this.state.path[this.i][1], this.state.path[this.i][0]);
    if (newCoord[0] == this.state.x && newCoord[1] == this.state.y) return;
    this.setState({x: newCoord[0], y: newCoord[1]});
  }

  onFieldClear() {
    this.field.reset();
    this.setState({clickedCell: [],
                   goalCell: [],
                   path: []});
  }

  setGoal(goal) {
    if (goal.length === 0) return false;

    var idx = goal[1] + goal[0] * this.state.width;
    var valid = this.state.cells[idx] < 0.5;

    this.setState({goalCell: goal, goalValid: valid});

    return valid;
  }

  onStart() {
    var start_row = Math.floor(this.state.y / this.state.cellSize);
    var start_col = Math.floor(this.state.x / this.state.cellSize);

    var path = this.field.gradientDescent([start_row, start_col]);
    this.setState({path: path});

    // Start robot motion.
    this.i = 0;
    this.interval = setInterval(this.timer.bind(this), 100);
  }

  onFieldCheck() {
    if (!this.state.showField) {
      this.field.show();
    }
    else {
      this.field.hide();
      this.field.setDraw(false);
    }

    this.setState({showField: !this.state.showField, drawFieldIncrease: false});
  }

  onIncreaseCheck() {
    this.field.setDraw(!this.state.drawFieldIncrease);
    this.setState({drawFieldIncrease: !this.state.drawFieldIncrease});
  }

  onBrushChange(evt) {
    this.setState({brushRadius: evt.target.value});
    this.field.setBrush(evt.target.value, config.PAINT_CELL_DELTA);
  }

  render() {
    var canvasStyle = {
      width: config.MAP_DISPLAY_WIDTH + "px",
      height: config.MAP_DISPLAY_WIDTH + "px",
    };

    return (
      <div>
        <div className="select-wrapper">
          <MapFileSelect onChange={(event) => this.onFileChange(event)}/>
        </div>

        <div className="button-wrapper">
          <button className="button" onClick={() => this.onFileUpload()}>Upload Map</button>
          <button className="button" onClick={() => this.onDownload()}>Download Field</button>
          <button className="button" onClick={() => this.onFieldClear()}>Clear Field</button>
          <button className="button" onClick={() => this.onStart()}>Start!</button>
        </div>

        <div className="draw-wrapper">
          <div className="field-toggle-wrapper">
            Show Field:
            <label className="switch">
              <input type="checkbox" onClick={() => this.onFieldCheck()}/>
              <span className="slider round"></span>
            </label>
          </div>
          {this.state.showField &&
          <div className="increase-toggle-wrapper">
            Increase Field:
            <label className="switch">
              <input type="checkbox" onClick={() => this.onIncreaseCheck()}/>
              <span className="slider round"></span>
            </label>
          </div>}
          {this.state.showField &&
          <div className="slider-wrapper">
            Brush Size:
            <label className="range-slider">
              <input className="range" type="range" min="1" max="10"
                     value={this.state.brushRadius}
                     onChange={(evt) => this.onBrushChange(evt)}/>
            </label>
          </div>}
        </div>

        <div className="canvas-container" style={canvasStyle}>
          <DrawMap cells={this.state.cells} width={this.state.width} height={this.state.height} />
          <canvas ref="fieldCanvas" width={config.MAP_DISPLAY_WIDTH} height={config.MAP_DISPLAY_WIDTH}>
          </canvas>
          <DrawCells loaded={this.state.mapLoaded} path={this.state.path} clickedCell={this.state.clickedCell}
                      goalCell={this.state.goalCell} goalValid={this.state.goalValid}
                      cellSize={this.state.cellSize} />
          <DrawRobot x={this.state.x} y={this.state.y} theta={this.state.theta}
                      loaded={this.state.mapLoaded} pixelsPerMeter={this.state.pixelsPerMeter}
                      posToPixels={(x, y) => this.posToPixels(x, y)} />
          <canvas ref="clickCanvas" width={config.MAP_DISPLAY_WIDTH} height={config.MAP_DISPLAY_WIDTH}
                  onMouseDown={(e) => this.handleMouseDown(e)}
                  onMouseMove={(e) => this.handleMouseMove(e)}
                  onMouseUp={() => this.handleMouseUp()}>
          </canvas>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <SceneView />,
  document.getElementById('app-root')
);
