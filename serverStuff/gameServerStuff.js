import listOfConfigGames from "../publicResources/gameResources/listOfConfigGames.json" assert { type: "json" };


class RoomCollection {
    constructor() {
        this.rommsList = {}
        this.gettersOpenRoomsWSList = []
    }
    setGetterOpenRoomsWebSocket( ws ) {
        this.gettersOpenRoomsWSList.push( ws )
        let listOpenRooms = this.#getListOpenRooms()
        let message = { "type": "listOpenRooms", "listOpenRooms": listOpenRooms }
        ws.send( JSON.stringify( message ) )
    }
    #getListOpenRooms() {
        let listInformationOfOpenRooms = []
        for ( let roomId in this.rommsList ) {
            let room = this.rommsList[ roomId ]
            let infromationOfRoom = this.#getMessageInformationOfRoom( room )
            listInformationOfOpenRooms.push( infromationOfRoom )
        }
        console.log( listInformationOfOpenRooms )
        return listInformationOfOpenRooms
    }

    getNewRoom() {
        let id = this.#getRandomId()
        let room = new Room()
        room.setId( id )
        room.setListOfConfigGames( listOfConfigGames )
        room.setRoomCollection( this )
        this.rommsList[ id ] = room
        return room
    }
    sendUpdateOrCreatedOpenRoom( room ) {
        let information = this.#getMessageInformationOfRoom( room )
        let message = {}
        message.type = "updateOrCreatedNewRoom"
        message.information = information
        console.log( message, "newOpenRoom" )
        this.#sendAllWS( message )
    }
    #getMessageInformationOfRoom( room ) {
        let information = {}
        information.id = room.getId()
        information.amountOfPlayers = room.getAmountOfPlayers()
        information.teamOfPlayersAndBots = room.getTeamOfPlayersAndBots()
        information.nameGame = room.getGameName()

        return information
    }
    #sendAllWS( message ) {
        let messageJson = JSON.stringify( message )
        for( let ws of this.gettersOpenRoomsWSList ) {
            ws.send( messageJson )
        }
    }

    deleteRoom( id ) {
        delete this.rommsList[ id ]
        this.#sendAllWS( { "type": "deleteRoom", "id": id } )
    }

    getRoomById( id ) {
        return this.rommsList[id]
    }

    #getRandomId() {
        return Math.floor( Math.random()*100000 )
    }
} 

class Room {
    constructor() {
        this.id
        this.listOfConfiGames
        this.roomCollection

        this.gameName
        this.amountOfPlayers
        this.game

        this.teamOfPlayersAndBots = {}
        this.playersTeam = {}
        this.playersAndViewersWebSockets = {}
        this.viewers = []
        this.amountOfEmptyTeam = 0

        this.teamOfFirstIncomingPerson
    }

    

    startGame() {
        let srcGame = this.getSrcGame()
        import("../publicResources/gameResources/" + srcGame ).then( module => { 
            this.game = module.game.getCopy(); 
            this.game.setOptions( this.amountOfPlayers ); 
            this.game.startGame() 
        })
        this.roomCollection.sendUpdateOrCreatedOpenRoom( this )
    }
    connectingPlayer( nickname, team ) {
        if ( this.#nicknameNotRepeat( nickname ) ) {
            if ( team == "_viewer" || !this.teamOfFirstIncomingPerson) {
                this.viewers.push( nickname )
            } else if ( team == undefined || this.teamOfPlayersAndBots[ team ] == "empty" || this.teamOfPlayersAndBots == "selected" ) {
                if ( team == undefined ) {
                    team = this.teamOfFirstIncomingPerson
                }
                this.amountOfEmptyTeam -= 1
                this.teamOfPlayersAndBots[ team ] = nickname
                this.playersTeam[ nickname ] = team
                this.roomCollection.sendUpdateOrCreatedOpenRoom( this )
            }
        }
    }

