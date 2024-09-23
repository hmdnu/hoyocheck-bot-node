import dotenv from "dotenv";
dotenv.config();
export const Env = {
    channelId: process.env.CHANNEL_ID,
    clientId: process.env.CLIENT_ID,
    dcToken: process.env.DC_TOKEN,
    baseUrl: process.env.BASE_URL,
    apiToken: process.env.API_TOKEN,
    roleId: process.env.ROLE_ID,
};
export const ResponseCode = {
    success: 0,
    alreadyCheckedIn: -5003,
    cookieInvalid: -100,
    gameNotFound: -10002,
};
export const ResponseData = [
    {
        code: ResponseCode.success,
        message: "You are succesfully checked in",
    },
    {
        code: ResponseCode.alreadyCheckedIn,
        message: "You are already checked in for today",
    },
    {
        code: ResponseCode.cookieInvalid,
        message: "Your cookie is invalid, try setting up again",
    },
    {
        code: ResponseCode.gameNotFound,
        message: "Game not found, you have not played this game yet",
    },
];
