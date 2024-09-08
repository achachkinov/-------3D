import http from "http"
import fs from "fs" 
import { WebSocketServer } from "ws"


class LocalServer {
    constructor() {
        this.PORT = 8000

        this.routeAdressFunct
        this.handlePostRequestFunt
        this.handleWebSocketOpenFunct
        this.handleWebSocketMessageFunt
        this.server

        this.processRequestFunt = ( request, response ) => { LocalServer.processRequestMessage( request, response, this ) }
        this.notificOfStartServer = () => { LocalServer.notificationOfStartServer( this ) }
    }
    run() {
        let server = http.createServer( this.processRequestFunt )
        server.listen( this.getPort(), this.notificOfStartServer )
        this.server = server
        this.wss = new WebSocketServer({ server });
        
        this.wss.on('connection', ( ws, request, client ) => { LocalServer.webSocketConnection(ws, request, client, this.handleWebSocketMessageFunt, this.handleWebSocketOpenFunct )})
    }

    static webSocketConnection(ws, request, client, handleWebSocketMessageFunt, handleWebSocketOpenFunct ) {
        ws.on('error', console.error);
        ws.on('message', (data, request, client) => { handleWebSocketMessageFunt( ws, data, request, client ) });
        ws.on(`open`, ( data, request ) => { handleWebSocketOpenFunct( ws, data, request, client ) });
    }

    static processRequestMessage( request, response, localServer ) {
        localServer.processRequest( request, response )
    }
    static notificationOfStartServer( localServer ) {
        let port = localServer.getPort()
        console.log("Server started at " + `${port}`);
    }

    processRequest( request, response ) {
        console.log(`Запрошенный адрес: ${request.url}`);
        if ( request.method == "POST") {
            this.#processPostRequest( request, response )

        } else {
            let filePath = this.#routeAddress( request.url )
            this.#sendFileByPath( filePath, response )
        }
    }

    #processPostRequest( request, response ) {
        WrapperClient.getPromiseWrapperClient( request, response ).then( (wrapperClient) => {
            this.handlePostRequestFunt( wrapperClient )
        })
    }

    #sendFileByPath( filePath, response ) {
        fs.access(filePath, fs.constants.R_OK, ( err ) => {
            if(err){
                console.log( err, "error" )
                response.statusCode = 404;
                response.end("There are no such resources here, who gave you the link?");
            }
            else{
                if( (filePath[ filePath.length - 2 ] == "j") && ( filePath[ filePath.length - 1 ] == "s" )) {
                    response.setHeader('Content-Type', 'text/javascript')
                }
                fs.createReadStream(filePath).pipe(response);
            }
        });
    }

    #routeAddress( url ) {
        let wrapperUrl = new WrapperUrl( url )
        if ( this.routeAdressFunct ) {
            return this.routeAdressFunct( wrapperUrl )
        } else {
            return this.#defaultRouteAddres( url )
        }
    }
    #defaultRouteAddres( url ) {
        let filePath = url.substring(1);
        if ( filePath == "" ) {
            filePath = "chessConstructorClient/html.html"
        } else {
            filePath = "chessConstructorClient/" + filePath
        }
        return filePath
    }

    setRouteAdressFunction( funct ) {
        this.routeAdressFunct = funct
    }
    setHandlePostRequestFunct( funct ) {
        this.handlePostRequestFunt = funct
    }
    setHandleWebSocketOpenFunct( funct ) {
        this.handleWebSocketOpenFunct = funct
    }
    setHandleWebSocketMessageFunct( funct ) {
        this.handleWebSocketMessageFunt = funct
    }

    getPort() {
        return this.PORT
    }
}


class WrapperClient {
    constructor() {
        this.request
        this.response
        this.message
    }

    static getPromiseWrapperClient(  request, response ) {
        return new Promise( (resolve, reject) => { WrapperClient.getMessageAndReturnWrapperClient( request, response, resolve, reject ) })

    }

    static async getMessageAndReturnWrapperClient( request, response, resolve, reject ) {
        let wrapperClient = new WrapperClient()
        let message = await WrapperClient.getMessage( request )
        wrapperClient.setRequest( request )
        wrapperClient.setResponse( response )
        wrapperClient.setMessage( message )
        resolve( wrapperClient )
    }   
    static async getMessage( request ) {
        const rb = [];
        await request.on('data', (chunks)=>{
            rb.push(chunks);
        });
        let message = JSON.parse(rb.join(""));
        return message
    }

    error() {
        this.response.statusCode = 404;
        this.response.end();
    }

    redirect( url ) {
        this.response.setHeader('location', url);
        this.response.statusCode = 302;
        this.response.end();
    }

    getIp() {
        let ipAdress = (this.request.headers['x-forwarded-for'] || '').split(',').pop() ||
        this.request.headers["x-real-ip"] ||
        this.request.connection.remoteAddress ||
        this.request.socket.remoteAddress ||
        this.request.connection.socket.remoteAddress
        return ipAdress
    }

    sendText( text ) {
        this.response.statusCode = 200
        this.response.setHeader('Content-Type', 'text/plain')
        this.response.end( text )
    }

    sendJson( json ) {
        this.response.statusCode = 200
        this.response.setHeader('Content-Type', "application/json")
        this.response.end( json )
    }

    getLastMessage() {
        return this.message
    }

    setMessage( message ) {
        this.message = message
    }
    setRequest( request ) {
        this.request = request
    }
    setResponse( response ) {
        this.response = response
    }
}


class WrapperUrl {
    constructor( urlText) {
        this.urlText = urlText
        this.arrayOfLiterals = this.#getSplitOfUrlText( urlText )
    }

    #getSplitOfUrlText( urlText ) {
        urlText = urlText.substring(1)
        if ( urlText[ urlText.length - 1 ] == "/") {
            urlText = urlText.slice(0,-1)
        }
        return urlText.split("/")
    }

    isFirstLiteral( value ) {
        let firstLiteral = this.getFirstLiteral()
        return firstLiteral == value
    }

    getFirstLiteral() {
        let firstLiteral = this.#getLiteralByNumberPosition( 1 )
        let firstLiteralWitchoutRequest = this.#deleteRequest( firstLiteral )
        return firstLiteralWitchoutRequest
    }
    getSecondLiteral() {
        return this.#getLiteralByNumberPosition( 2 )
    }
    getThirdLiteral() {
        return this.#getLiteralByNumberPosition( 3 )
    }
    #getLiteralByNumberPosition( number ) {
        if ( this.arrayOfLiterals.length >= number ) {
            return this.arrayOfLiterals[ number - 1 ]
        } else {
            return undefined
        }
    }

    #getRequest( urlText ) {
        let splitTextUrl = urlText.split("?")
        let request = splitTextUrl[1]
        return request
    }

    #deleteRequest( urlText ) {
        let splitTextUrl = urlText.split("?")
        let urlWitchoutRequest = splitTextUrl[0]
        return urlWitchoutRequest
    }

    getLength() {
        return this.arrayOfLiterals.length
    }

    getTextUrl() {
        return this.urlText.substring(1)
    }
}

export { LocalServer }