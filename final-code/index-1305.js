import readlineSync from "readline-sync";
import figlet from "figlet";
import gradient from "gradient-string";

import chalk from "chalk";
import chalkAnimation from "chalk-animation";

import { createSpinner } from "nanospinner";
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

let whichPet;
let maxPetHP;
let maxEnemyHP;
// 初始选择索引
let selectedIndex = 0;
//重新进入主地图的判断
let restart = false;
//重新进入宠物家庭地图的判断
let goPetMap = false;
//重新进入宠物战斗系统地图的判断
let goToFight = false;

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
    const input = readlineSync.question("Wie heißt dein Haustier? ");
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
    gameInMainMap.start();
}
printWelcomeMessage();

let itemsList = { apples: 0, flours: 0, sugar: 0 };

class MainMap {
    constructor(petName) {

        this.petName = "";
        
        this.map = [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                                                              🎄                           X",
            "X                       🌻                                    🎄  🎄                        X",
            "X                     🌻  🌻                                 🎄   🎄🎄🎄                    X",
            "X                   🌻      🌻                       🎄🎄🎄🎄🎄          🎄🎄🎄              X",
            "X                 🌻          🌻                     🎄                        🎄             X",
            "X               🌻             🌻                🎄 🎄                         🎄             X",
            "X              🌻🌻🌻🌻🌻🌻🌻🌻🌻                 🎄                        🎄               X",
            "X             🌻                🌻               🎄                       🎄                  X",
            "X             🌻                🌻              🎄                     🎄                     X",
            "X             🌻                🌻                                   🎄                       X",
            "X             🌻                                                      🎄                     X",
            "X             🌻                                 🎄🎄🎄                 🎄🎄                  X",
            "X             🌻                                      🎄                   🎄                X",
            "X             🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻                 🎄                      🎄               X",
            "X                                                 🎄                      🎄                 X",
            "X                                                🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄                  X",
            "X                                                                                            X",
            "X                                                                                            X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ];
        this.playerPosition = { x: 1, y: 1 };
        this.isRunning = true;
        this.isAtHome = false;
        this.isAdventureMap = false;

        this.applePositions = []; //随机生成苹果的位置
        this.enemyPosition = []; //随机产生怪兽的位置，暂时只产生3个
    }

    generateApples(numApples) {

        const arr = new Array(numApples + 3).fill('').forEach(
                (_,i) => {
                    // 随机生成苹果的 x 和 y 坐标 (x: 52~74; y:5~15)
                   const newCoordinates = {
                        x: Math.floor(Math.random() * (74 - 52)) + 52; // 在地图上52到74的数中间随机产生一个x的坐标,
                        y: Math.floor(Math.random() * (15 - 5)) + 5; // 在地图上5到15的数中间随机产生一个y的坐标,
                    };
        
                    // this.applePositions = i < numApples ? [...this.applePositions, newCoordinates], this.applePositions;

                    // this.enemyPosition 
        
                    //前面的那些给苹果
                    if (i < numApples) {
                        this.applePositions.push(newCoordinates);
                    }
                    else {
                        this.enemyPosition.push(newCoordinates); 
                    } // 最后的3个给怪兽

                    // oscar
                    if (i < numApples) {
                        return this.applePositions.push(newCoordinates);
                    }
                    return this.enemyPosition.push(newCoordinates); 

                }
        );

        for (let i = 0; i < numApples + 3; i++) {
            // 随机生成苹果的 x 和 y 坐标 (x: 52~74; y:5~15)
            const randomX = Math.floor(Math.random() * (74 - 52)) + 52; // 在地图上52到74的数中间随机产生一个x的坐标
            const randomY = Math.floor(Math.random() * (15 - 5)) + 5; // 在地图上5到15的数中间随机产生一个y的坐标

            //前面的那些给苹果
            if (i < numApples) {
                this.applePositions.push({
                    x: randomX,
                    y: randomY,
                });}
            else {
                this.enemyPosition.push({ x: randomX, y: randomY }); 
            }//最后的3个给怪兽
        }
    }

    getApplesAndEnemies(itemsList) {
        const randomApples = Math.floor(Math.random() * 5) + 1;
        const randomFlours = Math.floor(Math.random() * 3) + 1;
        const randomSugar = Math.floor(Math.random() * 3) + 1;

        if (
            this.applePositions.some(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            )
        ) {
            const applePositionIndex = this.applePositions.findIndex(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            );

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
                //捡完苹果后删除
                this.applePositions.splice(applePositionIndex, 1);
                // console.log(this.applePositions);
                // readlineSync.keyInPause("this.applePositions");
            } else return;
        } else if (
            this.enemyPosition.some(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            )
        ) {
            const enemyPositionIndex = this.enemyPosition.findIndex(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            );

            const fightEnemy = readlineSync.question(
                `Vorsicht, du hast ein Monster getroffen. Möchtest du gegen es kämpfen? (y/n)`
            );

            if (fightEnemy === "y") {
                //进入战斗画面
                goToFight = true;
                this.enemyPosition.splice(enemyPositionIndex, 1);
                myPetCareMode.petFightStart();
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
        console.log("enemy's Position ", this.enemyPosition);
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
        if (restart === true) this.isRunning = true;
        this.generateApples(myPetCareMode.affinity);
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
                    "Use W/A/S/D to move (or H to houseMap or Q to quit ): ",
                    // "Use W/A/S/D to move ( or Q to quit ): ",
                    { limit: "wasdqh" }
                );
            } else if (
                // in Adventure map
                this.playerPosition.x >= 50 &&
                this.playerPosition.x <= 76 &&
                this.playerPosition.y >= 5 &&
                this.playerPosition.y <= 15
            ) {
                this.isAdventureMap = true;
                console.log(
                    "Beachte, du bist jetzt auf der Abenteuerkarte. Hier kannst du Glück haben und Schätze 🍎 finden, aber natürlich auch Gefahren 🗡️ begegnen.!"
                );

                //添加随机遇到苹果和怪兽
                this.getApplesAndEnemies(itemsList);

                // 下面的这行代码必须要在，不然会出现代码乱跳的琴况
                move = readlineSync.keyIn(
                    "Use W/A/S/D to move ( or Q to quit ): ",
                    { limit: "wasdq" }
                );
            } else {
                this.isAtHome = false;
                this.isAdventureMap = false;
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
                    // myPetCareMode.name = petName;
                    // myPetCareMode.type = whichPet;
                    myPetCareMode.startPetCareMode();
                }
            }

