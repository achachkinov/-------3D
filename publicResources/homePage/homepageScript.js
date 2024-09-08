const nicknameInput = document.getElementById("nicknameInput")
const nicknameBlock = document.getElementById("nicknameBlock")

window.addEventListener('storage', function(e) {  
    console.log(Storage, "storage")
});

nicknameInput.addEventListener( "keyup", sendANicknameIfPressedEnter )
let nicknamePlayer

async function setNicknameFromSessionStorage() {
    let nickname = window.sessionStorage.getItem( "nickname" )
    if ( !nickname ) {
        nickname = getRandomNickname()
        await setNickname( nickname )
    } else {
        let nicknameOutputBlock = getOutputNicknameBlockAndCreateIfDontExist()
        nicknameOutputBlock.textContent += "your nickname: " + nickname
        nicknamePlayer = nickname
    }
}
setNicknameFromSessionStorage()

function getRandomNickname() {
    return "user:" + `${ Math.round( Math.random()*10000000 ) }`
}


async function sendANicknameIfPressedEnter( event ) {
    if( event.key == "Enter" ) {
        let nickname = nicknameInput.value
        await setNickname( nickname )
        for ( let idRoom in openRoomsOptionAndBlockList ) {
            let openRoom = openRoomsOptionAndBlockList[ idRoom ].openRoom
            console.log( openRoom, "wsw" )
            createOpenRoomTile( openRoom )
        }
    }
}

async function setNickname( nickname ) {
    let nicknameOutputBlock = getOutputNicknameBlockAndCreateIfDontExist()
    let url = "./user"
    let message = { "type": "setNicknameAndReturnErrorIfDublicate", "nickname": nickname }
    let parameters = {  method: 'POST',
        Headers:{"Content-Type":"application/json"},
        body: JSON.stringify(message)
    }

    await fetch( url, parameters ).then( (response) => {
        if ( !response.ok ) {
            nicknameOutputBlock.textContent += "   new nickname is not set, try again"
        } else {
            nicknamePlayer = nickname
            console.log( nicknamePlayer, "nickname" )
            sessionStorage.setItem( "nickname", nickname )
            console.log(sessionStorage.getItem("nickname"), sessionStorage)
            nicknameOutputBlock.textContent = "your nickname: " + nickname
            nicknameInput.value = ""
        }
    })
}

function getOutputNicknameBlockAndCreateIfDontExist() {
    let nicknameOutputBlock = document.getElementById("nicknameOutputBlock")
    if ( !nicknameOutputBlock ) {
        nicknameOutputBlock = document.createElement("div")
        nicknameOutputBlock.className = "paragraph boring-text"
        nicknameOutputBlock.id = "nicknameOutputBlock"
        nicknameBlock.appendChild(nicknameOutputBlock)
    }
    return nicknameOutputBlock
}

/////////////////////////////////////////////////////////////////////////////////////////////////

let teamSeletedOptions = {}
let selectedGame
let selectedAmountOfPlayers
let listOfConfigGames

const gamesListBlock = document.getElementById( "gamesListBlock" )
const gameList = document.getElementById( "gameList" )

fetch( "./publicResources/gameResources/listOfConfigGames.json" ).then((response) => {
    return response.json();
}).then((data) => {
    listOfConfigGames = data
    createGameTiles( data )
});

function createGameTiles(data) {
    let gamesListProcessing = document.getElementById( "gamesListProcessing" )
    gamesListBlock.removeChild( gamesListProcessing )
    for ( let gameName in data ) {
        let game = data[gameName]
        createGameTile( gameName, game )
    }
}

function createGameTile( gameName, game ) {
    let block = document.createElement("div")
    block.className = "block game-block col-2"
    let img = document.createElement("img")
    img.className = "img-logo-game"
    img.setAttribute("src", game.iconUrl );
    img.setAttribute("alt","logo.png");
    let nameGameElement = document.createElement("div")
    nameGameElement.textContent = gameName
    nameGameElement.className = "text-gamename"
    let description = document.createElement("div")
    description.className = "description"
    description.textContent = game.description
    block.appendChild( img )
    block.appendChild( nameGameElement )
    block.appendChild( description )
    gameList.appendChild( block )

    block.addEventListener( "click", event => {createStartGameMenu( gameName, game )} )
}

