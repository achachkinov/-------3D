
if ( !sessionStorage.getItem( "idRoom" ) ) {
    backToHomePage()
}


async function runGame() {
    let optionsOfGame = {}
    optionsOfGame.amountOfPlayer = sessionStorage.getItem("amountOfPlayer")
    optionsOfGame.idRoom = sessionStorage.getItem("idRoom")
    optionsOfGame.nickname = sessionStorage.getItem("nickname")
    if ( !optionsOfGame.nickname ) {
        backToHomePage()
    }
    console.log( optionsOfGame )

    let srcGame = "../" +sessionStorage.getItem( "srcGame" )
    console.log( srcGame )
    import(srcGame).then( module => { startGame( module.game, optionsOfGame) } )
}

function startGame( game, optionsOfGame ) {
    game.setOptions( optionsOfGame )
    game.startGame()
}

function backToHomePage() {
    window.location.href = "./"
}

runGame()