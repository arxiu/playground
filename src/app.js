
const ipfs = require('./ipfsNode')
const format =  { format: 'dag-cbor', hashAlg: 'sha2-256' }

let baseProps = {
    canRead:[],
    canWrite:[],
    hitags:[],
    history:[]
}

let getBaseProps=()=>
{
    return JSON.parse(JSON.stringify(baseProps));
}

let addChild=(parent, child)=>
{
    if(!parent.hitag)
        parent.hitag =  getBaseProps()

    parent.hitag.hitags.push(child)
}

let newHitag = (name)=>
{
    return {
        name: name,
        hitag: getBaseProps()
    }
}

let resolveHitag=(cid, hitagPath, key)=>
{
    ipfs.dag.get(cid, 'hitag', (e,r)=>{
        console.log(r)
    })
    hitagPath.split('/')
}

let getData=(error, data)=>
{
    console.log(data.value)
}

let onNewCid=(error, cid)=>
{
    if(error)
        console.error(error)

    console.log('Added :',cid.toBaseEncodedString('base58btc'))

    resolveHitag(cid,'Bunga','0x123')
}

let init=()=>
{
    let h1 = newHitag('Unga')
    let h2 = newHitag('Bunga')
    let h3 = newHitag('Xunga')

    addChild(h2, h3)
    addChild(h1, h2)

    //console.log(JSON.stringify(h1))

    ipfs.dag.put(h1, format, onNewCid)
}

ipfs.on('start', init)