function createStartGameMenu( gameName, game ) {
    selectedGame = gameName
    teamSeletedOptions = {}

    let blurDiv = document.createElement("div")
    blurDiv.id = "blur"
    blurDiv.className = "blur"
    document.body.appendChild( blurDiv )
    blurDiv.addEventListener( "click", deleteStartGameMenu )

    let img = document.createElement("img")
    img.className = "img-logo-game"
    img.setAttribute("src", game.iconUrl );
    img.setAttribute("alt","logo.png");

    let gameMenu = document.createElement("div")
    gameMenu.id = "startGameMenu"
    gameMenu.className = "block start-game-menu"
    gameMenu.appendChild( img )
    document.body.appendChild( gameMenu )

    let gameNameText = document.createElement("div")
    gameNameText.className = "text-gamename"
    gameNameText.textContent = gameName
    gameMenu.appendChild( gameNameText )
    let selectorAmountOfPlayers = createSelectorAmountOfPlayers( game )
    gameMenu.appendChild( selectorAmountOfPlayers )

    updateTeamCustomizationOption(game)

    let startGameButton = document.createElement("div")
    startGameButton.className = "block button"
    let textStartGameButton = document.createElement("div")
    textStartGameButton.textContent = "create room"
    textStartGameButton.className = "center text-button"
    startGameButton.appendChild( textStartGameButton )
    gameMenu.appendChild( startGameButton )

    startGameButton.addEventListener( "click", ( event ) => { startGame() } )
}

function createSelectorAmountOfPlayers( game ) {
    let divConteiner = document.createElement("div")
    //divConteiner.className = "selector-amount-of-players"

    let label = document.createElement("label")
    let radioInput = document.createElement("select")
    radioInput.addEventListener("change", event => {updateTeamCustomizationOption(game)} )
    label.setAttribute( "for", "amount-of-players-option" )
    label.textContent = "amount of players: "
    radioInput.id = "amountOfPlayerOption"
    radioInput.setAttribute( "name", "amount-of-players-option" )
    radioInput.className = "selector-amount-of-players"
    for ( let amountOfPlayers of game.amountOfPlayers ) {
        let value = `${amountOfPlayers}`
        let option = createOption( value )
        radioInput.appendChild( option )
    }
    divConteiner.appendChild( label )
    divConteiner.appendChild( radioInput )
    return divConteiner
}

function createOption( value ) {
    let option = document.createElement("option")
    option.setAttribute("value", value )
    option.className = "selector-option"
    option.textContent = value
    return option
}

function updateTeamCustomizationOption( game ) {
    let gameMenu = document.getElementById("startGameMenu")
    let selectInput = document.getElementById("amountOfPlayerOption")

    let divConteiner = document.getElementById( "conteinerTeamCustomization" )
    if ( divConteiner ) {
        divConteiner.innerHTML = '';
    } else {
        divConteiner = document.createElement("div")
        divConteiner.id = "conteinerTeamCustomization"
        divConteiner.className = "container-4"
        gameMenu.appendChild( divConteiner )
    }

    let amountOfPlayers = selectInput.value
    selectedAmountOfPlayers = selectInput.value
    amountOfPlayers = Number( amountOfPlayers )

    for ( let numberTeam = 0; numberTeam < amountOfPlayers; numberTeam++ ) {
        let teamBlock = document.createElement("div")
        teamBlock.className = "block"

        let informText = document.createElement("div")
        informText.className = "inform-text"
        informText.textContent = "empty"
        teamBlock.appendChild( informText )

        let iconDiv = document.createElement("div")
        iconDiv.className = "icon-user-div"
        let icon = document.createElement("img")
        icon.className = "icon-user"
        icon.setAttribute("src", "./icons/icon_user_empty.png" );
        icon.setAttribute("alt","icon.png");
        iconDiv.appendChild( icon )
        teamBlock.appendChild( iconDiv )
        divConteiner.appendChild( teamBlock )

        let nameTeam = game.teams[ numberTeam ]
        teamSeletedOptions[ nameTeam ] = "empty"
        let nameDiv = document.createElement("div")
        nameDiv.textContent = nameTeam
        nameDiv.className = "center text-gamename"
        teamBlock.appendChild( nameDiv )

        let buttonAddBot = document.createElement("div")
        buttonAddBot.className = "block button-add-bot"
        buttonAddBot.textContent = "add bot"
        buttonAddBot.addEventListener( "click", (event) => { addBotButtonClicked( teamBlock, icon, buttonAddBot, nameTeam )} )

        iconDiv.addEventListener( "click", (event) => { teamSelectClicked( teamBlock, icon, buttonAddBot, nameTeam ) })
        teamBlock.appendChild( buttonAddBot )
    }
}

