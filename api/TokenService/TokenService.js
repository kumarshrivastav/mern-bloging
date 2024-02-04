import jwt from "jsonwebtoken"
class TokenService{
    generateToken(payload){
        const accessToken=jwt.sign(payload,process.env.ACCESS_TOKEN_JWT,{expiresIn:'1h'})
        const refreshToken=jwt.sign(payload,process.env.REFRESH_TOKEN_JWT,{expiresIn:'1y'})
        return {accessToken,refreshToken}
    }
    verifyAccessToken(accessToken){
        return jwt.verify(accessToken)
    }
    verifyRefreshToken(refreshToken){
        return jwt.verify(refreshToken)
    }
}

export default new TokenService;