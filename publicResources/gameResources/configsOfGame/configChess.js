import { FacadeGame, Figur, Cell, TypeOfFigur, TypeOfCell, Move, Pos, Bot } from "../gameScripts/gameBoard.js";
import { FacadeDisplay, DisplayInformationOfType, DisplayInformationOfElement, Dot, BuilderModel, BuilderCompositeModel, Lite } from "../gameScripts/display.js";


let listDotsOfSurfaceCell = [
    new Dot( -1, 0, 1 ),
    new Dot( -1, 0, -1 ),
    new Dot( 1, 0, -1 ),
    new Dot( 1, 0, 1 )
]
let listDotsOfSurfaceDeskSimpleCell = [
    new Dot( -1, -0.1, 1 ),
    new Dot( -1, -0.1, -1 ),
    new Dot( 1, -0.1, -1 ),
    new Dot( 1, -0.1, 1 )
]
let lisDotsOfbottomDeskSimpleCell = [
    new Dot( -1, -2, 1 ),
    new Dot( 1, -2, 1 ),
    new Dot( 1, -2, -1 ),
    new Dot( -1, -2, -1 )
]
let listDotsOfSurfaceDeskBorderCell = [
    new Dot( -3, -0.01, 1 ),
    new Dot( -3, -0.01, -1 ),
    new Dot( 1, -0.01, -1 ),
    new Dot( 1, -0.01, 1 )
]
let listDotsOfbottomDeskBorderCell = [
    new Dot( -3, -2, 1 ),
    new Dot( 1, -2, 1 ),
    new Dot( 1, -2, -1 ),
    new Dot( -3, -2, -1 )
]
let listDotsOfBorderDeskBorderCell = [
    new Dot( -3, -2, -1 ),
    new Dot( -3, -0.01, -1 ),
    new Dot( -3, -0.01, 1 ),
    new Dot( -3, -2, 1 )
]
let listDotsOfSurfaceDeskAngularCell = [
    new Dot( -3, -0.01, 1 ),
    new Dot( -3, -0.01, -3 ),
    new Dot( 1, -0.01, -3 ),
    new Dot( 1, -0.01, 1 )
]
let listDotsOfbottomDeskAngularCell = [
    new Dot( -3, -2, 1 ),
    new Dot( 1, -2, 1 ),
    new Dot( 1, -2, -3 ),
    new Dot( -3, -2, -3 )
]
let listDotsOfLeftBorderDeskAngularCell = [
    new Dot( -3, -2, -3 ),
    new Dot( -3, -0.01, -3 ),
    new Dot( -3, -0.01, 1 ),
    new Dot( -3, -2, 1 )
]
let listDotsOfForwarsBorderDeskAngularCell = [
    new Dot( 1, -2, -3 ),
    new Dot( 1, -0.01, -3 ),
    new Dot( -3, -0.01, -3 ),
    new Dot( -3, -2, -3 )
]


let simpleCellType = new TypeOfCell()

let simpleCellDisplayInformationOfType = new DisplayInformationOfType()
let simpleCellModel = new BuilderModel()
simpleCellModel.setScale( 5000 )
simpleCellModel.selectColorNumber( 1 )
simpleCellModel.drawQuadrilateral( listDotsOfSurfaceDeskSimpleCell )
simpleCellModel.drawQuadrilateral( lisDotsOfbottomDeskSimpleCell )
simpleCellModel.selectColorNumber( 0 )
simpleCellModel.drawQuadrilateral( listDotsOfSurfaceCell )
simpleCellDisplayInformationOfType.setBuilderModel( simpleCellModel )
simpleCellType.setDisplayInformationOfType( simpleCellDisplayInformationOfType )



let rightBorderCellType = new TypeOfCell()

let rightBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let rightBorderCellModel = new BuilderModel()
rightBorderCellModel.setScale( 5000 )
rightBorderCellModel.selectColorNumber( 1 )
rightBorderCellModel.drawQuadrilateral( listDotsOfSurfaceDeskBorderCell )
rightBorderCellModel.drawQuadrilateral( listDotsOfbottomDeskBorderCell )
rightBorderCellModel.drawQuadrilateral( listDotsOfBorderDeskBorderCell )
rightBorderCellModel.selectColorNumber( 0 )
rightBorderCellModel.drawQuadrilateral( listDotsOfSurfaceCell  )
rightBorderCellDisplayInformationOfType.setBuilderModel( rightBorderCellModel )
rightBorderCellType.setDisplayInformationOfType( rightBorderCellDisplayInformationOfType )


let leftBorderCellType = new TypeOfCell()

let leftBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let leftBorderCellModel = rightBorderCellModel.getCopy()
leftBorderCellModel.rotateAroundAxisY( 180 )
leftBorderCellDisplayInformationOfType.setBuilderModel( leftBorderCellModel )
leftBorderCellType.setDisplayInformationOfType( leftBorderCellDisplayInformationOfType )


let forwardBorderCellType = new TypeOfCell()

let forwardBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let forwardBorderCellModel = rightBorderCellModel.getCopy()
forwardBorderCellModel.rotateAroundAxisY( -90 )
forwardBorderCellDisplayInformationOfType.setBuilderModel( forwardBorderCellModel )
forwardBorderCellType.setDisplayInformationOfType( forwardBorderCellDisplayInformationOfType )


let backBorderCellType = new TypeOfCell()

let backBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let backBorderCellModel = rightBorderCellModel.getCopy()
backBorderCellModel.rotateAroundAxisY( 90 )
backBorderCellDisplayInformationOfType.setBuilderModel( backBorderCellModel )
backBorderCellType.setDisplayInformationOfType( backBorderCellDisplayInformationOfType )



let leftForwardBorderCellType = new TypeOfCell()

let leftForwardBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let leftForwardBorderCellModel = new BuilderModel()
leftForwardBorderCellModel.setScale( 5000 )
leftForwardBorderCellModel.selectColorNumber( 1 )
leftForwardBorderCellModel.drawQuadrilateral( listDotsOfSurfaceDeskAngularCell )
leftForwardBorderCellModel.drawQuadrilateral( listDotsOfbottomDeskAngularCell )
leftForwardBorderCellModel.drawQuadrilateral( listDotsOfLeftBorderDeskAngularCell )
leftForwardBorderCellModel.drawQuadrilateral( listDotsOfForwarsBorderDeskAngularCell )
leftForwardBorderCellModel.selectColorNumber( 0 )
leftForwardBorderCellModel.drawQuadrilateral( listDotsOfSurfaceCell  )
leftForwardBorderCellDisplayInformationOfType.setBuilderModel( leftForwardBorderCellModel )
leftForwardBorderCellType.setDisplayInformationOfType( leftForwardBorderCellDisplayInformationOfType )


let leftBackBorderCellType = new TypeOfCell()

let leftBackBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let leftBackBorderCellModel = leftForwardBorderCellModel.getCopy()
leftBackBorderCellModel.rotateAroundAxisY( 90 )
leftBackBorderCellDisplayInformationOfType.setBuilderModel( leftBackBorderCellModel )
leftBackBorderCellType.setDisplayInformationOfType( leftBackBorderCellDisplayInformationOfType )



