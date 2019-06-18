import { Component, Input, NgModule, OnInit } from '@angular/core';

const GAME_FIELDS_AREA: string[] = new Array(9).fill('');
const GAME_FIELDS: any = document.getElementsByClassName('field');
const START_GAME_NOTIFICATION = 'Start game by click on start button';
const MAX_COUNT_LENGTH = 9;
const WINNING_COMBINATIONS = [
    ['0', '1', '2'],
    ['0', '3', '6'],
    ['0', '4', '8'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['2', '4', '6'],
    ['3', '4', '5'],
    ['6', '7', '8']
];
let stepsCount = 0;
let defaultPlayer = 'X';

@Component({
    selector: 'app-game-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['./engine.component.css']
})


export class EngineComponent implements OnInit {
    private gameList = GAME_FIELDS_AREA;
    private gameStart = false;
    private dataX: any = [];
    private dataO: any = [];
    private strikethrough: any = [];

    @Input()
    public notification: string;
    public activeNoughts = false;
    public activeCrosses = false;
    public disableArea = true;
    public isVertical = false;
    public isHorizontal = false;
    public isDiagonalLeftRight = false;
    public isDiagonalRightLeft = false;
    public target: any;

    public ngOnInit(): void {
        this.notification = START_GAME_NOTIFICATION;
    }

    public startGame() {
        this.gameStart = true;
        this.disableArea = false;
        this.activeNoughts = false;
        this.activeCrosses = true;
        this.isVertical = false;
        this.isHorizontal = false;
        this.isDiagonalLeftRight = false;
        this.isDiagonalRightLeft = false;


        for (const item of GAME_FIELDS) {
            const singleDiv: HTMLElement = item;
            singleDiv.innerText = '';
            singleDiv.classList.remove('active-X', 'active-0', 'strikethrough', 'vertical', 'horizontal',
                'diagonal', 'diagonal-lr', 'diagonal-rl');
        }
        this.notification = defaultPlayer + ' turn';
        stepsCount = 0;
        this.dataX = [];
        this.dataO = [];
    }

    public playerAction($event): void {
        if (this.gameStart === true && this.disableArea === false) {
            this.target = event.target || event.srcElement || event.currentTarget;
            const cellAttribute = this.target.attributes.index.nodeValue;
            const innerText = this.target.innerText;

            if (!innerText) {
                this.target.innerText = defaultPlayer;
                const symbolElement = document.createElement('div');
                this.target.appendChild(symbolElement);
                this.changePlayer(cellAttribute);
                if (this.disableArea === false) {
                    this.notification = this.move();
                    stepsCount++;
                    this.draw();
                }
            }
        }
    }

    public changePlayer(cellAttribute) {
        if (this.disableArea === false) {
            if (defaultPlayer === 'X') {
                this.activeNoughts = true;
                this.activeCrosses = false;
                this.target.classList.add('active-' + defaultPlayer);
                this.dataX.push(cellAttribute);
                if (this.dataX.length > 2 && this.checkWin(this.dataX, cellAttribute)) {
                    this.disableArea = true;
                    this.notification = defaultPlayer + ' win';
                    this.activeNoughts = false;
                    this.activeCrosses = true;
                    this.markStrikethrough(GAME_FIELDS, this.strikethrough);
                } else {
                    return defaultPlayer = '0';
                }
            } else {
                this.activeCrosses = true;
                this.activeNoughts = false;
                this.target.classList.add('active-' + defaultPlayer);
                this.dataO.push(cellAttribute);
                if (this.dataO.length > 2 && this.checkWin(this.dataO, cellAttribute)) {
                    this.disableArea = true;
                    this.notification = defaultPlayer + ' win';
                    this.activeNoughts = true;
                    this.activeCrosses = false;
                    this.markStrikethrough(GAME_FIELDS, this.strikethrough);
                    return defaultPlayer = 'X';
                } else {
                    return defaultPlayer = 'X';
                }
            }
        }
    }

    public draw() {
        if (stepsCount === MAX_COUNT_LENGTH) {
            this.notification = 'Draw';
            this.disableArea = true;
            this.activeNoughts = true;
            this.activeCrosses = true;
            return defaultPlayer = 'X';
        } else {
            this.move();
        }
    }

    public move() {
        const notification: string = defaultPlayer + ' turn';
        return notification;
    }

    public markStrikethrough(fields, winningArray) {
        const horizontalLine =  [
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8']
        ];
        const verticalLine =  [
            ['0', '3', '6'],
            ['1', '4', '7'],
            ['2', '5', '8']
        ];
        const diagonalFirst =  [
            ['0', '4', '8']
        ];
        const diagonalSecond =  [
            ['2', '4', '6']
        ];

        const winingCombination = winningArray.join('');

        for (let v = 0, vLen = verticalLine.length; v < vLen; v++) {
            const verticalSingle = verticalLine[v].join('');
            if (verticalSingle === winingCombination) {
                this.isVertical = true;
            }
        }
        for (let h = 0, hLen = horizontalLine.length; h < hLen; h++) {
            const horizontalSingle = horizontalLine[h].join('');
            if (horizontalSingle === winingCombination) {
                this.isHorizontal = true;
            }
        }
        for (let d = 0, dLen = diagonalFirst.length; d < dLen; d++) {
            const diagonalLeftRight = diagonalFirst[d].join('');
            if (diagonalLeftRight === winingCombination) {
                this.isDiagonalLeftRight = true;
            }
        }
        for (let d = 0, dLen = diagonalSecond.length; d < dLen; d++) {
            const diagonalRightLeft = diagonalSecond[d].join('');
            if (diagonalRightLeft === winingCombination) {
                this.isDiagonalRightLeft = true;
            }
        }

        for (let i = 0, iLen = winningArray.length; i < iLen; i++) {
            const item = winningArray[i];

            for (let c = 0, cLen = fields.length; c < cLen; c++ ) {
                const singleCell = fields[c];
                // maybe can be changed for switch
                if (singleCell.attributes.index.nodeValue === item && this.isVertical === true) {
                    singleCell.classList.add('strikethrough', 'vertical');
                }
                if (singleCell.attributes.index.nodeValue === item && this.isHorizontal === true) {
                    singleCell.classList.add('strikethrough', 'horizontal');
                }
                if (singleCell.attributes.index.nodeValue === item && this.isDiagonalLeftRight === true) {
                    singleCell.classList.add('strikethrough', 'diagonal-lr');
                }
                if (singleCell.attributes.index.nodeValue === item && this.isDiagonalRightLeft === true) {
                    singleCell.classList.add('strikethrough', 'diagonal-rl');
                }
            }

        }
    }

    public checkWin(arr, number) {
        for (let w = 0, wLen = WINNING_COMBINATIONS.length; w < wLen; w++) {
            const someWinArr = WINNING_COMBINATIONS[w];
            const inWinningCombination: number = someWinArr.findIndex(indexOf => indexOf === number);
            let count = 0;

            if (inWinningCombination !== -1) {
                for (let k = 0, kLen = someWinArr.length; k < kLen; k++) {
                    const inWinningArray = arr.findIndex(arrayIndex => arrayIndex === someWinArr[k]);
                    if (inWinningArray !== -1) {
                        count++;
                        if (count === 3) {
                            this.strikethrough = someWinArr;
                            return true;
                        }
                    }
                }
                count = 0;
            }
        }
    }
}
