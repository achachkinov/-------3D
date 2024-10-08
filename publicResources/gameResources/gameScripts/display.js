import {Pos} from "./gameBoard.js"

class FacadeDisplay {
    constructor() {
        this.scaleCellOfDesk = 10000
        this.display
        this.wrapperOfEvenListener
        this.facadeGame

        this.initializateFacadeGameIfClient()
    }
    initializateFacadeGameIfClient() {
        try {
            global
        } catch {
            this.display = new Display()
            this.wrapperOfEvenListener = new WrapperOfEvenListener()
        }
    }

    initializateGame( facadeGame ) {
        try {
            global
        } catch {
            this.#initializateElements( facadeGame )
            this.#createEventListener()
        }
    }
    #initializateElements( facadeGame ) {
        this.#setFacadeGame( facadeGame )
        let iteratorOfElements = facadeGame.getIteratorOfElemets()
        for ( iteratorOfElements.start(); iteratorOfElements.isNotDone(); iteratorOfElements.next() ) {
            this.#initializateCurrentElement( iteratorOfElements )
        }
    }
    #initializateCurrentElement( iteratorOfElements ) {
        let name = iteratorOfElements.getNameOfCurrentItem()
        let model = this.#getCurrentModelOnPos( iteratorOfElements )
        this.#addModel( name, model )
        this.#setPositionToCurrentElement( iteratorOfElements )
    }
    #getCurrentModelOnPos( iteratorOfElements ) {
        let element = iteratorOfElements.currentItem()
        let model = this.#createModel( element )
        return model
    }
    #createModel( element ) {
        let displayInformationOfType = element.getDisplayInfmationOfType()
        let builderModel = displayInformationOfType.getBuilderModel()
        ///
        builderModel.setDisplayInformationOfElement( element )
        ///
        let model = builderModel.getModel()
        return model
    }

    #addModel( name, model  ) {
        this.display.addModel( name, model )
    }

    #createEventListener() {
        this.wrapperOfEvenListener.setFacadeDisplay( this )
        this.wrapperOfEvenListener.createEventListener()
    }

    processEventMouseMove() {
        let isShiftDown = this.wrapperOfEvenListener.isShiftDown()
        if ( this.wrapperOfEvenListener.isRMBDown() ) {
            if ( isShiftDown ) {
                this.#updateDisplayByMouseMoveWithShift()
            } else {
                this.#updateDisplayByMouseMove()
            }
        }  else {
            this.#coloredEndPositionByStartPositionOfMouse()
        }
    }

    #updateDisplayByMouseMoveWithShift() {
        let deltaX = this.wrapperOfEvenListener.deltaX
        let deltaY = this.wrapperOfEvenListener.deltaY
        this.display.addEventNumberWithShiftToCamera( deltaY, deltaX )
        this.render()
    }
    #updateDisplayByMouseMove() {        
        let deltaX = this.wrapperOfEvenListener.deltaX
        let deltaY = this.wrapperOfEvenListener.deltaY
        this.display.addEventNumberToCamera( deltaY, deltaX )
        this.render()
    }
    #coloredEndPositionByStartPositionOfMouse() {
        let x = this.wrapperOfEvenListener.lastX
        let y = this.wrapperOfEvenListener.lastY
        let pos = this.#fromDotOnPlaneToPos( x, y )
        if( !this.facadeGame.isSelectedStartPos() ) {
            if( this.facadeGame.isEnableStartPosMove( pos ) ) {
                let listOfEndPos = this.facadeGame.getListOfEndPosByStartPos( pos )
                this.#coloredSelectFigurAndEndPos( pos, listOfEndPos )
                this.render()  
            } else if ( this.display.isColoredDesk() ) {
                this.#decoloredSelectFigurAndEndPos()
                this.render() 
            }
        } 
    }

    processEventMouseDown() {
    }
    processEventMouseUp() {
        let lastEvent = this.wrapperOfEvenListener.getLastEvent()
        if ( lastEvent === "mouseUpLMB" ) {
            this.#processEventMouseUpLMB()
        }
    }
    #processEventMouseUpLMB() {
        let x = this.wrapperOfEvenListener.lastX
        let y = this.wrapperOfEvenListener.lastY
        let pos = this.#fromDotOnPlaneToPos( x, y )
        if( this.facadeGame.isSelectedStartPos()  ) {
            if ( this.facadeGame.isEnableEndPosMove( pos ) ) {
                this.#decoloredSelectFigurAndEndPos()
                this.facadeGame.moveTo( pos )
            } else {
                this.#selectNewCell( pos )
            }
        } else {
            this.#selectNewCell( pos )
        }

        this.render()
    }

    #selectNewCell( pos ) {
        if ( this.facadeGame.isEnableStartPosMove( pos ) ) {
            this.facadeGame.setStartPosMove( pos )
            let listOfEndPos = this.facadeGame.getListOfEndPosFromSelectPos()
            this.#coloredSelectFigurAndEndPos( pos, listOfEndPos )
        } else if ( this.display.isColoredDesk() ) {
            this.facadeGame.unsetStartPosMove()
            this.#decoloredSelectFigurAndEndPos()
        }
    }
    processEventWheel() {
        let num = this.wrapperOfEvenListener.getWheelNum()
        this.display.addEventNumberOfWheelToCamera( num )
        this.render()
    }
    processEventResize() {
        this.display.updateSize()
        this.render()
    }
    processEventKeyDown() {
        let keys = this.wrapperOfEvenListener.getListOfkeysDown()
        console.log( "what" )
        if ( keys["w"] || keys["a"] || keys["s"] || keys["d"] ) {
            let changeX = 0
            let changeY = 0
            if ( keys["w"] ) {
                changeX += 5
            }
            if ( keys["s"] ) { 
                changeX -= 5
            }
            if ( keys["a"] ){
                changeY += 5
            } 
            if ( keys["d"] ) {
                changeY -= 5
            }
            this.display.addEventNumberWithShiftToCamera( changeX, changeY )
            this.render()
            setTimeout( () => { this.processEventKeyDown() }, 10 )
        }
    }

    #coloredSelectFigurAndEndPos( pos, listOfEndPos ) {
        let gameBoard = this.facadeGame.gameBoard
        let dot = this.#fromPosToDot( pos )
        dot.setY( -50 )
        let listOfColorEndPos = new Array( listOfEndPos.length )
        let listOfEndDots = new Array( listOfEndPos.length )
        for ( let numberPos = 0; numberPos < listOfEndDots.length; numberPos++ ) {
            let endPos = listOfEndPos[ numberPos ]
            let endDot = this.#fromPosToDot( endPos )
            endDot.setY( -50 )
            let colorNum = this.display.getColorOfSelectCell( endPos, gameBoard )
            listOfColorEndPos[ numberPos ] = colorNum
            listOfEndDots[ numberPos ] = endDot
        }
        this.display.coloredSelectFigurAndEndPos( dot, listOfEndDots, listOfColorEndPos ) 
    }
    #decoloredSelectFigurAndEndPos() {
        this.display.decoloredSelectFigurAndEndPos()
    }

    ////
    updatePositionsAndRender() {
        let iteratorOfElements = this.facadeGame.getIteratorOfElemets()
        for ( iteratorOfElements.start(); iteratorOfElements.isNotDone(); iteratorOfElements.next() ) {
            this.#setPositionToCurrentElement( iteratorOfElements )
        }
        this.render()
    }
    #setPositionToCurrentElement( iteratorOfElements ) {
        let element = iteratorOfElements.currentItem()
        let nameElement = iteratorOfElements.getNameOfCurrentItem()
        let pos = iteratorOfElements.getPosOfCurrentItem()
        let dot = this.#fromPosToDot( pos )
        if ( this.#isCell( element ) ) {
            this.#proccesIfCell( dot )
        }
        this.display.selectModelByName( nameElement )
        this.display.setCenterToSelectModel( dot )
    }
    #isCell( element ) {
        return element.getClass() == "Cell"
    }
    //
    #proccesIfCell( dot ) {
        dot.setY( -100 )
    }
    //
    ////

    #fromDotOnPlaneToPos( x, y ) {
        let dot = this.#fromDotOnPlaneToDotOnDesk( x, y )
        let pos = this.#formDotToPos( dot )
        return pos
    }
    #fromDotOnPlaneToDotOnDesk( x, y ) {
        return this.display.fromFromPosOnPlaneToPosOnDesk( x, y )
    }
    #formDotToPos( dot ) {
        let x = dot.getX()
        let y = dot.getZ()
        let newX = Math.floor(x/this.scaleCellOfDesk +0.5)
        let newY =  Math.floor(y/this.scaleCellOfDesk +0.5)
        let pos = new Pos( newX, newY )
        return pos
    }
    #fromPosToDot( pos ) {
        let dot = Dot.fromPosToDot( pos )
        dot.multiplyLengthOnFactor( this.scaleCellOfDesk )
        return dot
    }
    setLite( lite ) {
        if ( this.display ) {
            this.display.setLite( lite )
        }
    }
    setBackgroundColor(color) {
        if ( this.display ) {
            this.display.setBackgroundColor(color)
        }
    }
    setDispInformOfSelectCell( dispInform ) {
        if ( this.display ) {
            this.display.setDispInformOfSelectCell( dispInform )
        }
    }
    setFunctionCalculateColorSelect( funct ) {
        if ( this.display ) {
            this.display.setFunctionCalculateColorSelect( funct )
        }
    }


    render() {
        requestAnimationFrame( () => {this.display.render()})
    }

    #setFacadeGame( facadeGame ) {
        this.facadeGame = facadeGame
    }
}


class WrapperOfEvenListener {
    constructor() {
        this.facadeDisplay

        this.lastEvent
        this.lastX
        this.lastY
        this.deltaX = 0
        this.deltaY = 0
        this.isRMBDownInf = false
        this.isLMBDownInf = false
        this.isShiftDownInf = false
        this.wheelNum
        this.listOfkeysDown = {}

        this.disableContextMenu = event => { event.preventDefault() }        
        this.mouseDownFunct = event => { WrapperOfEvenListener.processMouseDownByWrapper( event, this ) }
        this.mouseMoveFunct =  event => { WrapperOfEvenListener.processMouseMoveByWrapper( event, this )}
        this.mouseUpFunct =  event => { WrapperOfEvenListener.processMouseUpByWrapper( event, this )}
        this.wheelFunct = event => { WrapperOfEvenListener.processWheelByWrapper( event, this ) }
        this.changeSizeFunt = event => { WrapperOfEvenListener.changeSize( event, this ) }
        this.keyUpFunct = event => { WrapperOfEvenListener.processKeyUpByWrapper( event, this ) }
        this.keyDownFunct = event => { WrapperOfEvenListener.processKeyDownByWrapper( event, this ) }
    }

