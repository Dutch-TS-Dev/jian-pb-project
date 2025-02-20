import readlineSync from "readline-sync";
import figlet from "figlet";
import gradient from "gradient-string";

import chalk from "chalk";
import chalkAnimation from "chalk-animation";

import { setTimeout as waitingTime } from "timers/promises";
console.clear();

const greetWord1 = "Willkommen zu deinem Abenteuer \n";
const greetWord2 =
    "                       in der Welt       \n                  der Haustierpflege       \n               und Abenteuer";

// 问题选项
const petType = [
    "Tiger 🐯 (seine Angriffskraft ist höher)",
    "Affe 🐒 (seine Intelligenz ist höher)",
    "Hase 🐰 (seine Zuneigung ist höher)",
];
let petName = "";
// 初始选择索引
let selectedIndex = 0;
//重新进入主地图的判断
let restart = false;
let goPetMap = false;

function printWelcomeMessage() {
    figlet(greetWord1, { font: "Standard" }, function (err, data1) {
        const rainbowText = chalkAnimation.rainbow(data1);

        setTimeout(() => {
            rainbowText.stop();
            figlet(greetWord2, { font: "Small" }, function (err, data2) {
                const rainbowText1 = chalkAnimation.rainbow(data2);

                setTimeout(() => {
                    rainbowText1.stop();
                    console.clear();
                    printPetSelection();
                }, 3000);
            });
        }, 1000);
    });
}

async function printPetSelection() {
    while (true) {
        console.log(
            `Wähle dein Haustier aus: (Use ${chalk.bold.yellow(
                "u"
            )}(up ⬆️) and ${chalk.bold.yellow(
                "d"
            )}(down ⬇️) to navigate, press ${chalk.bold.blue(
                "Space"
            )} to select), press ${chalk.bold.red("q")} to quit the game)`
        );
        for (let i = 0; i < petType.length; i++) {
            if (i === selectedIndex) {
                console.log("> \x1b[36m" + petType[i] + "\x1b[0m");
            } else {
                console.log("  " + petType[i]);
            }
        }

        const key = readlineSync.keyIn("", {
            hideEchoBack: true,
            mask: "",
            limit: "udq ",
        });
        // 根据按键更新选择索引
        if (key === "u") {
            selectedIndex =
                selectedIndex === 0 ? petType.length - 1 : selectedIndex - 1;
        } else if (key === "d") {
            selectedIndex =
                selectedIndex === petType.length - 1 ? 0 : selectedIndex + 1;
        } else if (key === "q") {
            // Ctrl+C 退出程序
            process.exit();
        } else if (key === " ") {
            // space键表示选定
            break;
        }
        console.clear();
    }
    // 打印最终选择
    console.log("You selected:", petType[selectedIndex]);
    console.log(chalk.bold.greenBright("Kluge Wahl"));
    petName = readlineSync.question("Wie heißt dein Haustier? ");
    //console.log(petName);
    console.log(
        `Bist du bereit? 🥳 ${chalk.bold.blueBright(
            petName
        )}, Wir beginnen ein neues Abenteuer! 🥳`
    );

    await waitingTime(3000);
    console.clear();
    startGame();
}

function startGame() {
    // 初始化游戏并开始
    // const gameInMainMap = new MainMap();
    gameInMainMap.start();
    // myPetCareMode.startPetCareMode();
}

printWelcomeMessage();

let whichPet;

