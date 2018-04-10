const ipfs = require('./ipfsNode')
const format =  { format: 'dag-cbor', hashAlg: 'sha2-256'}
const dagCBOR = require('../../arxiu-ipld-hitag')

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
    ipfs.dag.get(cid, 'hitag/hitags/0/name', (e,r)=>{
        console.log(r)
    })
    hitagPath.split('')
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
    ipfs._ipld.support.rm(dagCBOR.resolver.multicodec)
    ipfs._ipld.support.add(
        dagCBOR.resolver.multicodec,
        dagCBOR.resolver,
        dagCBOR.util)
        
    let h1 = newHitag('Unga')
    let h2 = newHitag('Bunga')
    let h3 = newHitag('Xunga')

    addChild(h2, h3)
    addChild(h1, h2)

    //console.log(JSON.stringify(h1))

    ipfs.dag.put(h1, format, onNewCid)
}

ipfs.on('start', init)