            if (move.toLowerCase() === "q") {
                this.isRunning = false;
                console.log("Game over. Thanks for playing!");
                process.exit();
                // break;
            }

            this.movePlayer(move.toLowerCase());
        }
    }
}
const gameInMainMap = new MainMap();

//------- 宠物养成系统 和战斗系统------------
let applePie = 0;
// const itemsList = { apple: 10, flour: 10, sugar: 10 };
const WeaponsList = [
    { weaponName: "Stab des Feuers", weaponAttack: 15 },
    { weaponName: "Donnerstab", weaponAttack: 18 },
    { weaponName: "Engelstab", weaponAttack: 16 },
    { weaponName: "Dunkelheitsstab", weaponAttack: 25 },
    { weaponName: "Drachenstab", weaponAttack: 22 },
    { weaponName: "Weisenstab", weaponAttack: 20 },
];
let isFight;
let randomEnemy;
let enemyType = "";
let enemyRandom;
let canCook;
class Pet {
    constructor(
        name = petName,
        type = whichPet,
        full = 5,
        affinity = 5,
        IQ = 5,
        HP = 80,
        attack = 20,
        weaponName = "",
        weaponAttack = 0
    ) {
        this.name = name;
        this.type = type;
        this.full = full;
        this.affinity = affinity;
        this.IQ = IQ;
        this.HP = HP;

        this.attack = attack;
        this.weapons = {
            weaponName: weaponName,
            weaponAttack: weaponAttack,
        };
        this.isFighting = true;

        this.isPlaying = true;
    }

    addAffinity(value) {
        if (whichPet === "Tiger")
            this.affinity = Math.min(this.affinity + value, 10);
        if (whichPet === "Affe")
            this.affinity = Math.min(this.affinity + value, 12);
        if (whichPet === "Hase")
            this.affinity = Math.min(this.affinity + value, 16);
    }

    reduceAffinity(value) {
        this.affinity = Math.max(this.affinity - value, 0);
    }

    addFull(value) {
        this.full = Math.min(this.full + value, 10);
    }

    reduceFull(value) {
        this.full = Math.max(this.full - value, 0);
    }

    addIQ(value) {
        if (whichPet === "Tiger") this.IQ = Math.min(this.IQ + value, 10);
        if (whichPet === "Affe") this.IQ = Math.min(this.IQ + value, 16);
        if (whichPet === "Hase") this.IQ = Math.min(this.IQ + value, 12);
    }

    reduceIQ(value) {
        this.IQ = Math.max(this.IQ - value, 0);
    }

    addHP(value) {
        if (whichPet === "Tiger") this.HP = Math.min(this.HP + value, 160);
        if (whichPet === "Affe") this.HP = Math.min(this.HP + value, 120);
        if (whichPet === "Hase") this.HP = Math.min(this.HP + value, 100);
    }

    //foodStock() {}