let rightForwardBorderCellType = new TypeOfCell()

let rightForwardBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let rightForwardBorderCellModel = leftForwardBorderCellModel.getCopy()
rightForwardBorderCellModel.rotateAroundAxisY( -90 )
rightForwardBorderCellDisplayInformationOfType.setBuilderModel( rightForwardBorderCellModel )
rightForwardBorderCellType.setDisplayInformationOfType( rightForwardBorderCellDisplayInformationOfType )



let rightBackBorderCellType = new TypeOfCell()

let rightBackBorderCellDisplayInformationOfType = new DisplayInformationOfType()
let rightBackBorderCellModel = leftForwardBorderCellModel.getCopy()
rightBackBorderCellModel.rotateAroundAxisY( 180 )
rightBackBorderCellDisplayInformationOfType.setBuilderModel( rightBackBorderCellModel )
rightBackBorderCellType.setDisplayInformationOfType( rightBackBorderCellDisplayInformationOfType )




let rockType = new TypeOfFigur()

let rockDisplayInformationOfType = new DisplayInformationOfType()
let rockModel = new BuilderModel()
rockModel.setScale( 29 )
rockModel.drawHoop( new Dot( 128, 0) )
rockModel.drawHoop( new Dot( 128, 32) )
rockModel.drawHoop( new Dot( 113, 46 ) )
rockModel.drawHoop( new Dot( 125, 62) )
rockModel.drawSphereOutside( new Dot( 115, 92 ), 85 )
rockModel.drawHoop( new Dot( 100, 108 ) )
rockModel.drawHoop( new Dot( 98, 118 ) )
rockModel.drawHoop( new Dot( 92, 124 ) )
rockModel.drawHoop( new Dot( 96, 130 ) )
rockModel.drawSphereOutside( new Dot( 95, 138 ), 9 )
rockModel.drawSphereInside( new Dot( 71, 312 ), 668 )
rockModel.drawSphereInside( new Dot( 76, 326 ), 68 )
rockModel.drawHoop( new Dot( 80, 338 ) )
rockModel.drawHoop( new Dot( 90, 342 ) )
rockModel.drawSphereOutside( new Dot( 90, 360 ), 34 )
rockModel.drawHoop( new Dot( 94, 366 ) )
rockModel.setLastDot( new Dot( 79, 422 ) )
rockModel.drawHoop( new Dot( 79, 402 ) )
rockModel.drawHoop( new Dot( 0, 402 ) )
rockModel.setLastDot( new Dot( 94, 366 ) )
rockModel.drawHoop( new Dot( 94, 422 ) )
rockModel.drawHoop( new Dot( 79, 422 ) )
rockDisplayInformationOfType.setBuilderModel( rockModel )
rockType.setDisplayInformationOfType( rockDisplayInformationOfType )

let firstRockMove = new Move()
firstRockMove.setFunctOfCalcOfMovePosition( firstCalculatorPositionForRock )
firstRockMove.setFunctOfIsPosibleToMove( classicPosibleToMove )
firstRockMove.setFunctOfIsTimeToBreak( classicTimeToBreak )
firstRockMove.setFunctOfChangeBoard( classicChangeBoard )
let secondRockMove = firstRockMove.getCopy()
secondRockMove.setFunctOfCalcOfMovePosition( secondCalculatorPositionForRock )
let thirdRockMove = firstRockMove.getCopy()
thirdRockMove.setFunctOfCalcOfMovePosition( thirdCalculatorPositionForRock )
let fourthRockMove = firstRockMove.getCopy()
fourthRockMove.setFunctOfCalcOfMovePosition( fourthCalculatorPositionForRock )
rockType.addMove( firstRockMove )
rockType.addMove( secondRockMove )
rockType.addMove( thirdRockMove )
rockType.addMove( fourthRockMove )


let bishopType = new TypeOfFigur()

let bishopDisplayInformationOfType = new DisplayInformationOfType()
let bishopModel = new BuilderModel()
bishopModel.setScale( 48.5 )
bishopModel.drawHoop( new Dot( 77, 0 ) )
bishopModel.drawHoop( new Dot( 77, 22 ) )
bishopModel.drawHoop( new Dot( 67, 30 ) )
bishopModel.drawHoop( new Dot( 75, 38 ) )
bishopModel.drawSphereOutside( new Dot( 71, 54 ) )
bishopModel.drawHoop( new Dot( 59, 64 ) )
bishopModel.drawSphereOutside( new Dot( 50, 74 ) )
bishopModel.drawSphereInside( new Dot( 53, 90 ), 50 )
bishopModel.drawHoop( new Dot( 43, 96 ) )
bishopModel.drawSphereInside( new Dot( 28, 154 ), 200)
bishopModel.drawHoop( new Dot( 28, 172 ) )
bishopModel.drawSphereOutside( new Dot( 36, 180 ) )
bishopModel.drawHoop( new Dot( 45, 184 ) )
bishopModel.drawSphereInside( new Dot( 49, 196 ) )
bishopModel.drawHoop( new Dot( 44, 200 ) )
bishopModel.drawHoop( new Dot( 43, 206 ) )
bishopModel.drawSphereOutside( new Dot( 39, 209 ), 10 )
bishopModel.drawHoop( new Dot( 35, 210 ) )
bishopModel.drawSphereOutside( new Dot( 30, 216 ), 10 )
bishopModel.drawHoop( new Dot( 30, 218 ) )
bishopModel.drawHoop( new Dot( 33, 222 ) )
bishopModel.drawSphereOutside( new Dot( 33, 224 ) )
bishopModel.drawHoop( new Dot( 30, 228 ) ) 
bishopModel.drawSphereOutside( new Dot( 17, 312 ), 61 )
bishopModel.drawSphereInside( new Dot( 21, 323 ), 16 )
bishopModel.drawSphereOutside( new Dot( 13, 332 ), 16 )
bishopModel.drawSphereOutside( new Dot( 0, 335 ), 85 )
bishopDisplayInformationOfType.setBuilderModel( bishopModel )
bishopType.setDisplayInformationOfType( bishopDisplayInformationOfType )

let firstBishopMove = new Move()
firstBishopMove.setFunctOfCalcOfMovePosition( firstCalculatorPositionForBishop )
firstBishopMove.setFunctOfIsPosibleToMove( classicPosibleToMove )
firstBishopMove.setFunctOfIsTimeToBreak( classicTimeToBreak )
firstBishopMove.setFunctOfChangeBoard( classicChangeBoard )
let secondBishopMove = firstBishopMove.getCopy()
secondBishopMove.setFunctOfCalcOfMovePosition( secondCalculatorPositionForBishop )
let thirdBishopMove = firstBishopMove.getCopy()
thirdBishopMove.setFunctOfCalcOfMovePosition( thirdCalculatorPositionForBishop )
let fourthBishopMove = firstBishopMove.getCopy()
fourthBishopMove.setFunctOfCalcOfMovePosition( fourthCalculatorPositionForBishop )
bishopType.addMove( firstBishopMove )
bishopType.addMove( secondBishopMove )
bishopType.addMove( thirdBishopMove )
bishopType.addMove( fourthBishopMove )