    deleteEventListener() {
        document.removeEventListener("contextmenu", this.disableContextMenu );
        document.removeEventListener("mousedown", this.mouseDownFunct )
        document.removeEventListener("mousemove", this.mouseMoveFunct)
        document.removeEventListener("mouseup", this.mouseUpFunct)
        document.removeEventListener("wheel", this.wheelFunct )
        document.removeEventListener("keyup", this.keyUpFunct )
        document.removeEventListener("keydown", this.keyDownFunct )
        window.removeEventListener('resize', this.changeSizeFunt )
    }
    createEventListener() {
        document.addEventListener("contextmenu", this.disableContextMenu );
        document.addEventListener("mousedown", this.mouseDownFunct )
        document.addEventListener("mousemove", this.mouseMoveFunct )
        document.addEventListener("mouseup", this.mouseUpFunct )
        document.addEventListener("wheel", this.wheelFunct )
        document.addEventListener("keyup", this.keyUpFunct )
        document.addEventListener("keydown", this.keyDownFunct )
        window.addEventListener('resize', this.changeSizeFunt )
    }

    static processMouseDownByWrapper( event, wrapper ) {
        wrapper.processMouseDown( event )
    }
    static processMouseMoveByWrapper( event, wrapper ) {
        wrapper.processMouseMove( event )
    }
    static processMouseUpByWrapper( event, wrapper ) {
        wrapper.processMouseUp( event )
    }
    static processWheelByWrapper( event, wrapper ) {
        wrapper.processWheel( event )
    }
    static changeSize( event, wrapper ) {
        wrapper.processChangeSize()
    }
    static processKeyUpByWrapper( event, wrapper ) {
        wrapper.processKeyUp( event )
    }
    static processKeyDownByWrapper( event, wrapper ) {
        wrapper.processKeyDown( event )
    }

    processMouseDown( event ) {
        if (this.#isRMB( event )) {
            this.lastEvent = "mouseDownRMB"
            this.isRMBDownInf = true
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            this.isShiftDownInf = event.shiftKey
        }  else if ( this.#isLMB( event ) ) {
            this.lastEvent = "mouseDownLMB"
            this.isLMBDownInf = true
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            this.isShiftDownInf = event.shiftKey
        }
        event.preventDefault()
        this.#processDisplayMouseDown()
    }
    #processDisplayMouseDown() {
        this.facadeDisplay.processEventMouseDown()
    }

    processMouseMove( event ) {
        this.#updateInformationEventMouseMove( event )
        this.#processDisplayMouseMove()
    }
    #updateInformationEventMouseMove( event ) {
        this.lastEvent = "mouseMove"
        this.deltaX = event.clientX - this.lastX 
        this.deltaY = event.clientY - this.lastY
        this.lastX = event.clientX
        this.lastY = event.clientY
        this.isShiftDownInf = event.shiftKey
    } 
    #processDisplayMouseMove() {
        this.facadeDisplay.processEventMouseMove()
    }

    processMouseUp( event ) {
        if (this.#isRMB( event )) {
            this.lastEvent = "mouseUpRMB"
            this.isRMBDownInf = false
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            this.isShiftDownInf = event.shiftKey
        } else if ( this.#isLMB( event ) ) {
            this.lastEvent = "mouseUpLMB"
            this.isLMBDownInf = false
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            this.isShiftDownInf = event.shiftKey
        }
        event.preventDefault()
        this.#processDisplayMouseUp()
    }
    #processDisplayMouseUp() {
        this.facadeDisplay.processEventMouseUp()
    }
    #isRMB( event ) {
        let numberOfRightMouseButton = 2
        return event.button === numberOfRightMouseButton
    }
    #isLMB( event ) {
        let numberOfLeftMouseButton = 0
        return event.button === numberOfLeftMouseButton
    }

    processWheel( event ) {
        this.lastEvent = "wheel"
        this.wheelNum = event.deltaY
        this.#updateDisplayByWheel()
    }
    #updateDisplayByWheel() {
        this.facadeDisplay.processEventWheel()
    }

    processChangeSize() {
        this.lastEvent = "resize"
        this.facadeDisplay.processEventResize()
    }

    processKeyUp( event ) {
        this.listOfkeysDown[ event.key ] = false
    }

    processKeyDown( event ) {
        if (!this.listOfkeysDown[ event.key ]) {
            this.listOfkeysDown[ event.key ] = true
            this.facadeDisplay.processEventKeyDown()
        }
    }

    isRMBDown() {
        return this.isRMBDownInf
    }
    isLMBDown() {
        return this.isLMBDownInf
    }
    getDeltaX() {
        return this.deltaX
    }
    getDeltaY() {
        return this.deltaY
    }
    getLastX() {
        return this.lastX
    }
    getLastY() {
        return this.lastY
    }
    getLastEvent() {
        return this.lastEvent
    }
    isShiftDown() {
        return this.isShiftDownInf
    }
    getWheelNum() {
        return this.wheelNum
    }
    getListOfkeysDown() {
        return this.listOfkeysDown
    }

    setFacadeDisplay( facadeDisplay ) {
        this.facadeDisplay = facadeDisplay
    }
}


class Display {
    constructor() {
        this.adapterCanv = new AdapterCanvas()
        this.camera = Camera.getOrbitalCamera()
        this.compositeModels = new CompositeModel()
        this.coloredCellDecorator = new ColorCellsDecorator()
        this.coloredCellDecorator.setDisplay( this )

        this.selectModelName
    }

    render() {
        let iteratorPoligonsOnPlane = this.#getIteratorPoligonsOnPlane()
        this.adapterCanv.drawBackgroundAndPoligons(iteratorPoligonsOnPlane)
    }
    coloredSelectFigurAndEndPos( dot, listOfEndDots, listOfColorEndPos ) {
        this.coloredCellDecorator.coloredSelectFigurAndEndPos( dot, listOfEndDots, listOfColorEndPos )
    }
    decoloredSelectFigurAndEndPos() {
        this.coloredCellDecorator.decoloredSelectFigurAndEndPos()
    }
    selectModelByName( nameElement ) {
        this.selectModelName = nameElement
    }
    isEnableModel( nameOfColoredSelectFigur ) {
        return this.compositeModels.isEnableModel( nameOfColoredSelectFigur )
    }
    setCenterToSelectModel( dot ) {
        let model = this.compositeModels.getModel( this.selectModelName )
        model.setCenter( dot )
    }
    #getIteratorPoligonsOnPlane() {
        let iterator = this.compositeModels.getIteratorProjectionPoligonsOnPlane( this.camera, this.adapterCanv )
        return iterator
    }
    addEventNumberToCamera( numX, numY ) {
        this.camera.addEventNumberToCamera( numX, numY )
    }
    addEventNumberWithShiftToCamera( numX, numY ) {
        this.camera.addEventNumberWithShiftToCamera( numX, numY )
    }
    addEventNumberOfWheelToCamera( num ) {
        this.camera.addEventNumberOfWheelToCamera( num )
    }
    updateSize() {
        this.adapterCanv.updateSize()
    }
    fromFromPosOnPlaneToPosOnDesk( x, y ) {
        let dotOnDesk = Dot.fromFromPosOnPlaneToPosOnDesk( x, y, this.camera, this.adapterCanv )
        return dotOnDesk
    }

    setLite( lite ) {
        this.compositeModels.setLite( lite )
    }
    setBackgroundColor(color) {
        this.adapterCanv.setBackgroundColor( color )
    }
    setDispInformOfSelectCell( dispInform ) {
        this.coloredCellDecorator.setDispInformOfSelectCell( dispInform )
    }
    setFunctionCalculateColorSelect( funct ) {
        this.coloredCellDecorator.setFunctionCalculateColorSelect( funct )
    }

    getColorOfSelectCell( pos, gameBoard ) {
        return this.coloredCellDecorator.getColorOfSelectCell( pos, gameBoard )
    }
    isColoredDesk() {
        return this.coloredCellDecorator.isColoredDesk()
    }

    addModel( name , model) {
        this.compositeModels.addModel( name, model )
    }
    addLength(length) {
        this.camera.addLengthFromCenterToPos(length)
    }
}


