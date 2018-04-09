
const IPFS = require('ipfs')
const Repo = require('ipfs-repo')
const repo = new Repo('/tmp/ipfs-repo')

// IPFS will need a repo, it can create one for you or you can pass
// it a repo instance of the type IPFS Repo
// https://github.com/ipfs/js-ipfs-repo

//Generate key: https://github.com/libp2p/js-libp2p-crypto
//PeerId: https://github.com/libp2p/js-peer-id

const ipfsConfig = {
    init: true,
    repo: repo,
    start: true,
    pass: undefined, // pass phrase for key access',
    EXPERIMENTAL: { // enable experimental features
        pubsub: true,
        sharding: true, // enable dir sharding
        dht: true, // enable KadDHT, currently not interopable with go-ipfs
        relay: {
            enabled: true, // enable circuit relay dialer and listener
            hop: {
                enabled: true // enable circuit relay HOP (make this node a relay) 
            }
        }
    },
    config: { // overload the default IPFS node config, find defaults at https://github.com/ipfs/js-ipfs/tree/master/src/core/runtime
        Addresses: { Swarm: ['/ip4/127.0.0.1/tcp/1337']}
    },
    
   libp2p: { // add custom modules to the libp2p stack of your node
        modules: {}
    }
}

let shutDown=(ipfsConfig)=>
{
    console.log()
    console.log('Closing IPFS')
    node.stop(()=>process.exit(1))
}

const node = new IPFS()
node.once('ready', () => {console.log('Node ready')})    // Node is ready to use when you first create it
node.on('error', (err) => {console.log(err);shutDown()}) // Node has hit some error while initing/starting
node.on('init', () => {console.log('Node init')})     // Node has successfully finished initing the repo
node.on('start', () => {console.log('Node start')})    // Node has started
node.on('stop', () => {console.log('Node stop')})     // Node has stopped

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)

module.exports = node