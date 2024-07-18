const asyncHandler = (fn)=>(req, res, next) =>{
    Promise.resolve(fn(req, res, next)).catch((error)=>{
        console.log(`Error: ${error.message}`);
        res.status(500).json({message: error.message})
    })
}

export default asyncHandler;