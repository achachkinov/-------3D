console.log( console )
//доска
var cPoz = [
       "LNBQKBNL",
       "PPPPPPPP",
       "........",
       "........",
      "........",
      "........",
       "pppppppp",
       "lnbqkbnl"
]

/*"LNBQKBNL",
       "PPPPPPPP",
       "........",
       "........",
      "........",
      "........",
       "pppppppp",
       "lnbqkbnl" */

function mkDsk(poz) {
       let gran = "xx"
	for (let i = 0;i < poz[0].length;i++) {
		gran +="x"
	}
       let pozit = ""
       pozit = pozit + gran + gran
       for(let i =0; i < poz.length;i++) {
              pozit = pozit + "x" + poz[i] + "x"
       }
       pozit = pozit + gran + gran
       return pozit
}

var classicPoz = mkDsk(cPoz)
console.log(classicPoz)
 
//"xxxxxxxxxx
// xxxxxxxxxx
// xLNBQKBNLx
// xPPPPPPPPx
// x........x
// x........x
// x........x
// x........x
// xppppppppx
// xlnbqkbnlx
// xxxxxxxxxx
// xxxxxxxxxx"


function Width(Poz) {
       for (let i = 0;;i++) {
              if (Poz[i] != "x") {
                     return (i - 1)/2;
              }
       }
}

//стороны куда можно пойти
var Down = Width(classicPoz), Up = -Down, Left = -1, Right = 1;

console.log( Up + Left )

//ходы фигур
var figurHod = {
       "k" : [[Up + Left],[Up + Right],[Down + Left],
              [Down + Right],[Up],[Down],[Left,],[Right],
              [Right + Right,"deat",(desk,poz,coord,beHod) => {
                     if ((beHod.indexOf(coord) == -1) && (desk[poz + Left] == ".")) {
                            if (desk[poz + Right] == "l" && (beHod.indexOf(poz + Right) == -1)) {
                                   return [[poz + Right,"."],[poz + Left,"l"]]
                            } else if (desk[poz + Right] == "." && desk[poz + Right + Right] == "l" && beHod.indexOf(poz + Right + Right) == -1) {
                                   return [[poz + Right + Right,"."],[poz + Left,"l"]]
                            }
                     }
              }],
              [Left + Left,"deat",(desk,poz,coord,beHod) => {
                     if ((beHod.indexOf(coord) == -1) && (desk[poz + Right] == ".")) {
                            if (desk[poz + Left] == "l" && (beHod.indexOf(poz + Left) == -1)) {
                                   return [[poz + Left,"."],[poz + Right,"l"]]
                            } else if (desk[poz + Left] == "." && desk[poz + Left + Left] == "l" && beHod.indexOf(poz + Left + Left) == -1) {
                                   return [[poz + Left + Left,"."],[poz + Right,"l"]]
                            }
                     }
              }]],
       "q" : [[Up + Left,"while"],[Up + Right,"while"],[Down + Left,"while"],
              [Down + Right,"while"],[Up,"while"],[Down,"while"],[Left,"while"],[Right,"while"]],
       "b" : [[Up + Left,"while"],[Up + Right,"while"],[Down + Left,"while"],[Down + Right,"while"]],
       "n" : [[Up + Up + Left],[Up + Up + Right],[Up + Left + Left],
              [Up + Right + Right],[Down + Down + Left],[Down + Down + Right],
              [Down + Left + Left],[Down + Right + Right]],
       "l" : [[Up,"while"],[Down,"while"],[Left,"while"],[Right,"while"]],
       "p" : [[Up,"deat", (desk,poz) => {if (desk[poz + Up] == "x") {return [[poz,"q"]]} else {return "save"}}],
              [Up+Up,"deat",(desk,poz,coord,beHod) => {if ((desk[poz + Down] == ".") && (beHod.indexOf(poz +Down + Down) == -1)) {return "save"}}],
              [Up+Left,"eat", (desk,poz) => {if (desk[poz + Up] == "x") {return [[poz,"q"]]} else {return "save"}}],
              [Up+Right,"eat", (desk,poz) => {if (desk[poz + Up] == "x") {return [[poz,"q"]]} else {return "save"}}]]
}

var figurs = Object.keys(figurHod)

//ценность фигур
var figurValue = {"k":10000,"q":90,"b":30,"n":30,"l":50,"p":10};