let queenType = new TypeOfFigur()

let queenDisplayInformationOfType = new DisplayInformationOfType()
let queenModel = new BuilderModel()
queenModel.setScale( 25 )
queenModel.drawHoop( new Dot( 152, 0 ) )
queenModel.drawHoop( new Dot( 152, 42 ) )
queenModel.drawHoop( new Dot( 138, 54 ) )
queenModel.drawHoop( new Dot( 138, 62 ) )
queenModel.drawHoop( new Dot( 148, 76 ) )
queenModel.drawSphereOutside( new Dot( 129, 115 ), 95 )
queenModel.drawHoop( new Dot( 118, 126 ) )
queenModel.drawSphereOutside( new Dot( 100, 150 ), 42 )
queenModel.drawHoop( new Dot( 105, 178 ) )
queenModel.drawHoop( new Dot( 90, 192 ) )
queenModel.drawSphereInside( new Dot( 58, 390 ), 450 )
queenModel.drawHoop( new Dot( 58, 440 ) )
queenModel.drawSphereOutside( new Dot( 70, 410 ) )
queenModel.drawHoop( new Dot( 90, 418 ) )
queenModel.drawSphereInside( new Dot( 98, 444 ) )
queenModel.drawHoop( new Dot( 88, 450 ) )
queenModel.drawHoop( new Dot( 86, 462 ) )
queenModel.drawSphereOutside( new Dot( 78, 468 ), 20 )
queenModel.drawHoop( new Dot( 70, 470 ) )
queenModel.drawSphereOutside( new Dot( 60, 482 ), 20 )
queenModel.drawHoop( new Dot( 60, 486 ) )
queenModel.drawHoop( new Dot( 66, 494 ) )
queenModel.drawSphereOutside( new Dot( 66, 498 ) )
queenModel.drawHoop( new Dot( 60, 506 ) ) 
queenModel.drawSphereOutside( new Dot( 90, 652 ), 400 )
queenModel.drawSphereOutside( new Dot( 27, 684 ), 110 )
queenModel.drawSphereInside( new Dot( 30, 695 ), 16 )
queenModel.drawSphereOutside( new Dot( 22, 705 ), 16 )
queenModel.drawSphereOutside( new Dot( 0, 709 ), 85 )
queenDisplayInformationOfType.setBuilderModel( queenModel )
queenType.setDisplayInformationOfType( queenDisplayInformationOfType )

queenType.addMove( firstBishopMove )
queenType.addMove( secondBishopMove )
queenType.addMove( thirdBishopMove )
queenType.addMove( fourthBishopMove )
queenType.addMove( firstRockMove )
queenType.addMove( secondRockMove )
queenType.addMove( thirdRockMove )
queenType.addMove( fourthRockMove )


let whiteKnightType = new TypeOfFigur()

let whiteKnightDisplayInformationOfType = new DisplayInformationOfType()
let whiteKnightModel = new BuilderCompositeModel()
let baseOfKnight = new BuilderModel()
let headOfKnigth = new BuilderModel()
baseOfKnight.setScale( 29 )
baseOfKnight.drawHoop( new Dot( 128, 0) )
baseOfKnight.drawHoop( new Dot( 128, 32) )
baseOfKnight.drawHoop( new Dot( 113, 46 ) )
baseOfKnight.drawHoop( new Dot( 125, 62) )
baseOfKnight.drawSphereOutside( new Dot( 115, 92 ), 85 )
baseOfKnight.drawHoop( new Dot( 100, 108 ) )
baseOfKnight.drawHoop( new Dot( 98, 118 ) )
baseOfKnight.drawHoop( new Dot( 92, 124 ) )
baseOfKnight.drawHoop( new Dot( 96, 130 ) )
baseOfKnight.drawHoop( new Dot( 0, 130 ) )
headOfKnigth.setScale( 29 )
headOfKnigth.beginPath()
headOfKnigth.setWidthEdgeOfDrawingPath( 35 )
headOfKnigth.drawDotOfPath( new Dot( 0, 130 ) )
headOfKnigth.drawDotOfPath( new Dot( 76, 130 ) )
headOfKnigth.drawDotOfPath( new Dot( 104, 145 ) )
headOfKnigth.drawDotOfPath( new Dot( 16, 298 ) )
headOfKnigth.drawDotOfPath( new Dot( 83, 278 ) )
headOfKnigth.drawDotOfPath( new Dot( 99, 258 ) )
headOfKnigth.drawDotOfPath( new Dot( 119, 258 ) )
headOfKnigth.drawDotOfPath( new Dot( 147, 292 ) )
headOfKnigth.drawDotOfPath( new Dot( 142, 302 ) )
headOfKnigth.drawDotOfPath( new Dot( 150, 314 ) )
headOfKnigth.drawDotOfPath( new Dot( 117, 336 ) )
headOfKnigth.drawDotOfPath( new Dot( 81, 368 ) )
headOfKnigth.drawDotOfPath( new Dot( 86, 378 ) )
headOfKnigth.drawDotOfPath( new Dot( 63, 405 ) )
headOfKnigth.drawDotOfPath( new Dot( 21, 405 ) )
headOfKnigth.drawDotOfPath( new Dot( 21, 446 ) )
//headOfKnigth.drawDotOfPath( new Dot( -44, 405 ) )
headOfKnigth.drawDotOfPath( new Dot( -53, 405 ) )
headOfKnigth.drawDotOfPath( new Dot( -101, 304 ) )
headOfKnigth.drawDotOfPath( new Dot( -115, 254 ) )
headOfKnigth.drawDotOfPath( new Dot( -103, 155 ) )
headOfKnigth.drawDotOfPath( new Dot( -76, 130 ) )
headOfKnigth.finishPath()
headOfKnigth.rotateAroundAxisY( -90 )
whiteKnightModel.addBuilderModel( "baseknight", baseOfKnight )
whiteKnightModel.addBuilderModel( "headknight", headOfKnigth )
whiteKnightDisplayInformationOfType.setBuilderModel( whiteKnightModel )
whiteKnightType.setDisplayInformationOfType( whiteKnightDisplayInformationOfType )

let knightMove = new Move()
knightMove.setFunctOfCalcOfMovePosition( knightCalcPos )
knightMove.setFunctOfIsPosibleToMove( classicPosibleToMove )
knightMove.setFunctOfIsTimeToBreak( knightTimeToBreak )
knightMove.setFunctOfChangeBoard( classicChangeBoard )
whiteKnightType.addMove(knightMove)


