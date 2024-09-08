class FacadeGame {
    constructor() {
        this.gameBoard = new GameBoard()
        this.display
        this.bot = this.#getBotIfNeed()

        this.optionsOfGame
    }
    #getBotIfNeed() {
        try { 
            global
            return Bot.getRandomBot()
        } catch {
            return undefined
        }
    }

    startGame() {
        try {
            global
            this.gameBoard.start()
        } catch {
            this.#initializateDisplayIfClient()
        }
    }
    #initializateDisplayIfClient() {
        this.gameBoard.setOptionsOfGame( this.optionsOfGame )
        this.gameBoard.start()
        this.display.initializateGame( this )
        this.display.render()
    }

    getCopy() {
        let copyFacadeGame = new FacadeGame()
        copyFacadeGame.gameBoard = this.gameBoard.getCopy()
        copyFacadeGame.setDisplay(this.display)
        copyFacadeGame.setBot(this.bot)
        copyFacadeGame.setOptions( this.optionsOfGame )
        return copyFacadeGame
    }
    moveByBot() {
        this.bot.calculateNextMove( this.gameBoard )
        let startPos = this.bot.getStartPos()
        let endPos = this.bot.getEndPos()
        this.setStartPosMove( startPos )
        this.moveTo( endPos )
    }
    setStartPosMove( startPos ) {
        let pos = Pos.convertToPosObject( startPos )
        this.gameBoard.setStartPosMove( pos )
    }
    unsetStartPosMove() {
        this.gameBoard.unsetStartPosMove()  
    }
    moveTo( endPos ) {
        let pos = Pos.convertToPosObject( endPos )
        this.gameBoard.moveTo( pos )
        this.#updateDisplayIfRender()
    }
    #updateDisplayIfRender() {
        try {
            global
        } catch {
            this.display.updatePositionsAndRender()
        }
    }

    getListOfPosMove() {
        return this.gameBoard.getListOfPosMove()
    }
    getChangeBoardOperations() {
        return this.gameBoard.getChangeBoardOperations()
    }

    isSelectedStartPos() {
        let result = this.gameBoard.isSelectedStartPos()
        return result
    }
    isEnableStartPosMove( pos ) {
        let result = this.gameBoard.isEnableStartPosMove( pos )
        return result
    }
    isEnableEndPosMove( pos ) {
        let result = this.gameBoard.isEnableEndPosMove( pos )
        return result
    }
    getListOfEndPosByStartPos( startPos ) {
        return this.gameBoard.getListOfEndPosByStartPos( startPos )
    }
    getListOfEndPosFromSelectPos() {
        return this.gameBoard.getListOfEndPosFromSelectPos()
    }
    getListOfStartPos() {
        return this.gameBoard.getListOfStartPos()
    }

    getIteratorOfElemets() {
        return this.gameBoard.getIteratorOfElemets()
    }
    getWalkingTeam() {
        return this.gameBoard.getWalkingTeam()
    }
    getBoardArrangement() {
        return this.gameBoard.getBoardArrangement()
    }

    getStatus() {
        return this.gameBoard.getStatus()
    }

    setOptions( options ) {
        this.optionsOfGame = options
    }
    
    setElement( element ) {
        this.gameBoard.setElement( element )
    }
    setDisplay( display ) {
        try {
            global
        } catch {
            this.display = display
            this.gameBoard.setDisplay( display )
        }
    }
    setBot( bot ) {
        this.bot = bot
    }
    setFunctCreateStartBoard( funct ) {
        this.gameBoard.setFunctCreateStartBoard( funct )
    }
    setFunctCalculateStatusOfGame( funct ) {
        this.gameBoard.setFunctCalculateStatusOfGame( funct )
    }
}


class Bot {
    constructor() {
        this.calcNextMoveFunct
        this.startPos
        this.endPos
    }
    calculateNextMove( gameBoard ) {
        let { startPos, endPos } = this.calcNextMoveFunct( gameBoard )
        this.startPos = startPos
        this.endPos = endPos
    }
    getStartPos() {
        return this.startPos
    }
    getEndPos() {
        return this.endPos
    }
    setCalcNextMoveFunct( funct ) {
        this.calcNextMoveFunct = funct
    }
    static getRandomBot() {
        let bot = new Bot()
        bot.setCalcNextMoveFunct( Bot.randCalcNextMove )
        return bot
    }
    static randCalcNextMove( board ) {
        let list = board.getListOfStartPos()
        let lengthList = list.length
        while ( true ) {
            let randomPosIndex = Math.floor( Math.random()*lengthList )
            let randomStartPos = list[ randomPosIndex ]
            let listOfendPos = board.getListOfEndPosByStartPos( randomStartPos )
            let lengthListOfEndPos = listOfendPos.length
            if ( lengthListOfEndPos != 0 ) {
                let randomEndPosIndex = Math.floor( Math.random()*lengthListOfEndPos )
                let randomEndPos = listOfendPos[ randomEndPosIndex ]
                return { "startPos": randomStartPos, "endPos": randomEndPos }
            } 
        }
    }
}


class GameBoard {
    constructor() {
        this.resourcesAndSpaceOfFigurs = new ResourcesAndSpaceOfElements()
        this.resourcesAndSpaceOfCells = new ResourcesAndSpaceOfElements()
        this.flyWeightOfElements
        this.createFlyWeight()

        this.functionCalculateStatus
        this.functionCreateStartBoard

        this.walkingTeam
        this.visitorOfEnableMoves = GameBoard.getVisitor()
        
        ////////////////
        this.optionsOfGame
        //////////////

        this.statusGame

        ///////////////
        this.changeBoardOperations = []
        ////////////////
    }

