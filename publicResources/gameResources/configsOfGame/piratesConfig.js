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


export { game }