//ценность позиции фигур
var pozValue = {"k":[
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0, -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,0],
                     [0, -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,0],
                     [0, -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,0],
                     [0, -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,0],
                     [0, -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0,0],
                     [0, -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0,0],
                     [0,  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ,0],
                     [0,  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0]
              ],
              "q":[  [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0, -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0,0],
                     [0, -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0,0],
                     [0, -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0,0],
                     [0, -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5,0],
                     [0,  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5,0],
                     [0, -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0,0],
                     [0, -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0,0],
                     [0, -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0]
                 ],
              "b":[  [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0, -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0,0],
                     [0, -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0,0],
                     [0, -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0,0],
                     [0, -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0,0],
                     [0, -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0,0],
                     [0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,0],
                     [0, -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0,0],
                     [0, -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0]
                 ],
              "n":[  [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0,0],
                     [0,-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0,0],
                     [0,-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0,0],
                     [0,-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0,0],
                     [0,-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0,0],
                     [0,-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0,0],
                     [0,-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0,0],
                     [0,-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0]
                 ],
              "l":[  [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,0],
                     [0,  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5,0],
                     [0, -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5,0],
                     [0, -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5,0],
                     [0, -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5,0],
                     [0, -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5,0],
                     [0, -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5,0],
                     [0,  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0]
                 ],
              "p":[  [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,0],
                     [0,5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,0],
                     [0,1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0,0],
                     [0,0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5,0],
                     [0,0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0,0],
                     [0,0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5,0],
                     [0,0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5,0],
                     [0,0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [0,0,0,0,0,0,0,0,0,0]
                 ]
              };

//координаты от центра к граням
function centerEdge(poz) {
       let arr = [];
       function cenEdge(from,str1,str2) {
              for(i = 0;i < 10;i++) {
                     let end = from
                     let cen = from
                     for (let g = 0; g < i;g++) {
                            end += str2
                            cen += str1
                            if (poz[end] == "x") {
                                   end += str1
                                   end -= str2
                                   if (poz[end] == "x") {break}
                            }
                            if (poz[cen] == "x") {
                                   cen += str2
                                   cen -= str1
                                   if (poz[cen] == "x") {break}
                            }
                     }
                     if (poz[end] == "x" || poz[cen] == "x") {break}
                     if (!arr[i]) {
                            arr[i] = []
                     }
                     arr[i].push(end)
                     while (cen != end) {
                            arr[i].push(cen);
                            cen = cen +str2 -str1
                     } 
                     if (arr[i].length == 0 ) {
                            break
                     }
              }
       }
       let center = Math.floor((poz.length/2) - (Down/2))
       cenEdge(center,Left,Up)
       cenEdge(center+Right,Right,Up)
       cenEdge(center+Down,Left,Down)
       cenEdge(center+Down+Right,Right,Down)
       return arr
}
let cenEdg = centerEdge(classicPoz)

//объект доска
class ChessBoard {
       constructor(board,beHod = [],beHod2 = [],rule = (br) => {if (br.indexOf("k") == -1) {return -1} else if (br.indexOf("K") == -1) {return 1} else return 0}) {
              if (typeof board == "string") {
                     this.board = board.split("");
              } else {
                     this.board = board
              }
              this.beHod = beHod;
              this.beHod2 = beHod2
              this.rule = rule
              this.game = this.rule(board,beHod,beHod2)
              this.reverse = (this.beHod.length + this.beHod2.length) % 2 != 0
              this.hods = ChessBoard.calculateHod(board,this.beHod);
       }

       nextHod(from,to) {
              if (this.hods[from]) {
                     if (this.hods[from][to]) {
                            let newBoard = [...this.board];
                            newBoard[to] = newBoard[from]
                            newBoard[from] = "."
                            if (this.hods[from][to].length != 0) {
                                   for (let hd of this.hods[from][to]) {
                                          newBoard[hd[0]] = hd[1]
                                   }
                            }
                            let bh = [...this.beHod]
                            bh[bh.length] = to
                            return new ChessBoard(ChessBoard.flip(newBoard),this.beHod2,bh,this.rule)
                     }
              }
       }

       
       static flip(board) {
                     return board.map(fig => {
                                   if (fig in figurHod) {
                                          return fig.toUpperCase()
                                   } else if (fig.toLowerCase() in figurHod) {
                                          return fig.toLowerCase()
                                   } else {return fig}
                            }).reverse()
       }