    getCopy() {
        let copyGameBoard = new GameBoard()
        copyGameBoard.#setFlyWeight( this.flyWeightOfElements )

        copyGameBoard.setFunctCalculateStatusOfGame( this.functionCalculateStatus )
        copyGameBoard.setFunctCreateStartBoard( this.functionCreateStartBoard )
        return copyGameBoard
    }
    getVisitorOfEnableMoves() {
        return new VisitorOfEnableMoves( this )
    }
    getIteratorOfElemets() {
        return new IteratorOfElements( this )
    }
    getListOfPosMove() {
        return this.visitorOfEnableMoves.getListOfPosMove()
    }
    getChangeBoardOperations() {
        return this.changeBoardOperations
    }

    isEnableStartPosMove( pos ) {
        let result = this.visitorOfEnableMoves.isEnableStartPosMove( pos )
        return result
    }
    setStartPosMove( pos ) {
        this.visitorOfEnableMoves.setStartPosMove( pos )
    }
    unsetStartPosMove() {
        this.visitorOfEnableMoves.unsetStartPosMove()
    }
    isSelectedStartPos() {
        let result = this.visitorOfEnableMoves.isSelectedStartPos()
        return result
    }
    isEnableEndPosMove( pos ) {
        let result = this.visitorOfEnableMoves.isEnableEndPosMove( pos )
        return result
    }
    moveTo( pos ) {
        this.changeBoardOperations = []
        this.visitorOfEnableMoves.moveTo( pos )
        this.#calcStatus()
    }
    getListOfEndPosByStartPos( startPos ) {
        return this.visitorOfEnableMoves.getListOfEndPosByStartPos( startPos )
    }
    getListOfEndPosFromSelectPos() {
        return this.visitorOfEnableMoves.getListOfEndPosFromSelectPos()
    }
    getListOfStartPos() {
        return this.visitorOfEnableMoves.getListOfStartPos()
    }

    isEnableFigurOnPos( pos ) {
        let figur = this.getFigurByPosition( pos )
        if ( figur ) {
            return true
        } else {
            return false
        }
    }

    isEnableCellOnPos( pos ) {
        let cell = this.getCellByPosition( pos )
        if ( cell ) {
            return true
        } else {
            return false
        }
    }

    setPositionForSelectFigur( pos ) {
        this.#writeChangeBoardOperation( "setPositionForSelectFigur", pos )
        this.resourcesAndSpaceOfFigurs.setPositionForSelectElement( pos )
    }
    selectFigurByName( name ) {
        this.#writeChangeBoardOperation( "selectFigurByName", name )
        this.resourcesAndSpaceOfFigurs.selectElementByName( name )
    }
    selectFigurByPosition( pos ) {
        this.#writeChangeBoardOperation( "selectFigurByPosition", pos )
        this.resourcesAndSpaceOfFigurs.selectElementByPosition( pos )
    }
    getFigurByName( name ) {
        return this.resourcesAndSpaceOfFigurs.getElementByName( name )
    }
    getFigurByPosition( pos ) {
        return this.resourcesAndSpaceOfFigurs.getElementByPosition( pos )
    }
    getFigurPosByName( name ) {
        return this.resourcesAndSpaceOfFigurs.getPositionByName( name )
    }
    
    setPositionForSelectCell( pos ) {
        this.#writeChangeBoardOperation( "setPositionForSelectCell", pos )
        this.resourcesAndSpaceOfCells.setPositionForSelectElement( pos )
    }
    selectCellByName( name ) {
        this.#writeChangeBoardOperation( "selectCellByName", name )
        this.resourcesAndSpaceOfCells.selectElementByName( name )
    }
    selectCellByPosition( pos ) {
        this.#writeChangeBoardOperation( "selectCellByPosition", pos )
        this.resourcesAndSpaceOfCells.selectElementByPosition( pos )
    }
    getCellByName( name ) {
        return this.resourcesAndSpaceOfCells.getElementByName( name )
    }
    getCellByPosition( pos ) {
        return this.resourcesAndSpaceOfCells.getElementByPosition( pos )
    }
    getCellPosByName( name ) {
        return this.resourcesAndSpaceOfCells.getPositionByName( name )
    }

