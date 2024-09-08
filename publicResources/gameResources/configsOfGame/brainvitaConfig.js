import { FacadeGame, Figur, Cell, TypeOfFigur, TypeOfCell, Move, Pos } from "../gameScripts/gameBoard.js";
import { FacadeDisplay, DisplayInformationOfType, DisplayInformationOfElement, Dot, BuilderModel, BuilderCompositeModel, Lite } from "../gameScripts/display.js";

let widthOfLeaf = 3
let heightOfLeaf = 2

let widthBoard = widthOfLeaf + 2*heightOfLeaf

let listDotsOfSurfaceCell = [
    new Dot( -1, 0, 1 ),
    new Dot( -1, 0, -1 ),
    new Dot( 1, 0, -1 ),
    new Dot( 1, 0, 1 )
]
let listDotsOfSurfaceDesk = [
    new Dot( -1, -2, -1 ),
    new Dot( -1, -2, 1 ),
    new Dot( 1, -2, 1 ),
    new Dot( 1, -2, -1 )
]
let listDotsOf1DeskBorderCell = [
    new Dot( -1, -2, -1 ),
    new Dot( -1, -0, -1 ),
    new Dot( -1, -0, 1 ),
    new Dot( -1, -2, 1 )
]
let listDotsOf2DeskBorderCell = [
    new Dot( -1, -2, 1 ),
    new Dot( -1, -0, 1 ),
    new Dot( 1, -0, 1 ),
    new Dot( 1, -2, 1 )
]
let listDotsOf3DeskBorderCell = [
    new Dot( 1, -2, 1 ),
    new Dot( 1, -0, 1 ),
    new Dot( 1, -0, -1 ),
    new Dot( 1, -2, -1 )
]
let listDotsOf4DeskBorderCell = [
    new Dot( 1, -2, -1 ),
    new Dot( 1, -0, -1 ),
    new Dot( -1, -0, -1 ),
    new Dot( -1, -2, -1 )
]

let cellType = new TypeOfCell()

let cellDisplayInformationOfType = new DisplayInformationOfType()
let cellModel = new BuilderModel()
cellModel.setScale( 5000 )
cellModel.selectColorNumber( 1 )
cellModel.drawQuadrilateral( listDotsOfSurfaceCell )
cellModel.drawQuadrilateral( listDotsOfSurfaceDesk )
cellModel.drawQuadrilateral( listDotsOf1DeskBorderCell )
cellModel.drawQuadrilateral( listDotsOf2DeskBorderCell )
cellModel.drawQuadrilateral( listDotsOf3DeskBorderCell )
cellModel.drawQuadrilateral( listDotsOf4DeskBorderCell )
cellModel.setLastDot( new Dot( 0.6 , 0.1 ) )
cellModel.drawHoop( new Dot( 0, 0 ) )
cellDisplayInformationOfType.setBuilderModel( cellModel )
cellType.setDisplayInformationOfType( cellDisplayInformationOfType )







let ballType = new TypeOfFigur()

let ballDisplayInformationOfType = new DisplayInformationOfType()
let ballModel = new BuilderModel()
ballModel.setScale( 5000 )
ballModel.drawHoop( new Dot(0.01,0) )
ballModel.drawSphereOutsideCenterRad( new Dot(0, 1.2 ) )
ballDisplayInformationOfType.setBuilderModel( ballModel )
ballType.setDisplayInformationOfType( ballDisplayInformationOfType )

let ballMove = new Move()
ballMove.setFunctOfCalcOfMovePosition( classicCalcOfMovePos )
ballMove.setFunctOfIsPosibleToMove( classicPosibleToMove )
ballMove.setFunctOfIsTimeToBreak( classicTimeToBreak )
ballMove.setFunctOfChangeBoard( classicChangeBoard )
ballType.addMove( ballMove )


function classicCalcOfMovePos( board, startPos, itteratorNum ) {
    let differentX
    let differentY
    if ( itteratorNum == 0 ) {
        differentX = 2
        differentY = 0
    } else if (itteratorNum == 1) {
        differentX = 0
        differentY = 2
    } else if (itteratorNum == 2) {
        differentX = -2
        differentY = 0
    } else {
        differentX = 0
        differentY = -2
    }
    let endPos = startPos.getCopy()
    endPos.addX( differentX )
    endPos.addY( differentY )
    return endPos
}