       static calculateHod(board,beHod) {
              let calcHod = Object.create(null);
              for (let cE of cenEdg) {
                     for (let coord of cE) {
                            coord = Number(coord)
                            if (board[coord] in figurHod) {
                                   for (let nHod of figurHod[board[coord]]) { 
                                          let newpoz = coord 
                                          do {
                                                 newpoz += nHod[0]
                                                 if (!(board[newpoz] in figurHod) && (board[newpoz] != "x") && !((nHod[1] == "eat" && board[newpoz] == ".") || (nHod[1] == "deat" && board[newpoz] != "."))) {
                                                        if (!calcHod[coord]) {calcHod[coord] = {}}
                                                        if (nHod[2]) {
                                                               let dop = nHod[2](board,newpoz,coord,beHod)
                                                               if (dop == "save") {
                                                                      calcHod[coord][newpoz] = []
                                                               } else if (dop){
                                                                      calcHod[coord][newpoz] = dop
                                                               }
                                                        } else {
                                                               calcHod[coord][newpoz] = []
                                                               if (board[newpoz].toLowerCase() in figurHod) {
                                                                      break
                                                               }
                                                        }
                                                 } else {
                                                        break
                                                 }
                                          }   while (nHod[1] == "while")
                                   }
                            }
                     }
              }
              return calcHod
       }
}

class DisplayBoard {
       constructor(desk) {
              this.desk = desk
              this.canvas = document.createElement("canvas");
              this.cx = this.canvas.getContext("2d")
              this.canvas.width = window.innerWidth;
              this.canvas.height = window.innerHeight;
              document.body.appendChild(this.canvas);
              this.boardWidth = Down;
              this.boardHeight = (this.desk.board.length / this.boardWidth) -2 ;
              this.cell = this.canvas.width / (2 * this.boardWidth);
              this.img = document.createElement("img");
              this.img.src = 'oldChess/figurSprite.png';
              this.figurSize = 106.5
       }

      paintDesk(selectFg,mousPoz,comment) {

              this.cx.fillStyle = "#87CEEB"
              this.cx.fillRect(0,0,this.canvas.width,this.canvas.height);
              this.cx.fillStyle = "#8B4513"
              this.cx.fillRect((this.canvas.width - (this.boardWidth * this.cell))/2,(this.canvas.height - (this.boardHeight * this.cell))/2,this.boardWidth * this.cell,this.boardHeight * this.cell)
              this.cx.strokeStyle = "#000000";
              this.cx.lineWidth = 4;
              this.cx.strokeRect((this.canvas.width - (this.boardWidth * this.cell))/2,(this.canvas.height - (this.boardHeight * this.cell))/2,this.boardWidth * this.cell,this.boardHeight * this.cell)
              this.cx.strokeRect((this.canvas.width - (this.boardWidth * this.cell))/2 + this.cell - 2,(this.canvas.height - (this.boardHeight * this.cell))/2 + this.cell - 2,this.boardWidth * this.cell - (2 *this.cell) + 4,this.boardHeight * this.cell - (2 *this.cell) + 4)
              
              if(comment) {
                     this.cx.fillStyle = "#000000"
                     this.cx.font = "50px Georgia"
                     this.cx.textAlign = "center"
                     this.cx.fillText(comment,this.canvas.width/2,(this.canvas.height - ((this.boardHeight + 1) * this.cell))/2)
              }

              let hodi = null;
              let lastFig;
              let brd;
              let selectFig = selectFg;

              if (this.desk.hods[selectFig]) {
                     hodi = Object.keys(this.desk.hods[selectFig])
              }
              if (this.desk.reverse) {
                     brd = ChessBoard.flip(this.desk.board)
                     if (hodi) {
                            hodi = hodi.map(e => {let pz = (this.boardWidth * (this.boardHeight + 2)) - e - 1; return `${pz}`})
                     }
                     selectFig = (this.boardWidth * (this.boardHeight + 2)) - selectFg -1;
              }
              for ( let y = 1; y < this.boardHeight; y++ ) {
                     for (let x = 0; x < this.boardWidth;x++) {
                            let fig
                            if (this.desk.reverse) {
                                   fig = brd[(y * this.boardWidth) + x]
                            } else {
                                   fig = this.desk.board[(y * this.boardWidth) + x];
                            }
                            if (fig != "x") {
                                   if ((y + x)%2 != 0) {
                                          this.cx.fillStyle = "#FFFFFF"
                                   } else {
                                          this.cx.fillStyle = "#A0522D"
                                   }
                                   let pz = (y * this.boardWidth) + x;
                                   if (hodi) {
                                          if (hodi.indexOf(`${pz}`) != -1) {
                                                 if (fig != ".") {
                                                        if ((y + x)%2 != 0) {
                                                               this.cx.fillStyle = "#FF5959"
                                                        } else {
                                                               this.cx.fillStyle = "#DE1D10"
                                                        }
                                                 } else {
                                                        if ((y + x)%2 != 0) {
                                                               this.cx.fillStyle = "#1E90FF"
                                                        } else {
                                                               this.cx.fillStyle = "#1E70FF"
                                                        }
                                                 }
                                          }
                                          if (selectFig == pz) {
                                                 this.cx.fillStyle = "#2E8B57"
                                          }
                                   }   
                                   let xPoz = (this.canvas.width - (this.boardWidth * this.cell))/2 + (this.cell * x)
                                   let yPoz = ((this.canvas.height - (this.boardHeight * this.cell))/2) + (this.cell * (y-1))
                                   this.cx.fillRect(xPoz,yPoz,this.cell,this.cell)
                                   if (fig != ".") {
                                          let numFig = figurs.indexOf(fig)
                                          let str = 0
                                          if (numFig == -1) {
                                                 numFig = figurs.indexOf(fig.toLowerCase())
                                                 str = 1
                                          }
                                          if (mousPoz && (selectFig == pz)) {
                                                 lastFig = [numFig * this.figurSize,str * this.figurSize,mousPoz[0] - this.cell/2,mousPoz[1] - this.cell/2]
                                          } else {
                                                 this.cx.drawImage(this.img,numFig * this.figurSize,str * this.figurSize,this.figurSize,this.figurSize,xPoz,yPoz,this.cell,this.cell)
                                          }
                                   }
                            }
                     }
              }
              if (lastFig) {
                     this.cx.drawImage(this.img,lastFig[0],lastFig[1],this.figurSize,this.figurSize,lastFig[2],lastFig[3],this.cell,this.cell)
              }
      }