    feed() {
        while (true) {
            // console.log(this.full);
            if (this.full === 10) {
                // console.log(`I am full. I want to go to adventure`); // 显示不出来????
                const getMessage = readlineSync.keyIn(
                    "Ich bin satt. Ich möchte auf Abenteuer gehen. Oder wir können andere Dinge tun. Verwende Leerzeichen, um zurückzugehen!",
                    { limit: " " }
                );
                if (getMessage === " ") return;
            }

            if (applePie && itemsList.apples) {
                const foods = readlineSync.question(
                    `Möchtest du einen Apfel essen oder einen Apfelkuchen? 1. Apfel ; 2. Apfelkuchen `
                );
                if (foods === "1") {
                    this.addFull(2);
                    this.addAffinity(3);
                    itemsList.apples--;
                    readlineSync.keyInPause(
                        `Du hast einen Apfel gegessen.dein Full-Eigenschaft erhöhte sich um 2, deine Affinität-Eigenschaft erhöhte sich ebenfalls um 3.`
                    );
                }
                if (foods === "2") {
                    this.addFull(5);
                    this.addAffinity(5);
                    applePie--;
                    readlineSync.keyInPause(
                        `Du hast einen Apfelkuchen gegessen.dein Full-Eigenschaft erhöhte sich um 5, deine Affinität-Eigenschaft erhöhte sich ebenfalls um 5.`
                    );
                }
            } else if (applePie && !itemsList.apples) {
                this.addFull(5);
                this.addAffinity(5);
                applePie--;
                readlineSync.keyInPause(
                    `Wir haben keine Äpfel, aber wir haben Apfelkuchen. Du kannst den Apfelkuchen essen.`
                );
                readlineSync.keyInPause(
                    `Du hast einen Apfelkuchen gegessen.dein Full-Eigenschaft erhöhte sich um 5, deine Affinität-Eigenschaft erhöhte sich ebenfalls um 5.`
                );
            } else if (!applePie && itemsList.apples) {
                const makeFood = readlineSync.question(
                    `Wir haben keine Apfelkuchen mehr, aber wir haben noch Äpfel. Möchtest du einen Apfelkuchen backen oder lieber Äpfel essen? (y für Apfelkuchen backen/ e für Äpfel essen): `
                );
                if (makeFood.toLowerCase() === "y") {
                    do {
                        this.cook(itemsList);
                        if (canCook) {
                            const cookApplepie = readlineSync.keyIn(
                                `Apfelkuchen + 1, Wir haben jetzt ${applePie} Apfelkuchen. Möchtest du weitermachen? (y/n)`,
                                { limit: "yn" }
                            );
                            if (cookApplepie === "n") break;
                        } else {
                            readlineSync.keyInPause(
                                "Wir haben nicht genug Rohstoffe Apfelkuchen zu backen."
                            );
                            break;
                        }
                    } while (canCook);
                }
                if (makeFood.toLowerCase() === "e") {
                    this.addFull(2);
                    this.addAffinity(3);
                    itemsList.apples--;
                    readlineSync.keyInPause(
                        `Du hast einen Apfel gegessen.dein Full-Eigenschaft erhöhte sich um 2, deine Affinität-Eigenschaft erhöhte sich ebenfalls um 3.`
                    );
                }
            } else if (!applePie && !itemsList.apples)
                readlineSync.keyInPause(
                    `Wir haben nicht genügend Äpfel und Apfelkuchen. Du musst rausgehen und sie pflücken.`
                );
            return;
        }
    }

    cook(itemsList) {
        if (
            itemsList.apples >= 2 &&
            itemsList.flours >= 1 &&
            itemsList.sugar >= 1
        ) {
            applePie++;
            itemsList.apples -= 2;
            itemsList.flours--;
            itemsList.sugar--;

            canCook = true;

            // console.log(
            //     `Apfelkuchen + 1, Wir haben jetzt ${applePie} Apfelkuchen.`
            // );
        } else {
            canCook = false;
            console.log(
                `Wir haben nicht genug Rohstoffe, du musst rausgehen und sie pflücken.`
            );
            return;
        }
        return canCook;
    }
    // play() {
    //     if (this.full > 8) return `${this.name} ist zu hungrig zum spielen`;
    //     this.addAffinity(2);
    //     this.addFull(3);

    //    // return `${this.name} hat gespielt!`;
    // }
    healed() {
        readlineSync.keyInPause(`Deine aktuelle HP ist ${this.HP}`);
        this.addHP(200);

        // console.log(`${attacker.playerName} increase his 5 healthPoints `);
        readlineSync.keyInPause(
            `Nach der Behandlung ist deine HP ist ${this.HP}, bereits auf dem Maximalwert.`
        );
    }

