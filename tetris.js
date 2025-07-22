class Tetris {
    constructor() {
        this.stageWidth = 10;
        this.stageHeight = 20;
        this.stageCanvas = document.getElementById("stage");
        this.nextCanvas = document.getElementById("next");
        let cellWidth = this.stageCanvas.width / this.stageWidth;
        let cellHeight = this.stageCanvas.height / this.stageHeight;
        this.cellSize = cellWidth < cellHeight ? cellWidth : cellHeight;
        this.stageLeftPadding = (this.stageCanvas.width - this.cellSize * this.stageWidth) / 2;
        this.stageTopPadding = (this.stageCanvas.height - this.cellSize * this.stageHeight) / 2;
        this.blocks = this.createBlocks();
        this.deletedLines = 0;
        this.gameSpeed = 1050;
        this.level = 1;
        this.gameStatus = "S";
        this.timeoutId;
        this.bag = [];

        window.onkeydown = (e) => {
            console.log(e.keyCode);
            if(this.gameStatus === "S"){
                if (e.keyCode === 37) {
                    if (this.currentBlock != null) {
                        this.moveLeft();
                    }
                } else if (e.keyCode === 38) {
                    if (this.currentBlock != null) {
                        this.rotate();
                    }
                } else if (e.keyCode === 39) {
                    if (this.currentBlock != null) {
                        this.moveRight();
                    }
                } else if (e.keyCode === 40) {
                    if (this.currentBlock != null) {
                        this.fallBlock();
                        this.draw();
                        this.timerReset();
                    }
                } else if (e.keyCode === 32) {
                    if (this.currentBlock != null) {
                        this.fall();
                    }
                }
            }
            if (e.keyCode === 27 || e.keyCode === 80) {
                this.pause();
            } else if (e.keyCode === 82) {
                this.reset();
            } 
        }
        
        document.getElementById("tetris-move-left-button").onmousedown = (e) => {
            if(this.gameStatus === "S" && this.currentBlock != null){ 
                this.moveLeft();
            }
        }
        document.getElementById("tetris-rotate-button").onmousedown = (e) => {
            if(this.gameStatus === "S" && this.currentBlock != null){ 
                this.rotate();
            }
        }
        document.getElementById("tetris-move-right-button").onmousedown = (e) => {
            if(this.gameStatus === "S" && this.currentBlock != null){ 
                this.moveRight();
            }
        }
        document.getElementById("tetris-down-button").onmousedown = (e) => {
            if(this.gameStatus === "S" && this.currentBlock != null){ 
                this.fallBlock();
                this.draw();
                this.timerReset();
            }
        }
        document.getElementById("tetris-fall-button").onmousedown = (e) => {
            if(this.gameStatus === "S" && this.currentBlock != null){ 
                this.fall();
            }
        }
        document.getElementById("tetris-pause-button").onmousedown = (e) => {
            this.pause();
        }
        document.getElementById("tetris-reset-button").onmousedown = (e) => {
            this.reset();
        }
    }

    createBlocks() {
        let blocks = [
            {
                shape: [[[-1, 0], [0, 0], [1, 0], [2, 0]],
                        [[0, -1], [0, 0], [0, 1], [0, 2]],
                        [[-1, 0], [0, 0], [1, 0], [2, 0]],
                        [[0, -1], [0, 0], [0, 1], [0, 2]]],
                color: "rgb(0, 255, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 128)"
            },
            {
                shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
                        [[0, 0], [1, 0], [0, 1], [1, 1]],
                        [[0, 0], [1, 0], [0, 1], [1, 1]],
                        [[0, 0], [1, 0], [0, 1], [1, 1]]],
                color: "rgb(255, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 128, 0)"
            },
            {
                shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
                        [[-1, -1], [-1, 0], [0, 0], [0, 1]],
                        [[0, 0], [1, 0], [-1, 1], [0, 1]],
                        [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(0, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 0)"
            },
            {
                shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
                        [[0, -1], [-1, 0], [0, 0], [-1, 1]],
                        [[-1, 0], [0, 0], [0, 1], [1, 1]],
                        [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
                color: "rgb(255, 0, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 0)"
            },
            {
                shape: [[[-1, -1], [-1, 0], [0, 0], [1, 0]],
                        [[0, -1], [1, -1], [0, 0], [0, 1]],
                        [[-1, 0], [0, 0], [1, 0], [1, 1]],
                        [[0, -1], [0, 0], [-1, 1], [0, 1]]],
                color: "rgb(0, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 0, 128)"
            },
            {
                shape: [[[1, -1], [-1, 0], [0, 0], [1, 0]],
                        [[0, -1], [0, 0], [0, 1], [1, 1]],
                        [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                        [[-1, -1], [0, -1], [0, 0], [0, 1]]],
                color: "rgb(255, 165, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 82, 0)"
            },
            {
                shape: [[[0, -1], [-1, 0], [0, 0], [1, 0]],
                        [[0, -1], [0, 0], [1, 0], [0, 1]],
                        [[-1, 0], [0, 0], [1, 0], [0, 1]],
                        [[0, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(255, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 128)"
            }
        ];
        return blocks;
    }

    createNewBag() {
        for (let i = 0; i < 7; i++) {
            this.bag.push(i);
        }
        this.shuffleBag();
    }

    shuffleBag() {
        for (let i = this.bag.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }


    drawBlock(x, y, type, angle, canvas, alpha = 1.0) {
        let context = canvas.getContext("2d");
        let block = this.blocks[type];
        context.save();
        context.globalAlpha = alpha;
        for (let i = 0; i < block.shape[angle].length; i++) {
            this.drawCell(context,
                     x + (block.shape[angle][i][0] * this.cellSize),
                     y + (block.shape[angle][i][1] * this.cellSize),
                     this.cellSize,
                     type);
        }
        context.restore();
    }
    drawCell(context, cellX, cellY, cellSize, type) {
        let block = this.blocks[type];
        let adjustedX = cellX + 0.5;
        let adjustedY = cellY + 0.5;
        let adjustedSize = cellSize - 1;
        context.fillStyle = block.color;
        context.fillRect(adjustedX, adjustedY, adjustedSize, adjustedSize);
        context.strokeStyle = block.highlight;
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize);
        context.lineTo(adjustedX, adjustedY);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
        context.strokeStyle = block.shadow;
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize);
        context.lineTo(adjustedX + adjustedSize, adjustedY + adjustedSize);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
    }

    draw() {
        this.drawStage();
        if (this.currentBlock != null) {
            let ghostY = this.getGhostBlock(this.blockX, this.blockY, this.currentBlock, this.blockAngle);
            this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                this.stageTopPadding + ghostY * this.cellSize,
                this.currentBlock, this.blockAngle, this.stageCanvas, 0.3);
            this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                this.stageTopPadding + this.blockY * this.cellSize,
                this.currentBlock, this.blockAngle, this.stageCanvas);
        }
    }
    startGame() {
        let virtualStage = new Array(this.stageWidth);
        for (let i = 0; i < this.stageWidth; i++) {
            virtualStage[i] = new Array(this.stageHeight).fill(null);
        }
        this.virtualStage = virtualStage;
        this.currentBlock = null;
        this.nextBlock = this.getRandomBlock();
        this.mainLoop();
    }

    mainLoop() {
        if (this.gameStatus === "S") {
            if (this.currentBlock == null) {
                if (!this.createNewBlock()) {
                    return;
                }
            } else {
                this.fallBlock();
            }
            this.draw();
            this.timeoutId = setTimeout(this.mainLoop.bind(this), this.gameSpeed);
        }
    }

    createNewBlock() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = this.getRandomBlock();
        this.blockX = Math.floor(this.stageWidth / 2 - 2);
        this.blockY = 0;
        this.blockAngle = 0;
        this.drawNextBlock();
        if (!this.checkBlockMove(this.blockX, this.blockY, this.currentBlock, this.blockAngle)) {
            let messageElem = document.getElementById("message");
            messageElem.innerText = "GAME OVER";
            return false;
        }
        return true;
    }

    drawNextBlock() {
        this.clear(this.nextCanvas);
        let block = this.blocks[this.nextBlock];
        let shape = block.shape[0]; 

        let minX = Math.min(...shape.map(cell => cell[0]));
        let maxX = Math.max(...shape.map(cell => cell[0]));
        let minY = Math.min(...shape.map(cell => cell[1]));
        let maxY = Math.max(...shape.map(cell => cell[1]));

        let blockWidth = maxX - minX + 1;
        let blockHeight = maxY - minY + 1;

        let previewCanvasSizeX = this.nextCanvas.width;
        let previewCanvasSizeY = this.nextCanvas.height;

        let startX = ((previewCanvasSizeX - blockWidth * this.cellSize) / 2) - (minX * this.cellSize);
        let startY = ((previewCanvasSizeY - blockHeight * this.cellSize) / 2) - (minY * this.cellSize);


        this.drawBlock(startX, startY, this.nextBlock, 0, this.nextCanvas);
    }

    getRandomBlock() {
        if (this.bag.length === 0) {
            this.createNewBag();
        }
        return this.bag.pop();
    }

    getGhostBlock(x,y,type,angle) {
        while (this.checkBlockMove(x, y + 1, type, angle)) {
            y++;
        }
        return y
    }
    fallBlock() {
        if (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle)) {
            this.blockY++;
        } else {
            this.fixBlock(this.blockX, this.blockY, this.currentBlock, this.blockAngle);
            this.currentBlock = null;
        }
    }

    checkBlockMove(x, y, type, angle) {
        for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
            let cellX = x + this.blocks[type].shape[angle][i][0];
            let cellY = y + this.blocks[type].shape[angle][i][1];
            if (cellX < 0 || cellX > this.stageWidth - 1) {
                return false;
            }
            if (cellY > this.stageHeight - 1) {
                return false;
            }
            if (this.virtualStage[cellX][cellY] != null) {
                return false;
            }
        }
        return true;
    }

    fixBlock(x, y, type, angle) {
        for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
            let cellX = x + this.blocks[type].shape[angle][i][0];
            let cellY = y + this.blocks[type].shape[angle][i][1];
            if (cellY >= 0) {
                this.virtualStage[cellX][cellY] = type;
            }
        }
        for (let y = this.stageHeight - 1; y >= 0; ) {
            let filled = true;
            for (let x = 0; x < this.stageWidth; x++) {
                if (this.virtualStage[x][y] == null) {
                    filled = false;
                    break;
                }
            }
            if (filled) {
                for (let y2 = y; y2 > 0; y2--) {
                    for (let x = 0; x < this.stageWidth; x++) {
                        this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
                    }
                }
                for (let x = 0; x < this.stageWidth; x++) {
                    this.virtualStage[x][0] = null;
                }
                
                let linesElem = document.getElementById("lines");
                this.deletedLines++;
                linesElem.innerText = "" + this.deletedLines;
                
                this.level = 1+parseInt(this.deletedLines/5);
                // this.level = this.deletedLines;
                let levelElem = document.getElementById("level");
                levelElem.innerText = "" + this.level;
                if(this.level <= 20){
                    this.gameSpeed = 1100 - (this.level*50);
                }
                // let speedElem = document.getElementById("spd");
                // speedElem.innerText = "" + this.gameSpeed;
            } else {
                y--;
            }
        }
    }
    drawStage() {
        this.clear(this.stageCanvas);

        let context = this.stageCanvas.getContext("2d");
        for (let x = 0; x < this.virtualStage.length; x++) {
            for (let y = 0; y < this.virtualStage[x].length; y++) {
                if (this.virtualStage[x][y] != null) {
                    this.drawCell(context,
                        this.stageLeftPadding + (x * this.cellSize),
                        this.stageTopPadding + (y * this.cellSize),
                        this.cellSize,
                        this.virtualStage[x][y]);
                }
            }
        }
    }

    moveLeft() {
        if (this.checkBlockMove(this.blockX - 1, this.blockY, this.currentBlock, this.blockAngle)) {
            this.blockX--;
            this.refreshStage();
        }
    }

    moveRight() {
        if (this.checkBlockMove(this.blockX + 1, this.blockY, this.currentBlock, this.blockAngle)) {
            this.blockX++;
            this.refreshStage();
        }
    }

    rotate() {
        let newAngle;
        if (this.blockAngle < 3) {
            newAngle = this.blockAngle + 1;
        } else {
            newAngle = 0;
        }
        if (this.checkBlockMove(this.blockX, this.blockY, this.currentBlock, newAngle)) {
            this.blockAngle = newAngle;
            this.refreshStage();
        }
    }

    fall() {
        while (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle)) {
            this.blockY++;
            this.refreshStage();
        }
    }

    refreshStage() {
        this.clear(this.stageCanvas);
        this.drawStage();
        if (this.currentBlock != null) {
            let ghostY = this.getGhostBlock(this.blockX, this.blockY, this.currentBlock, this.blockAngle);
            this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                           this.stageTopPadding + ghostY * this.cellSize,
                           this.currentBlock, this.blockAngle, this.stageCanvas, 0.3);
        }
        this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                       this.stageTopPadding + this.blockY * this.cellSize,
                       this.currentBlock, this.blockAngle, this.stageCanvas);
    }

    clear(canvas) {
        let context = canvas.getContext("2d");
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    pause(){
        if(this.gameStatus === "S"){
            this.gameStatus = "P";
            clearTimeout(this.timeoutId);
        }else{
            this.gameStatus = "S";
            this.mainLoop();
        }
    }
    reset(){
        clearTimeout(this.timeoutId);
        this.stageWidth = 10;
        this.stageHeight = 20;
        this.stageCanvas = document.getElementById("stage");
        this.nextCanvas = document.getElementById("next");
        let cellWidth = this.stageCanvas.width / this.stageWidth;
        let cellHeight = this.stageCanvas.height / this.stageHeight;
        this.cellSize = cellWidth < cellHeight ? cellWidth : cellHeight;
        this.stageLeftPadding = (this.stageCanvas.width - this.cellSize * this.stageWidth) / 2;
        this.stageTopPadding = (this.stageCanvas.height - this.cellSize * this.stageHeight) / 2;
        this.blocks = this.createBlocks();
        this.deletedLines = 0;
        this.gameSpeed = 1050;
        this.level = 1;
        this.gameStatus = "S";
        document.getElementById("message").innerText = "";
        document.getElementById("lines").innerText = "" + this.deletedLines;
        document.getElementById("level").innerText = "" + this.level;
        this.startGame();
    }
    timerReset() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.mainLoop.bind(this), this.gameSpeed);
    }
}