let itemsList = { apples: 0, flours: 0, sugar: 0 };
class MainMap {
    constructor() {
        this.map = [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                         x                                                                 X",
            "X                       x  x                                                                X",
            "X                     x     x                                                               X",
            "X                   x        x                                                              X",
            "X                 x           x                                                             X",
            "X               x              x                                                            X",
            "X              xxxxxxxxxxxxxxxxxx                                                           X",
            "X              x                x                                                           X",
            "X              x                x                                                           X",
            "X              x                x                                                           X",
            "X              x                                                                            X",
            "X              x                                                                            X",
            "X              x                                                                            X",
            "X              xxxxxxxxxxxxxxxxxx                                                           X",
            "X                                                                                           X",
            "X                                                                                           X",
            "X                                                                                           X",
            "X                                                                                           X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ];

        this.playerPosition = { x: 1, y: 1 };
        this.isRunning = true;
        // this.applePositions = [
        //     { x: 20, y: 10 },
        //     { x: 30, y: 11 },
        //     { x: 40, y: 12 },
        // ];
        this.applePositions = []; //随机生成苹果的位置
        this.enemyPosition = []; //随机产生怪兽的位置，暂时只产生3个

        this.generateApples(3); // 生成3个苹果
    }

    generateApples(numApples) {
        for (let i = 0; i < numApples + 3; i++) {
            // 随机生成苹果的 x 和 y 坐标 (x: 52~74; y:5~15)
            const randomX = Math.floor(Math.random() * (74 - 52)) + 52; // 在地图上52到74的数中间随机产生一个x的坐标
            const randomY = Math.floor(Math.random() * (15 - 5)) + 5; // 在地图上5到15的数中间随机产生一个y的坐标
            // // 检查随机生成的位置是否为空地，若不是则重新生成
            // while (this.map[randomY][randomX] !== " ") {
            //     randomX =
            //         Math.floor(Math.random() * (this.map[0].length - 2)) + 1;
            //     randomY = Math.floor(Math.random() * (this.map.length - 2)) + 1;
            // }
            if (i < numApples)
                this.applePositions.push({
                    x: randomX,
                    y: randomY,
                });
            //前面的那些给苹果
            else this.enemyPosition.push({ x: randomX, y: randomY }); //最后的3个给怪兽
        }
        this.getApples(itemsList);
        this.enemyPosition();
    }

    getApples(itemsList) {
        const randomApples = Math.floor(Math.random() * 5) + 1;
        const randomFlours = Math.floor(Math.random() * 3) + 1;
        const randomSugar = Math.floor(Math.random() * 3) + 1;
        // console.log(
        //     `Herzlichen Glückwunsch zu ${randomApples} Äpfeln, ${randomFlours} Mehl und ${randomSugar} Zucker. Möchtest du sie behalten oder wegwerfen?`
        // );
        if (
            this.applePositions.some(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            )
        ) {
            const takeApples = readlineSync.question(
                `Herzlichen Glückwunsch zu ${randomApples} Äpfeln, ${randomFlours} Mehl und ${randomSugar} Zucker. Möchtest du sie behalten oder wegwerfen? (y/n)`
            );

            if (takeApples === "y") {
                itemsList.apples += randomApples;
                itemsList.flours += randomFlours;
                itemsList.sugar += randomSugar;
                console.log(
                    `Du hast jetzt ${itemsList.apples} Äpfel, ${itemsList.flours} Mehl und ${itemsList.sugar} Zucker.`
                );
            } else return;
        }
        if (
            this.enemyPosition.some(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            )
        ) {
            const takeFight = readlineSync.question(
                `Vorsicht, du hast ein Monster getroffen. Möchtest du gegen es kämpfen? (y/n)`
            );

            if (takeFight === "y") {
                //进入战斗画面
                petAdventureMode.petFightStart();
            } else return;
        }

        return itemsList;
    }

    //打印主地图
    printMap() {
        console.clear();
        whichPet = petType[selectedIndex].split(" ")[0]; //??? 为何定义全局时，取不到值
        for (let row of this.map) {
            // 将玩家标记 'M' 替换为 ASCII 艺术, 不同的宠物对应不同的图标
            if (whichPet === "Tiger") row = row.replace("M", "🐯");
            // 这里可以使用任何你喜欢的 ASCII 艺术
            else if (whichPet === "Affe") row = row.replace("M", "🐒");
            else if (whichPet === "Hase") row = row.replace("M", "🐰");
            console.log(row);
        }
        // 打印玩家当前位置坐标
        console.log("player's Position:", this.playerPosition);
        console.log("truesure's Position ", this.applePositions);
    }

    movePlayer(direction) {
        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        switch (direction) {
            case "w":
                newY--;
                break;
            case "s":
                newY++;
                break;
            case "a":
                newX--;
                break;
            case "d":
                newX++;
                break;
            default:
                break;
        }

        if (this.map[newY][newX] === " ") {
            this.map[this.playerPosition.y] =
                this.map[this.playerPosition.y].slice(
                    0,
                    this.playerPosition.x
                ) +
                " " +
                this.map[this.playerPosition.y].slice(
                    this.playerPosition.x + 1
                );
            this.playerPosition.x = newX;
            this.playerPosition.y = newY;
            this.map[this.playerPosition.y] =
                this.map[this.playerPosition.y].slice(
                    0,
                    this.playerPosition.x
                ) +
                "M" +
                this.map[this.playerPosition.y].slice(
                    this.playerPosition.x + 1
                );
        }
    }

    start() {
        // let flag = true;
        let move;
        this.generateApples(3);
        if (restart === true) this.isRunning = true;
        while (this.isRunning) {
            console.log(this.isRunning);
            if (!this.isRunning) break;
            this.printMap();

            // at home
            if (
                this.playerPosition.x >= 16 &&
                this.playerPosition.x <= 30 &&
                this.playerPosition.y >= 8 &&
                this.playerPosition.y <= 13
            ) {
                this.isAtHome = true;
                console.log("Zuhause 🏠, schönes Zuhause 🏡 !");
                move = readlineSync.keyIn(
                    "Use W/A/S/D to move (or H to hoursMap or Q to quit ): ",
                    { limit: "wasdqh" }
                );
            } else {
                move = readlineSync.keyIn(
                    "Use W/A/S/D to move (or Q to quit): ",
                    { limit: "wasdq" }
                );
            }

            //询问是否进入宠物养成系统
            if (move.toLowerCase() === "h") {
                const isPetCare = readlineSync.question(
                    "Do you want to play with your Pet (y/n)? "
                );
                if (isPetCare === "y") {
                    this.isRunning = false;
                    goPetMap = true;
                    myPetCareMode.startPetCareMode();
                }
            }

            // if (
            //     this.applePositions.some(
            //         (item) =>
            //             item.x === this.playerPosition.x &&
            //             item.y === this.playerPosition.y
            //     )
            // ) {
            //     this.getApples(itemsList);
            //     console.log(itemsList);
            // }

            if (move.toLowerCase() === "q") {
                this.isRunning = false;
                console.log("Game over. Thanks for playing!");
                break;
            }

            this.movePlayer(move.toLowerCase());
        }
    }
}
const gameInMainMap = new MainMap();

//删除了part2-....-care0705 的宠物养成系统 到最后