function teamSelectClicked(  teamBlock, icon, buttonAddBot, nameTeam ) {

    if ( teamSeletedOptions[nameTeam] == "empty") {
        let oldSelectedTeamBlock = document.getElementById("_selected")
        if ( oldSelectedTeamBlock ) {
            oldSelectedTeamBlock.id = ""
            let oldInformText = oldSelectedTeamBlock.getElementsByClassName( "inform-text" )[0]
            oldInformText.textContent = "empty"
        
            let oldIcon = oldSelectedTeamBlock.getElementsByClassName( "icon-user" )[0]
            oldIcon.setAttribute("src", "./icons/icon_user_empty.png" );
            let oldButtonAddBot = oldSelectedTeamBlock.getElementsByClassName( "hiden" )[0]
            oldButtonAddBot.className = "block button-add-bot"

            let oldNameTeam = oldSelectedTeamBlock.getElementsByClassName( "center text-gamename" )[0]
            teamSeletedOptions[oldNameTeam.textContent] = "empty"
        }


        teamBlock.id = "_selected"

        let informText = teamBlock.getElementsByClassName( "inform-text" )[0]
        informText.textContent = "selected"
    
        icon.setAttribute("src", "./icons/icon_user_selected.png" );
        buttonAddBot.className = "hiden"

        teamSeletedOptions[nameTeam] = "selected"
    } else if ( teamSeletedOptions[nameTeam] == "selected" ) {
        teamBlock.id = ""
        let informText = teamBlock.getElementsByClassName( "inform-text" )[0]
        informText.textContent = "empty"
    
        icon.setAttribute("src", "./icons/icon_user_empty.png" );
        buttonAddBot.className = "block button-add-bot"

        teamSeletedOptions[nameTeam] = "empty"
    }
}

function addBotButtonClicked( teamBlock, icon, buttonAddBot, nameTeam  ) {
    if ( teamSeletedOptions[nameTeam] == "empty" ) {
        let informText = teamBlock.getElementsByClassName( "inform-text" )[0]
        informText.textContent = "bot"
    
        buttonAddBot.textContent = "delete"
        buttonAddBot.className = "block button-delete-bot"
    
        icon.setAttribute("src", "./icons/icon_user_bot.png" );

        teamSeletedOptions[nameTeam] = "bot"
    } else if ( teamSeletedOptions[nameTeam] == "bot" ) {
        let informText = teamBlock.getElementsByClassName( "inform-text" )[0]
        informText.textContent = "empty"
    
        icon.setAttribute("src", "./icons/icon_user_empty.png" );
        buttonAddBot.textContent = "add bot"
        buttonAddBot.className = "block button-add-bot"

        teamSeletedOptions[nameTeam] = "empty"
    }
}

function startGame() {
    safeInfromationInSessionStorage()
    let totalMessageToStartGame = {}
    totalMessageToStartGame.type = "createRoom"
    totalMessageToStartGame.selectedGame = selectedGame
    totalMessageToStartGame.teamOptions = teamSeletedOptions
    totalMessageToStartGame.amountOfPlayers = selectedAmountOfPlayers
    totalMessageToStartGame.nickname = nicknamePlayer
    let url = "./startGame"
    let parameters = {  method: 'POST',
        Headers:{"Content-Type":"application/json"},
        body: JSON.stringify(totalMessageToStartGame)
    }
    fetch( url, parameters ).then( (response) => {
        let paramUrl = response.url.split("?")[1]
        let params = new URLSearchParams( paramUrl );
        let idRoom = params.get('n');
        window.sessionStorage.setItem( "idRoom", `${idRoom}` )
        let newUrl = response.url
        window.location.href = newUrl
    })
}

function safeInfromationInSessionStorage() {
    let srcGame = listOfConfigGames[ selectedGame ].src
    window.sessionStorage.setItem( "srcGame", srcGame )
    window.sessionStorage.setItem( "amountOfPlayer", selectedAmountOfPlayers )
    window.sessionStorage.setItem( "nickname", nicknamePlayer )
}