    randomNumForQuiz(randomNumArr) {
        while (randomNumArr.length < 4) {
            let randomNum = Math.floor(Math.random() * 10);
            if (!randomNumArr.includes(randomNum)) randomNumArr.push(randomNum);
        }
        console.log(
            `Lasst uns jetzt 'Bulls and Cows game' spielen. \n${chalk.bold.bgYellow(
                "Regeln"
            )}: 1. Die Geheimzahl muss aus 4 Ziffern bestehen und jede Ziffer muss einzigartig sein.\n2. Wenn die Ziffern übereinstimmen und sich an der richtigen Stelle befinden, werden sie als "🐃" gezählt. \n3. Wenn sie sich an unterschiedlichen Positionen befinden, werden sie als "🐄" gezählt. \n4. Wenn die Ziffern nicht richtig sind, werden sie als "😿" gezählt.`
        );
        return randomNumArr;
    }
    quiz() {
        //bulls and cows game
        let randomNumArr = [];
        this.randomNumForQuiz(randomNumArr);
        let round = 1;
        console.log(`(${randomNumArr})`); //显示结果，为了尽快的显示
        while (true) {
            let result = [];
            const guess = readlineSync.question(
                "Gib mir eine nicht wiederholende Vier aus den Zahlen 0 bis 9 (q for quit): "
            );
            if (guess === "q") break;
            console.log("deine zahle ist: ", guess);
            console.log("Round ", round);
            // console.log(randomNumArr);
            for (let i = 0; i < randomNumArr.length; i++) {
                if (randomNumArr[i] === +guess.split("")[i]) result[i] = "🐃";
                else if (randomNumArr.includes(+guess.split("")[i]))
                    result[i] = "🐄";
                else result[i] = "😿";
            }

            if (!result.every((e) => e === "🐃"))
                console.log(
                    `Round${round}, your answer is ${result}, not collect, continue... `
                );
            if (result.every((e) => e === "🐃")) {
                if (round <= 3) {
                    this.addIQ(10);
                    this.addAffinity(5);
                    console.log(
                        `🎆 Wow,${chalk.blue(
                            petName
                        )}, du bist wirklich großartig! Du hast es nur in ${round} Versuchen geschafft 🥇❗❗❗ 🎆\nDein IQ-Egenschaft erhöhte sich um 10, deine Affinität-Egenschaft erhöhte sich ebenfalls um 5.`
                    );
                }
                if (round > 3 && round < 7) {
                    this.addIQ(6);
                    this.addAffinity(3);
                    console.log(
                        `${chalk.blue(
                            petName
                        )}, Du bist sehr gut, du hast es nur in ${round} Versuchen geschafft. Beim nächsten Mal wird es noch besser sein 🥈❗\nDein IQ-Egenschaft erhöhte sich um 6, deine Affinität-Egenschaft erhöhte sich ebenfalls um 3. `
                    );
                }
                if (round >= 7) {
                    this.addIQ(3);
                    this.addAffinity(1);
                    console.log(
                        `Herzlichen Glückwunsch,${chalk.blue(
                            petName
                        )}, du hast es im ${round}ten Versuch geschafft. \nDein IQ-Egenschaft erhöhte sich um 3, deine Affinität-Egenschaft erhöhte sich ebenfalls um 1.`
                    );
                }
                // round = 1;
                // this.playAgain(randomNumArr);
                const playAgain = readlineSync.question(
                    "Do you want to play again? (y/n) "
                );
                if (playAgain === "y") {
                    console.clear();
                    petMaps.printPetMap();
                    randomNumArr = [];
                    this.randomNumForQuiz(randomNumArr);
                    round = 0;
                }
                if (playAgain === "n") break;
                //  break;
            } else {
                if (round >= 7 && round < 10)
                    console.log(
                        `Viel Glück, ${chalk.blue(
                            petName
                        )}, du hast noch ⏲️ ${chalk.yellow(
                            10 - round
                        )} Versuche.`
                    );
                if (round === 10) {
                    this.reduceIQ(3);
                    this.reduceAffinity(3);
                    console.log(
                        ` 😅 ,${chalk.blue(
                            petName
                        )}, Spiel vorbei, du hast verloren. Ich wünsche Ihnen einen schönen Tag. Willkommen zur nächsten Herausforderung. \nLeide dein IQ-Egenschaft wurde um 3 reduziert, deine Affinität-Egenschaft wurde um 3 reduziert.`
                    );
                    // round = 1;
                    // this.playAgain(randomNumArr);
                    const playAgain = readlineSync.question(
                        "Do you want to play again? (y/n) "
                    );
                    if (playAgain === "y") {
                        console.clear();
                        petMaps.printPetMap();
                        randomNumArr = [];
                        this.randomNumForQuiz(randomNumArr);
                        round = 0;
                    }
                    if (playAgain === "n") break;
                }
            }
            round++;
        }
    }

    startPetCareMode() {
        let petCareModes;
        myPetCareMode.name = petName;
        myPetCareMode.type = whichPet;
        if (goPetMap === true) this.isPlaying = true;
        while (this.isPlaying) {
            petMaps.printPetMap();

            petCareModes = readlineSync.keyIn(
                "Use 1/2/3/4 to choose (or b to mainMap or Q to quit ): ",
                { limit: "1234bq" }
            );

            switch (petCareModes) {
                case "1":
                    this.feed();
                    break;
                case "2":
                    this.play();
                    break;
                case "3":
                    this.quiz();
                    break;
                case "4":
                    this.healed();
                    break;
                case "q":
                    this.isPlaying = false;
                    console.log("Game over. Thanks for playing!");
                    process.exit();
                // break;
                case "b":
                    this.isPlaying = false;
                    restart = true; // go back to main map
                    gameInMainMap.start();
                    break;
                default:
                    break;
            }
        }
    }

