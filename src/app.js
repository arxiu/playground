const ipfs = require('./ipfsNode')
const hitagDag = require('../../arxiu-ipld-hitag')
const hitagMulticodec = hitagDag.resolver.multicodec
const format =  { format: hitagMulticodec , hashAlg: 'sha2-256'}
console.log(hitagMulticodec)

let hp1 = 'Unga/Bunga/'

let base = {
    hitags:[],
    canRead:["1"]
}

let getNewHitag =(name)=>
{
    return {
        name:name,
        canRead:["1"],
        canWrite:[],
        hitags:[],
        history:[]
    }
}

let addChild=(parent, child)=>
{
    if(!parent.hitags)
        parent.hitags = []
    parent.hitags.push(child)
}

let canRead=(currentKeys, inheritKeys, requesterKey)=>
{
    if(currentKeys)
        return (currentKeys.find(key=>key===requesterKey)?true:false)
    else
        if(inheritKeys)
            return (inheritKeys.find(key=>key===requesterKey)?true:false)

    console.error('No keys are defined. No reading will be allowed')
    return false
}

let resolveHitagPath=(cid, hitagPath, requesterKey)=>
{
    let tags = hitagPath.split('/')
    console.log(tags)

    ipfs.dag.get(cid,'', (e,r)=>{
        if(e)
            console.error(e)
            console.log(r.value)
        
        let parent = r.value
        let inheritReadKeys = parent.canRead
        let hitag = {}

        for(let i in tags)
        {
            let tag= tags[i]

            console.log("parent hitags",parent.hitags)
            if(!parent.hitags[tag])
                console.error('Unxexisting path ', tag)

            hitag = parent.hitags[tag]

            if(canRead(hitag.canRead, inheritReadKeys, requesterKey))
            {
                inheritReadKeys = hitag.canRead
                parent = hitag
            }
            else
            {
                break
            }
        }

        return hitag
    
    })
}

let onNewCid=(error, cid)=>
{
    if(error)
        console.error(error)

    console.log('Added :',cid.toBaseEncodedString('base58btc'))

    resolveHitagPath(cid, 'Unga/Bunga',"1")
}

let init=()=>
{
   
    ipfs._ipld.support.rm('dag-cbor')
    ipfs._ipld.support.add(
        hitagMulticodec,
        hitagDag.resolver,
        hitagDag.util)
        
    let h1 = getNewHitag('Unga')
    let h2 = getNewHitag('Bunga')
    let h3 = getNewHitag('Xunga')

    addChild(h2, h3)
    addChild(h1, h2)
    addChild(base, h1)

    //console.log(JSON.stringify(h1))

    ipfs.dag.put(base, format, onNewCid)
}

ipfs.on('start', init)

console.log('Can read', canRead(undefined,["1","2","3"],"2"))