function deleteStartGameMenu( event ) {
    let blurDiv = document.getElementById( "blur" )
    let gameMenu = document.getElementById( "startGameMenu" )
    document.body.removeChild( blurDiv )
    document.body.removeChild( gameMenu )
    //let 
}


//fetch( "" )

/////////////////////////////////////////////////////////////////////////////////////////////////


const openRoomsListBlock = document.getElementById( "openRoomsListBlock" )
const openRoomsList = document.getElementById( "openRoomsList" )

let openRoomsOptionAndBlockList = {}

function createWebSocketInfromationOfOpenRooms() {
    let ws = new WebSocket( "./openRooms" )
    let message = { "type":"connectingToGetOpenRooms" }
    ws.onmessage = ( event ) => { processMessageWSFunct( event ) }
    ws.onopen = () => {ws.send( JSON.stringify( message ) )}
}

function processMessageWSFunct( event ) {
    let message = JSON.parse(event.data)
    if ( message.type == "listOpenRooms" ) {
        createOpenRoomTiles( message.listOpenRooms )
    } else if ( message.type == "updateOrCreatedNewRoom" ) {
        console.log(  message.information )
        createOpenRoomTile( message.information )
    }
}

function createOpenRoomTiles( listOpenRooms ) {
    console.log( listOpenRooms )
    let openRoomsListProcessing = document.getElementById( "openRoomsListProcessing" )
    openRoomsListBlock.removeChild( openRoomsListProcessing )
    console.log( listOpenRooms )
    for ( let openRoom of listOpenRooms ) {
        createOpenRoomTile( openRoom )
    }
}

function createOpenRoomTile( openRoom ) {
    let block
    if ( !openRoomsOptionAndBlockList[ openRoom.id ] ) {
        block = document.createElement("div")
    } else {
        block = openRoomsOptionAndBlockList[ openRoom.id ].block
        block.innerHTML = ''
    }
    fillList( openRoom, block )
    block.className = "block open-room-block"
    let idText = document.createElement("div")
    idText.className = "text-gamename-openroom"
    idText.textContent = openRoom.nameGame + " #" + openRoom.id
    let containerTeams = document.createElement("div")
    containerTeams.className = "container-team-openroom"
    let isHavePresentPlayer = getIsHavePresentPlayer( openRoom )
    
    fillContainerTeam( containerTeams, openRoom, isHavePresentPlayer )

    block.appendChild( idText )
    block.appendChild( containerTeams )
    openRoomsList.appendChild( block )
}

function getIsHavePresentPlayer( openRoom ) {
    let teamList = openRoom.teamOfPlayersAndBots
    for ( let team in teamList ) {
        if ( teamList[ team ] == nicknamePlayer ) {
            return true
        }
    }
    return false
}   

function fillList( openRoom, block ) {
    let openRoomList = {}
    openRoomList.block = block
    openRoomList.teamOptions = openRoom.teamOfPlayersAndBots
    openRoomList.teamsBlock = {}
    openRoomList.openRoom = openRoom
    openRoomsOptionAndBlockList[ openRoom.id ] = openRoomList 
}

function fillContainerTeam( containerTeams, openRoom, isHavePresentPlayer ) {
    containerTeams.innerHTML = ''
    let teamList = openRoom.teamOfPlayersAndBots
    console.log( teamList )
    for ( let team in teamList ) {
        addTeamTileToContainerOpenRoom( containerTeams, team, teamList[ team ], openRoom, isHavePresentPlayer )
    }
    addTeamTileToContainerOpenRoom( containerTeams, "_viewer", "empty", openRoom, isHavePresentPlayer )
}