    //pet Adeventure
    fightOrGoHome(enemy) {
        if (this.HP > 50) {
            if (this.IQ > 15) {
                isFight = readlineSync.keyIn(
                    `Die HP des Feindes sind ${enemy.HP}, die Angriffskraft ist ${enemy.attack}; Deine HP sind ${this.HP}, deine Angriffskraft ist ${this.attack}, Die Angriffskraft deiner Waffe (${this.weapons.weaponName}) beträgt ${this.weapons.weaponAttack} Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                    { limit: "khe" }
                );
            } else {
                if (enemy.HP > this.HP && enemy.attack > this.attack) {
                    isFight = readlineSync.keyIn(
                        `Gefahr, du könntest wahrscheinlich umkommen. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                        { limit: "khe" }
                    );
                } else {
                    isFight = readlineSync.keyIn(
                        `Du hast möglicherweise die Möglichkeit, deinen Feind zu besiegen. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                        { limit: "khe" }
                    );
                }
            }
        } else if (this.HP === 0) {
            this.isFighting = false;
            goPetMap = true;
            readlineSync.keyInPause(
                `your HP is ${this.HP} now, you must be go home to heal. press any key to continue`
            );
            myPetCareMode.startPetCareMode();
        } else {
            isFight = readlineSync.keyIn(
                `Deine Lebenspunkte sind zu niedrig. Es besteht die Möglichkeit, dass du im Kampf sterben wirst. Es wird empfohlen, zunächst nach Hause zu gehen und dich zu heilen. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                { limit: "khe" }
            );
        }
        if (isFight === "k") {
            console.log(
                `Deine Basisangriffskraft beträgt ${
                    myPetCareMode.attack
                }, du benutzt die Waffe ${
                    myPetCareMode.weapons.weaponName
                }, welche eine Angriffskraft von ${
                    myPetCareMode.weapons.weaponAttack
                } hat. Also beträgt deine Gesamtangriffskraft ${
                    myPetCareMode.attack + myPetCareMode.weapons.weaponAttack
                }.`
            );

            this.fight(enemiesList[randomEnemy]);
        }
        if (isFight === "h") {
            goPetMap = true;
            // console.log(goPetMap);
            // readlineSync.keyInPause("press any key to continue");
            myPetCareMode.startPetCareMode();
        }
        if (isFight === "e") {
            gameInMainMap.start();
        }
    }

    fight(enemy) {
        while (true) {
            enemy.HP = enemy.HP - (this.attack + this.weapons.weaponAttack);
            enemy.HP <= 0 ? (enemy.HP = 0) : enemy.HP;

            readlineSync.keyInPause(
                `${petName} fight ${enemy.name}(enemy's HP is ${enemy.HP}), press any key to continue`
            );
            this.HP = this.HP - enemy.attack;
            this.HP <= 0 ? (this.HP = 0) : this.HP;
            readlineSync.keyInPause(
                `${enemy.name} fight ${petName}(your HP is ${this.HP}), press any key to continue`
            );
            // console.log(
            //     `${this.playerName} fight ${enemy.playerName}(${enemy.HP})`
            // );
            petMaps.printPetFightMap(); //每次HP变化时都要更新地图

            if (enemy.HP <= 0) {
                //怪兽血为零恢复满血，为下次作准备
                enemy.HP = maxEnemyHP;
                this.addAffinity(5);
                this.reduceFull(5);
                this.getWeapons(enemiesList[randomEnemy]);
            }
            if (this.HP <= 0) {
                this.isFighting = false;
                goPetMap = true;
                this.reduceAffinity(5);
                this.reduceFull(5);
                readlineSync.keyInPause(
                    `Deine HP beträgt jetzt ${this.HP}, du musst nach Hause gehen, um dich zu heilen. Drücke eine beliebige Taste, um fortzufahren.`
                );
                myPetCareMode.startPetCareMode();
                break;
            }
        }
    }

    getWeapons(enemy) {
        const randomWeaponIndex = Math.floor(
            Math.random() * WeaponsList.length
        );

        const equipWeapon = readlineSync.question(
            `Du hast ${WeaponsList[randomWeaponIndex].weaponName} erhalten, Angriffskraft ist ${WeaponsList[randomWeaponIndex].weaponAttack}; Dein aktuelles ist ${this.weapons.weaponName}, Angriffskraft ist ${this.weapons.weaponAttack}. Möchtest du es ersetzen? (y/n)`
        );
        if (equipWeapon === "y") {
            this.weapons.weaponName = WeaponsList[randomWeaponIndex].weaponName;
            this.weapons.weaponAttack =
                WeaponsList[randomWeaponIndex].weaponAttack;
        }
        isFight = readlineSync.keyIn(
            `Du hast ${enemy.name} besiegt. Möchtest du nach Hause gehen oder weiter erkunden? (h for nach Hause gehen und e for weiter erkunden)`,
            { limit: "he" }
        );
        if (isFight === "h") {
            goPetMap = true;
            // console.log(goPetMap);
            // readlineSync.keyInPause("press any key to continue");
            myPetCareMode.startPetCareMode();
        }
        if (isFight === "e") {
            gameInMainMap.start();
        }
    }

    //进入宠物战斗系统
    petFightStart() {
        console.clear();
        maxPetHP = myPetCareMode.HP;

        if (goToFight === true) this.isFighting = true;
        while (this.isFighting) {
            randomEnemy = Math.floor(Math.random() * enemiesList.length);
            enemyType = enemiesList[randomEnemy].type;
            enemyRandom = enemiesList[randomEnemy];
            maxEnemyHP = enemiesList[randomEnemy].HP;
            petMaps.printPetFightMap();
            // console.log(enemiesList[randomEnemy]);
            this.fightOrGoHome(enemiesList[randomEnemy]);
        }
    }
}
const myPetCareMode = new Pet();

//怪兽战斗模式初始化
class Enemies {
    constructor(name, type, HP, attack) {
        this.name = name;
        this.type = type;
        this.HP = HP;
        this.attack = attack;
    }
}

const goldEagle = new Enemies("Adlersturz", "Eagle", 120, 20);
const zuBat = new Enemies("Nachtjäger", "Bat", 100, 10);
const wolfsRuf = new Enemies("Einsamer Wolf", "Wolf", 140, 30);
const enemiesList = [goldEagle, zuBat, wolfsRuf];

//所有图片，宠物在家的模式和宠物战斗的模式
class AllPetMaps {
    constructor() {
        this.mapTiger = [
            "================================= 💓💓💓 ===============================",
            "                                                                        ",
            `     __  _-==-=_,-.                                                     `,
            "     /--`'\\_@-@.--<                                                    ",
            "     `--'\\ \\   <___/.                  ------- myName: -------         ",
            `           \\ \\\   " /                  | full: ${myPetCareMode.full}`,
            `            >=\\_/'<                    | IQ: ${myPetCareMode.IQ}        `,
            `           /= | \\_|/                   | affinity: ${myPetCareMode.affinity}`,
            `          /===\\____/                   | HP: ${myPetCareMode.HP}       `,
            `                                        ----------------------          `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `  1. feeding    2. playing (coming soon)   3. quiz   4. to heal         `,
            ` (you can chose 1, 2, 3 or 4, to play with your pet;)                   `,
            ` (press "q" to quit the game, press "b" to go back to main map)         `,
            "================================ 💓💓💓 ================================",
        ];

        this.mapManky = [
            "================================= 💓💓💓 ===============================",
            "                                                                        ",
            `             __,__                                                       `,
            `    .--.  .-"     "-.  .--.                                              `,
            `   /.. ./  .-. .-. .'/ ..  )             ------- myName: -------         `,
            `  || '  |  /   Y     |   ' ||            | full: ${myPetCareMode.full}`,
            `  ||     )   0 | 0   (     ||            | IQ: ${myPetCareMode.IQ}    `,
            `   ('-  ).-" '''' "-./, -' /             | affinity: ${myPetCareMode.affinity}`,
            `    '._. (_   ^ ^   _ ) ._.'             | HP: ${myPetCareMode.HP}      `,
            `        |  (._   _.)  |                  ----------------------           `,
            "        `.  ( '~' )   /                                                  ",
            `         '._ '-=-' _.'                                                   `,
            `            '~---~'                                                      `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `  1. feeding   2. playing (coming soon)   3. quiz   4. to heal          `,
            ` (you can chose 1, 2, 3 or 4, to play with your pet;)                   `,
            ` (press "q" to quit the game, press "b" to go back to main map)         `,
            "================================ 💓💓💓 ================================",
        ];
        this.mapRabbit = [
            "================================= 💓💓💓 ===============================",
            "                                                                        ",
            `     ***                                                                `,
            `     ** **                                                              `,
            `    **   **                             ------- myName: -------  `,
            `    **   **         ****                | full: ${myPetCareMode.full} `,
            `    **   **       **   ****             | IQ: ${myPetCareMode.IQ}      `,
            `    **  **       *   **   **            | affinity: ${myPetCareMode.affinity} `,
            `     **  *      *  **  ***  **          | HP: ${myPetCareMode.HP}     `,
            `       **  *    *  **     **  *          ----------------------         `,
            "        ** **  ** **        **                                          ",
            `        **   **  **                                                     `,
            `       *           *                                                    `,
            `      *             *                                                   `,
            `     *    0     0    *                                                  `,
            `     *   /   @   \\   *                                                 `,
            `     *   \\__/ \\__/   *                                                `,
            `       *     W     *                                                    `,
            `         **     **                                                      `,
            `           *****                                                        `,
            `                                                                        `,
            `                                                                        `,
            `  1. feeding    2. playing (coming soon)   3. quiz   4. to heal         `,
            ` (you can chose 1, 2, 3 or 4, to play with your pet;)                   `,
            ` (press "q" to quit the game, press "b" to go back to main map)         `,
            "================================ 💓💓💓 ================================",
        ];
        this.mapTigerFight = [
            "🐯================== 💓🐯💓 =================🐯",
            `🛡️                                           🗡️`,
            `🗡️                                           🛡️`,
            `🛡️                                           🗡️`,
            `🗡️                                           🛡️`,
            `🛡️                                           🗡️`,
            `🗡️           __  _-==-=_,-.                  🛡️`,
            "🛡️          /--`'\\_@-@.--<                   🗡️",
            "🗡️          `--'\\ \\   <___/.                 🛡️",
            `🛡️                \\ \\\   " /                  🗡️`,
            "🗡️                 >=\\_/`<                   🛡️",
            `🛡️                /= | \\_|/                  🗡️`,
            `🗡️               /===\\____/                  🛡️`,
            `🛡️                                           🗡️`,
            "🗡️                                           🛡️",
            `🛡️                                           🗡️`,
            `🗡️                                           🛡️`,
            `🛡️                                           🗡️`,
            `🗡️                                           🛡️`,
            `     HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷                  `,
            `🗡️                                           🛡️`,
            `🛡️                                           🗡️`,
            `🗡️                                           🛡️`,
            "🐯================== 💓🐯💓 ==================🐯",
        ];
        this.mapMankyFight = [
            "🐵=============== 💓🐵💓 ===============🐵",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                 __,__                🛡️`,
            `🛡️        .--.  .-"     "-.  .--.       🗡️`,
            `🗡️       /.. ./  .-. .-. .'/ ..  )      🛡️`,
            `🛡️      || '  |  /   Y     |   ' ||     🗡️`,
            `🗡️      ||     )   0 | 0   (     ||     🛡️`,
            `🛡️       ('-  ).-" '''' "-./, -' /      🗡️`,
            `🗡️        '._. (_   ^ ^   _ ) ._.'      🛡️`,
            `🛡️            |  (._   _.)  |           🗡️`,
            "🗡️            `.  ( '~' )   /           🛡️",
            `🛡️             '._ '-=-' _.'            🗡️`,
            `🗡️                '~---~'               🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷           `,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            "🐵=============== 💓🐵💓 ===============🐵",
        ];
        this.mapRabbitFight = [
            "🐰=============== 💓🐰💓 ===============🐰",
            `🛡️      ***                             🗡️`,
            `🗡️      ** **                           🛡️`,
            `🛡️     **   **                          🗡️`,
            `🗡️     **   **         ****             🛡️`,
            `🛡️     **   **       **   ****          🗡️`,
            `🗡️     **  **       *   **   **         🛡️`,
            `🛡️      **  *      *  **  ***  **       🗡️`,
            `🗡️        **  *    *  **     **  *      🛡️`,
            "🛡️         ** **  ** **        **       🗡️",
            `🗡️         **   **  **                  🛡️`,
            `🛡️        *           *                 🗡️`,
            `🗡️       *             *                🛡️`,
            `🛡️      *    0     0    *               🗡️`,
            `🗡️      *   /   @   \\   *              🛡️`,
            `🛡️      *   \\__/ \\__/   *             🗡️`,
            `🗡️        *     W     *                 🛡️`,
            `🛡️          **     **                   🗡️`,
            `🗡️            *****                     🛡️`,
            `       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷           `,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            "🐰=============== 💓🐰💓 ===============🐰",
        ];
        this.mapEagleFight = [
            "🦅=============== 💓🦅💓 ===============🦅",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️            .------._                 🗡️`,
            '🗡️      .-"""`-.<´)    `-._             🛡️',
            `🛡️     (.--. _   '._'---.__.-'          🗡️`,
            `🗡️      '';'-.-'         '-    ._       🛡️`,
            `🛡️        .--'''  '._      - '   .      🗡️`,
            "🗡️         `''''-.    `---'             🛡️",
            "🛡️                  `\\                 🗡️",
            "🗡️                  `\\      .'         🛡️",
            "🛡️                  `'. '               🗡️",
            "🗡️                    `'.               🛡️",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷           `,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            "🦅=============== 💓🦅💓 ===============🦅",
        ];
        this.mapBatFight = [
            "🦇================ 💓🦇💓 ================🦇",
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️              /'.    .'\\                🗡️`,
            `🗡️              \\(\\__/ )/                 🛡️`,
            `🛡️         ___   / (.)(.)\\   ___          🗡️`,
            '🗡️    _.-"`_  `-.|  ____  |.-`  _`"-._    🛡️',
            "🛡️  .-'.-'//||`'-.  V--V  /.-'`||\\'-.'-.  🗡️",
            "🗡️`'-'-.// ||    / .___.      || \\.-'-'`  🛡️",
            "🛡️      `-.||_.._|        |_.._||.-'      🗡️",
            `🗡️              \\ ((  )) /                🛡️`,
            "🛡️                '.    .'                🗡️",
            "🗡️                  `/`                   🛡️",
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷             `,
            `🗡️                                        🛡️`,
            `🛡️                                         🗡️`,
            `🗡️                                        🛡️`,
            "🦇================ 💓🦇💓 ================🦇",
        ];
        this.mapWolfFight = [
            "🐺================ 💓🐺💓 ===============🐺",
            `🛡️                            __          🗡️`,
            `🗡️                          .d$$b        🛡️`,
            `🛡️                        .' TO$;\\       🗡️`,
            `🗡️                       /  : TP._;      🛡️`,
            `🛡️                      / _.;  :Tb|      🗡️`,
            `🗡️                     /   /   ;j$j      🛡️`,
            `🛡️                 _.-"       d$$$$      🗡️`,
            `🗡️                .' ..       d$$$$;       🛡️`,
            "🛡️               /  /P'      d$$$$P. |     🗡️",
            `🗡️              /   "      .d$$$P' |\\^"l  🛡️`,
            "🛡️           .'           `T$P^'''''  :  🗡️",
            `🗡️       ._.'      _.'                ;  🛡️`,
            '🛡️    `-.-".-"-"" ._.       _.-"    .-"  🗡️',
            '🗡️   `.-" _____  ._              .-"     🛡️',
            `🛡️  -(.g$$$$$$$b.              .'        🗡️`,
            `🗡️     ""^^T$$$P^)            .(:        🛡️`,
            `🛡️                                       🗡️`,
            `🗡️                                       🛡️`,
            `       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷            `,
            `🗡️                                       🛡️`,
            `🛡️                                       🗡️`,
            `🗡️                                       🛡️`,
            "🐺================ 💓🐺💓 ===============🐺",
        ];
    }