let blackKnightType = new TypeOfFigur()
let blackKnightDisplayInformationOfType = new DisplayInformationOfType()
let blackKnightModel = new BuilderCompositeModel()
let blackHeadOfKnigth = headOfKnigth.getCopy()
blackHeadOfKnigth.rotateAroundAxisY( 180 )
blackKnightModel.addBuilderModel( "baseknight", baseOfKnight )
blackKnightModel.addBuilderModel( "headknight", blackHeadOfKnigth )
blackKnightDisplayInformationOfType.setBuilderModel( blackKnightModel )
blackKnightType.setDisplayInformationOfType( blackKnightDisplayInformationOfType )

blackKnightType.addMove(knightMove)


let kingType = new TypeOfFigur()

let kingDisplayInformationOfType = new DisplayInformationOfType()
let kingModel = new BuilderModel()
kingModel.setScale( 25 )
kingModel.drawHoop( new Dot( 152, 0 ) )
kingModel.drawHoop( new Dot( 152, 42 ) )
kingModel.drawHoop( new Dot( 138, 54 ) )
kingModel.drawHoop( new Dot( 138, 62 ) )
kingModel.drawHoop( new Dot( 148, 76 ) )
kingModel.drawSphereOutside( new Dot( 129, 115 ), 95 )
kingModel.drawHoop( new Dot( 118, 126 ) )
kingModel.drawSphereOutside( new Dot( 100, 150 ), 42 )
kingModel.drawHoop( new Dot( 105, 178 ) )
kingModel.drawHoop( new Dot( 90, 192 ) )
kingModel.drawSphereInside( new Dot( 58, 390 ), 450 )
kingModel.drawHoop( new Dot( 58, 440 ) )
kingModel.drawSphereOutside( new Dot( 70, 410 ) )
kingModel.drawHoop( new Dot( 90, 418 ) )
kingModel.drawSphereInside( new Dot( 98, 444 ) )
kingModel.drawHoop( new Dot( 88, 450 ) )
kingModel.drawHoop( new Dot( 86, 462 ) )
kingModel.drawSphereOutside( new Dot( 78, 468 ), 20 )
kingModel.drawHoop( new Dot( 70, 470 ) )
kingModel.drawSphereOutside( new Dot( 60, 482 ), 20 )
kingModel.drawHoop( new Dot( 60, 486 ) )
kingModel.drawHoop( new Dot( 66, 494 ) )
kingModel.drawSphereOutside( new Dot( 66, 498 ) )
kingModel.drawHoop( new Dot( 60, 506 ) ) 
kingModel.drawSphereOutside( new Dot( 90, 652 ), 400 )
kingModel.drawSphereOutside( new Dot( 27, 684 ), 110 )
kingModel.drawSphereOutside( new Dot( 0, 684 ), 110 )
kingModel.setWidthEdgeOfDrawingPath( 10 )
kingModel.beginPath()
kingModel.drawDotOfPath( new Dot( 10, 684 ) )
kingModel.drawDotOfPath( new Dot( 10, 724 ) )
kingModel.drawDotOfPath( new Dot( 30, 724 ) )
kingModel.drawDotOfPath( new Dot( 30, 744 ) )
kingModel.drawDotOfPath( new Dot( 10, 744 ) )
kingModel.drawDotOfPath( new Dot( 10, 764 ) )
kingModel.drawDotOfPath( new Dot( -10, 764 ) )
kingModel.drawDotOfPath( new Dot( -10, 744 ) )
kingModel.drawDotOfPath( new Dot( -30, 744 ) )
kingModel.drawDotOfPath( new Dot( -30, 724 ) )
kingModel.drawDotOfPath( new Dot( -10, 724 ) )
kingModel.drawDotOfPath( new Dot( -10, 684 ) )
kingModel.finishPath()
kingDisplayInformationOfType.setBuilderModel( kingModel )
kingType.setDisplayInformationOfType( kingDisplayInformationOfType )

let kingMove = new Move()
let castlingMove = kingMove.getCopy()//todo
kingMove.setFunctOfCalcOfMovePosition( kingCalcPos )
kingMove.setFunctOfIsPosibleToMove( classicPosibleToMove )
kingMove.setFunctOfIsTimeToBreak( knightTimeToBreak )
kingMove.setFunctOfChangeBoard( classicChangeBoard )
kingType.addMove( kingMove )


let whitePawnType = new TypeOfFigur()

let pawnDisplayInformationOfType = new DisplayInformationOfType()
let pawnModel = new BuilderModel()
pawnModel.setScale( 115 )
pawnModel.drawHoop( new Dot(32.5,0) )
pawnModel.drawHoop( new Dot(32.5,9) )
pawnModel.drawHoop( new Dot(28,12) )
pawnModel.drawHoop( new Dot(31,18) )
pawnModel.drawSphereOutside( new Dot(31,26) )
pawnModel.drawHoop( new Dot(19.5,36) )
pawnModel.drawHoop( new Dot(19.5,41) )
pawnModel.drawSphereInside( new Dot(11,55), 0, 20 )
pawnModel.drawHoop( new Dot(11.5,68) )
pawnModel.drawHoop( new Dot(17,68) )
pawnModel.drawSphereOutside( new Dot(17,74) )
pawnModel.drawHoop( new Dot(7,79) )
pawnModel.drawSphereOutsideCenterRad( new Dot(0,115) )
pawnDisplayInformationOfType.setBuilderModel( pawnModel )
whitePawnType.setDisplayInformationOfType( pawnDisplayInformationOfType )

let whitePawnMoveForward = new Move()
whitePawnMoveForward.setFunctOfCalcOfMovePosition( whitePawnCalcMoveForward )
whitePawnMoveForward.setFunctOfIsPosibleToMove( pawnPossibleMoveForward )
whitePawnMoveForward.setFunctOfIsTimeToBreak( pawnTimeToBreak )
whitePawnMoveForward.setFunctOfChangeBoard( pawnChangeBoard )
let whitePawnMoveTwoCellsForward = whitePawnMoveForward.getCopy()
whitePawnMoveTwoCellsForward.setFunctOfCalcOfMovePosition( whitePawnCalcMoveTwoCellsForward )
whitePawnMoveTwoCellsForward.setFunctOfIsPosibleToMove( whitePawnPossibleTwoCellsForward )
let whitePawnEatFigur = whitePawnMoveForward.getCopy()
whitePawnEatFigur.setFunctOfCalcOfMovePosition( whitePawnCalcEatFigur )
whitePawnEatFigur.setFunctOfIsPosibleToMove( pawnPossibleEat )
whitePawnEatFigur.setFunctOfIsTimeToBreak( pawnTimeToBreakForEat )
whitePawnType.addMove( whitePawnMoveForward )
whitePawnType.addMove( whitePawnMoveTwoCellsForward )
whitePawnType.addMove( whitePawnEatFigur )


let blackPawnType = new TypeOfFigur()

blackPawnType.setDisplayInformationOfType( pawnDisplayInformationOfType )