function classicPosibleToMove( board, startPos, itteratorNum, endPos ) {
    if ( board.isEnableCellOnPos( endPos ) ) {
        if ( !board.isEnableFigurOnPos( endPos ) ) {
            let midlePos = getMidlePos( startPos, endPos )
            if ( board.isEnableFigurOnPos( midlePos )) {
                return true
            }
        }
    }
    return false
}

function classicTimeToBreak( board, startPos, itteratorNum, endPos ) {
    return itteratorNum >= 3
}

function classicChangeBoard( board, startPos, endPos ) {
    let midlePos = getMidlePos( startPos, endPos )
    board.selectFigurByPosition( midlePos )
    board.setPositionForSelectFigur( Pos.getNaN() )
    board.selectFigurByPosition( startPos )
    board.setPositionForSelectFigur( endPos )
    return board
}

function getMidlePos( startPos, endPos ) {
    let endX = endPos.getX()
    let endY = endPos.getY()
    let startX = startPos.getX()
    let startY = startPos.getY()
    let midleX = (endX+startX)/2
    let midleY = ( endY+startY )/2
    let midlePos = new Pos()
    midlePos.setX( midleX )
    midlePos.setY( midleY )
    return midlePos
}


let quality = 10

let game = new FacadeGame()

let cellColorList = ["#FFAE40","#702200"]
let cellDisplayInformation = new DisplayInformationOfElement()
cellDisplayInformation.setColorList( cellColorList )
cellDisplayInformation.setQuality( quality )
let listOfInitializatedCells = {}


initializateCentralCells( game )
initializateLeafCells( game )

function initializateCentralCells( game ) {
    fillSquareWithCells( new Pos() , widthOfLeaf, widthOfLeaf, cellType, game )
}
function initializateLeafCells( game ) {
    let startSquarePos = new Pos()
    startSquarePos.setX( -heightOfLeaf )
    startSquarePos.setY( 0 )
    fillSquareWithCells( startSquarePos , heightOfLeaf, widthOfLeaf, cellType, game )
    startSquarePos.setX( 0 )
    startSquarePos.setY( widthOfLeaf )
    fillSquareWithCells( startSquarePos , widthOfLeaf, heightOfLeaf, cellType, game )
    startSquarePos.setX( 0 )
    startSquarePos.setY( -heightOfLeaf )
    fillSquareWithCells( startSquarePos , widthOfLeaf, heightOfLeaf, cellType, game )
    startSquarePos.setX( widthOfLeaf )
    startSquarePos.setY( 0 )
    fillSquareWithCells( startSquarePos , heightOfLeaf, widthOfLeaf, cellType, game )
}

function initializateAngularCells( game ) {
    initializateCell( game, startX, startY, leftForwardBorderCellType )
    initializateCell( game, startX, sizeBoard - 1 + startY, leftBackBorderCellType )
    initializateCell( game, sizeBoard - 1 + startX, startY, rightForwardBorderCellType )
    initializateCell( game, sizeBoard - 1 + startX, sizeBoard - 1 + startY, rightBackBorderCellType )
}

function fillSquareWithCells( startSquare, width, height, type, game ) {
    for( let x = 0; x < width; x++  ) {
        for( let y = 0; y < height; y++ ) {
            let cellPos = startSquare.getCopy()
            cellPos.addX( x )
            cellPos.addY( y )
            initializateCell( game, cellPos, type)
        }
    }
}

function initializateCell( game, pos, cellType) {
    let num =  getNumberOfCellByPosition( pos )
    let name = "cell" + `${num}`
    let cell = new Cell()
    cell.setType( cellType )
    cell.setDisplayInformationOfElement( cellDisplayInformation )
    cell.setName( name )
    game.setElement( cell )
    listOfInitializatedCells[ name ] = pos
}

function getNumberOfCellByPosition( pos ) {
    let x = pos.getX()
    let y = pos.getY()
    let num = `${x}` + "x" + `${y}`
    return num
}






//"#125632", -зеленый
//"#FFFF66" - лампочка
// "#561231", - фиолетовый
// "#13394D", - синий
// "#8a0a07" - красный
//"#aa00aa",


let teamName = "balls"

let ballsColorList = ["#999999","#8a0a07"]
let ballsFigurDisplayInformation = new DisplayInformationOfElement()
ballsFigurDisplayInformation.setColorList( ballsColorList )
ballsFigurDisplayInformation.setQuality( quality )
let listOfInitializatedBalls = {}


initializateCentralBalls( game )
initializateLeafBalls( game )


