document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll("[data-cell]");
  const X_CLASS = "x";
  const CIRCLE_CLASS = "circle";
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const restartButton = document.getElementById("restart-button");
  const statusElement = document.getElementById("status");
  let circleTurn;

  startGame();

  function startGame() {
    circleTurn = false;
    cells.forEach((cell) => {
      cell.innerHTML = ""; // SVG entfernen
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick, { once: true });
    });
    statusElement.textContent = "Spieler X ist am Zug"; // Status aktualisieren
    document.querySelectorAll(".line").forEach((line) => line.remove()); // Entferne vorherige Gewinnlinien
    restartButton.classList.add("hidden"); // Neustart-Button verstecken
  }

  restartButton.addEventListener("click", startGame); // Neustart-Button Click-Event

  function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
      endGame(false); // Spieler gewinnt
    } else if (isDraw()) {
      endGame(true); // Unentschieden
    } else {
      swapTurns();
      statusElement.textContent = `Spieler ${
        circleTurn ? "X" : "O"
      } ist am Zug`; // Status aktualisieren
    }
  }

  function endGame(draw) {
    if (draw) {
      statusElement.textContent = "Unentschieden!";
    } else {
      statusElement.textContent = `Spieler ${circleTurn ? "O" : "X"} gewinnt!`;
      drawWinningLine();
    }
    restartButton.classList.remove("hidden"); // Neustart-Button anzeigen
  }

  function placeMark(cell, currentClass) {
    const svgElement = createSVGElement(currentClass);
    cell.appendChild(svgElement);
    cell.classList.add(currentClass);
  }

  function swapTurns() {
    circleTurn = !circleTurn;
  }

  function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some((combination) => {
      return combination.every((index) => {
        return cells[index].classList.contains(currentClass);
      });
    });
  }

  function isDraw() {
    return [...cells].every((cell) => {
      return (
        cell.classList.contains(X_CLASS) ||
        cell.classList.contains(CIRCLE_CLASS)
      );
    });
  }

  function createSVGElement(currentClass) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    if (currentClass === X_CLASS) {
      const path1 = document.createElementNS(svgNS, "path");
      const path2 = document.createElementNS(svgNS, "path");
      path1.setAttribute("d", "M 10 10 L 90 90");
      path2.setAttribute("d", "M 90 10 L 10 90");
      path1.classList.add("x");
      path2.classList.add("x");
      svg.appendChild(path1);
      svg.appendChild(path2);
    } else if (currentClass === CIRCLE_CLASS) {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", "50");
      circle.setAttribute("cy", "50");
      circle.setAttribute("r", "40");
      circle.classList.add("circle");
      svg.appendChild(circle);
    }

    return svg;
  }

  function drawWinningLine() {
    const winningCombination = WINNING_COMBINATIONS.find((combination) => {
      return combination.every((index) =>
        cells[index].classList.contains(circleTurn ? CIRCLE_CLASS : X_CLASS)
      );
    });

    if (winningCombination) {
      const [a, b, c] = winningCombination;

      const startX =
        cells[a].getBoundingClientRect().left + cells[a].offsetWidth / 2;
      const startY =
        cells[a].getBoundingClientRect().top + cells[a].offsetHeight / 2;
      const endX =
        cells[c].getBoundingClientRect().left + cells[c].offsetWidth / 2;
      const endY =
        cells[c].getBoundingClientRect().top + cells[c].offsetHeight / 2;

      const line = document.createElement("div");
      line.className = "line";
      line.style.backgroundColor = circleTurn ? "blue" : "red";

      const length = Math.hypot(endX - startX, endY - startY);
      const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      line.style.left = `${startX}px`;
      line.style.top = `${startY}px`;

      document.getElementById("game-board").appendChild(line);
    }
  }
});