let blackPawnMoveForward = new Move()
blackPawnMoveForward.setFunctOfCalcOfMovePosition( blackPawnCalcMoveForward )
blackPawnMoveForward.setFunctOfIsPosibleToMove( pawnPossibleMoveForward )
blackPawnMoveForward.setFunctOfIsTimeToBreak( pawnTimeToBreak )
blackPawnMoveForward.setFunctOfChangeBoard( pawnChangeBoard )
let blackPawnMoveTwoCellsForward = blackPawnMoveForward.getCopy()
blackPawnMoveTwoCellsForward.setFunctOfCalcOfMovePosition( blackPawnCalcMoveTwoCellsForward )
blackPawnMoveTwoCellsForward.setFunctOfIsPosibleToMove( blackPawnPossibleTwoCellsForward )
let blackPawnEatFigur = blackPawnMoveForward.getCopy()
blackPawnEatFigur.setFunctOfCalcOfMovePosition( blackPawnCalcEatFigur )
blackPawnEatFigur.setFunctOfIsPosibleToMove( pawnPossibleEat )
blackPawnEatFigur.setFunctOfIsTimeToBreak( pawnTimeToBreakForEat )
blackPawnType.addMove( blackPawnMoveForward )
blackPawnType.addMove( blackPawnMoveTwoCellsForward )
blackPawnType.addMove( blackPawnEatFigur )



function classicPosibleToMove( board, startPos, itteratorNum, endPos ) {
    //todo clear Code
    if ( board.isEnableCellOnPos( endPos ) ) {
        if ( board.isEnableFigurOnPos( endPos )) {
            let startFigur = board.getFigurByPosition( startPos )
            let teamOfStartFigur = startFigur.getTeam()
            let endFigur = board.getFigurByPosition( endPos )
            let teamOfEndFigur = endFigur.getTeam()
            if ( teamOfEndFigur === teamOfStartFigur ) {
                return false
            } else {
                return true
            }
        } else {
            return true
        } 
    } else {
       return false
    }
}

function classicTimeToBreak( board, startPos, itteratorNum, endPos ) {
    let result = board.isEnableFigurOnPos( endPos ) || !board.isEnableCellOnPos( endPos )
    return result
}

function classicChangeBoard( board, startPos, endPos ) {
    board.selectFigurByPosition( startPos )
    board.setPositionForSelectFigur( endPos )
    changeWalkingTeam( board )
    return board
}


function pawnPossibleMoveForward( board, startPos, itteratorNum , endPos ) {
    let result1 = board.isEnableCellOnPos( endPos )
    let result2 = !board.isEnableFigurOnPos( endPos )
    let totalResult = result1 & result2
    return totalResult
}

function pawnPossibleEat( board, startPos, itteratorNum , endPos ) {
    let isEnableCellOnPos = board.isEnableCellOnPos( endPos )
    let isEnableFigurOnPos = board.isEnableFigurOnPos( endPos )
    let isOtherTeam = false
    if ( isEnableCellOnPos & isEnableFigurOnPos  ) {
        let startFigur = board.getFigurByPosition( startPos )
        let teamOfStartFigur = startFigur.getTeam()
        let endFigur = board.getFigurByPosition( endPos )
        let teamOfEndFigur = endFigur.getTeam()
        isOtherTeam = teamOfStartFigur !== teamOfEndFigur
    }
    let result = isEnableCellOnPos & isEnableFigurOnPos & isOtherTeam
    return result
}

function pawnTimeToBreak( board, startPos, itteratorNum, endPos ) {
    return true
}

function pawnTimeToBreakForEat( board, startPos, itteratorNum, endPos ) {
    return itteratorNum == 1
}

function pawnChangeBoard( board, startPos, endPos ) {
    board.selectFigurByPosition( startPos )
    board.setPositionForSelectFigur( endPos )
    let testPos1 = endPos.getCopy()
    testPos1.addY( 1 )
    let testPos2 = endPos.getCopy()
    testPos2.addY( -1 )
    if ( !board.isEnableCellOnPos( testPos1 ) || !board.isEnableCellOnPos( testPos2 ) ) {
        let pawn = board.getFigurByPosition( endPos )
        let namePawn = pawn.getName()
        let team = pawn.getTeam()
        let num = namePawn.replace( "pawn", "" )
        num = num.replace( team, "" )
        num = Number( num )
        let newType = "queen"
        let nameQueen = team + newType + num
        let copyEndPos = endPos.getCopy()
        board.selectFigurByName( nameQueen )
        board.setPositionForSelectFigur( copyEndPos )
    }
    changeWalkingTeam( board )
}


function firstCalculatorPositionForRock( board, startPos, itteratorNum) {
    let endPos = startPos.getCopy()
    itteratorNum++
    endPos.addX( itteratorNum )
    return endPos
}

function secondCalculatorPositionForRock( board, startPos, itteratorNum) {
    let endPos = startPos.getCopy()
    itteratorNum++
    endPos.addY( itteratorNum )
    return endPos
}

function thirdCalculatorPositionForRock( board, startPos, itteratorNum) {
    let endPos = startPos.getCopy()
    itteratorNum++
    endPos.addX( -itteratorNum )
    return endPos
}

function fourthCalculatorPositionForRock( board, startPos, itteratorNum) {
    let endPos = startPos.getCopy()
    itteratorNum++
    endPos.addY( -itteratorNum )
    return endPos
}


function firstCalculatorPositionForBishop( board, startPos, itteratorNum ) {
    return bishopCalcPos(  board, startPos, itteratorNum, 1, 1 )
}

function secondCalculatorPositionForBishop( board, startPos, itteratorNum) {
    return bishopCalcPos(  board, startPos, itteratorNum, -1, 1 )
}

function thirdCalculatorPositionForBishop( board, startPos, itteratorNum) {
    return bishopCalcPos(  board, startPos, itteratorNum, 1, -1 )
}

function fourthCalculatorPositionForBishop( board, startPos, itteratorNum) {
    return bishopCalcPos(  board, startPos, itteratorNum, -1, -1 )
}

function bishopCalcPos(  board, startPos, itteratorNum, a, b ) {
    let endPos = startPos.getCopy()
    itteratorNum++
    let differentX = a*itteratorNum
    let differentY = b*itteratorNum
    endPos.addX( differentX )
    endPos.addY( differentY )
    return endPos
}