    #writeChangeBoardOperation( name, argument ) {
        let opertain = { "name": name, "argument" :argument }
        this.changeBoardOperations.push( opertain )
    }

    getBoardArrangement() {
        let boardArrangement = {}
        let figursArrangement = this.resourcesAndSpaceOfFigurs.getArrangement()
        let cellsArrangement = this.resourcesAndSpaceOfCells.getArrangement()
        boardArrangement.figurs = figursArrangement
        boardArrangement.cells = cellsArrangement
        return boardArrangement
    }
 
    start() {
        this.#createGameIfServer()
        this.visitorOfEnableMoves.setBoard( this )
    }
    #createGameIfServer() {
        try {
            global        
            this.functionCreateStartBoard( this )
            this.#calcStatus()
        } catch {}
    }
    #calcStatus() {
        if ( this.getStatus() == "_empty" || this.getStatus() === undefined ) {
            this.setStatus( this.functionCalculateStatus( this ) )
        }
    }
    getStatus() {
        return this.statusGame
    } 
    setStatus( status ) {
        this.statusGame = status
    }

    getFlyWeightOfElements() {
        return this.flyWeightOfElements
    }
    createFlyWeight() {
        let flyWeight = new FlyWeightOfElements()
        this.resourcesAndSpaceOfFigurs.setFlyWeightOfElements( flyWeight )
        this.resourcesAndSpaceOfCells.setFlyWeightOfElements( flyWeight )
        this.flyWeightOfElements = flyWeight
    }
    static getVisitor() {
        let visitor;
        try {
            global;
            visitor = new VisitorOfEnableMoves() 
        } catch {
            visitor = new VisitorOfEnableMovesOnline() 
        }
        return visitor
    }
    setAmountOfPlayer(amountOfPlayers) {
        this.amountOfPlayers = amountOfPlayers
    }
    #setFlyWeight( flyWeight ) {
        this.resourcesAndSpaceOfFigurs.setFlyWeightOfElements( flyWeight )
        this.resourcesAndSpaceOfCells.setFlyWeightOfElements( flyWeight )
        this.flyWeightOfElements = flyWeight
    }
    setElement( element ) {
        this.flyWeightOfElements.setElement( element )
    }
    setFunctCreateStartBoard( funct ) {
        this.functionCreateStartBoard = funct
    }
    setFunctCalculateStatusOfGame( funct ) {
        this.functionCalculateStatus = funct
    }

    setWalkingTeam( team ) {
        this.walkingTeam = team
    }
    getWalkingTeam() {
        return this.walkingTeam
    }
    
    getOptionsOfGame() {
        return this.optionsOfGame
    }
    setOptionsOfGame( options ) {
        this.optionsOfGame = options
    }
    setDisplay( display ) {
        this.visitorOfEnableMoves.setDisplay( display )
    }
}


class VisitorOfEnableMoves {
    constructor() {
        this.gameBoard
        this.listOfEndPosMove
        this.listOfEndPosMovesForGraphic
        this.listOfStartPos

        this.enableEndPos

        this.pos
        this.selectIndexPos
    }

    update() {
        this.#setDefaultOptions()
        let iteratorOfElements = this.gameBoard.getIteratorOfElemets()
        for ( iteratorOfElements.start(); iteratorOfElements.isNotDone(); iteratorOfElements.next() ) {
            this.#processCurentItem( iteratorOfElements )
        }
        if ( !this.enableEndPos ) {
            this.gameBoard.setStatus( "_noMoves" )
        }
    }
    #setDefaultOptions() {
        this.listOfEndPosMove = {}
        this.listOfEndPosMovesForGraphic = {}
        this.listOfStartPos = []
        this.enableEndPos = false
        this.selectIndexPos = undefined
        this.pos = undefined
    }
    #processCurentItem( iteratorOfElements ) {
        let element = iteratorOfElements.currentItem()
        if ( this.#isClassAFigur( element ) ) {
            if ( this.#isMovingTeam( element )) {
                let startPos = iteratorOfElements.getPosOfCurrentItem()
                if ( startPos != undefined ) {
                    let moves = element.getMoves()
                    this.#processMoves( moves, startPos )
                }
            }
        }
    }
    #isClassAFigur( element ) {
        return element.getClass() === "Figur"
    }
    #isMovingTeam( element ) {
        return element.getTeam() === this.gameBoard.getWalkingTeam()
    }

    #processMoves( moves, startPos ) {
        if ( moves.length != 0 ) {
            for ( let move of moves ) {
                this.#processMove( move, startPos )
            }
        }
    }
    #processMove( move, startPos  ) {
        this.listOfStartPos.push( startPos )
        move.setBoard( this.gameBoard )
        move.setPositionOfStartFigur( startPos )
        let endPositions = move.getArrayOfNewPosition()
        this.#processEndPositions( endPositions, startPos, move )
    }
    #processEndPositions( endPositions, startPos, move ) {
        let idStartPos = this.#fromPosToIndex( startPos )
        this.#createListOfEndPosIfDontExit( idStartPos )
        for ( let endPos of endPositions ) {
            this.#pushEndPosToList( idStartPos, endPos, move )
        }
    }
    #createListOfEndPosIfDontExit( idStartPos ) {
        if ( !this.listOfEndPosMove[ idStartPos ] ) {
            this.listOfEndPosMove[ idStartPos ] = {}
            this.listOfEndPosMovesForGraphic[ idStartPos ] = []
        }
    }
    #pushEndPosToList( idStartPos, endPos, move ) {
        if ( !this.enableEndPos ) {
            this.enableEndPos = true
        } 
        let listOfEndPos = this.listOfEndPosMove[ idStartPos ]
        this.listOfEndPosMovesForGraphic[ idStartPos ].push( endPos )
        let indexEndMove = this.#fromPosToIndex( endPos )
        listOfEndPos[ indexEndMove ] = move
    }

    setStartPosMove( pos ) {
        if ( pos == undefined ) {
            this.selectIndexPos = undefined
        } else {
            this.pos = pos
            let index = this.#fromPosToIndex( pos )
            if ( this.#isEnableIndexStartPosMove( index ) ) {
                this.selectIndexPos = index
            }
        }
    }
    unsetStartPosMove() {
        this.selectIndexPos = undefined
    }
    isEnableStartPosMove( pos ) {
        let index = this.#fromPosToIndex( pos )
        let result = this.#isEnableIndexStartPosMove( index )
        return result
    }
    #isEnableIndexStartPosMove( index ) {
        return index in this.listOfEndPosMove
    } 
    moveTo( pos ) {
        let index = this.#fromPosToIndex( pos )
        if ( this.#isEnableIndexEndPosMove( index ) ) {
            this.#moveToIndexEndPos( pos, index )
        }
    }
    #moveToIndexEndPos( pos, index ) {
        let move = this.#getMoveByIndexEndPos( index )
        move.setPositionOfStartFigur( this.pos )
        move.setBoard( this.gameBoard )
        move.changeBoardByNewPosition( pos )
        this.update()
    }
    #getMoveByIndexEndPos( index ) {
        let listOfEndPos = this.listOfEndPosMove[ this.selectIndexPos ]
        let move = listOfEndPos[ index ]
        return move
    }
    isEnableEndPosMove( pos ) {
        let index = this.#fromPosToIndex( pos )
        let result = this.#isEnableIndexEndPosMove( index )
        return result
    }
    #isEnableIndexEndPosMove( index ) {
        return index in this.listOfEndPosMove[ this.selectIndexPos ]
    }
    getListOfEndPosByStartPos( startPos ) {
        let selectIndexPos = undefined
        if ( startPos == undefined ) {
            return []
        } else {
            let index = this.#fromPosToIndex( startPos )
            if ( this.#isEnableIndexStartPosMove( index ) ) {
                selectIndexPos = index
            }
        }
        let listOfEndPos = this.listOfEndPosMovesForGraphic[ selectIndexPos ]
        return listOfEndPos
    }
    getListOfEndPosFromSelectPos() {
        let listOfEndPos = this.listOfEndPosMovesForGraphic[ this.selectIndexPos ]
        return listOfEndPos
    } 
    getListOfStartPos() {
        return this.listOfStartPos
    }
    getListOfPosMove() {
        return this.listOfEndPosMovesForGraphic
    }
    #fromPosToIndex( pos ) {
        let x = pos.getX()
        let y = pos.getY()
        let index = `${ x }` + "x" + `${ y }`
        return index
    }
    isSelectedStartPos() {
        if (this.selectIndexPos) {
            return true
        } else {
            return false
        }
    }

    setBoard( board ) {
        this.gameBoard = board
        this.update()
    }
}


