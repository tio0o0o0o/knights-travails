const Queue = require("./queue.js");

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.shortedPath = [];
  }
}

class Board {
  constructor(size = 8) {
    this.size = size;
    this.columns = this.#createTiles(size);
  }

  #createTiles(size) {
    const columns = [];

    for (let i = 0; i < size; i++) {
      const column = [];
      for (let ii = 0; ii < size; ii++) {
        column.push(new Tile(i, ii));
      }
      columns.push(column);
    }

    return columns;
  }

  #inBounds(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  #getLegalMoves(tile) {
    const { x, y } = tile;
    const legalMoves = [];

    if (this.#inBounds(x + 2, y + 1))
      legalMoves.push(this.columns[x + 2][y + 1]);
    if (this.#inBounds(x + 2, y - 1))
      legalMoves.push(this.columns[x + 2][y - 1]);
    if (this.#inBounds(x + 1, y + 2))
      legalMoves.push(this.columns[x + 1][y + 2]);
    if (this.#inBounds(x + 1, y - 2))
      legalMoves.push(this.columns[x + 1][y - 2]);
    if (this.#inBounds(x - 1, y + 2))
      legalMoves.push(this.columns[x - 1][y + 2]);
    if (this.#inBounds(x - 1, y - 2))
      legalMoves.push(this.columns[x - 1][y - 2]);
    if (this.#inBounds(x - 2, y + 1))
      legalMoves.push(this.columns[x - 2][y + 1]);
    if (this.#inBounds(x - 2, y - 1))
      legalMoves.push(this.columns[x - 2][y - 1]);

    return legalMoves;
  }

  knightMoves(start, end) {
    const [startX, startY] = start;
    const [endX, endY] = end;

    if (!this.#inBounds(startX, startY)) throw new Error("Start out of bounds");
    if (!this.#inBounds(endX, endY)) throw new Error("End out of bounds");

    const startTile = this.columns[startX][startY];
    const endTile = this.columns[endX][endY];
    const searchQueue = new Queue();
    searchQueue.enqueue(startTile);

    while (searchQueue.peek() !== null) {
      const currentTile = searchQueue.peek();
      searchQueue.dequeue();

      if (currentTile === endTile)
        return [...currentTile.shortedPath, currentTile];

      const legalMoves = this.#getLegalMoves(currentTile);
      legalMoves.forEach((move) => {
        if (move.visited) return;
        searchQueue.enqueue(move);
        move.shortedPath = [...currentTile.shortedPath, currentTile];
      });
      currentTile.visited = true;
    }
  }

  knightMovesPrint(start, end) {
    const path = this.knightMoves(start, end);
    console.log(`You made it in ${path.length - 1} move/s! Here's your path:`);
    path.forEach((tile) => {
      console.log(`[${tile.x}, ${tile.y}]`);
    });
  }
}

const board = new Board();
board.knightMovesPrint([0, 0], [1, 2]);
