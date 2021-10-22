const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

let ip_address = '127.0.0.1';
let msg = "Hello World";
let url = "ws://" + ip_address + ":8080";

let connection_pending = false;
let connected = false;

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;

        // Socket
        this._socket = null;

        
    }

    connect() {
        console.log(url);
        window.socketr = new WebSocket(url);

        window.socketr.onopen = function() {
            try {
                console.log("Sending message to server ...\n");
                window.socketr.send(msg);
                console.log("Message sent\n");
            } catch(err) {
                console.log("Error: ");
            }
        }

        window.socketr.onclose = function () {
            console.log("Socket closed\n");
        }  

        window.socketr.onmessage = function (message) {
            console.log(message);
        }

        window.socketr.onerror = function(event) {
            console.log(event);
        }
    }

    sendMsg() {
        window.socketr.send(msg);
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        if(!connected) {
            console.log("Connecting to web server ...\n");
            if(!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        }

    }
}

module.exports = Scratch3NewBlocks;