class VisitorOfEnableMovesOnline {
    constructor() {
        this.gameBoard
        this.listOfEndPosMove
        this.listOfEndPosMoveWitchIndex

        this.optionsOfGame
        this.webSocket = new WebSocketWrapper()

        this.pos
        this.selectIndexPos
        this.display
    }

    #setDefaultOptions() {
        this.listOfEndPosMove = {}
        this.selectIndexPos = undefined
        this.pos = undefined
    }

    setStartPosMove( pos ) {
        if ( pos == undefined ) {
            this.selectIndexPos = undefined
        } else {
            this.pos = pos
            let index = this.#fromPosToIndex( pos )
            if ( this.#isEnableIndexStartPosMove( index ) ) {
                this.selectIndexPos = index
            }
        }
    }
    unsetStartPosMove() {
        this.selectIndexPos = undefined
    }
    isEnableStartPosMove( pos ) {
        let index = this.#fromPosToIndex( pos )
        let result = this.#isEnableIndexStartPosMove( index )
        return result
    }
    #isEnableIndexStartPosMove( index ) {
        if ( this.listOfEndPosMove ) {
            return index in this.listOfEndPosMove
        } else {
            return false
        }
    }
    ////
    moveTo( pos ) {
        let index = this.#fromPosToIndex( pos )
        if ( this.#isEnableIndexEndPosMove( index ) ) {
            this.#sendMove( pos )
            this.#setDefaultOptions()
        }
    }
    #sendMove( pos ) {
        let message = { "type": "moving", "startPos": this.pos, "endPos": pos, "nickname": this.optionsOfGame.nickname, "idRoom": this.optionsOfGame.idRoom }
        this.webSocket.send( JSON.stringify(message) )
    }
    isEnableEndPosMove( pos ) {
        let index = this.#fromPosToIndex( pos )
        let result = this.#isEnableIndexEndPosMove( index )
        return result
    }
    #isEnableIndexEndPosMove( index ) {
        return this.listOfEndPosMoveWitchIndex[ this.selectIndexPos ].includes( index )
    }
    getListOfEndPosByStartPos( startPos ) {
        let selectIndexPos = undefined
        if ( startPos == undefined ) {
            return []
        } else {
            let index = this.#fromPosToIndex( startPos )
            if ( this.#isEnableIndexStartPosMove( index ) ) {
                selectIndexPos = index
            }
        }
        let listOfEndPos = this.listOfEndPosMove[ selectIndexPos ]
        return listOfEndPos
    }
    getListOfEndPosFromSelectPos() {
        let listOfEndPos = this.listOfEndPosMove[ this.selectIndexPos ]
        return listOfEndPos
    } 
    #fromPosToIndex( pos ) {
        let x = pos.getX()
        let y = pos.getY()
        let index = `${ x }` + "x" + `${ y }`
        return index
    }
    isSelectedStartPos() {
        if (this.selectIndexPos) { 
            return true
        } else {
            return false
        }
    }

    setBoard( board ) {
        this.optionsOfGame = board.getOptionsOfGame()
        this.#runWebSocket()
        this.gameBoard = board
    }

    #runWebSocket() {
        this.webSocket.setOptionsOfGame( this.optionsOfGame )
        this.webSocket.setGetMessageFunct( ( event ) => VisitorOfEnableMovesOnline.getMessageFunct( event, this ) )
        this.webSocket.setStartMessage( JSON.stringify( { "type": "getBoardArrangement", "idRoom": this.optionsOfGame.idRoom } ) )
        this.webSocket.run()
    }
    static getMessageFunct( event, visitor ) {
        let message = JSON.parse(event.data)
        console.log( message, "message" )
        if ( message.type == "moveList" ) {
            visitor.setMoveList( message.moveList )
        } else if ( message.type == "changeBoardOperations" ) {
            visitor.changeBoardByOperations( message.changeBoardOperations )
        } else if ( message.type == "roomIsNotExist" ) {
            window.location.href = "./"
        } else if ( message.type == "boardArrangement" ) {
            visitor.setBoardArrangement( message.boardArrangement )
        }
    }

    setBoardArrangement( boardArrangement ) {
        let figurs = boardArrangement.figurs
        this.#arrangmentFigurs( figurs )
        let cells = boardArrangement.cells
        this.#arrangmentCells( cells )
        this.display.updatePositionsAndRender()
    }
    #arrangmentFigurs( listOfFigurs ) {
        for ( let nameFigur in listOfFigurs ) {
            let pos = Pos.convertToPosObject( listOfFigurs[ nameFigur ] )
            this.gameBoard.selectFigurByName( nameFigur )
            this.gameBoard.setPositionForSelectFigur( pos )
        }
    }
    #arrangmentCells( listOfCells ) {
        for ( let nameCell in listOfCells ) {
            let pos = Pos.convertToPosObject( listOfCells[ nameCell ] )
            this.gameBoard.selectCellByName( nameCell )
            this.gameBoard.setPositionForSelectCell( pos )
        }
    }
    
    setMoveList( moveList ) {
        let newMoveList = {}
        let newMoveListWitchIndex = {}
        for ( let startPos in moveList ) {
            let arrayEndPos = moveList[ startPos ]
            newMoveList[ startPos ] = []
            newMoveListWitchIndex[ startPos ] = []
            for ( let endPos of arrayEndPos ) {
                let newEndPos = new Pos()
                newEndPos.setX( endPos.x )
                newEndPos.setY( endPos.y )
                let index = this.#fromPosToIndex( newEndPos )  
                newMoveList[startPos].push( newEndPos )
                newMoveListWitchIndex[ startPos ].push( index )
            }
        }
        this.listOfEndPosMove = newMoveList
        this.listOfEndPosMoveWitchIndex = newMoveListWitchIndex
    }
    changeBoardByOperations( changeBoardOperations ) {
        for ( let opertaion of changeBoardOperations ) {
            let argument = opertaion.argument
            if ( typeof argument != "string" ) {
                argument = Pos.convertToPosObject( opertaion.argument )
            }
            this.gameBoard[ opertaion.name ]( argument )
        }
        this.display.updatePositionsAndRender()
    }
    setDisplay( display ) {
        this.display = display
    }
}