    #nicknameNotRepeat( nickname ) {
        if ( this.playersTeam[ nickname ] || this.viewers.includes( nickname )) {
            return false
        } else {
            return true
        }
    }

    getBoardArrangement() {
        return this.game.getBoardArrangement()
    }

    setWebSocketOfPlayer( nickname , ws ) {
        this.playersAndViewersWebSockets[ nickname ] = ws
        if ( this.amountOfEmptyTeam == 0 ) {
            this.#sendMovePos()
        }
    }

    #sendMovePos() {
        let walkingTeam = this.game.getWalkingTeam()
        let nickname = this.teamOfPlayersAndBots[ walkingTeam ]
        if ( nickname == "bot" ) {
            this.#botMove()
        } else {
            let ws = this.playersAndViewersWebSockets[ nickname ]
            let posMoveList = this.game.getListOfPosMove()
            ws.send( JSON.stringify( { "type": "moveList", "moveList": posMoveList } ))
        }
    }

    processMovingMessage( message ) {
        let walkingTeam = this.game.getWalkingTeam()
        let nickname = this.teamOfPlayersAndBots[ walkingTeam ]
        if( message.nickname == nickname ) {
            let startPos = message.startPos
            let endPos = message.endPos
            this.game.setStartPosMove( startPos )
            this.game.moveTo( endPos )
            this.#sendChangeBoardMessage()
            this.#checkGameStatusAndSendMoveIfNeed()
        }
    }
    #sendChangeBoardMessage() {
        let message = { "type": "changeBoardOperations", "changeBoardOperations": this.game.getChangeBoardOperations() }
        let messageJson =  JSON.stringify( message )
        for ( let nickname in this.playersAndViewersWebSockets ) {
            let webSocket = this.playersAndViewersWebSockets[ nickname ]
            webSocket.send( messageJson )
        }

    }

    #botMove() {
        setTimeout( () => { 
            this.game.moveByBot()
            this.#sendChangeBoardMessage()
            this.#checkGameStatusAndSendMoveIfNeed()
        }, 500 )
    }
    #checkGameStatusAndSendMoveIfNeed() {
        let status = this.game.getStatus()
        if ( status != "_empty" ) {
            this.roomCollection.deleteRoom( this.id )
        } else {
            this.#sendMovePos()
        }
    }

    setGame(gameName) {
        this.gameName = gameName
    }
    getGameName() {
        return this.gameName
    }

    setAmountOfPlayers( number ) {
        this.amountOfPlayers = number
    }

    setTeamOptions( teamOptions ) {
        this.teamOfPlayersAndBots = {}
        for (let team in teamOptions) {
            let player = teamOptions[ team ]
            if ( player == "selected" ) {
                this.teamOfFirstIncomingPerson = team
            }
            this.teamOfPlayersAndBots[ team ] = player
            if ( player != "bot" ) {
                this.amountOfEmptyTeam +=1
            }
        }
        this.teamOfPlayersAndBots = teamOptions
    }

    giveIncomingPersonANickname() {
        let nickname = this.nicknameIncomingPerson 
        this.nicknameIncomingPerson = undefined
        return nickname
    }
    
    getTeamOfPlayersAndBots() {
        return this.teamOfPlayersAndBots
    }
    getSrcGame() {
        return this.listOfConfiGames[ this.gameName ].src
    }

    getAmountOfPlayers() {
        return this.amountOfPlayers
    }

    getId() {
        return this.id
    }

    setId( id ) {
        this.id = id
    }
    setListOfConfigGames( list ) {
        this.listOfConfiGames = list
    }
    setRoomCollection( roomCollection ) {
        this.roomCollection = roomCollection
    }
}


class UserList {
    constructor() {
        this.listOfNicknames = []
    }
    isDublicate( nickname ) {
        return this.listOfNicknames.includes( nickname )
    }
    setNickname( nickname ) {
        this.listOfNicknames.push( nickname )
    }
}

export { RoomCollection, UserList }