    updateHP(myPetCareMode, enemyRandom) {
        const maxPetHeart = 3 * Math.ceil(maxPetHP / 10); // 最大HP值，也就是最多的红心数量🩷
        const maxEnemyHeart = 3 * Math.ceil(maxEnemyHP / 10);
        const hpSymbol = "🩷 "; // 红心符号  🩷  :heart
        // const blackHPSymbol = "🩶";
        // readlineSync.keyInPause(
        //     `enemy's mxpHP is ${maxEnemyHP}, pet's mxpHP is ${maxPetHP}, press any key`
        // );

        // 计算需要多少个红心来表示当前HP
        const petHeartsNeeded = Math.ceil(myPetCareMode.HP / 10);
        const enemyHeartsNeeded = Math.ceil(enemyRandom.HP / 10);
        // readlineSync.keyInPause(`enemy's HP is ${enemyRandom.HP}`);
        // 构建新的HP字符串
        const petHPString = hpSymbol.repeat(petHeartsNeeded);
        const enemyHPString = hpSymbol.repeat(enemyHeartsNeeded);

        // 更新地图数组中的HP值
        const petFight = this.whichPetFightMap(whichPet);
        const enemyFight = this.whichEnemyFightMap(enemyType);
        //这里需要字符串的长度是20,才能显示10个🩶或🩷
        petFight.splice(
            19,
            1,
            `        HP ${petHPString.padEnd(maxPetHeart, "🩶 ")}           `
        );
        enemyFight.splice(
            19,
            1,
            `        HP ${enemyHPString.padEnd(
                maxEnemyHeart,
                "🩶 "
            )}             `
        );

        // 输出更新后的地图
        // console.log(this.mapRabbitFight.join("\n"));
        return petFight[19] + "                " + enemyFight[19];
    }