class ColorCellsDecorator {
    constructor() {
        this.display

        this.builderColoredCellModel = this.#getBuilderColoredCellModel()
        this.displayList = []
        this.selectDisplayNum = 0

        this.colorCellFunct

        this.isColoredDeskInf = false
        this.nameOfColoredCell = "selectColoredCell"

        this.coloredCellsNameList = []
        this.amountOfCreatedEndDots = 0
    }
    #getBuilderColoredCellModel() {
        let listDotsOfSurfaceCell = [
            new Dot( -1, 0, 1 ),
            new Dot( -1, 0, -1 ),
            new Dot( 1, 0, -1 ),
            new Dot( 1, 0, 1 )
        ]
        let selectCellModel = new BuilderModel()
        selectCellModel.setScale( 5000 )
        selectCellModel.selectColorNumber( 0 )
        selectCellModel.drawQuadrilateral( listDotsOfSurfaceCell )
        return selectCellModel
    }

    coloredSelectFigurAndEndPos( dot, listOfEndDots, listOfColorEndPos ) {
        this.isColoredDeskInf = true
        this.#coloredSelectFigur( dot )
        this.#coloredEndPos( listOfEndDots, listOfColorEndPos )
    }
    #coloredSelectFigur( dot ) {
        if ( ! (this.displayList.length == 0) ) {
            this.#setDisplayNum(0)
            let nameOfColoredSelectFigur = this.nameOfColoredCell
            this.#setColoredCell( nameOfColoredSelectFigur, dot )
        }
    }
    #coloredEndPos( listOfEndDots, listOfColorEndPos ) {
        this.#decoloredEndPos()
        this.amountOfCreatedEndDots = listOfEndDots.length
        for ( let numberOfDot = 0; numberOfDot < listOfEndDots.length; numberOfDot++ ) {
            let endDot = listOfEndDots[ numberOfDot ]
            let selectDisplayNum = listOfColorEndPos[ numberOfDot ]
            this.#setDisplayNum( selectDisplayNum )
            let nameOfDot = this.nameOfColoredCell + `${ numberOfDot }` + "_" + `${ selectDisplayNum }`
            if ( numberOfDot >= this.coloredCellsNameList.length ) {
                this.coloredCellsNameList.push( nameOfDot )
            } else {
                this.coloredCellsNameList[ numberOfDot ] = nameOfDot
            }
            this.#setColoredCell( nameOfDot, endDot )
        }
    }
    #setColoredCell( nameOfDot, dot ) {
        if ( !this.display.isEnableModel( nameOfDot )) {
            this.#createColoredSelectCell( nameOfDot )    
        }
        this.display.selectModelByName( nameOfDot )
        this.display.setCenterToSelectModel( dot )
    }
    #createColoredSelectCell( nameOfColoredSelectFigur )  {
        let selectedDisplayInformation = this.#getSelectedDisplayInformation()
        this.builderColoredCellModel.setDisplayInformation( selectedDisplayInformation )
        let model = this.builderColoredCellModel.getModel()
        this.display.addModel( nameOfColoredSelectFigur, model )
    }
    #getSelectedDisplayInformation() {
        return this.displayList[ this.selectDisplayNum ]
    }
    decoloredSelectFigurAndEndPos( ) {
        this.isColoredDeskInf = false
        this.#decoloredSelectFigur()
        this.#decoloredEndPos()
    }
    #decoloredSelectFigur() {
        let nameOfColoredSelectFigur = this.nameOfColoredCell
        let dot = new Dot()
        dot.setNaN()
        this.display.selectModelByName( nameOfColoredSelectFigur )
        this.display.setCenterToSelectModel( dot )
    }
    #decoloredEndPos() {
        for ( let numberOfColoredCell = 0; numberOfColoredCell < this.amountOfCreatedEndDots; numberOfColoredCell++ ) {
            let nameOfColoredCell = this.coloredCellsNameList[ numberOfColoredCell ]
            let dot = Dot.getNaN()
            this.display.selectModelByName( nameOfColoredCell )
            this.display.setCenterToSelectModel( dot )
        }
    }
    #setDisplayNum( num ) {
        this.selectDisplayNum = num
    }

    getColorOfSelectCell( pos, gameBoard ) {
        return this.colorCellFunct( pos, gameBoard )
    }
    setDispInformOfSelectCell( dispInform ) {
        this.displayList.push( dispInform )
    }
    setFunctionCalculateColorSelect( funct ) {
        this.colorCellFunct = funct
    }

    isColoredDesk() {
        return this.isColoredDeskInf
    }

    setDisplay( display ) {
        this.display = display
    } 
}


class AdapterCanvas {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.canvas.width = this.windowWidth;
        this.canvas.height = this.windowHeight;
        document.body.appendChild(this.canvas)
        let colorOfBlueSky = "#87CEEB"
        this.setBackgroundColor(colorOfBlueSky)
    }

    updateSize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.canvas.width = this.windowWidth;
        this.canvas.height = this.windowHeight;
    }
    drawBackgroundAndPoligons(iteratorPoligons) {
        this.fillBackgroundInSetBackgroundColor()
        this.drawPoligons(iteratorPoligons)
    }
    fillBackgroundInSetBackgroundColor() {
        let fillStyleColor = this.ctx.fillStyle
        this.ctx.fillStyle = this.backgroundColor
        this.#fillBackgroundInFillStyleColor()
        this.ctx.fillStyle = fillStyleColor
    }
    #fillBackgroundInFillStyleColor() {
        this.ctx.fillRect(0,0,this.windowWidth,this.windowHeight)
    }
    drawPoligons(iteratorPoligons) {
        this.beginPath()
        for ( iteratorPoligons.start(); iteratorPoligons.isNotDone(); iteratorPoligons.next() ) {
            this.#drawCurrentPoligon(iteratorPoligons)
        }
        this.closePathAndFill()
    }
    #drawCurrentPoligon(iteratorPoligons) {
        let colorText = iteratorPoligons.getColorText()
        this.#changeColorIfNeed( colorText )
        this.#lineTriangleNonFillAndNonStroke(iteratorPoligons)
    }
    #changeColorIfNeed( colorText ) {
        if ( colorText != this.getStrokeStyle() ) {
            this.closePathAndFill()
            this.setFillStyle(colorText)
            this.setStrokeStyle(colorText)
            this.beginPath()
        }
    }
    #lineTriangleNonFillAndNonStroke(iteratorPoligons) {
        let dot1 = iteratorPoligons.getCurrentDot1()
        let dot2 = iteratorPoligons.getCurrentDot2()
        let dot3 = iteratorPoligons.getCurrentDot3()
        this.ctx.moveTo(dot1.x , dot1.y)
        this.ctx.lineTo(dot2.x , dot2.y)
        this.ctx.lineTo(dot3.x , dot3.y)
    }
    beginPath() {
        this.ctx.beginPath()
    }
    closePathAndFill() {
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.fill()
    }

    setBackgroundColor(color) {
        this.backgroundColor = color
    }
    clearBackground() {
        this.ctx.clearRect(0,0,this.windowWidth,this.windowHeight)
    }
    setFillStyle(newFillStyle) {
        this.ctx.fillStyle = newFillStyle
    }
    setStrokeStyle(newStrokeStyle) {
        this.ctx.strokeStyle = newStrokeStyle
    }
    getFillStyle() {
        return this.ctx.fillStyle
    }
    getStrokeStyle() {
        return this.ctx.fillStyle
    }
    getAspectRatio() {
        return this.windowWidth/this.windowHeight
    }
    getWidthCanvas() {
        return this.windowWidth
    }
    getHeightCanvas() {
        return this.windowHeight
    }
    deleteCanvas() {
        document.removeEventListener("resize", this.wheelFunct )
        //todo
    }
}


class Camera {
    constructor() {
        this.EyeAngle = 30
        this.sensivityMouse = 0.2
        this.sensivityMouseWithShift = 50
        this.sensivityWheel = 50
        this.verticalLimitAngle = 90

        this.position = new Dot()
        this.sight = new Direction()
        this.strategy
    }

    addEventNumberToCamera( numX, numY ) {
        this.strategy.addEventNumberToCamera( this, numX, numY )
    }
    addEventNumberWithShiftToCamera( numX, numY ) {
        this.strategy.addEventNumberWithShiftToCamera( this, numX, numY )
    }
    addEventNumberOfWheelToCamera( num ) {
        this.strategy.addEventNumberOfWheelToCamera( this, num )
    }
    translatePosition( dot ) {
        this.strategy.translatePosition( dot )
    }
    static getOrbitalCamera() {
        let camera = new Camera()
        let strategy = new StrategyOfOrbitalCamera()
        camera.setStrategy( strategy )
        camera.updatePositionByStrategy()
        return camera
    }
    static getPOVCamera() {
        let camera = new Camera()
        let strategy = new StrategyOfPOVCamera()
        camera.setStrategy( strategy )
        return camera
    }
    updatePositionByStrategy() {
        this.strategy.setPositionAndSigthCamera( this )
    }
    getPosition() {
        return this.position.getCopy()
    }
    getSigth() {
        return this.sight.getDirection()
    }
    getDirection() {
        return this.sight.getDirection()
    }
    getPerpendicularDirectionByHorizontal() {
        return this.sight.getPerpendicularDirectionByHorizontal()
    }
    getCrossDirectionByHorizontal() {
        return this.sight.getCrossDirectionByHorizontal()
    }

    getEyeAngle() {
        return this.EyeAngle
    } 
    getSensivityMouse() {
        return this.sensivityMouse
    }
    getSensivityMouseWithShift() {
        return this.sensivityMouseWithShift
    }
    getSensivityWheel() {
        return this.sensivityWheel
    }
    getVerticalLimitAngle() {
        return this.verticalLimitAngle
    }

    setStrategy( strategy ) {
        this.strategy = strategy
    }
    setPosition(newPosition) {
        this.position = newPosition
    }
    setSight( sight ) {
        this.sight = sight
    }
    setEyeAngle(angle) {
        this.EyeAngle = angle
    } 
}


class StrategyOfOrbitalCamera {
    constructor() {
        this.positionOfCamera = Direction.createDefaultPositionFromCenter()
        this.sight = new Direction()
        this.orbitalCenter = new Dot()
    }
    addEventNumberToCamera( camera, numX, numY ) {
        this.#rotatePosition( camera, numX, numY )
        this.setPositionAndSigthCamera( camera )
    }
    #rotatePosition( camera, numX, numY ) {
        let verticalAngle = numX*camera.getSensivityMouse()
        let horizontalAngle = numY*camera.getSensivityMouse()
        verticalAngle = this.#getlimitedVerticalAngle( camera, verticalAngle )
        this.#rotateSight( -verticalAngle,  horizontalAngle )
        this.#rotatePositionFromCenter( verticalAngle,  horizontalAngle )
    }
    #getlimitedVerticalAngle( camera, verticalAngle ) {
        let limitVerticalAngle = camera.getVerticalLimitAngle()
        let totalAngle = verticalAngle
        if ( verticalAngle > limitVerticalAngle ) {
            totalAngle = limitVerticalAngle
        } else if( verticalAngle < -limitVerticalAngle ) {
            totalAngle = -limitVerticalAngle
        }
        return totalAngle
    }
    #rotateSight( angleVertical,  angleHorizontal ) {
        this.sight.rotateAnglesOfVerticalAndHorizontal( angleVertical,  angleHorizontal )
    }
    #rotatePositionFromCenter( angleVertical,  angleHorizontal ) {
        this.positionOfCamera.rotateAnglesOfVerticalAndHorizontal( angleVertical,  angleHorizontal )
    }

    addEventNumberWithShiftToCamera( camera, numX, numY ) {
        let translateVec = new Dot()
        let lenTranslateX = numX*camera.getSensivityMouseWithShift()
        let lenTranslateY = -numY*camera.getSensivityMouseWithShift()
        let forwardTranslateVec = this.sight.getDirection()
        forwardTranslateVec.setY( 0 )
        forwardTranslateVec.setLength( lenTranslateX )
        let leftTranslateVec = this.sight.getPerpendicularDirectionByHorizontal()
        leftTranslateVec.multiplyLengthOnFactor( lenTranslateY )
        translateVec.plusDot( forwardTranslateVec )
        translateVec.plusDot( leftTranslateVec )
        this.orbitalCenter.plusDot( translateVec )
        this.#setPositionToCamera( camera )
    }
    addEventNumberOfWheelToCamera( camera, num ) {
        let length = num*camera.getSensivityWheel()
        this.positionOfCamera.addLength( length )
        this.#setPositionToCamera( camera )
    }
    setPositionAndSigthCamera( camera ) {
        this.#setPositionToCamera( camera )
        this.#setSightToCamera( camera )
    }
    #setPositionToCamera( camera ) {
        let pos = this.#getPositionOfCamera()
        camera.setPosition( pos )
    }
    #getPositionOfCamera() {
        let position = this.positionOfCamera.getDirection()
        position.plusDot(this.orbitalCenter)
        return position
    }

    #setSightToCamera( camera ) {
        let sight = this.#getSight()
        camera.setSight( sight )
    }
    #getSight() {
        return this.sight
    }
}