function knightCalcPos( board, startPos, itteratorNum ) {
    // let endPos = startPos.getCopy()
    // let fork = Math.floor(itteratorNum/5)
    // let cellNum = itteratorNum % 5
    // let xOffSet = 0
    // let yOffSet = 0
    // for ( let i = 0; i < Math.min(cellNum, 2); i++ ) {
    //     xOffSet++
    // }
    // for ( let i = 2; i < cellNum; i++ ) {
    //     yOffSet++
    // }
    // if ( fork == 0 ) {
    //     endPos.addY( xOffSet )
    //     endPos.addX( yOffSet )
    // } else if ( fork == 1 ) {
    //     endPos.addX( xOffSet )
    //     endPos.addY( -yOffSet )
    // } else if ( fork == 2 ) {
    //     endPos.addX( -yOffSet )
    //     endPos.addY( -xOffSet )
    // } else if ( fork == 3 ) {
    //     endPos.addX( -xOffSet )
    //     endPos.addY( yOffSet )
    // }
    // console.log( xOffSet, yOffSet )
    // return endPos
    let endPos = startPos.getCopy()
    let xOffSet = 1
    let yOffSet = 2
    let xMark = 1
    let yMark = 1
    if ( itteratorNum >= 4 ) {
        xOffSet = 2
        yOffSet = 1
    }
    let resultOfXMark = (((itteratorNum)/2) % 2 )>= 1
    if ( resultOfXMark ) {
        xMark = -1
    }
    if ( itteratorNum% 2 == 1 ) {
        yMark = -1
    }
    let totalXOffSet = xMark*xOffSet
    let totalYOffSet = yMark*yOffSet
    endPos.addX( totalXOffSet )
    endPos.addY( totalYOffSet )
    return endPos
}

function knightTimeToBreak(board, startPos, itteratorNum, endPos) {
    return itteratorNum >= 7
}


function whitePawnCalcMoveForward( board, startPos, itteratorNum ) {
    let endPos = startPos.getCopy()
    endPos.addY( 1 )
    return endPos
} 

function whitePawnCalcMoveTwoCellsForward( board, startPos, itteratorNum ) {
    let endPos = startPos.getCopy()
    endPos.addY( 2 )
    return endPos
}

function whitePawnPossibleTwoCellsForward( board, startPos, itteratorNum , endPos) {
    let testPos = startPos.getCopy()
    testPos.addY( 1 )
    let resultFirstCell = ( board.isEnableCellOnPos( testPos ) & !board.isEnableFigurOnPos( testPos ) )
    let resultSecondCell = ( board.isEnableCellOnPos( endPos ) & !board.isEnableFigurOnPos( endPos ) )
    testPos.addY( -3 )
    let resultOfEnableCell = !board.isEnableCellOnPos( testPos )
    let totalResult = resultFirstCell & resultSecondCell & resultOfEnableCell 
    return totalResult
}

function whitePawnCalcEatFigur( board, startPos, itteratorNum) {
    let endPos = startPos.getCopy()
    endPos.addY( 1 )
    let x = 1 -2*itteratorNum
    endPos.addX( x )
    return endPos
}


function blackPawnCalcMoveForward( board, startPos, itteratorNum ) {
    let endPos = startPos.getCopy()
    endPos.addY( -1 )
    return endPos
} 

function blackPawnCalcMoveTwoCellsForward( board, startPos, itteratorNum ) {
    let endPos = startPos.getCopy()
    endPos.addY( -2 )
    return endPos
}

function blackPawnPossibleTwoCellsForward( board, startPos, itteratorNum , endPos) {
    let testPos = startPos.getCopy()
    testPos.addY( -1 )
    let resultFirstCell = ( board.isEnableCellOnPos( testPos ) & !board.isEnableFigurOnPos( testPos ) )
    let resultSecondCell = ( board.isEnableCellOnPos( endPos ) & !board.isEnableFigurOnPos( endPos ) )
    testPos.addY( 3 )
    let resultOfEnableCell = !board.isEnableCellOnPos( testPos )
    let totalResult = resultFirstCell & resultSecondCell & resultOfEnableCell 
    return totalResult
}

function blackPawnCalcEatFigur( board, startPos, itteratorNum) {
    let endPos = startPos.getCopy()
    endPos.addY( -1 )
    let x = 1 -2*itteratorNum
    endPos.addX( x )
    return endPos
}

function kingCalcPos( board, startPos, itteratorNum ) {
    if ( itteratorNum >= 4 ) {
        itteratorNum++
    }
    let x = ( itteratorNum % 3 ) - 1
    let y = ( Math.floor( itteratorNum / 3 ) - 1 )
    let endPos = startPos.getCopy()
    endPos.addY( y )
    endPos.addX( x )
    return endPos
}

function changeWalkingTeam( board ) {
    // if ( (moveIndex % 3) == 2 ) {
    //     board.setWalkingTeam( "black" )
    // } else {
    //     board.setWalkingTeam( "white" )
    // }
    if ( board.getWalkingTeam() == "white" ) {
        board.setWalkingTeam( "black" )
    } else {
        board.setWalkingTeam( "white" )
    }
    //moveIndex++
}







let game = new FacadeGame()

let whiteCellColorList = ["#999999","#702200"]
let whiteCellDisplayInformation = new DisplayInformationOfElement()
whiteCellDisplayInformation.setColorList( whiteCellColorList )

let blackCellColorList = ["#803210","#702200"]
let blackCellDisplayInformation = new DisplayInformationOfElement()
blackCellDisplayInformation.setColorList( blackCellColorList )

let sizeBoard = 8
let startX = 0
let startY = 0

initializateCentralCells( game )
initializateBorderCells( game )
initializateAngularCells( game )

function initializateCentralCells( game ) {
    for( let x = 1; x < sizeBoard-1; x++) {
        for( let y = 1; y < sizeBoard-1; y++) {
            inizializateCell( game, startX + x, startY + y, simpleCellType)
        }
    }
}
function initializateBorderCells( game ) {
    for ( let x = 1; x < sizeBoard-1; x++ ) {
        let y = 0
        inizializateCell( game, startX + x, startY + y, forwardBorderCellType )
    }
    for ( let x = 1; x < sizeBoard-1; x++ ) {
        let y = sizeBoard - 1
        inizializateCell( game, startX + x, startY + y, backBorderCellType )
    }
    for ( let y = 1; y < sizeBoard-1; y++ ) {
        let x = 0
        inizializateCell( game, startX + x, startY + y, rightBorderCellType )
    }
    for ( let y = 1; y < sizeBoard-1; y++ ) {
        let x = sizeBoard - 1
        inizializateCell( game, startX + x, startY + y, leftBorderCellType )
    }
}
function initializateAngularCells( game ) {
    inizializateCell( game, startX, startY, leftForwardBorderCellType )
    inizializateCell( game, startX, sizeBoard - 1 + startY, leftBackBorderCellType )
    inizializateCell( game, sizeBoard - 1 + startX, startY, rightForwardBorderCellType )
    inizializateCell( game, sizeBoard - 1 + startX, sizeBoard - 1 + startY, rightBackBorderCellType )
}

function inizializateCell( game, x, y, cellType) {
    let num =  getNumberOfCellByPosition( x, y )
    let disp = getDisplayByPositionCell( x, y )
    let name = "cell" + `${num}`
    let cell = new Cell()
    cell.setType( cellType )
    cell.setDisplayInformationOfElement( disp )
    cell.setName( name )
    game.setElement( cell )
}

function getDisplayByPositionCell( x, y ) {
    let sum = x+y
    if( sum%2 != 0 ) {
        return whiteCellDisplayInformation
    } else {
        return blackCellDisplayInformation
    }
}

function getNumberOfCellByPosition( x, y ) {
    let num = y*sizeBoard + x
    return num
}