class WebSocketWrapper {
    constructor() {
        this.webSocket
        this.getMessageFunct
        
        this.startMessage

        this.nickname
    }

    run() {
        this.webSocket = new WebSocket( "./room/" + this.idRoom )
        this.webSocket.onopen = ( event ) => { 
            this.webSocket.send( JSON.stringify( { "type":"connectingWebSocket", "nickname": this.nickname, "idRoom": this.idRoom } ) ); 
            this.webSocket.send( this.startMessage )
        }
        this.webSocket.onmessage = ( event ) => { this.getMessageFunct( event ) }
        this.webSocket.onerror = (error) => { console.log("Ошибка " + error.message); };
    }

    send( message ) {
        this.webSocket.send( message )
    }

    setStartMessage( message ) {
        this.startMessage = message
    }

    setGetMessageFunct( funct ) {
        this.getMessageFunct = funct
    }

    setOptionsOfGame( optionsOfGame ) {
        this.nickname = optionsOfGame.nickname
        this.roomId = optionsOfGame.room
        this.idRoom = optionsOfGame.idRoom
    }
}

class ResourcesAndSpaceOfElements {
    constructor() {
        this.fabricOfStructurs = new FabricOfStructurElements()
        this.spaceOfElements = this.fabricOfStructurs.getSpaceOfElements()
        this.flyWeightOfElements
        this.selectElementName
    }

    getArrangement() {
        return this.spaceOfElements.getArrangement()
    }

    selectElementByName( name ) {
        this.selectElementName = name
    }
    selectElementByPosition( pos ) {
        this.spaceOfElements.setCursorPosition( pos )
        let name = this.spaceOfElements.getNameElementFromCursorPosition()
        this.selectElementByName( name )
    }

    setPositionForSelectElement( pos ) {
        this.spaceOfElements.setCursorPosition( pos )
        this.spaceOfElements.setElementNameToCursorPosition( this.selectElementName )
    }

    getElementByName( name ) {
        return this.flyWeightOfElements.getElementByName( name )
    }
    getElementByPosition( pos ) {
        this.spaceOfElements.setCursorPosition( pos )
        let name = this.spaceOfElements.getNameElementFromCursorPosition()
        let element =  this.flyWeightOfElements.getElementByName( name )
        return element
    }
    getPositionByName( name ) {
        let pos = this.spaceOfElements.getPositionByNameElement( name )
        return pos
    }
    
    setFlyWeightOfElements( flyWeightOfElements ) {
        this.flyWeightOfElements = flyWeightOfElements
    }
}


