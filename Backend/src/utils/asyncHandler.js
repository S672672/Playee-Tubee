const asyncHandler = (requestHandler)=>{
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}



export {asyncHandler};




// const asyncHandler = (fn) => async (req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }catch(err){
//         resizeBy.status(err.code || 5000).json({
//             success:false,
//             message:err.message
//         })
//     }
// }