    whichPetFightMap(whichPet) {
        let mapPetFight = [];
        if (whichPet === "Tiger") mapPetFight = this.mapTigerFight;
        else if (whichPet === "Affe") mapPetFight = this.mapMankyFight;
        else if (whichPet === "Hase") mapPetFight = this.mapRabbitFight;
        return mapPetFight;
    }
    whichEnemyFightMap(enemyType) {
        let mapEnemyFight = [];
        if (enemyType === "Eagle") mapEnemyFight = this.mapEagleFight;
        else if (enemyType === "Bat") mapEnemyFight = this.mapBatFight;
        else if (enemyType === "Wolf") mapEnemyFight = this.mapWolfFight;
        return mapEnemyFight;
    }
    printPetMap() {
        console.clear();
        let mapPet = [];
        let maxHP = 0;
        let maxIQ = 0;
        let maxAffinity = 0;
        // myPetCareMode.name = petName;
        if (whichPet === "Tiger") {
            maxHP = 160;
            maxIQ = 10;
            maxAffinity = 10;
            mapPet = this.mapTiger;
        } else if (whichPet === "Affe") {
            maxHP = 120;
            maxIQ = 16;
            maxAffinity = 12;
            mapPet = this.mapManky;
        } else if (whichPet === "Hase") {
            maxHP = 100;
            maxIQ = 12;
            maxAffinity = 16;
            mapPet = this.mapRabbit;
        }

        for (let rowPet of mapPet) {
            // 在每次打印地图之前，更新地图中宠物的各项属性值的部分
            if (rowPet.includes("myName:")) {
                //为何名字显示不了
                //console.log("为何名字显示不了");
                const updatedRow = rowPet.replace(
                    // /myName: \d+/,
                    /myName: /,
                    `${myPetCareMode.name}`
                );
                // console.log(petName);
                console.log(updatedRow);
            } else if (rowPet.includes("full:")) {
                const updatedRow = rowPet.replace(
                    /full: \d+/,
                    `full: ${myPetCareMode.full} (max: 10)`
                );
                // console.log(myPetCareMode.full);
                console.log(updatedRow);
            } else if (rowPet.includes("IQ:")) {
                const updatedRow = rowPet.replace(
                    /IQ: \d+/,
                    `IQ: ${myPetCareMode.IQ} (max: ${maxIQ})`
                );
                // console.log(myPetCareMode.full);
                console.log(updatedRow);
            } else if (rowPet.includes("affinity:")) {
                const updatedRow = rowPet.replace(
                    /affinity: \d+/,
                    `affinity: ${myPetCareMode.affinity} (max: ${maxAffinity})`
                );
                // console.log(myPetCareMode.full);
                console.log(updatedRow);
            } else if (rowPet.includes("HP:")) {
                const updatedRow = rowPet.replace(
                    /HP: \d+/,
                    `HP: ${myPetCareMode.HP} (max: ${maxHP})`
                );
                // console.log(myPetCareMode.full);
                console.log(updatedRow);
            } else {
                console.log(rowPet);
            }
        }
    }

    printPetFightMap() {
        console.clear();
        const updatedRowStr = this.updateHP(myPetCareMode, enemyRandom);
        const mapPetFight = this.whichPetFightMap(whichPet);
        const mapEnemyFight = this.whichEnemyFightMap(enemyType);
        for (let i = 0; i < mapPetFight.length; i++) {
            let rowPet = mapPetFight[i] + "                " + mapEnemyFight[i];
            if (i === 19) console.log(updatedRowStr);
            else console.log(rowPet);
        }
    }
}
const petMaps = new AllPetMaps();