class SpaceOfElements {
    constructor() {
        this.fabricOfStructurs
        this.listOfPositionElements
        this.ElementsField
    }

    getArrangement() {
        return this.listOfPositionElements.getArrangement()
    }

    getNameElementFromCursorPosition() {
        let selectIdElement = this.ElementsField.getNameFromCursorPosition()
        return selectIdElement
    }
    getPositionByNameElement( name ) {
        let position = this.listOfPositionElements.getPosition( name )
        return position
    }

    setElementNameToCursorPosition( name ) {
        let oldPositionOfElementName = this.listOfPositionElements.getPosition( name )
        let nameElementInCoursorPosition = this.ElementsField.getNameFromCursorPosition()
        this.ElementsField.setElementNameToCursorPosition( name )
        this.listOfPositionElements.setElementNameToCursorPosition( name )
        this.ElementsField.removeElementFromPosition( oldPositionOfElementName )
        this.listOfPositionElements.setNaNPosToElement( nameElementInCoursorPosition )
    }

    setCursorPosition( pos ) {
        this.ElementsField.setCursorPosition( pos )
        this.listOfPositionElements.setCursorPosition( pos )
    }

    setFabricOfStructurs( fabric ) {
        this.fabricOfStructurs = fabric 
        this.#initializateStructurs()
    }
    #initializateStructurs() {
        this.ElementsField = this.fabricOfStructurs.getElementsField()
        this.listOfPositionElements = this.fabricOfStructurs.getListOfPositionElements()
    }
}


class TwoDimensionalFieldOfName {
    constructor() {
        this.fabricOfStructurs
        this.listOfChunks = {} 
        this.selectChunkIndex
        this.chunkScale
    }

    getNameFromCursorPosition() {
        let selectChunk = this.#getSelectedChunk()
        let name = selectChunk.getNameFromCursorPosition()
        return name
    }
    setCursorPosition( pos ) {
        this.#selectChunkAndCreateIfDontExit( pos )
        this.#setCursorPositionToSelectedChunk( pos )
    }
    #selectChunkAndCreateIfDontExit( pos ) {
        let index = this.#getChunkIndexFromPos( pos )
        this.#createChunkIfDontExit( index )
        this.selectChunkIndex = index
    }
    #createChunkIfDontExit( newChunkIndex ) {
        if ( this.#isChunkNotExist( newChunkIndex ) ) {
            this.#createNewChunk( newChunkIndex )
        }
    }
    #isChunkNotExist( chunkIndex ) {
        if ( this.listOfChunks[ chunkIndex ] ) {
            return false
        } else {
            return true
        }
    }
    #createNewChunk( chunkIndex ) {
        let newChunk = this.fabricOfStructurs.getChunk()
        this.listOfChunks[ chunkIndex ] = newChunk
    }
    #setCursorPositionToSelectedChunk( pos ) {
        let selectedChunk = this.#getSelectedChunk()
        selectedChunk.setCursorPosition( pos )
    }
    #getSelectedChunk() {
        let selectedChunk = this.listOfChunks[ this.selectChunkIndex ]
        return selectedChunk
    }

    setElementNameToCursorPosition( name ) {
        let selectedChunk = this.#getSelectedChunk()
        selectedChunk.setElementNameToCursorPosition( name )
    }
    removeElementFromPosition( pos ) {
        if ( this.#isPosNotNaN( pos ) ) {
            let index = this.#getChunkIndexFromPos( pos )
            let chunk = this.listOfChunks[ index ]
            chunk.removeElementFromPosition( pos )
        }
    }
    #isPosNotNaN( pos ) {
        if (pos === undefined ) {
            return false
        } else {
            return !pos.isNaN()
        }
    }

    #getChunkIndexFromPos( pos ) {
        let newXIndex = this.#fromCoordinateToIndexOfChunk( pos.getX() )
        let newYIndex = this.#fromCoordinateToIndexOfChunk( pos.getY() )
        let newChunkIndex = newXIndex + "x" + newYIndex
        return newChunkIndex
    }
    #fromCoordinateToIndexOfChunk( coordinate ) {
        let chunkIndex
        chunkIndex = Math.floor( coordinate/this.chunkScale )
        return chunkIndex
    }


    setFabricOfStructurs( fabric ) {
        this.fabricOfStructurs = fabric 
        this.#initializateStructurs()
    }
    #initializateStructurs() {
        this.chunkScale = this.fabricOfStructurs.getChunkScale()
    }
}


class Chunk {
    constructor() {
        let scale = Chunk.getScale()
        let numberOfCells = Math.pow( scale, 2 )
        this.arrayOfChunk = new Array(numberOfCells)
        this.cursorPositionIndex = 0
    }
    
    setElementNameToCursorPosition( id ) {
        this.arrayOfChunk[ this.cursorPositionIndex ] = id
    }
    getNameFromCursorPosition() {
        let selectId = this.arrayOfChunk[ this.cursorPositionIndex ]
        return selectId
    }
    setCursorPosition( pos ) {
        let positionIndex = this.#fromCoordinateToIndex( pos )
        this.cursorPositionIndex = positionIndex
    }
    removeElementFromPosition( pos ) {
        let positionIndex = this.#fromCoordinateToIndex( pos )
        this.arrayOfChunk[ positionIndex ] = undefined
    }
    #fromCoordinateToIndex( pos ) {
        let x = this.#fromCoordinateToIndexInChunk( pos.getX() )
        let y = this.#fromCoordinateToIndexInChunk( pos.getY() )
        let scale = Chunk.getScale()
        let index = scale*y + x
        return index
    }
    #fromCoordinateToIndexInChunk( coordinate ) {
        let scaleChunk = Chunk.getScale()
        let inChunkIndex
        if  (coordinate >= 0) {
            inChunkIndex = coordinate%scaleChunk
        } else {
            coordinate = -1*( coordinate + 1 )
            inChunkIndex = scaleChunk - ( coordinate%scaleChunk ) - 1 
        }
        return inChunkIndex
    }

    static getScale() {
        return Chunk.prototype.scale
    }
}
Chunk.prototype.scale = 8


