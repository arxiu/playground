const ipfs = require('./ipfsNode')
const hitagDag = require('../../arxiu-ipld-hitag')
const hitagMulticodec = hitagDag.resolver.multicodec
const format =  { format: hitagMulticodec , hashAlg: 'sha2-256'}
console.log(hitagMulticodec)

let hitagPath = 'Unga/Xunga/'

let getBaseProps=()=>
{
    return {
        
        canWrite:{},
        hitags:{},
        history:{}
    }
}

let getNewHitag =(name)=>
{
    let hitag = {}
    hitag[name]=getBaseProps()
    return hitag
}

let addChild=(parent, name, props)=>
{
    if(!parent.hitags)
        parent.hitags={}

    if(parent.hitags[name])
        throw('The child '+ name + 'already exist in '+parent)
    
    if(props)
        parent.hitags[name] = props
    else
        parent.hitags[name] = getBaseProps()

    return parent.hitags[name]
}

let addReadKey=(parent, key)=>
{
    if(!parent.canRead)
        parent.canRead = []
    
    if (key)
        parent.canRead.push(key)
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
    let currentPath='/'

    ipfs.dag.get(cid,'', (e,r)=>{
        if(e)
            console.error(e)
            console.log('value',r.value)
        
        let parent = r.value
        let inheritReadKeys = parent.canRead
        
        let hitag = {}

        for(let i in tags)
        {
            let tag= tags[i]

            if(!parent.hitags[tag])
                console.error('Unxexisting path ', tag)

            hitag = parent.hitags[tag]

            console.log(i, tag)
            currentPath+=tag+'/'

            console.log('can read:' , hitag.canRead, inheritReadKeys, requesterKey)
            if(canRead(hitag.canRead, inheritReadKeys, requesterKey))
            {
                //TODO, is using the hitag keys and they may come from parent
                inheritReadKeys = hitag.canRead
                parent = hitag
            }
            else
            {
                console.error("No permissions to read " + currentPath)
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

    resolveHitagPath(cid, hitagPath,"1")
}

let init=()=>
{
   
    ipfs._ipld.support.rm('dag-cbor')
    ipfs._ipld.support.add(
        hitagMulticodec,
        hitagDag.resolver,
        hitagDag.util)
    
    let h0 = getBaseProps()
    addReadKey(h0, '1')
    let h1 = addChild(h0,'Unga')
    addChild(h0, 'Xunga')
    addChild(h0, 'Bunga')
    addChild(h1, 'Xunga')
    let h2 = addChild(h1,'Bunga')
    //let h3 = addChild('Xunga')

    ipfs.dag.put(h0, format, onNewCid)
}

ipfs.on('start', init)

console.log('can read',canRead([],['1'],'1'))