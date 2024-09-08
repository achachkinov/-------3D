import { LocalServer } from "./wrapperServer.js"
import { RoomCollection, UserList } from "./gameServerStuff.js"


const userList = new UserList()
const roomCollection = new RoomCollection()

const localServer = new LocalServer()

function routeAdressFunct( url ) {
    if ( url.getFirstLiteral() == "" ) {
        return routeToHomePage()
    } else if ( url.isFirstLiteral("homePage")) {
        return routeOfHomePage( url )
    } else if ( url.isFirstLiteral("room") ) {
        return routeOfRoomUrl( url )
    } else if ( url.isFirstLiteral("oldChess") ) {
        return routeOfOldChess( url )
    } else if( url.isFirstLiteral("icons")  ) {
        return routeOfIcon( url )
    } else if( url.isFirstLiteral("favicon.ico") ) {
        return routeOfFaviconIco( url )
    } else {
        return defaultRoute( url )
    }
}

function routeToHomePage() {
    return "publicResources/homePage/homePage.html"
}

function routeOfHomePage( url ) {
    return "publicResources/" + url.getTextUrl()
}

function routeOfRoomUrl( url ) {
    if ( url.getLength() > 1 ) {
        if ( url.getSecondLiteral() == "gameScripts" ) {
            return "publicResources/gameResources/gameScripts/" + url.getThirdLiteral()
        } else if ( url.getSecondLiteral() == "configsOfGame" ) {
            console.log( "publicResources/gameResources/configsOfGame/" + url.getThirdLiteral(), "what" )
            return "publicResources/gameResources/configsOfGame/" + url.getThirdLiteral()
        } else if ( url.getSecondLiteral() == "clientPage" ) {
            return "publicResources/clientPage/" + url.getThirdLiteral()
        }
    } else {
        return "publicResources/clientPage/client.html"
    }
}

function routeOfOldChess( url ) {
    if ( url.getLength() > 1 ) {
        return "publicResources/oldChess/" + url.getSecondLiteral()
    } else {
        return "publicResources/oldChess/chess.html"
    }
}   

function routeOfIcon( url ) {
    return "publicResources/" + url.getTextUrl()
}

function routeOfFaviconIco( url ) {
    return "publicResources/icons/classic.png"
}

function defaultRoute( url ) {
    return url.getTextUrl()
}
 

function handlePostRequest( client ) {
    let lastMessage = client.getLastMessage()
    let ip = client.getIp()
    console.log( ip, lastMessage )
    if ( lastMessage.type == "setNicknameAndReturnErrorIfDublicate" ) {
        if ( userList.isDublicate( lastMessage.nickname ) ) {
            client.error()
        } else {
            userList.setNickname( lastMessage.nickname )
            client.sendText( "good" )
        }

    } else if ( lastMessage.type == "createRoom" ) {
        let room = roomCollection.getNewRoom()
        room.setGame( lastMessage.selectedGame )
        room.setAmountOfPlayers( lastMessage.amountOfPlayers )
        room.setTeamOptions( lastMessage.teamOptions )
        room.connectingPlayer( lastMessage.nickname )
        room.startGame()
        let idRoom = room.getId()
        client.redirect( `./room?n=${idRoom}` )
    } else if ( lastMessage.type == "connectionToRoom" ) {
        processConnectionToRoom( lastMessage, client )
    }
}

function processConnectionToRoom( message, client ) {
    let idRoom = message.idRoom
    let room = roomCollection.getRoomById( idRoom )
    if ( room ) {
        let nickname = message.nickname
        let team = message.team
        room.connectingPlayer( nickname, team )
        client.redirect( `./room?n=${idRoom}` )
    } else {
        client.redirect( `./` )
    }
}


function handleWebSocketOpenFunct( ws, data, request ) {
    console.log("whatASigma")
    console.log( data, request, "data" )
}

function handleWebSocketMessageFunt( ws, data, request ) {
    let message = JSON.parse(data)
    console.log( message )

    if ( message.type == "connectingWebSocket" ){
        let room = roomCollection.getRoomById( message.idRoom )
        if ( !room ) {
            ws.send( JSON.stringify( { "type" : "roomIsNotExist" } ) )
        } else {
            room.setWebSocketOfPlayer( message.nickname , ws )
        }
    } else if ( message.type == "moving" ) {
        let room = roomCollection.getRoomById( message.idRoom )
        room.processMovingMessage( message )
    } else if ( message.type == "connectingToGetOpenRooms" ) {
        roomCollection.setGetterOpenRoomsWebSocket( ws )
    } else if ( message.type == "getBoardArrangement" ) {
        let room = roomCollection.getRoomById( message.idRoom )
        if ( room ) {
            let boardArrangement = room.getBoardArrangement()
            let sendMessage = { "type": "boardArrangement", "boardArrangement": boardArrangement  }
            ws.send( JSON.stringify( sendMessage ) )
        }
    }
}

localServer.setHandlePostRequestFunct( handlePostRequest )
localServer.setRouteAdressFunction( routeAdressFunct )
localServer.setHandleWebSocketOpenFunct( handleWebSocketOpenFunct )
localServer.setHandleWebSocketMessageFunct( handleWebSocketMessageFunt )
localServer.run()