class StrategyOfPOVCamera {
    constructor() {

    }


}


class BuilderCompositeModel {
    constructor() {
        this.compositeModel
        this.listOfBuilderModels = {}
    }

    getModel() {
        this.compositeModel = new CompositeModel()
        for ( let modelName in this.listOfBuilderModels ) {
            let builder = this.listOfBuilderModels[ modelName ]
            let model = builder.getModel()
            this.compositeModel.addModel( modelName, model )
        }
        return this.compositeModel
    }
    setDisplayInformationOfElement( element ) {
        for ( let modelName in this.listOfBuilderModels ) {
            let builder = this.listOfBuilderModels[ modelName ]
            builder.setDisplayInformationOfElement( element )
        }
    }
    addBuilderModel( name, builder ) {
        this.listOfBuilderModels[ name ] = builder
    }
}


class BuilderModel {
    constructor() {
        this.strategyBuilder = new StrategyBuilderModel()
        this.listOfOperation = []

        this.listDotsOfPath
    }

    getModel() {
        this.strategyBuilder.setDefaultOptions()
        this.#drawModel()
        let model = this.strategyBuilder.getModel()
        return model
    }
    #drawModel() {
        for ( let operation of this.listOfOperation ) {
            this.#doOperation( operation )
        }
    }
    #doOperation( operation ) {
        let nameOperation = operation[0]
        let firstArgument = operation[1]
        let secondArgument = operation[2]
        this.strategyBuilder[ nameOperation ]( firstArgument, secondArgument )
    }

    drawSphereOutsideCenterRad( dot ) {
        let nameOperation = "drawSphereOutsideCenterRad"
        let firstArgument = dot
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    drawSphereInside( dot, radius ) {
        let nameOperation = "drawSphereInside"
        let firstArgument = dot
        let secondArgument = radius
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    drawSphereOutside( dot, radius ) {
        let nameOperation = "drawSphereOutside"
        let firstArgument = dot
        let secondArgument = radius
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    drawHoop( dot ) {
        let nameOperation = "drawHoop"
        let firstArgument = dot
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    drawQuadrilateral( listOfDots ) {
        let nameOperation = "drawQuadrilateral"
        let firstArgument = listOfDots
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    selectColorNumber( number ) {
        let nameOperation = "selectColorNumber"
        let firstArgument = number
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    rotateAroundAxisY( angle ) {
        let nameOperation = "rotateAroundAxisY"
        let firstArgument = angle
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    setLastDot( dot ) {
        let nameOperation = "setLastDot"
        let firstArgument = dot
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    setScale( num ) {
        let nameOperation = "setScale"
        let firstArgument = num
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    setWidthEdgeOfDrawingPath( num ) {
        let nameOperation = "setWidthEdgeOfDrawingPath"
        let firstArgument = num
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
    }
    beginPath() {
        this.listDotsOfPath = []
    }
    drawDotOfPath( dot ) {
        this.listDotsOfPath.push( dot )
    }
    finishPath() {
        let nameOperation = "drawPath"
        let firstArgument = [ ...this.listDotsOfPath ]
        let secondArgument = ""
        this.#addOperation( nameOperation, firstArgument, secondArgument)
        this.listDotsOfPath = undefined
    }

    #addOperation( nameOperation, firstArgument, secondArgument ) {
        let operation = new Array(3)
        operation[0] = nameOperation
        operation[1] = firstArgument
        operation[2] = secondArgument
        this.listOfOperation.push( operation )
    }

    getCopy() {
        let newBuilder = new BuilderModel()
        newBuilder.listOfOperation = [ ...this.listOfOperation ]
        return newBuilder
    }
    setDisplayInformationOfElement( element ) {
        this.strategyBuilder.setDisplayInformationOfElement( element )
    }
    setDisplayInformation( dispInform ) {
        this.strategyBuilder.setDisplayInformation( dispInform )
    }
}


class StrategyBuilderModel {
    constructor() {
        this.model = new Model()
        let defaultQuality = 10
        let defaultLastDot = new Dot(0,0,0)
        let defaultListOfColor = [ new Color() ]
        let defaultScale = 1
        let defaultSelectedColorNumber = 0
        let defaultWidthOfDrawingPath = 1
        this.quality = defaultQuality
        this.lastDot = defaultLastDot
        this.listOfColor = defaultListOfColor
        this.scale = defaultScale
        this.displayScale = defaultScale
        this.totalScale = defaultScale
        this.selectedColorNumber = defaultSelectedColorNumber
        this.widthEdgeOfDrawingPath = defaultWidthOfDrawingPath
    }

    getModel() {
        return this.model
    }
    setDefaultOptions() {
        this.model = new Model()
        this.selectColorNumber( 0 )
        this.lastDot = new Dot()
    }
    drawSphereOutsideCenterRad( dot ) {
        this.drawSphereOutside( dot, "centerRad" )
    }
    drawSphereInside( dot, radius ) {
        let convex = false
        this.drawSphere( dot, radius, convex )
    }  
    drawSphereOutside( dot, radius ) {
        let convex = true
        this.drawSphere( dot, radius, convex )
    }
    drawSphere( dot, radiusArgument, convex ) {//
        let scaleDot = dot.getCopy()
        scaleDot.multiplyLengthOnFactor( this.#getScale() )
        let lastDot = this.getLastDot()   
        let radius = this.#getRadius( radiusArgument, scaleDot )
        let center = this.#getCenter( radius, scaleDot, convex )       
        let distanceVec = lastDot.getDistanceToDot(scaleDot)
        let step = this.#getStep( radius, scaleDot )
        let vec1 = lastDot.getCopy()
        vec1.minusDot(center)
        if ( (vec1.x - dot.x) < 0) {
            step *= -1
        }
        let chDot1
        let lastDistanceFromChDot1ToVec1 = 0
        let DistanceFromChDot1ToVec1
        for ( let numStep = 0; numStep < this.quality+1; numStep++) {
            let angle = step*numStep
            chDot1 = vec1.getCopy()
            chDot1.rotateAroundAxisZ(angle)
            DistanceFromChDot1ToVec1 = vec1.getDistanceToDot(chDot1)
            if ( (vec1.getDistanceToDot(chDot1) > distanceVec ) | ( DistanceFromChDot1ToVec1 < lastDistanceFromChDot1ToVec1 ) ) { 
                this.drawHoop( dot )
                break 
            }
            chDot1.plusDot(center)
            lastDistanceFromChDot1ToVec1 = DistanceFromChDot1ToVec1
            chDot1.multiplyLengthOnFactor(1/this.#getScale())
            this.drawHoop( chDot1 ) 
        }
        this.#setLastDot( scaleDot )
    }


    #getRadius( radiusArgument, scaleDot ) {
        let radius
        if ( radiusArgument == "centerRad" ) {
            radius = scaleDot.centerRadiusY(this.lastDot)
        } else if ( radiusArgument ) {
            radius = this.#getScale()*radiusArgument
        } else {
            radius = this.lastDot.getDistanceToDot(scaleDot) / Math.sqrt(2) }
        return radius
    }
    #getCenter( radius, scaleDot, convex ) {
        let height = Math.sqrt( Math.pow(radius, 2) - Math.pow(this.lastDot.getDistanceToDot(scaleDot)/2 , 2) )
        if  ( isNaN(height) ) { return false }
        let vecHeight = new Dot().searchProjection(scaleDot,this.lastDot)
        vecHeight.setLength(height)
        if ( convex ) { 
            vecHeight.reverse() }
        let center = this.lastDot.getCopy()
        center.plusDot(scaleDot)
        center.multiplyLengthOnFactor(1/2)
        center.plusDot(vecHeight)
        return center
    }
    #getStep( radius, scaleDot ) {
        let radius2 = this.lastDot.radiusY0(scaleDot)
        let sinQ = Math.sin(Dot.inRad( 180/this.quality )) 
        let qR = radius2*sinQ /radius
        let step = 2*Math.asin( qR )
        if ( qR > 1 ) {
            step = Dot.inRad(180) }
        step = Dot.inGrad(step)
        return step
    }
    drawHoop( dot ) {
        let scaleDot = dot.getCopy()
        scaleDot.multiplyLengthOnFactor( this.#getScale() )
        let startTopDot = new Dot()
        let startBottomDot = new Dot()
        startTopDot.plusDot(scaleDot)
        startBottomDot.plusDot(this.lastDot)
        let bottomDotOfPoligon = startBottomDot
        let TopDotOfPoligon = startTopDot
        let lengthStep = 360/this.quality ;
        let amountStep = ( this.quality*2 ) + 1
        let newDot
        for( let step = 0; step <= amountStep ; step++ ) {
            if ( step % 2 == 0 ) { 
                newDot = startBottomDot.getCopy()
            } else { 
                newDot = startTopDot.getCopy()
            }
            newDot.rotateAroundAxisY( lengthStep * ( Math.floor(step/2)))
            let poligon = new Poligon()
            poligon.setDot1(bottomDotOfPoligon.getCopy())  
            poligon.setDot2(TopDotOfPoligon.getCopy())
            poligon.setDot3(newDot.getCopy())
            poligon.setColor( this.getActiveColor())
            this.#addPoligonToModel( poligon )
            if ( step % 2 == 0 ) { 
                bottomDotOfPoligon = newDot 
            } else { 
                TopDotOfPoligon = newDot 
            }
        }
        this.#setLastDot( scaleDot )
    }  
    #addPoligonToModel( poligon ) {
        if ( ( this.#isWholePoligon( poligon ) )  ) {
            this.model.addPoligon( poligon )
        }
    }
    #isWholePoligon( poligon ) {
        return !poligon.getNormal().isNaN()
    }
    drawQuadrilateral( listOfDots ) {
        let dot1 = listOfDots[0].getCopy()
        let dot2 = listOfDots[1].getCopy()
        let dot3 = listOfDots[2].getCopy()
        let dot4 = listOfDots[3].getCopy()
        let scale = this.#getScale()
        let color = this.getActiveColor()
        dot1.multiplyLengthOnFactor( scale )
        dot2.multiplyLengthOnFactor( scale )
        dot3.multiplyLengthOnFactor( scale )
        dot4.multiplyLengthOnFactor( scale )

        let firstPoligon = new Poligon()
        firstPoligon.setDot1( dot1 )
        firstPoligon.setDot2( dot2 )
        firstPoligon.setDot3( dot3 )
        firstPoligon.setColor( color )
        this.model.addPoligon( firstPoligon )

        let secondPoligon = new Poligon()
        secondPoligon.setDot1( dot3 )
        secondPoligon.setDot2( dot4 )
        secondPoligon.setDot3( dot1 )
        secondPoligon.setColor( color )
        this.model.addPoligon( secondPoligon )
    }
    drawPath( listOfDots ) {
        this.#drawSideEdgeOfPath( listOfDots )
        this.#drawEdgeOfPath( listOfDots )
    }
    #drawSideEdgeOfPath( listOfDots ) {
        let scale = this.#getScale()
        for ( let numberOfFirstDot = 0; numberOfFirstDot < listOfDots.length; numberOfFirstDot++ ) {
            let numberOfSecondDot = ( numberOfFirstDot + 1 )%listOfDots.length
            let firstDotOfList = listOfDots[ numberOfFirstDot ].getCopy()
            let secondDotOfList = listOfDots[ numberOfSecondDot ].getCopy()
            firstDotOfList.multiplyLengthOnFactor( scale )
            secondDotOfList.multiplyLengthOnFactor( scale )
            let dotOfSideEdge = new Dot( 0, 0, this.widthEdgeOfDrawingPath )
            let dot1 = firstDotOfList.getCopy()
            let dot2 = firstDotOfList.getCopy()
            let dot3 = secondDotOfList.getCopy()
            let dot4 = secondDotOfList.getCopy()
            dot1.plusDot( dotOfSideEdge )
            dot2.minusDot( dotOfSideEdge )
            dot3.plusDot( dotOfSideEdge )
            dot4.minusDot( dotOfSideEdge )
            let color = this.getActiveColor()
            let firstPoligon = new Poligon()
            firstPoligon.setDot1( dot2 )
            firstPoligon.setDot2( dot1 )
            firstPoligon.setDot3( dot3 )
            firstPoligon.setColor( color )
            this.model.addPoligon( firstPoligon )
            let secondPoligon = new Poligon()
            secondPoligon.setDot1( dot2 )
            secondPoligon.setDot2( dot3 )
            secondPoligon.setDot3( dot4 )
            secondPoligon.setColor( color )
            this.model.addPoligon( secondPoligon )
        }
    }
    #drawEdgeOfPath( listOfDots ) {
        let listOfDotsCopy = [ ...listOfDots ]
        let dot1
        let dot2
        let dot3
        let index = 0
        dot1 = listOfDotsCopy[ index ]
        dot2 = listOfDotsCopy[ index + 1 ]
        dot3 = listOfDotsCopy[ index + 2 ]
        while ( listOfDotsCopy.length > 3 ) {
            if ( this.#isDotsAEar( listOfDotsCopy, dot1, dot2, dot3, index ) ) {
                this.#drawEdgePathPoligon( dot1, dot2,dot3 )
                listOfDotsCopy.splice( (index)%listOfDotsCopy.length + 1, 1 )
            }
            index++
            dot1 = listOfDotsCopy[ ( index )%listOfDotsCopy.length]
            dot2 = listOfDotsCopy[ (index + 1 )%listOfDotsCopy.length ]
            dot3 = listOfDotsCopy[ (index + 2 )%listOfDotsCopy.length ]
        }
        dot1 = listOfDotsCopy[ 0 ]
        dot2 = listOfDotsCopy[ 1 ]
        dot3 = listOfDotsCopy[ 2 ]
        this.#drawEdgePathPoligon( dot1, dot2,dot3 )
    }
    #drawEdgePathPoligon( dot1, dot2,dot3 ) {
        let scale = this.#getScale()
        let scaleDot1 = dot1.getCopy()
        let scaleDot2 = dot2.getCopy()
        let scaleDot3 = dot3.getCopy()
        scaleDot1.multiplyLengthOnFactor( scale )
        scaleDot2.multiplyLengthOnFactor( scale )
        scaleDot3.multiplyLengthOnFactor( scale )
        let dotOfSideEdge = new Dot( 0, 0, this.widthEdgeOfDrawingPath )
        let dot1FirstPol = scaleDot1.getCopy()
        let dot2FirstPol = scaleDot2.getCopy()
        let dot3FirstPol = scaleDot3.getCopy()
        dot1FirstPol.plusDot( dotOfSideEdge )
        dot2FirstPol.plusDot( dotOfSideEdge )
        dot3FirstPol.plusDot( dotOfSideEdge )
        let dot1SecondPol = scaleDot1.getCopy()
        let dot2SecondPol = scaleDot2.getCopy()
        let dot3SecondPol = scaleDot3.getCopy()
        dot1SecondPol.minusDot( dotOfSideEdge )
        dot2SecondPol.minusDot( dotOfSideEdge )
        dot3SecondPol.minusDot( dotOfSideEdge )
        let color1 = this.getActiveColor()
        let color2 = this.getActiveColor()
        let firstPoligon = new Poligon()
        firstPoligon.setDot1( dot2FirstPol )
        firstPoligon.setDot2( dot1FirstPol )
        firstPoligon.setDot3( dot3FirstPol )
        firstPoligon.setColor( color1 )
        this.model.addPoligon( firstPoligon )
        let secondPoligon = new Poligon()
        secondPoligon.setDot1( dot1SecondPol )
        secondPoligon.setDot2( dot2SecondPol )
        secondPoligon.setDot3( dot3SecondPol )
        secondPoligon.setColor( color2 )
        this.model.addPoligon( secondPoligon )
    }
    #isDotsAEar( listOfDots, dot1, dot2, dot3, index ) {
        let scalar = this.#angleOfDots(dot1, dot2, dot3)
        if ( scalar >= 0 ) {
            return false
        }
        for ( let numberDot = 0; numberDot < (listOfDots.length-3); numberDot++ ) {
            let totalNumberDot = ( index + 3 + numberDot) % listOfDots.length
            let dot = listOfDots[ totalNumberDot ]
            if ( this.#isDotInTriangle( dot, dot1, dot2, dot3 ) ) {
                return false
            }
        }
        return true
    }
    #isDotInTriangle( dot, dot1, dot2, dot3 ) {
        let scalar1 = this.#angleOfDots(dot1, dot2, dot)
        let scalar2 = this.#angleOfDots(dot2, dot3, dot)
        let scalar3 = this.#angleOfDots(dot3, dot1, dot)
        let result1 = scalar1 <=0 & scalar2 <=0 & scalar3 <= 0 
        let result2 = scalar1 >=0 & scalar2 >=0 & scalar3 >= 0 
        if( result1 | result2) {
            return true
        }
        return false
    }
    #angleOfDots(dot1, dot2, dot3) {
        let testDot = dot1.getCopy()
        let testDot2 = dot3.getCopy()
        testDot2.minusDot( dot2 )
        testDot.minusDot( dot2 )
        testDot.crossDot( testDot2 )
        let scalar = testDot.getZ()
        return scalar
    }

    #setLastDot( dot ) {
        this.lastDot = dot
    }

    setDisplayInformationOfElement( element ) {
        let displayInformationOfElement = element.getDisplayInfmationOfElement()
        this.setDisplayInformation( displayInformationOfElement )
    }
    setDisplayInformation( dispInform ) {
        let colorList = dispInform.getColorList()
        let quality = dispInform.getQuality()
        let scale = dispInform.getScale()

        this.setColorList( colorList )
        this.setQuality( quality )
        this.#setScaleByDisplayInformation( scale )
    }
    setColorList( colorList ) {
        for ( let colorNum in colorList ) {
            let textColor = colorList[ colorNum ]
            this.listOfColor[ colorNum ] = new Color(textColor)
        }
    }
    setQuality(quality) {
        this.quality = quality
    }
    #setScaleByDisplayInformation( scale ) {
        this.displayScale = scale
        if ( scale != undefined ) {
            this.totalScale = this.scale*this.displayScale
        }
    }

    selectColorNumber( num ) {
        this.selectedColorNumber = num
    }
    rotateAroundAxisY( angle ) {
        this.model.rotateAroundAxisY( angle )
    }
    rotateAroundAxisX( angle ) {
        this.model.rotateAroundAxisY( angle )
    }
    rotateAroundAxisZ( angle ) {
        this.model.rotateAroundAxisY( angle )
    }
    setLastDot( dot ) {
        let scale = this.#getScale()
        let lastDot = dot.getCopy()
        lastDot.multiplyLengthOnFactor( scale )
        this.lastDot = lastDot
    }
    setScale(scale) {
        this.scale = scale
        this.totalScale = scale
        if ( this.displayScale != undefined ) {
            this.totalScale *= this.displayScale
        }
    }
    setWidthEdgeOfDrawingPath( num ) {
        let totalNum = num * this.#getScale() 
        this.widthEdgeOfDrawingPath = totalNum
    }

    #getScale() {
        return this.totalScale
    }
    getActiveColor() {
        let activeColor = this.listOfColor[this.selectedColorNumber]
        return activeColor.getCopy()
    }
    getLastDot() {
        return this.lastDot
    }
    getQuality() {
        return this.quality
    }
}


