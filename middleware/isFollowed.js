
export const isFollowed = async(req,res, next)=>{
    const {id} = req.params
    const {followerList} = req.user
    let isTrue = false;
    const id1 = id.toString()
    const id3 = req.user._id.toString()
    console.log(id3)
    if( id1 == id3)
    {
        isTrue = true
    }
    else
    {
    followerList.forEach(element => {
        const id2 = element.toString()
        if(id1 == id2)
        isTrue = true
    })
    }
    if(isTrue === true)
    {
        next();
    }
    else
    {
        return res.json({
            success : false,
            message : "You need to follow the user in order to view post"
        })
    }
}