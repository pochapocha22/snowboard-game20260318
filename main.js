const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: "#ff4500",
    velocityY: 0,
    gravity: 0.8,
    jumpPower: -12,
    isJumping: false
};

let obstacle = {
    x: 600,
    y: 310,
    width: 20,
    height: 20,
    color: "#8b4513",
    speed: 5
};

const groundHeight = 300;
let isGameOver = false;
let score = 0;

function resetGame() {
    isGameOver = false;
    score = 0;
    player.y = groundHeight;
    player.velocityY = 0;
    player.isJumping = false;
    obstacle.x = canvas.width;
    obstacle.speed = 5;
    update();
}

// ★追加・変更ポイント1：入力された時の処理を「関数」として独立させる
function handleInput() {
    if (isGameOver) {
        resetGame();
    } else if (!player.isJumping) {
        player.velocityY = player.jumpPower;
        player.isJumping = true;
    }
}

// ★変更ポイント2：スペースキーが押されたら handleInput() を呼ぶ
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault(); // スペースキーで画面が下にスクロールするのを防ぐ
        handleInput();
    }
});

// ★追加ポイント3：スマホのタッチ、またはPCのマウスクリックに対応
// タッチされた時 (スマホ用)
canvas.addEventListener("touchstart", function(event) {
    event.preventDefault(); // タッチ操作による画面の拡大やスクロールを防ぐ
    handleInput();
}, { passive: false });

// クリックされた時 (PCのマウス用)
canvas.addEventListener("mousedown", function(event) {
    handleInput();
});

// ゲームのメインループ
function update() {
    if (isGameOver) {
        ctx.fillStyle = "black";
        ctx.font = "40px sans-serif";
        ctx.fillText("GAME OVER", 180, 200);
        
        ctx.font = "20px sans-serif";
        ctx.fillText("タップ または スペースキーでリトライ", 110, 240); // ★文字も少し変更
        return; 
    }

    // 1. プレイヤーの計算
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= groundHeight) {
        player.y = groundHeight;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // 2. 障害物の計算
    obstacle.x -= obstacle.speed;

    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width;
        score++;
        obstacle.speed += 0.5;
    }

    // 3. 当たり判定
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        isGameOver = true;
    }

    // 4. 画面の描画
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 雪の地面
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 330, canvas.width, 70);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.fillStyle = "black";
    ctx.font = "24px sans-serif";
    ctx.fillText("Score: " + score, 20, 40);

    requestAnimationFrame(update);
}

update();