class ListOfPositionOfElements {
    constructor() {
        this.listOfPosition = {}
        this.cursorPos
    }

    getArrangement() {
        return this.listOfPosition
    }

    setElementNameToCursorPosition( name ) {
        this.#setNameOnListIfDontExit( name )
        this.listOfPosition[name] = this.cursorPos
    }
    #setNameOnListIfDontExit( name ) {
        if ( this.#isNotIncludeNameElement( name ) ){
            this.#setNameElementOnList( name )
        }
    }
    #isNotIncludeNameElement( name ) {
        let result = this.listOfPosition[name] === undefined;
        return result
    }
    #setNameElementOnList( name ) {
        this.listOfPosition[ name ] = new Pos()
    }

    setNaNPosToElement( name ) {
        if ( this.#isNameNotUndefined( name ) ) { 
            let pos = this.listOfPosition[ name ]
            if (pos !== undefined) {
                pos.setNaN()
            }
        }
    }
    #isNameNotUndefined( name ) {
        return name !== undefined 
    }

    getPosition( name ) {
        let pos = this.listOfPosition[ name ]
        return pos
    }

    setCursorPosition( pos ) {
        this.cursorPos = pos
    }
}


class FabricOfStructurElements {
    constructor() {
    }

    getSpaceOfElements() {
        let spaceOfElements = new SpaceOfElements()
        spaceOfElements.setFabricOfStructurs( this )
        return spaceOfElements
    }
    getElementsField() {
        let elementsField = new TwoDimensionalFieldOfName()
        elementsField.setFabricOfStructurs( this )
        return elementsField
    }
    getListOfPositionElements() {
        let listOfPositionElements = new ListOfPositionOfElements()
        return listOfPositionElements
    }
    getChunk() {
        let chunk = new Chunk()
        return chunk
    }
    getChunkScale() {
        return Chunk.getScale()
    }
}


class FlyWeightOfElements {
    constructor() {
        this.listOfElements = {}
    }

    getListOfElements() {
        return this.listOfElements
    }

    getElementByName( name ) {
        let selectedElement = this.listOfElements[ name ]
        return selectedElement
    }

    setElement( element ) {
        let name = element.getName()
        this.listOfElements[ name ] = element
    }

    static getFlyWeightOfElements() {
        if ( FlyWeightOfElements.prototype._instance === 0 ) {
            FlyWeightOfElements.prototype._instance = new FlyWeightOfElements()
        }
        return FlyWeightOfElements.prototype._instance
    }
}
FlyWeightOfElements.prototype._instance = 0


class IteratorOfElements {
    constructor( gameBoard ) {
        this.gameBoard = gameBoard
        let flyWeightOfElements = this.gameBoard.getFlyWeightOfElements()
        this.listOfElements = flyWeightOfElements.getListOfElements()
        this.nameElements = Object.keys(this.listOfElements)
        this.selectId
    }
    start() {
        let startSelectId = 0
        this.selectId = startSelectId
    }
    isNotDone() {
        let result = ( !( this.nameElements.length == this.selectId ) )
        return result
    }
    next() {
        this.selectId++
    }
    currentItem() {
        let name = this.#getSelectName()
        let element = this.listOfElements[ name ]
        return element
    }
    getPosOfCurrentItem() {
        let name = this.#getSelectName()
        let posFigur = this.gameBoard.getFigurPosByName( name )
        let posCell = this.gameBoard.getCellPosByName( name )
        if ( posFigur === undefined ) {
            return posCell
        } else {
            return posFigur
        }
    }
    getNameOfCurrentItem() {
        return this.#getSelectName()
    }
    #getSelectName() {
        return this.nameElements[this.selectId]
    }
    setSpaceOfElements( spaceOfElements ) {
        this.spaceOfElements = spaceOfElements
    }
}


class Figur {
    constructor() {
        this.name
        this.type
        this.numberTeam
        this.displayInformationOfElement
    }

    setName( name ) {
        this.name = name
    }
    setType( type ) {
        this.type = type
    }
    setTeam( numberTeam ) {
        this.numberTeam = numberTeam
    }
    setDisplayInformationOfElement(displayInformationOfElement) {
        this.displayInformationOfElement = displayInformationOfElement
    } 
    getMoves() {
        let moves = this.type.getMoves()
        return moves
    }
    getClass() {
        return "Figur"
    }
    getType() {
        return this.type
    }
    getTeam() {
        return this.numberTeam
    }
    getName() {
        return this.name
    }
    getDisplayInfmationOfElement() {
        return this.displayInformationOfElement
    }
    getDisplayInfmationOfType() {
        return this.type.getDisplayInfmationOfType()
    }
}


class Cell {
    constructor() {
        this.name
        this.type
        this.displayInformationOfElement
    }

