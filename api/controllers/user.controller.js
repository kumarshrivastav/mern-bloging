class UserController{
    test(req,res){
        return res.json({message:"API is Working..."})
    }
}

export default new UserController;