function addTeamTileToContainerOpenRoom( containerTeams, team, teamPlayerNickname, openRoom, isHavePresentPlayer ) {
    let teamBlock = document.createElement("div")
    teamBlock.className = "block"
    openRoomsOptionAndBlockList[ openRoom.id ].teamsBlock[ team ] = teamBlock

    console.log( teamPlayerNickname )

    let informText = document.createElement("div")
    informText.className = "inform-text"

    informText.textContent = getTeamPlayerNickname(teamPlayerNickname)
    teamBlock.appendChild( informText )
    let iconDiv = document.createElement("div")
    iconDiv.className = getCassNameImg(isHavePresentPlayer, teamPlayerNickname) 

    let icon = document.createElement("img")
    icon.className = "icon-user"
    let srcIcon = getSrcForIcon( teamPlayerNickname, team )
    icon.setAttribute("src", srcIcon );
    icon.setAttribute("alt","icon.png");
    iconDiv.appendChild( icon )
    teamBlock.appendChild( iconDiv )

    let nameDiv = document.createElement("div")
    let teamName = getTeamName( team )
    nameDiv.textContent = teamName
    nameDiv.className = "center text-gamename"
    teamBlock.appendChild( nameDiv )
    teamBlock.addEventListener( "click", ( event ) => { sendMessageConnectToRoom( event, team, openRoom, isHavePresentPlayer ) } )
    containerTeams.appendChild( teamBlock )
}

function getCassNameImg( isHavePresentPlayer, teamPlayerNickname ) {
    if ( isHavePresentPlayer ) {
        if ( teamPlayerNickname == nicknamePlayer ) {
            return "icon-user-div-pointer"
        }
    } else if ( teamPlayerNickname == "empty" ) {
        return "icon-user-div-pointer"
    }
    return "icon-user-div"
}

function getTeamPlayerNickname( teamPlayerNickname ) {
    if ( teamPlayerNickname == nicknamePlayer) {
        return "you"
    } else {
        return teamPlayerNickname
    }
}

function getTeamName( team ) {
    console.log( team )
    if ( team == "_viewer") {
        return "viewer"
    } else {
        return team
    }
}

function getSrcForIcon( teamPlayer, team ) {
    if ( team == "_viewer" ) {
        return "./icons/icon_user_viewer.png"
    } else if ( teamPlayer == "empty" ) {
        return "./icons/icon_user_empty.png"
    } else if ( teamPlayer == "bot" ) {
        return "./icons/icon_user_bot.png"
    } else if ( teamPlayer == nicknamePlayer ) {
        return "./icons/icon_user_selected.png"
    } else {
        return "./icons/icon_user_4.png"
    }
}   

function sendMessageConnectToRoom( event, team, openRoom, isHavePresentPlayer ) {
    let nickname = openRoomsOptionAndBlockList[ openRoom.id ].teamOptions[ team ]
    if ( (isHavePresentPlayer && nickname == nicknamePlayer) || ( !isHavePresentPlayer&& (nickname == "empty" || team == "_viewer") ) ) {
        let srcGame = listOfConfigGames[openRoom.nameGame].src
        sessionStorage.setItem( "srcGame", srcGame )
        sendMessageToReadyAcceptClient( openRoom.id, team )
    }
}

function sendMessageToReadyAcceptClient( idRoom, team ) {
    let nickname = sessionStorage.getItem("nickname")
    console.log( nickname,"beforeStart" )
    if (!nickname) {
        setNicknameFromSessionStorage()
        nickname = sessionStorage.getItem("nickname")
    } else {
        let message = { "type": "connectionToRoom", "idRoom": idRoom, "team": team, "nickname": nickname }
        let parameters = {  method: 'POST',
            Headers:{"Content-Type":"application/json"},
            body: JSON.stringify(message)
        }
        let url = "/connection"
        fetch( url, parameters ).then( (response) => {
            let paramUrl = response.url.split("?")[1]
            let params = new URLSearchParams( paramUrl );
            let idRoom = params.get('n');
            sessionStorage.setItem( "idRoom", `${idRoom}` )
            let newUrl = response.url
            window.location.href = newUrl
        })
    }
}

function changeTeamPlayerNickname( message ) {
    openRoomsOptionAndBlockList[ message.idRoom ].teamOptions[ message.team ] = message.nickname
    let teamBlock = openRoomsOptionAndBlockList[ message.idRoom ].teamsBlock[ message.team ]
    let nicknameBlock = teamBlock.getElementsByClassName( "inform-text" )[0]
    nicknameBlock.textContent = getTeamPlayerNickname( message.player )
    let imgBlock = teamBlock.getElementsByClassName("icon-user")[0]
    imgBlock.src = getSrcForIcon( message.nickname, message.team )
}

createWebSocketInfromationOfOpenRooms()