
const ipfs = require('./ipfsNode')
const format =  { format: 'dag-cbor', hashAlg: 'sha2-256' }



let getData=(error, data)=>
{
    console.log(data.value)
}

let onNewCid=(error, cid)=>
{
    if(error)
        console.error(error)

        console.log(cid.toBaseEncodedString('base58btc'))

        ipfs.dag.get(cid, '', getData)
        
}

let init=()=>
{
    console.log('lets do stuff')

    let hitag = {
        name:'Unga bunga',
        arxiu:{
            history:[],
            canRead :[],
            canWrite : [],
            hitags :[]
        }
    }

    ipfs.dag.put(hitag,format, onNewCid)
}

ipfs.on('start', init)