class CompositeModel {
    constructor() {
        this.flyWeightDots = new FlyWeightDotsOfModel()
        this.listModels = {}
        this.center = new Dot()
        this.lite = new Lite()
        this.iteratorOfProjectionPoligonsOfModels
    }

    getIteratorProjectionPoligonsOnPlane( camera, canvas ) {
        this.#createIteratorIfDontExist( camera, canvas )
        return this.iteratorOfProjectionPoligonsOfModels
    }
    #createIteratorIfDontExist( camera, canvas ) {
        if ( this.iteratorOfProjectionPoligonsOfModels == undefined ) {
            this.iteratorOfProjectionPoligonsOfModels = new IteratorProjectionPoligonsOfCompositeModel( camera, canvas, this )
        }
    }

    setCenter( center ) {
        let tranclateDotFromOldCenter = center.getCopy()
        tranclateDotFromOldCenter.minusDot( this.center )
        this.#translatePositionOfModels( center )
        this.center = center
    }
    #translatePositionOfModels(dot) {
        for ( let modelName in this.listModels ) {
            let model = this.listModels[ modelName ]
            model.setCenter( dot )
        }
    }
    setLite(lite) {
        this.lite = lite
        for ( let nameModel in this.listModels ) {
            let model = this.listModels[ nameModel ]
            model.setLite( this.lite )  
        }
    }
    addModel( name, model ) {
        model.setLite( this.lite )
        this.listModels[ name ] = model
    }

    isEnableModel( name ) {
        return name in this.listModels
    }

    getListNameOfModels() {
        return Object.keys( this.listModels )
    }
    getModel( name ) {
        return this.listModels[ name ]
    }
    getCenter() {
        return this.center.getCopy()
    }
}