function initializateCentralBalls( game ) {
    fillSquareWithBalls( new Pos() , widthOfLeaf, widthOfLeaf, ballType, game )
}
function initializateLeafBalls( game ) {
    let startSquarePos = new Pos()
    startSquarePos.setX( -heightOfLeaf )
    startSquarePos.setY( 0 )
    fillSquareWithBalls( startSquarePos , heightOfLeaf, widthOfLeaf, ballType, game )
    startSquarePos.setX( 0 )
    startSquarePos.setY( widthOfLeaf )
    fillSquareWithBalls( startSquarePos , widthOfLeaf, heightOfLeaf, ballType, game )
    startSquarePos.setX( 0 )
    startSquarePos.setY( -heightOfLeaf )
    fillSquareWithBalls( startSquarePos , widthOfLeaf, heightOfLeaf, ballType, game )
    startSquarePos.setX( widthOfLeaf )
    startSquarePos.setY( 0 )
    fillSquareWithBalls( startSquarePos , heightOfLeaf, widthOfLeaf, ballType, game )
}

function fillSquareWithBalls( startSquare, width, height, type, game ) {
    for( let x = 0; x < width; x++  ) {
        for( let y = 0; y < height; y++ ) {
            let figurPos = startSquare.getCopy()
            figurPos.addX( x )
            figurPos.addY( y )
            initializateFigur( game, figurPos, type)
        }
    }
}

function initializateFigur( game, pos, figurType) {
    let num =  getNumberOfBallByPosition( pos )
    if ( num != "nan" ) {
        let name = "ball" + `${num}`
        let figur = new Figur()
        figur.setType( figurType )
        figur.setDisplayInformationOfElement( ballsFigurDisplayInformation )
        figur.setName( name )
        figur.setTeam( teamName )
        game.setElement( figur )
        listOfInitializatedBalls[ name ] = pos
    }
}

function getNumberOfBallByPosition( pos ) {
    let x = pos.getX()
    let y = pos.getY()
    if ( x == Math.floor(widthOfLeaf/2) && y == Math.floor( heightOfLeaf/2 ) ) {
        return "nan"
    }
    let num = `${x}` + "x" + `${y}`
    return num
}







let facadeDisplay = new FacadeDisplay()

let lite = new Lite()
lite.setPower( 128 )
lite.setReflexPower( 32 )
facadeDisplay.setLite( lite )

let dispInformOfSelectedElement = new DisplayInformationOfElement()
let dispInformOfEndMoveElement = new DisplayInformationOfElement()
let colorListOfSelectedElement = ["#147d33", "#702200"]
let colorListOfEndMoveElement = ["#13394D", "#702200"]
dispInformOfSelectedElement.setColorList( colorListOfSelectedElement )
dispInformOfEndMoveElement.setColorList( colorListOfEndMoveElement )
facadeDisplay.setDispInformOfSelectCell( dispInformOfSelectedElement )
facadeDisplay.setDispInformOfSelectCell( dispInformOfEndMoveElement )
facadeDisplay.setFunctionCalculateColorSelect( calculateColorSelect )
facadeDisplay.setBackgroundColor("#4EA7E1")

function calculateColorSelect( pos, gameBoard ) {
    return 1
}

game.setFunctCreateStartBoard( createStartBoard )
game.setFunctCalculateStatusOfGame( calculateStatusOfGame )
game.setDisplay( facadeDisplay )


function createStartBoard( board ) {
    arrangeFigur( board, listOfInitializatedBalls )
    arrangeCell( board, listOfInitializatedCells )
    board.setWalkingTeam( teamName )
}

function arrangeFigur( board, listOfInitializatedBalls ) {
    let namesOfFigurs = Object.keys( listOfInitializatedBalls )
    for ( let nameFigur of namesOfFigurs ) {
        let pos = listOfInitializatedBalls[ nameFigur ]
        let figurPos = pos.getCopy()
        board.selectFigurByName( nameFigur )
        board.setPositionForSelectFigur( figurPos )
    }
}

function arrangeCell( board, listOfInitializatedCells ) {
    let namesOfCells = Object.keys( listOfInitializatedCells )
    for ( let nameCell of namesOfCells ) {
        let pos = listOfInitializatedCells[ nameCell ]
        let cellPos = pos.getCopy()
        board.selectCellByName( nameCell )
        board.setPositionForSelectCell( cellPos )
    }
}

function calculateStatusOfGame( board ) {
    return "_empty"
}

export { game }