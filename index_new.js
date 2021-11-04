const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

let ip_address = '127.0.0.1';
let msg = "Hello World";
let url = ""

let connection_pending = false;
let connected = false;

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;

        // Socket
        this._socket = null;

        
    }

    connect() {
        url =  "ws://" + ip_address + ":8080";
        console.log(url);
        window.socketr = new WebSocket(url);

        window.socketr.onopen = function() {
            try {
                console.log("Sending message to server ...\n");
                window.socketr.send(msg);
                console.log("Message sent\n");
                connected = true;
                connection_pending = true;
            } catch(err) {
                console.log("Error: ");
            }
        }

        window.socketr.onclose = function () {
            connected = false;
            connection_pending = false;
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
            id: 'sdk',
            name: 'EPH/Pi SDK controller',
            blocks: [
                {
                    opcode: 'getImageRecognize',
                    blockType: BlockType.COMMAND,
                    text: 'Recognize image on [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "path"
                        }
                    }
                },

                {
                    opcode: 'saveImage',
                    blockType: BlockType.COMMAND,
                    text: 'Save image into [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "path"
                        }
                    }
                },

                {
                    opcode: 'connectTo',
                    blockType: BlockType.COMMAND,
                    text: 'Connect to [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "127.0.0.1"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    getImageRecognize (args) {
        if(!connected) {
            if(!connection_pending) {
                this.connect();
                connection_pending = true;
            }
        } 
    
        if(!connected) {

        } else {
            msg = {"Message type": "command", "recognize_image": args['TEXT']};
            msg = JSON.stringify(msg);
            console.log(msg);
            window.socketr.send(msg);
        }

    }

    connectTo(args) {
            ip_address = args['TEXT'];
            this.connect()
    }

    saveImage (args) {
        console.log("Saving image ...\n");
    }
}

module.exports = Scratch3NewBlocks;