      pozMouse(pozMous) {
              let x = Math.floor((pozMous[0] - (this.canvas.width - (this.boardWidth * this.cell))/2)/this.cell);
              let y = Math.floor((pozMous[1] - (this.canvas.height - (this.boardHeight * this.cell))/2) / this.cell);
              let inn = false;
              if (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
                     inn = true
              }
              return ([x,y,inn])
      }
      pozDeskMouse(pozMouse) {
             let poz = (this.boardWidth * 2) + pozMouse[0] + (pozMouse[1] - 1 )* this.boardWidth;
             return poz
      }
      pozDeskReferse(pozMouse) {
              let poz = (this.boardWidth * (this.boardHeight + 2)) - pozMouse -1;
              return poz
      }
      remove() {
             this.canvas.remove()
      }

}

function runGame(pozFigurs,ClBot,levelBot,str = 0,rule) {
       let bord = new ChessBoard(pozFigurs,undefined,undefined,rule);
       let display = new DisplayBoard(bord);
       let bot = new ClBot(bord,levelBot)
       let pozMous = [];
       let selectFig = null;
       let nxHod = null;
       let lastTime = undefined
       let coment = ""
       document.getElementsByTagName("canvas")[0].addEventListener("mousemove",e => {pozMous = [e.offsetX,e.offsetY]})
       document.getElementsByTagName("canvas")[0].addEventListener("click",e => {
              if ((!bord.reverse && str == 0) || (bord.reverse && str == 1)) {
                     let poz = display.pozDeskMouse(display.pozMouse([e.offsetX,e.offsetY]))
                     if (bord.reverse) {
                            poz = display.pozDeskReferse(poz)
                     }
                     if (selectFig) {
                            if (bord.hods[selectFig][poz]) {
                                   nxHod = poz;
                            } else {
                                   selectFig = null
                                   nxHod = null
                            }
                     } else {
                            if (bord.hods[poz]) {
                                   selectFig = poz;
                            }
                     }
              }
       })
       function animate(time) {
              let an = false
              if (bord.game != 0) {
                     display.paintDesk(display.pozDeskReferse(display.pozDeskMouse(display.pozMouse(pozMous))),false,"CheckMate")
                     setTimeout(()=>{display.remove()},3000)
              } else {
                     if ((!bord.reverse && str == 0) || (bord.reverse && str == 1)) {
                            if (selectFig && nxHod) {
                                   bord = bord.nextHod(selectFig,nxHod)
                                   bot.setHod(bord)
                                   display.desk = bord
                                   selectFig = null
                                   nxHod = null 
                            }
                     } else {
                            let hod = bot.getHod()
                            bord = bord.nextHod(hod[0],hod[1])
                            bot.setHod(bord)
                            display.desk = bord
                            lastTime = undefined
                            coment = ""
                            an = false;
                            if (an) {
                                   coment = ""
                                   let kl = (Math.floor((time - lastTime) / 100) + 1) % 4
                                   for(let i = 0; i != kl;i++) {
                                          coment += "."
                                   }
                            }
                     }
                     if (selectFig) {
                            display.paintDesk(selectFig,pozMous,coment)
                     } else {
                            if (!bord.reverse) {
                                   display.paintDesk(display.pozDeskMouse(display.pozMouse(pozMous)),false,coment)
                            } else {
                                   display.paintDesk(display.pozDeskReferse(display.pozDeskMouse(display.pozMouse(pozMous))),false,coment)
                            }
                     }
                     requestAnimationFrame(animate)
              }
       }
       requestAnimationFrame(animate)
}