    setName( name ) {
        this.name = name
    }
    setType( type ) {
        this.type = type
    }
    setColorList( colorList ) {
        this.colorList = colorList
    }
    setDisplayInformationOfElement(displayInformationOfElement) {
        this.displayInformationOfElement = displayInformationOfElement
    }
    getClass() {
        return "Cell"
    }
    getName() {
        return this.name
    }
    getType() {
        return this.type
    }
    getDisplayInfmationOfElement() {
        return this.displayInformationOfElement
    }
    getDisplayInfmationOfType() {
        return this.type.getDisplayInfmationOfType()
    }
}


class TypeOfFigur {
    constructor() {
        this.arrayOfMoves = []
        this.displayInformationOfType
    }

    addMove( move ) {
        this.arrayOfMoves.push( move )
    }
    setDisplayInformationOfType( displayInformationOfType ) {
        this.displayInformationOfType = displayInformationOfType
    }
    getMoves() {
        return this.arrayOfMoves
    }
    getDisplayInfmationOfType() {
        return this.displayInformationOfType
    }
}


class TypeOfCell {
    constructor() {
        this.displayInformationOfType
    }

    setDisplayInformationOfType( displayInformationOfType ) {
        this.displayInformationOfType = displayInformationOfType
    }
    getDisplayInfmationOfType() {
        return this.displayInformationOfType
    }
}


class Move {
    constructor() {
        this.functOfCalculatorOfMovePosition
        this.functOfIsPosibleToMove
        this.functOfIsTimeToBreak
        this.functOfChangeBoard

        this.board
        this.positionOfStartFigur
    }

    getCopy() {
        let newMove = new Move()
        newMove.setFunctOfCalcOfMovePosition( this.functOfCalculatorOfMovePosition )
        newMove.setFunctOfIsPosibleToMove( this.functOfIsPosibleToMove )
        newMove.setFunctOfIsTimeToBreak( this.functOfIsTimeToBreak )
        newMove.setFunctOfChangeBoard( this.functOfChangeBoard )
        return newMove
    }

    changeBoardByNewPosition( newPosition ) {
        let newBoard = this.#changeBoard( newPosition )
        return newBoard
    }
    getArrayOfNewPosition() {
        let arrayOfNewPosition = []
        let itterator = 0
        let resultOfIsNotTimeToBreak = true
        do {
            let newPosition = this.#calculateNewPosition( itterator )
            let isPosibleToMove = this.#isPosibleToMove( itterator, newPosition )
            if ( isPosibleToMove ) {
                arrayOfNewPosition.push( newPosition )
            }
            resultOfIsNotTimeToBreak = this.#isNotTimeToBreak( itterator, newPosition )
            itterator++
        } while (resultOfIsNotTimeToBreak);
        return arrayOfNewPosition
    }

    #calculateNewPosition( itterator ) {
        let newPosition = this.functOfCalculatorOfMovePosition( this.board, this.positionOfStartFigur, itterator )
        return newPosition
    }
    #isPosibleToMove( itterator, newPosition ) {
        let isPosibleToMove = this.functOfIsPosibleToMove( this.board, this.positionOfStartFigur, itterator, newPosition )
        return isPosibleToMove
    }
    #isNotTimeToBreak( itterator, newPosition ) {
        let defaultMaxValueOfItterator = 4096
        if ( itterator > defaultMaxValueOfItterator ) {
            return false
        } else {
            let resultOfIsTimeToBreak = this.functOfIsTimeToBreak( this.board, this.positionOfStartFigur, itterator, newPosition )
            return !resultOfIsTimeToBreak
        }
    }
    #changeBoard( newPosition ) {
        let newBoard = this.functOfChangeBoard( this.board, this.positionOfStartFigur, newPosition )
        return newBoard
    }

    setBoard( board ) {
        this.board = board
    }
    setPositionOfStartFigur( positionOfStartFigur ) {
        this.positionOfStartFigur = positionOfStartFigur
    }

    setPrototypeMove( move ) {
        this.prototypeMove = move
    }

    setFunctOfCalcOfMovePosition( nameOfFunct ) {
        this.functOfCalculatorOfMovePosition = nameOfFunct
    }
    setFunctOfIsPosibleToMove( nameOfFunct ) {
        this.functOfIsPosibleToMove = nameOfFunct
    }
    setFunctOfIsTimeToBreak( nameOfFunct ) {
        this.functOfIsTimeToBreak = nameOfFunct
    }
    setFunctOfChangeBoard( nameOfFunct ) {
        this.functOfChangeBoard = nameOfFunct
    }
}


class Pos {
    constructor( x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    
    static convertToPosObject( obj ) {
        if ( obj["addX"] ) {
            return obj
        }
        let pos = new Pos()
        if ( obj.x === null ) {
            pos.setNaN()
        } else {
            pos.setX( obj.x )
            pos.setY( obj.y )
        }
        return pos
    }

    static getNaN() {
        let pos = new Pos()
        pos.setNaN()
        return pos
    }
    setNaN() {
        this.x = NaN
        this.y = NaN
    }
    isNaN() {
        let result = ( Number.isNaN(this.x) )
        return result
    }
    getCopy() {
        let newPos = new Pos()
        newPos.setX( this.x )
        newPos.setY( this.y )
        return newPos
    }
    addY( y ) {
        this.y += y
    }
    addX( x ) {
        this.x += x
    }
    setX( x ) {
        this.x = x
    }
    setY( y ) {
        this.y = y
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
}

export { FacadeGame, Figur, Cell, TypeOfFigur, TypeOfCell, Move, Pos, Bot }