class IteratorProjectionPoligonsOfCompositeModel {
    constructor( camera, canvas, compositeModel ) {
        this.camera = camera
        this.canvas = canvas
        this.compositeModel = compositeModel
        this.nameOfModels = this.compositeModel.getListNameOfModels()
        this.sortedNameOfModels
        this.selectedModelNum
        this.iteratorOfSelectedModel
    }

    start() {
        this.nameOfModels = this.compositeModel.getListNameOfModels()
        this.selectedModelNum = -1
        this.#sortIterators()
        this.#setNextIterator()
    }
    #sortIterators() {
        this.sortedNameOfModels = [ ...this.nameOfModels ]
        let functSort = ( nameModel1 , nameModel2 ) => { return IteratorProjectionPoligonsOfCompositeModel.sortFunct( nameModel1 , nameModel2, this ) }
        this.sortedNameOfModels.sort(functSort)
    }
    static sortFunct( nameMode1, nameModel2, iterator ) {
        return iterator.whishModelIsClose( nameMode1, nameModel2 )
    }
    whishModelIsClose( nameModel1, nameModel2 ) {
        let lengthModel1 = this.#getLengthFromCamera( nameModel1 )
        let lengthModel2 = this.#getLengthFromCamera( nameModel2 )
        return lengthModel2 - lengthModel1
    }
    #getLengthFromCamera( nameModel ) {
        let model = this.compositeModel.getModel( nameModel )
        let modelCenter = model.getCenter()
        if ( modelCenter.isNaN() ) {
            modelCenter = new Dot()
        }
        let dotCameraToModelPosition = this.camera.getPosition()
        dotCameraToModelPosition.minusDot( modelCenter )
        let lengthFromCameraToModel = dotCameraToModelPosition.getLength()
        return lengthFromCameraToModel
    }
    isNotDone() {
        let isListNotEnd = this.#isListNotEnd()
        return isListNotEnd
    }
    next() {
        if ( this.iteratorOfSelectedModel.isNotDone() ) {
            this.iteratorOfSelectedModel.next()
        } else {
            this.#setNextIterator()
        }
    }
    #setNextIterator() {
        do  {
            this.selectedModelNum++
            this.#getNewIteratorIfCan()
        } while ( this.#isIteratorDone() )
    }
    #getNewIteratorIfCan() {
        if ( this.#isListNotEnd() ) {
            this.#setIteratorByNumberOfModel( this.selectedModelNum )
        }
    }
    #setIteratorByNumberOfModel( num ) {
        let selectedNameModel = this.sortedNameOfModels[ num ]
        let selectedModel = this.compositeModel.getModel( selectedNameModel )
        this.iteratorOfSelectedModel = selectedModel.getIteratorProjectionPoligonsOnPlane( this.camera, this.canvas )
        this.iteratorOfSelectedModel.start()
    }
    #isIteratorDone() {
        let isListEnd = this.#isListNotEnd()
        let isiteratorDone = !this.iteratorOfSelectedModel.isNotDone() 
        return isListEnd & isiteratorDone
    }
    #isListNotEnd() {
        return this.selectedModelNum < (this.nameOfModels.length) 
    }
    getCurrentDot1() {
        return this.iteratorOfSelectedModel.getCurrentDot1()
    }
    getCurrentDot2() {
        return this.iteratorOfSelectedModel.getCurrentDot2()
    }
    getCurrentDot3() {
        return this.iteratorOfSelectedModel.getCurrentDot3()
    }
    getColorText() {
        return this.iteratorOfSelectedModel.getColorText()
    }
}


class Model  {
    constructor() {
        this.flyWeightDots = new FlyWeightDotsOfModel()
        this.poligons = []
        this.center = new Dot()
        this.lite = new Lite()
        this.iteratorOfProjectionPoligonsOnPlane
    }

    addPoligon( poligon ) {
        poligon.setColorBrightnessByLite( this.lite )
        let dot1 = poligon.getDot1()
        let dot2 = poligon.getDot2()
        let dot3 = poligon.getDot3()
        let indexDot1 = this.flyWeightDots.getIndexByDot( dot1 )
        let indexDot2 = this.flyWeightDots.getIndexByDot( dot2 )
        let indexDot3 = this.flyWeightDots.getIndexByDot( dot3 )
        let flyWeightDot1 = this.flyWeightDots.getDotByIndex( indexDot1 )
        let flyWeightDot2 = this.flyWeightDots.getDotByIndex( indexDot2 )
        let flyWeightDot3 = this.flyWeightDots.getDotByIndex( indexDot3 )
        poligon.setIndexDot1( indexDot1 )
        poligon.setIndexDot2( indexDot2 )
        poligon.setIndexDot3( indexDot3 )
        poligon.setDot1( flyWeightDot1 )
        poligon.setDot2( flyWeightDot2 )
        poligon.setDot3( flyWeightDot3 )
        this.poligons.push( poligon )
    }
    getIteratorProjectionPoligonsOnPlane( camera, canvas ) {
        this.#createIteratorIfDontExist( camera, canvas )
        return this.iteratorOfProjectionPoligonsOnPlane
    }
    #createIteratorIfDontExist( camera, canvas ) {
        if ( this.iteratorOfProjectionPoligonsOnPlane == undefined ) {
            this.iteratorOfProjectionPoligonsOnPlane = new IteratorProjectionPoligons( camera, canvas, this )
        }
    }
    rotateAroundAxisY( angle ) {
        this.flyWeightDots.rotateAroundAxisY( angle )
        for ( let numPoligon in this.poligons ) {
            let poligon = this.poligons[ numPoligon ]
            poligon.updateNormal()
            poligon.setColorBrightnessByLite(this.lite)
        }
    }

    isCenterNaN() {
        return this.center.isNaN()
    }

    getCenter() {
        return this.center.getCopy()
    }

    setLite(lite) {
        this.lite = lite
        for ( let numPoligon in this.poligons ) {
            let poligon = this.poligons[ numPoligon ]
            poligon.updateNormal()
            poligon.setColorBrightnessByLite(this.lite)
        }
    }
    setCenter( center ) {
        let totalCenter = center
        if ( this.center.isNaN() ){
            this.center = new Dot()
        }
        if ( center.isNaN() ){
            totalCenter = new Dot()
        }
        let tranclateDotFromOldCenter = totalCenter.getCopy()
        tranclateDotFromOldCenter.minusDot( this.center )
        this.#translatePositionOfPoligons( tranclateDotFromOldCenter )
        this.center = center
        if ( center.isNaN() ){
            this.center = center
        }
    }
    #translatePositionOfPoligons(dot) {
        if ( !dot.isNaN() ) {
            this.flyWeightDots.translatePositionOfDots( dot )
        }
    }
}


class IteratorProjectionPoligons {
    constructor(camera, canvas, model) {
        this.camera = camera
        this.canvas = canvas
        this.model = model
        this.flyWeightDots = model.flyWeightDots
        this.poligons = model.poligons
        this.projectionDotsArray = new Array( this.flyWeightDots.getLength())
        this.sortedPoligons
        this.lengthOfSortedPoligons
        this.selectPoligon
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // sortPoligonsByDistanceToCamera(poligons) {/////////////
    //     //return poligons
    //     poligons.sort( (poligon1 , poligon2) => {
    //         let cameraPoz = this.camera.getPosition()
    //         let cameraEye = this.camera.getSigth() 
    //         return this.calcDistance(poligon2, cameraPoz, cameraEye) - this.calcDistance(poligon1, cameraPoz, cameraEye)
    //     })
    //     return poligons
    // }
    // calcDistance(poligon, cameraPoz, cameraEye) {//
    //     let len1 = this.cameraLength(poligon.dot1, cameraPoz, cameraEye)
    //     let len2 = this.cameraLength(poligon.dot2, cameraPoz, cameraEye)
    //     let len3 = this.cameraLength(poligon.dot3, cameraPoz, cameraEye)
    //     return Math.max( len1, len2, len3) 
    // }
    // cameraLength(dot, cameraPoz, cameraEye) {//
    //     let copyDota = dot.getCopy()
    //     copyDota.minusDot(cameraPoz)
    //     return copyDota.searchProjection(cameraEye).getLength()
    // }
    //////////////////////////////////////////////////////////////////////////////////////////////

    start() {
        this.selectPoligon = 0
        this.sortedPoligons = []
        this.lengthOfSortedPoligons = 0
        this.projectionDotsArray = new Array( this.flyWeightDots.getLength())
        this.#sortPoligon()
    }
    #sortPoligon() {////////////
        if ( this.#isCenterModelNotNan() ) {
            this.sortedPoligons = new Array( this.poligons.length )
            this.#iterateAllPoligonsAndCheckIsVisible()
        }
    }
    #isCenterModelNotNan() {
        return !this.model.isCenterNaN()
    }
    #iterateAllPoligonsAndCheckIsVisible() {///////////
        let numSortPoligon = 0
        for ( let poligon of this.poligons ) {
            if ( poligon.isVisible( this.camera, this.flyWeightDots )) {
                this.sortedPoligons[ numSortPoligon ] = poligon
                numSortPoligon++
            }
        }
        this.lengthOfSortedPoligons = numSortPoligon
    }

    isNotDone() {
        if ( this.sortedPoligons.length == 0 ) {
            return false
        }
        return ( this.selectPoligon < (this.lengthOfSortedPoligons-1) )
    }
    next() {
        this.selectPoligon++
    }
    getCurrentDot1() {
        let indexDot = this.sortedPoligons[this.selectPoligon].getIndexDot1()
        let dot = this.#getProjectionDot( indexDot )
        return dot
    }
    getCurrentDot2() {
        let indexDot = this.sortedPoligons[this.selectPoligon].getIndexDot2()
        let dot = this.#getProjectionDot( indexDot )
        return dot
    }
    getCurrentDot3() {
        let indexDot = this.sortedPoligons[this.selectPoligon].getIndexDot3()
        let dot = this.#getProjectionDot( indexDot )
        return dot
    }
    #getProjectionDot( indexDot ) {
        let projectionDot = this.projectionDotsArray[ indexDot ]
        if ( projectionDot == undefined ) {
            let dot = this.flyWeightDots.getDotByIndex( indexDot )
            projectionDot = dot.getProjectionDotOnPlane( this.camera, this.canvas )
            this.projectionDotsArray[ indexDot ] = projectionDot
        }
        return projectionDot
    }
    getColorText() {
        return this.sortedPoligons[this.selectPoligon].getColorText()
    }
}