class randomBot {
       constructor (chBoard) {
              this.chBoard = chBoard
       }
       getHod() {
              let fig
              let hod
              do {
                     fig = Math.floor(this.chBoard.board.length * Math.random())
              } while (!this.chBoard.hods[fig])
              do {
                     hod = Math.floor(this.chBoard.board.length * Math.random())
              } while (!this.chBoard.hods[fig][hod])
              return [fig,hod]
       }
       setHod(newChBoard) {
              this.chBoard = newChBoard
       }
}

class calcBot {
       constructor (chBoard,level = 3) {
              this.chBoard = chBoard;
              this.level = level
       }
       static calcBoard(bord) {
              let value = 0
              for (let i = (Down+Down+Right) ; i < (bord.board.length + ((Up*2) + (Left*1))); i++) {
                     if (bord.board[i] in figurValue) {
                            value += figurValue[bord.board[i]];
                            value += pozValue[bord.board[i]][Math.floor(i/Down)][i%Down]
                     } else if (bord.board[i].toLowerCase() in figurValue) {
                            value -= figurValue[bord.board[i].toLowerCase()];
                            value -= pozValue[bord.board[i].toLowerCase()][Math.floor((bord.board.length - 1 -i)/Down)][i%Down]
                     }
              }
              return value
       }
       getHod() {
              let oldTime = Date.now()
              function minimax(desk,level,alpha,beta,maxOrMin,start) {
                     let frTo = []
                     if (level == 0) {
                            return calcBot.calcBoard(desk)

                     } else if (desk.game == -1) {
                            if(maxOrMin) {
                                   return -9999
                            } else {return 9999}
                     } else if (desk.game == 1){
                            if(maxOrMin) {
                                   return 9999
                            } else {return -9999}
                     } else {
                            let maximinValue = +Infinity
                            let funct = Math.min
                            let nextMinMax = true
                            if (maxOrMin) {
                                   maximinValue = -Infinity
                                   funct = Math.max
                                   nextMinMax = false
                            }
                            for (let from in desk.hods) {
                                   for (let to in desk.hods[from]) {
                                          let value = minimax(desk.nextHod(Number(from),Number(to)),level - 1,alpha,beta,nextMinMax)
                                          let oldmaximinValue = maximinValue
                                          maximinValue = funct(maximinValue,value)
                                          if (start && oldmaximinValue != maximinValue) {
                                                 frTo[0] = from
                                                 frTo[1] = to
                                          }
                                          if (maxOrMin) {
                                                 alpha = Math.max(alpha, value)
                                          } else {
                                                 beta = Math.min(beta, value)
                                          }
                                          if (beta <= alpha) {
                                                 break
                                          }
                                   }
                                   if (beta <= alpha) {
                                         break
                                   }
                            }
                            if (start) {
                                   return [Number(frTo[0]),Number(frTo[1])]
                            } else {
                                   return maximinValue
                            }
                     }
              }
              let hod = minimax(this.chBoard,this.level,-Infinity,+Infinity,(this.level % 2) == 0,true)
              console.log(Date.now() - oldTime)
              return hod
       }
       setHod(newChBoard) {
              this.chBoard = newChBoard
       }
}

runGame(classicPoz,calcBot,4,0)