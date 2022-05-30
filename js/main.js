$(document).ready(function () {
  /**
   * Prepare
   */
  var start_x = 23;
  var start_y = 15;
  var length = 6;
  var size = 20;
  var speed = 250;
  var btn = 'right';
  var snakeColor = '#FFE227';
  var foodColor = '#29BB89';
  var border = '#1d2c3b';
  var snake = [];
  var food;

  var map = $('#map')[0];
  var ctx = map.getContext('2d');
  var width = $('#map').width();
  var height = $('#map').height();

  /**
   * Init
   */
  function init() {
    create_time();
    create_snake();
    create_food();

    game = setInterval(paint, speed);
  }

  $('#main').hide();
  $('#cancel').hide();
  $('#range').hide();

  $('#input').keyup(function (e) {
    if (e.target.value !== '') {
      $('#start').removeAttr('disabled');
    }
  });

  $('#start').click(function () {
    $('#main').show();
    $('#front').hide();
    init();
  });

  /**
   * Set Time
   */
  function create_time() {
    var sec = 0;
    function pad(val) {
      return val > 9 ? val : '0' + val;
    }
    time = setInterval(function () {
      $('#second').html(pad(++sec % 60));
      $('#minute').html(pad(parseInt(sec / 60)));
    }, 1000);
  }

  /**
   * Draw Snake
   */
  function create_snake() {
    for (var i = length - 1; i >= 0; i--) {
      snake.push({ x: start_x, y: start_y });
    }
  }

  /**
   * Draw Food
   */
  function create_food() {
    food = {
      x: Math.round((Math.random() * (width - size)) / size),
      y: Math.round((Math.random() * (height - size)) / size),
    };
  }

  /**
   * Run Game
   */
  function paint() {
    ctx.fillStyle = '#e5e7eb'; // warna papan
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#2c4e50'; // warna tepi papan
    ctx.strokeRect(0, 0, width, height);

    /**
     * Move Snake
     */
    var nx = snake[0].x;
    var ny = snake[0].y;

    if (btn == 'right') {
      nx++;
    } else if (btn == 'left') {
      nx--;
    } else if (btn == 'bottom') {
      ny++;
    } else if (btn == 'up') {
      ny--;
    }

    /**
     * Snake Hit Edge
     */
    if (nx < 0) {
      nx = (width - size) / size;
    }
    if (nx > (width - size) / size) {
      nx = 0;
    }
    if (ny < 0) {
      ny = (height - size) / size;
    }
    if (ny > (height - size) / size) {
      ny = 0;
    }

    /**
     * Snake Eat Food
     */
    if (nx == food.x && ny == food.y) {
      var tail = { x: nx, y: ny };

      create_food();
    } else {
      var tail = snake.pop();
      tail.x = nx;
      tail.y = ny;
    }

    snake.unshift(tail);

    for (var i = 0; i < snake.length; i++) {
      var c = snake[i];

      paint_cell({ x: c.x, y: c.y, fill: snakeColor, stroke: border });
    }

    paint_cell({ x: food.x, y: food.y, fill: foodColor, stroke: border });

    /**
     * Snake Collision
     */
    for (var i = 1; i < snake.length; i++) {
      if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
        $('.modal').css('display', 'block');
        $('#end-score').html(snake.length);
        $('#end-highscore').html(localStorage.getItem('highscore'));

        clearInterval(game);
        clearInterval(time);
      }
    }

    /**
     * Update Score
     */
    $('#score').html(snake.length);
    if (localStorage.getItem('highscore') < snake.length) {
      localStorage.setItem('highscore', snake.length);
    }
  }

  function paint_cell(data) {
    const { x, y, fill, stroke } = data;

    ctx.fillStyle = fill;
    ctx.fillRect(x * size, y * size, size, size);
    ctx.strokeStyle = stroke;
    ctx.strokeRect(x * size, y * size, size, size);
  }

  /**
   * Controller
   */
  $(document).keydown(function (e) {
    var key = e.which;
    if (key == '37' && btn != 'right') {
      btn = 'left';
    } else if (key == '38' && btn != 'bottom') {
      btn = 'up';
    } else if (key == '39' && btn != 'left') {
      btn = 'right';
    } else if (key == '40' && btn != 'up') {
      btn = 'bottom';
    }
  });

  /**
   * Rewind
   */
  $('#rewind').click(function () {
    $('#cancel').show();
    $('#range').show();
    $('#rewind').hide();
  });

  $('#cancel').click(function () {
    $('#rewind').show();
    $('#range').hide();
    $('#cancel').hide();
  });
});