class Poligon {
    constructor() {
        this.indexDot1
        this.indexDot2
        this.indexDot3
        this.dot1
        this.dot2
        this.dot3
        this.color
        this.normal
    }

    setColorBrightnessByLite(lite) {
        let normal = this.getNormal()
        this.color.setColorBrightnessByLite( normal, lite )
    }
    isVisible( camera, flyWeightDots ) {///////
        let vecFromCameraToPligon = flyWeightDots.getDotByIndex(this.indexDot1).getCopy()
        vecFromCameraToPligon.minusDot(camera.getPosition())
        let scalar = this.getNormal().getScalarProduct( vecFromCameraToPligon )//
        let result = scalar > 0 
        return result
    }

    setDot1(dot) {
        this.#setDot(dot, "dot1")
    }
    setDot2(dot) {
        this.#setDot(dot, "dot2")
    }
    setDot3(dot) {
        this.#setDot(dot, "dot3")
    }
    #setDot(dot, numDot) {
        this[numDot] = dot
        this.updateNormal()
    }
    updateNormal() {
        if ( this.#isHaveAllDots() ) {
            this.normal = Dot.getNormalOfThreeDots(this.dot1, this.dot2, this.dot3)
        }
    }
    #isHaveAllDots() {
        return this.dot1 && this.dot2 && this.dot3
    }

    setIndexDot1( indexDot ) {
        this.indexDot1 = indexDot
    }
    setIndexDot2( indexDot ) {
        this.indexDot2 = indexDot
    }
    setIndexDot3( indexDot ) {
        this.indexDot3 = indexDot
    }
    setColor( color ) {
        this.color = color
    }

    getCopy() {
        let copyPoligon = new Poligon()
        copyPoligon.setIndexDot1( thi.indexDot1 )
        copyPoligon.setIndexDot2( thi.indexDot2 )
        copyPoligon.setIndexDot3( thi.indexDot3 )
        copyPoligon.setDot1( this.getDot1() )
        copyPoligon.setDot2( this.getDot2() )
        copyPoligon.setDot3( this.getDot3() )
        copyPoligon.setColor( this.getColor() )
        return copyPoligon
    }
    getIndexDot1() {
        return this.indexDot1
    }
    getIndexDot2() {
        return this.indexDot2
    }
    getIndexDot3() {
        return this.indexDot3
    }
    getDot1() {
        return this.dot1
    }
    getDot2() {
        return this.dot2
    }
    getDot3() {
        return this.dot3
    }
    getNormal() {
        return this.normal
    }
    getColorText() {
        return this.color.getColorText() 
    }
    getColor() {
        return this.color
    }
}


class FlyWeightDotsOfModel {
    constructor( ) {
        this.listOfDots = []
        this.listOfHashDots = {}
    }

    getIndexByDot( dot ) {
        let hash = this.#getHashOfDot( dot )
        let listDotOfEqualsHash = this.#getListOfEqualsHashAndCreateIfHasnt( hash )
        let index = this.#getIndexInHashList( listDotOfEqualsHash, dot )
        if ( index == undefined ) {
            index = this.#addDotToListAndGetIndex( dot, hash )  
        }
        return index
    }
    #getHashOfDot( dot ) {
        let x = dot.getX()
        let y = dot.getX()
        let z = dot.getX()
        let hashNum = x*100+y*10+z
        return hashNum
    }
    #getListOfEqualsHashAndCreateIfHasnt( hash ) {
        let list = this.listOfHashDots[ hash ]
        if ( list == undefined ) {
            this.listOfHashDots[ hash ] = []
        }
        return this.listOfHashDots[ hash ]
    }
    #getIndexInHashList( listDotOfEqualsHash, dot ) {
        for ( let index of listDotOfEqualsHash ) {
            let dotInList = this.listOfDots[ index ]
            if ( dotInList.isEquals( dot ) ) {
                return index
            }
        }
    }
    #addDotToListAndGetIndex( dot, hash ) {
        let index = this.listOfDots.length
        this.listOfDots.push( dot )
        this.listOfHashDots[ hash ].push( index )
        return index
    }

    rotateAroundAxisY( angle ) {
        for ( let selectedDot of this.listOfDots ) {
            selectedDot.rotateAroundAxisY( angle )
        }
    }
    translatePositionOfDots( dot ) {
        for ( let selectedDot of this.listOfDots ) {
            selectedDot.plusDot( dot )
        }
    }

    getDotByIndex( index ) {
        return this.listOfDots[ index ]
    }
    getLength() {
        return this.listOfDots.length
    }
}


class Color {//////////
    constructor( textColor = "FFFFFF") {
        this.textColor = textColor
        this.textColorProcessedByLite = textColor
    }

    setColorBrightnessByLite( normal, lite) {//
        let coefficientOfBrightness = lite.getCoffecientOfBrightness(normal)
        this.#addBrightnessToColor( coefficientOfBrightness )
    }
    #addBrightnessToColor(coefficient ) {
        let chNum = Math.floor(coefficient)
        let newRed = this.#changeRGB(this.textColor.slice(1,3), chNum)
        let newGreen = this.#changeRGB(this.textColor.slice(3,5), chNum)
        let newBlue = this.#changeRGB(this.textColor.slice(5,7), chNum)
        this.textColorProcessedByLite = "#" + newRed + newGreen + newBlue 
    }
    #changeRGB(rgb, chNum) {
        let newRgb = (parseInt(rgb,16) + chNum)
        return newRgb < 0 ? "00" : ( newRgb > 255  ? "ff" : newRgb.toString(16).padStart(2,"0") )
    }
    setColorText(textColor) {
        this.textColor = textColor
        this.textColorProcessedByLite = textColor
    }
    getColorText() {
        return this.textColorProcessedByLite
    }
    getCopy() {
        let newColor = new Color( this.textColor )
        return newColor
    }
}


class Lite {
    constructor() {
        this.direction = new Dot(1,-1,0)
        this.direction.normalize()
        let defaultPower = 128
        let reflexPower = -32
        this.power = defaultPower
        this.reflexPower = reflexPower
    }

    getCoffecientOfBrightness(normal) {
        let coefficientOfBrightness = this.direction.getCoordinatOnLine( new Dot(), normal )
        if (coefficientOfBrightness > 0) { 
            coefficientOfBrightness *= this.power 
        } else if (coefficientOfBrightness < 0) {
            coefficientOfBrightness *= this.reflexPower
        } else {
            coefficientOfBrightness = 0 
        }
        return coefficientOfBrightness
    }
    setDirection(direction) {
        this.direction = direction.getCopy()
        this.direction.normalize()
    } 
    setPower(power) {
        this.power = power
    } 
    setReflexPower( reflexPower) {
        this.reflexPower = -reflexPower
    } 
    getDirection() {
        return this.direction.getCopy()
    }
    getPower() {
        return this.power
    }
    getReflexPower() {
        return this.reflexPower 
    }
}


class Direction {
    constructor() {
        let defaultLength = 1
        this.length = defaultLength
        this.angleByVertical = 0
        this.angleByHorizontal = 0
        this.direction
        this.perpendicularDirectionByHorizontal
        this.crossDirectionByHorizontal
        this.updateAllDirections()
    }

    static createDefaultPositionFromCenter() {
        let positionFromCenter = new Direction() 
        let defaultLength = 100000
        positionFromCenter.setLength(defaultLength)
        positionFromCenter.rotateAnglesOfVerticalAndHorizontal( 0 , 180 )
        return positionFromCenter
    }
    rotateAnglesOfVerticalAndHorizontal(angleVertical, angleHorizontal) {
        this.angleByVertical += angleVertical
        this.angleByHorizontal += angleHorizontal
        this.updateAllDirections()
    }
    setAnglesOfVerticalAndHorizontal(angleVertical, angleHorizontal) {
        this.angleByVertical = angleVertical
        this.angleByHorizontal = angleHorizontal
        this.updateAllDirections()
    }

    updateAllDirections() {
        this.updateDirection()
        this.updatePerpendicularDirectionByHorizontal()
        this.updateCrossDirectionByHorizontal()
    }
    updateDirection() {
        let direction = new Dot()
        let length = this.getLength()
        direction.setX( length )
        direction.rotateAroundAxisZ( this.angleByVertical )
        direction.rotateAroundAxisY( this.angleByHorizontal )
        this.direction = direction
    }
    updatePerpendicularDirectionByHorizontal() {
        let perpendicularDirectionByHorizontal = this.getDirection()
        perpendicularDirectionByHorizontal.setY( 0 )
        perpendicularDirectionByHorizontal.rotateAroundAxisY( 90 )
        perpendicularDirectionByHorizontal.normalize()
        this.perpendicularDirectionByHorizontal = perpendicularDirectionByHorizontal
    }
    updateCrossDirectionByHorizontal() {
        let crossDirectionByHorizontal = this.getPerpendicularDirectionByHorizontal()
        crossDirectionByHorizontal.crossDot(this.direction)
        crossDirectionByHorizontal.normalize()
        this.crossDirectionByHorizontal = crossDirectionByHorizontal
    }
    setLength(length) {
        this.length = length
        this.direction.setLength(length)
    }
    addLength( length ) {
        this.length += length
        this.direction.setLength( this.length )
    }
    getDirection() {
        return this.direction.getCopy()
    }
    getCrossDirectionByHorizontal() {
        return this.crossDirectionByHorizontal.getCopy()
    }
    getPerpendicularDirectionByHorizontal() {
        return this.perpendicularDirectionByHorizontal.getCopy()
    }
    getAngleByHorizontal() {
        return this.angleByHorizontal
    }
    getAngleByVertical() {
        return this.angleByVertical
    }
    getLength() {
        return this.length
    }
}


