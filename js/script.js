$(document).ready(function () {
  /**
   * Prepare
   */
  var start_x = 23; // posisi x
  var start_y = 15; // posis y
  var length = 6; // panjang ular
  var size = 20; // ukuran ular
  var speed = 250; // kecepatan ular per milisecond
  var btn = "right"; // arah pertama
  var snake = [];
  var food;

  var map = $("#map")[0];
  var ctx = map.getContext("2d");
  var width = $("#map").width();
  var height = $("#map").height();

  /**
   * Init
   */
  function init() {
    create_time();
    create_snake();
    create_food();

    game_loop = setInterval(paint, speed);
  }

  $("#input").keyup(function (e) {
    if (e.target.value !== "") {
      $("#start").removeAttr("disabled");
    }
  });

  $("#start").click(function () {
    $("#front").css("display", "none");
    $("#main").css("display", "block");
    init();
  });

  /**
   * Set Time
   */
  function create_time() {
    var sec = 0;
    function pad(val) {
      return val > 9 ? val : "0" + val;
    }
    time = setInterval(function () {
      $("#second").html(pad(++sec % 60));
      $("#minute").html(pad(parseInt(sec / 60, 10)));
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
    ctx.fillStyle = "#ecf0f1"; // warna papan
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#2c4e50";
    ctx.strokeRect(0, 0, width, height);

    /**
     * Move Snake
     */
    var nx = snake[0].x;
    var ny = snake[0].y;

    if (btn == "right") {
      nx++;
    } else if (btn == "left") {
      nx--;
    } else if (btn == "down") {
      ny++;
    } else if (btn == "up") {
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
    $("#score").html(snake.length);
    if (nx == food.x && ny == food.y) {
      var tail = { x: nx, y: ny }; // menambah ekor

      if (localStorage.getItem("highscore") < snake.length) {
        localStorage.setItem("highscore", snake.length); // simpan highscore
      }

      create_food(); // membuat makanan baru
    } else {
      var tail = snake.pop();
      tail.x = nx;
      tail.y = ny;
    }

    snake.unshift(tail);

    for (var i = 0; i < snake.length; i++) {
      var c = snake[i];

      paint_cell(c.x, c.y);
    }

    paint_cell(food.x, food.y);

    /**
     * Snake Collision
     */
    for (var i = 1; i < snake.length; i++) {
      if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
        alert(
          "Game Over. Your Highscore: " + localStorage.getItem("highscore")
        );
        clearInterval(game_loop);
        clearInterval(time);
      }
    }
  }

  function paint_cell(x, y) {
    ctx.fillStyle = "#1abc9c";
    ctx.fillRect(x * size, y * size, size, size);
    ctx.strokeStyle = "#ecf0fq";
    ctx.strokeRect(x * size, y * size, size, size);
  }

  /**
   * Controller
   */
  $(document).keydown(function (e) {
    var key = e.which;
    if (key == "37" && btn != "right") {
      btn = "left";
    } else if (key == "38" && btn != "down") {
      btn = "up";
    } else if (key == "39" && btn != "left") {
      btn = "right";
    } else if (key == "40" && btn != "up") {
      btn = "down";
    }
  });

  /**
   * Rewind
   */
  $("#rewind").click(function () {
    $("#range").css("display", "block");
    $("#cancel").css("display", "block");
    $("#rewind").css("display", "none");
  });

  $("#cancel").click(function () {
    $("#range").css("display", "none");
    $("#cancel").css("display", "none");
    $("#rewind").css("display", "block");
  });
});