//"#125632", -зеленый
//"#FFFF66" - лампочка
// "#561231", - фиолетовый
// "#13394D", - синий
// "#8a0a07" - красный
//"#aa00aa",


let quality = 6

let blackTeamName = "black"
let whiteTeamName = "white"

let whiteColorList = ["#13394D","#8a0a07"]
let whiteFigurDisplayInformation = new DisplayInformationOfElement()
whiteFigurDisplayInformation.setColorList( whiteColorList )
whiteFigurDisplayInformation.setQuality( quality )

let blackFigurColorList = ["#8a0a07","#13394D"]
let blackFigurDisplayInformation = new DisplayInformationOfElement()
blackFigurDisplayInformation.setColorList( blackFigurColorList )
blackFigurDisplayInformation.setQuality( quality )

let initializationListWhiteFigurs = [
    [ "king", kingType ],
    [ "queen", queenType ],
    [ "bishop1", bishopType],
    [ "bishop2", bishopType],
    [ "knight1", whiteKnightType ],
    [ "knight2", whiteKnightType ],
    [ "rock1", rockType],
    [ "rock2", rockType],
    [ "queen1", queenType ],
    [ "queen2", queenType ],
    [ "queen3", queenType ],
    [ "queen4", queenType ],
    [ "queen5", queenType ],
    [ "queen6", queenType ],
    [ "queen7", queenType ],
    [ "queen8", queenType ]
]
let initializationListBlackFigurs = [
    [ "king", kingType ],
    [ "queen", queenType ],
    [ "bishop1", bishopType],
    [ "bishop2", bishopType],
    [ "knight1", blackKnightType ],
    [ "knight2", blackKnightType ],
    [ "rock1", rockType],
    [ "rock2", rockType],
    [ "queen1", queenType ],
    [ "queen2", queenType ],
    [ "queen3", queenType ],
    [ "queen4", queenType ],
    [ "queen5", queenType ],
    [ "queen6", queenType ],
    [ "queen7", queenType ],
    [ "queen8", queenType ]
]
let initializationOfWhitePawnList = [
    [ "pawn1", whitePawnType],
    [ "pawn2", whitePawnType],
    [ "pawn3", whitePawnType],
    [ "pawn4", whitePawnType],
    [ "pawn5", whitePawnType],
    [ "pawn6", whitePawnType],
    [ "pawn7", whitePawnType],
    [ "pawn8", whitePawnType],
]
let initializationOfBlackPawnList = [
    [ "pawn1", blackPawnType],
    [ "pawn2", blackPawnType],
    [ "pawn3", blackPawnType],
    [ "pawn4", blackPawnType],
    [ "pawn5", blackPawnType],
    [ "pawn6", blackPawnType],
    [ "pawn7", blackPawnType],
    [ "pawn8", blackPawnType],
]


function initializateList(list, teamName, displayInformation, game) {
    for ( let elementList of list ) {
        inizializateElementList( elementList, teamName, displayInformation, game )
    }
}

let qlity = 2
let coffScale = 0.3

function inizializateElementList( elementList, teamName, displayInformation, game ) {
    let nameFigur = teamName + elementList[0]
    let typeFigur = elementList[1]
    let figur = new Figur()
    figur.setName( nameFigur )
    figur.setType( typeFigur )
    figur.setTeam( teamName )
    let newDispInf = displayInformation.getCopy()
    newDispInf.setQuality(qlity)
    qlity = Math.floor( Math.random() * 12 ) + 2
    coffScale = Math.random()*1.3 + 0.3
    newDispInf.setScale( coffScale )
    figur.setDisplayInformationOfElement( displayInformation )
    game.setElement( figur )
}

initializateList( initializationListWhiteFigurs, whiteTeamName, whiteFigurDisplayInformation, game )
initializateList( initializationListBlackFigurs, blackTeamName, blackFigurDisplayInformation, game )
initializateList( initializationOfWhitePawnList, whiteTeamName, whiteFigurDisplayInformation, game )
initializateList( initializationOfBlackPawnList, blackTeamName, blackFigurDisplayInformation, game )




// let minMaxBot = new Bot()
// minMaxBot.setCalcNextMoveFunct( functCalcNextMoveMinMax )

// let hashBoardListMinMaxResult = {}
// let MAX_DEPTH = 5;

// function functCalcNextMoveMinMax( board ) {
//     let answer = minMaxAlgoritm( board, MAX_DEPTH )
//     hashBoardListMinMaxResult = {}
//     return answer
// }

// function minMaxAlgoritm( board, depth, alpha = 0 , beta = 0 ) {
//     let hash = board.getHashOfPosition()
//     if ( hashBoardListMinMaxResult[hash] ) {
//         return hashBoardListMinMaxResult[ hash ]
//     }
//     if ( depth == 0 ) {
//         return positionAssessment( board )
//     } else {
//         let maxValue = -Infinity
//         let evaluate
//         if ( board.getWalkingTeam() == "black" ) {
//             maxValue = Infinity
//         }
//         let listMove = board.getListOfStartPos()
//         for( let startPos of listMove ) {
//             let endPosList = board.getListOfEndPosByStartPos( startPos )
//             for ( let endPos of endPosList ) {
//                 let newBoard = board.getCopy()
//                 newBoard.setStartPosMove( startPos )
//                 newBoard.moveTo( endPos )
//                 evaluate = minMaxAlgoritm( newBoard, depth-1, alpha, beta )
//                 if ( board.getWalkingTeam() == "black" ) {
//                     maxValue = Math.min( maxValue, evaluate )
//                     beta = Math.min( beta, evaluate )
//                 } else {
//                     maxMax = Math.max( maxValue, evaluate )
//                     alpha = Math.max( alpha, evaluate )
//                 }
//                 if ( alpha <= beta ) {
//                     break
//                 }
//             }
//         }

//         return maxValue
//     }
// } 

// function positionAssessment() {

// }

// game.setBot( minMaxBot )



let facadeDisplay = new FacadeDisplay()
let dispInformOfSelectedElement = new DisplayInformationOfElement()
let dispInformOfEndMoveElement1 = new DisplayInformationOfElement()
let dispInformOfEndMoveElement2 = new DisplayInformationOfElement()
let dispInformOfEndMoveElementWithFigur1 = new DisplayInformationOfElement()
let dispInformOfEndMoveElementWithFigur2 = new DisplayInformationOfElement()
let colorListOfSelectedElement = ["#147d33", "#702200"]
let colorListOfEndMoveElement1 = ["#28495A", "#702200"]
let colorListOfEndMoveElement2 = ["#13394D", "#702200"]
let colorListOfEndMoveElementWithFigur1 = [ "#8a0a07", "#702200" ]
let colorListOfEndMoveElementWithFigur2 = [ "#9f1f1c", "#702200" ]
dispInformOfSelectedElement.setColorList( colorListOfSelectedElement )
dispInformOfEndMoveElement1.setColorList( colorListOfEndMoveElement1 )
dispInformOfEndMoveElement2.setColorList( colorListOfEndMoveElement2 )
dispInformOfEndMoveElementWithFigur1.setColorList( colorListOfEndMoveElementWithFigur1 )
dispInformOfEndMoveElementWithFigur2.setColorList( colorListOfEndMoveElementWithFigur2 )
facadeDisplay.setDispInformOfSelectCell( dispInformOfSelectedElement )
facadeDisplay.setDispInformOfSelectCell( dispInformOfEndMoveElement1 )
facadeDisplay.setDispInformOfSelectCell( dispInformOfEndMoveElement2 )
facadeDisplay.setDispInformOfSelectCell( dispInformOfEndMoveElementWithFigur1 )
facadeDisplay.setDispInformOfSelectCell( dispInformOfEndMoveElementWithFigur2 )
facadeDisplay.setFunctionCalculateColorSelect( calculateColorSelect )