class Dot {
    constructor(x = 0 ,y = 0 ,z = 0 ) {
        this.x = x
        this.y = y
        this.z = z
    }

    static fromPosToDot( pos ) {
        let dot = new Dot()
        if ( pos == undefined ) {
            dot.setNaN()
        } else {
            dot.setX( pos.getX() )
            dot.setZ( pos.getY() )
        }
        return dot
    }
    static getDotFromPos() {

    }

    static getNaN() {
        let dot = new Dot()
        dot.setNaN()
        return dot
    }

    static fromFromPosOnPlaneToPosOnDesk( x, y, camera, canvas ) {
        let newX = x - canvas.getWidthCanvas()/2
        let newY = y - canvas.getHeightCanvas()/2
        let cotanOfCameraEyeAngle = Math.tan( Dot.inRad( camera.getEyeAngle() ))
        let sizeOfVerticalVec = newY*cotanOfCameraEyeAngle/(canvas.getHeightCanvas()/2)
        let sizeOfHorizontalVec = newX*cotanOfCameraEyeAngle/(canvas.getHeightCanvas()/2)
        let horizontalVec = camera.getPerpendicularDirectionByHorizontal()
        let verticalVec = camera.getCrossDirectionByHorizontal()
        horizontalVec.multiplyLengthOnFactor( sizeOfHorizontalVec )
        verticalVec.multiplyLengthOnFactor( sizeOfVerticalVec )
        let sigthOfCamera = camera.getDirection()
        sigthOfCamera.plusDot( horizontalVec )
        sigthOfCamera.plusDot( verticalVec )
        sigthOfCamera.normalize()
        let yOfSigthCamera = sigthOfCamera.getY()
        let cameraPos = camera.getPosition()
        let yOfCamera = cameraPos.getY()
        let newLengthOfSigth = -yOfCamera/yOfSigthCamera
        sigthOfCamera.multiplyLengthOnFactor( newLengthOfSigth )
        cameraPos.plusDot( sigthOfCamera )
        return cameraPos
    }

    getProjectionDotOnPlane( camera, canvas ) {//////////
        let positionDepthDotRelativeVecSigth = this.getCoordinatOnLine( camera.getPosition() , camera.getDirection() )
        if  ( positionDepthDotRelativeVecSigth < 0 ) { 
            return false 
        }
        let projectDotZ = camera.getPosition()
        projectDotZ.plusLineMultiplyOnFactor( camera.getDirection() , positionDepthDotRelativeVecSigth )

        let cameraCrossSightByVertical = camera.getCrossDirectionByHorizontal()
        let cameraPerpendicularSightByHorizontal = camera.getPerpendicularDirectionByHorizontal()
        let dotYOnPlane = this.getCoordinatOnLine(projectDotZ, cameraCrossSightByVertical)
        let dotXOnPlane = this.getCoordinatOnLine(projectDotZ, cameraPerpendicularSightByHorizontal)

        let scaleOfCameraEyeY = positionDepthDotRelativeVecSigth *Math.tan( Dot.inRad( camera.getEyeAngle() ))
        
        let newX = this.#resizeToFitCanvas( dotXOnPlane, scaleOfCameraEyeY, canvas ) + (canvas.getWidthCanvas()/2)
        let newY = this.#resizeToFitCanvas( dotYOnPlane, scaleOfCameraEyeY, canvas ) + (canvas.getHeightCanvas()/2)
        let dot = new Dot()
        dot.setX(newX)
        dot.setY(newY)
        return dot
    }
    #resizeToFitCanvas( dotOnPlane, scaleOfCameraEyeY, canvas ) {
        return dotOnPlane/(2*scaleOfCameraEyeY )*canvas.getHeightCanvas()
    }
    searchProjection(vec,center = new Dot()) {//
        let nwVec = this.getVecFromProjection( vec, center)
        nwVec.plusDot(center) 
        return nwVec 
    }
    getVecFromProjection(dot,center = new Dot()) {
        let line = dot.getCopy()
        line.minusDot(center)
        line.normalize()
        let coordinate = this.getCoordinatOnLine( center , line)
        line.multiplyLengthOnFactor(coordinate) 
        return line
    } 
    getCoordinatOnLine( lineStart , lineVec ) {
        let DotRelativityOfStartLine = this.getCopy()
        DotRelativityOfStartLine.minusDot(lineStart)
        let coordinate = DotRelativityOfStartLine.getScalarProduct(lineVec)  
        return coordinate  
    }
    getScalarProduct(line) {
        let scalar = 0
        scalar += this.x*line.x
        scalar += this.y*line.y
        scalar += this.z*line.z
        return scalar
    }
    centerRadiusY( dot ) {//
        let y =  (this.y + dot.y)/2 + ( Math.pow(this.x-dot.x, 2 ) + Math.pow( this.z - dot.z , 2) )/( 2 * ( dot.y - this.y ) )
        return (this.y > y ) ? this.y - y   : y -  this.y  
    }
    radiusY0(dot) {//
        let y0 = (Math.pow(this.x, 2) - Math.pow(dot.x, 2)+ 
                  Math.pow(this.y, 2) - Math.pow(dot.y, 2)+
                  Math.pow(this.z, 2) - Math.pow(dot.z, 2))/
                  ( 2 * ( this.y - dot.y) )
        return this.getDistanceToDot(new Dot(0,y0,0))
    }
    rotateAroundAxisX( angle ) {
        this.rotateAroundAxles(angle,"z","y")
    }
    rotateAroundAxisY( angle ) {
        this.rotateAroundAxles(angle,"x","z")
    }
    rotateAroundAxisZ( angle ) {
        this.rotateAroundAxles(angle,"y","x")
    }
    rotateAroundAxles(angle,axle1,axle2) {
        let valueAxle1 = this[axle1]
        let valueAxle2 = this[axle2]
        let radian = Dot.inRad(angle)
        this[axle1] = ( valueAxle1*Math.cos(radian) ) + ( valueAxle2*Math.sin( radian ))
        this[axle2] = ( valueAxle2*Math.cos(radian) ) - ( valueAxle1*Math.sin( radian ))
    }
    static getNormalOfThreeDots(dot1, dot2, dot3) {
        let vec1 = dot2.getCopy()
        let vec2 = dot3.getCopy()
        vec1.minusDot( dot1 )
        vec2.minusDot( dot1 )
        let normal = vec1
        normal.crossDot(vec2)
        normal.normalize()
        return normal
    }
    isEquals( dot ) {
        return ( this.x == dot.x ) & ( this.y == dot.y ) & ( this.z == dot.z )
    }
    crossDot(dot) {
        let newX = this.y*dot.z - this.z*dot.y
        let newY = this.z*dot.x - this.x*dot.z
        let newZ = this.x*dot.y - this.y*dot.x
        this.x = newX
        this.y = newY
        this.z = newZ
    }
    setLength(factor) {
        this.normalize()
        this.multiplyLengthOnFactor(factor)
    }
    getLength() {
        let length = 0
        length += this.x*this.x
        length += this.y*this.y
        length += this.z*this.z
        length = Math.sqrt(length)
        return length
    }
    getDistanceToDot(dot) {
        let copyDot = this.getCopy()
        copyDot.minusDot(dot)
        return copyDot.getLength()
    }
    normalize() {
        let length = this.getLength()
        this.x/=length
        this.y/=length
        this.z/=length
    }
    plusLineMultiplyOnFactor( lineVec , factor  ) {
        let newLineVec = lineVec.getCopy()
        newLineVec.multiplyLengthOnFactor(factor)
        this.plusDot(newLineVec)
    }
    multiplyLengthOnFactor(factor) {
        this.x*=factor
        this.y*=factor
        this.z*=factor
    }
    reverse() {
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
    }
    minusDot(dot) {
        this.x -= dot.x 
        this.y -= dot.y 
        this.z -= dot.z 
    }
    plusDot(dot) {
        this.x += dot.x 
        this.y += dot.y 
        this.z += dot.z
    }
    multiplyDot(dot) {
        this.x * dot.x 
        this.y * dot.y 
        this.z * dot.z
    }
    setNaN() {
        this.x = NaN
        this.y = NaN
        this.z = NaN
    }
    isNaN() {
        return Number.isNaN(this.x)
    }
    setX(x) {
        this.x = x
    }
    setY(y) {
        this.y = y
    }
    setZ(z) {
        this.z = z
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
    getZ() {
        return this.z
    }
    getCopy() {
        return new Dot(this.x, this.y, this.z)
    }

    static inRad( grad ) {
        return ( grad / 180 ) * Math.PI
    }
    static inGrad( rad ) {
        return ( rad * 180 ) / Math.PI
    }
}


class DisplayInformationOfElement {
    constructor() {
        this.colorList
        this.quality
        this.scale
    }

    setColorList( colorList ) {
        this.colorList = colorList
    }
    setQuality( quality ) {
        this.quality = quality
    }
    setScale( scale ) {
        this.scale = scale
    }
    getCopy() {
        let newDisplayInformation = new DisplayInformationOfElement()
        newDisplayInformation.setColorList( this.colorList )
        newDisplayInformation.setQuality( this.quality )
        return newDisplayInformation
    }
    getColorList() {
        return this.colorList
    }
    getQuality() {
        return this.quality
    }
    getScale() {
        return this.scale
    }
}


class DisplayInformationOfType {
    constructor() {
        this.builderModel
    }
    setBuilderModel( builderModel ) {
        this.builderModel = builderModel
    }
    getCopy() {
        let newDisplayInformation = new DisplayInformationOfType()
        newDisplayInformation.setBuilderModel( this.builderModel )
        return newDisplayInformation
    }
    getBuilderModel() {
        return this.builderModel
    }
}

export { FacadeDisplay, DisplayInformationOfType, DisplayInformationOfElement, Dot, BuilderModel, BuilderCompositeModel, Lite }