function calculateColorSelect( pos, gameBoard ) {
    let x = pos.getX()
    let y = pos.getY()
    let mode = (x+y) % 2
    if ( gameBoard.isEnableFigurOnPos( pos ) ) {
        if ( mode == 0 ) {
            return 3
        } else {
            return 4
        }
    } else {
        if ( mode != 0 ) {
            return 1
        } else {
            return 2
        }
    }
}

game.setFunctCreateStartBoard( createStartBoard )
game.setFunctCalculateStatusOfGame( calculateStatusOfGame )
game.setDisplay( facadeDisplay )


function createStartBoard( board ) {
    arrangeWhiteFigur( board )
    arrangeBlackFigur( board )
    arrangeBoardCell( board )
    board.setWalkingTeam( "white" )
}
function arrangeWhiteFigur( board ) {
    board.selectFigurByName( "whiterock1" )
    board.setPositionForSelectFigur( new Pos( 0, 0 ) )
    board.selectFigurByName( "whiteknight1" )
    board.setPositionForSelectFigur( new Pos( 1, 0 ) )
    board.selectFigurByName( "whitebishop1" )
    board.setPositionForSelectFigur( new Pos( 2, 0 ) )
    board.selectFigurByName( "whitequeen" )
    board.setPositionForSelectFigur( new Pos( 3, 0 ) )
    board.selectFigurByName( "whiteking" )
    board.setPositionForSelectFigur( new Pos( 4, 0 ) )
    board.selectFigurByName( "whitebishop2" )
    board.setPositionForSelectFigur( new Pos( 5, 0 ) )
    board.selectFigurByName( "whiteknight2" )
    board.setPositionForSelectFigur( new Pos( 6, 0 ) )
    board.selectFigurByName( "whiterock2" )
    board.setPositionForSelectFigur( new Pos( 7, 0 ) )
    board.selectFigurByName( "whitepawn1" )
    board.setPositionForSelectFigur( new Pos( 0, 1 ) )
    board.selectFigurByName( "whitepawn2" )
    board.setPositionForSelectFigur( new Pos( 1, 1 ) )
    board.selectFigurByName( "whitepawn3" )
    board.setPositionForSelectFigur( new Pos( 2, 1 ) )
    board.selectFigurByName( "whitepawn4" )
    board.setPositionForSelectFigur( new Pos( 3, 1 ) )
    board.selectFigurByName( "whitepawn5" )
    board.setPositionForSelectFigur( new Pos( 4, 1 ) )
    board.selectFigurByName( "whitepawn6" )
    board.setPositionForSelectFigur( new Pos( 5, 1 ) )
    board.selectFigurByName( "whitepawn7" )
    board.setPositionForSelectFigur( new Pos( 6, 1 ) )
    board.selectFigurByName( "whitepawn8" )
    board.setPositionForSelectFigur( new Pos( 7, 1 ) )
}
function arrangeBlackFigur( board ) {
    board.selectFigurByName( "blackrock1" )
    board.setPositionForSelectFigur( new Pos( 0, 7) )
    board.selectFigurByName( "blackknight1" )
    board.setPositionForSelectFigur( new Pos( 1, 7 ) )
    board.selectFigurByName( "blackbishop1" )
    board.setPositionForSelectFigur( new Pos( 2, 7 ) )
    board.selectFigurByName( "blackqueen" )
    board.setPositionForSelectFigur( new Pos( 3, 7 ) )
    board.selectFigurByName( "blackking" )
    board.setPositionForSelectFigur( new Pos( 4, 7 ) )
    board.selectFigurByName( "blackbishop2" )
    board.setPositionForSelectFigur( new Pos( 5, 7 ) )
    board.selectFigurByName( "blackknight2" )
    board.setPositionForSelectFigur( new Pos( 6, 7 ) )
    board.selectFigurByName( "blackrock2" )
    board.setPositionForSelectFigur( new Pos( 7, 7 ) )
    board.selectFigurByName( "blackpawn1" )
    board.setPositionForSelectFigur( new Pos( 0, 6 ) )
    board.selectFigurByName( "blackpawn2" )
    board.setPositionForSelectFigur( new Pos( 1, 6 ) )
    board.selectFigurByName( "blackpawn3" )
    board.setPositionForSelectFigur( new Pos( 2, 6 ) )
    board.selectFigurByName( "blackpawn4" )
    board.setPositionForSelectFigur( new Pos( 3, 6 ) )
    board.selectFigurByName( "blackpawn5" )
    board.setPositionForSelectFigur( new Pos( 4, 6 ) )
    board.selectFigurByName( "blackpawn6" )
    board.setPositionForSelectFigur( new Pos( 5, 6 ) )
    board.selectFigurByName( "blackpawn7" )
    board.setPositionForSelectFigur( new Pos( 6, 6 ) )
    board.selectFigurByName( "blackpawn8" )
    board.setPositionForSelectFigur( new Pos( 7, 6 ) )
}
function arrangeBoardCell( board ) {
    iterateAllPositionAndArrangeCells( board, sizeBoard )
}
function iterateAllPositionAndArrangeCells( board, widthDesk ) {
    for (let x = 0; x < widthDesk; x++) {
        for ( let y = 0; y < widthDesk; y++) {
            setPositionToCell( board, x + startX , y + startY, widthDesk )
        }
    }
}
function setPositionToCell( board, x, y, widthDesk) {
    let numberCell = x + y*widthDesk
    let name = "cell" + `${numberCell}`
    board.selectCellByName( name )
    board.setPositionForSelectCell( new Pos( x, y ) )
}

function calculateStatusOfGame( board ) {
    let nameOfWhiteKing = "whiteking"
    let nameOfBlackKing = "blackking"
    if ( isNotEnableKingOnDesk( board, nameOfWhiteKing ) ) {
        return blackTeamName
    } else if ( isNotEnableKingOnDesk( board, nameOfBlackKing )  ) {
        return whiteTeamName
    } else {
        return "_empty"
    }
}
function isNotEnableKingOnDesk( board, nameOfKing ) {
    let posKing = board.getFigurPosByName( nameOfKing )
    return posKing.isNaN()
}

export { game }
