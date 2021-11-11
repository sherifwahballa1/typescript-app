export const port = process.env.PORT;

export const ORIGIN_CORS = process.env.ORIGIN_CORS;

export const SESSION_SECRET = process.env.SESSION_SECRET;

export const REDIS_HOST = process.env.REDIS_HOST;

export const REDIS_PORT = process.env.REDIS_PORT;

export const MONGODB_URI = process.env.MONGODB_URI;

export const MONGODB_URI_WINTSON = process.env.MONGODB_URI_WINTSON;

export const ticketValidationInDays = process.env.ticketValidationInDays;

export const tempTokenDurationInHours = process.env.tempTokenDurationInHours;

export const timeBetweenPasswordResetsInHours = process.env.timeBetweenPasswordResetsInHours;

/**
 * ------------------ TEMP TOKRN  -------------------------
 */
export const temp_Token_Duration_In_Hours = process.env.banDurationInHours;
export const temp_Token_Secret = process.env.temp_Token_Secret;
export const temp_Token_Algorithm = process.env.temp_Token_Algorithm;
// ===========================================================


/**
 * ------------------ TOKRN  -------------------------
 */
export const Token_Algorithm = process.env.Token_Algorithm;
export const maxLogins = process.env.maxLogins;
export const Token_Validation_Time = process.env.Token_Validation_Time;
export const PRIVATEKEY = process.env.PRIVATEKEY;
export const PUBLICKEY = process.env.PUBLICKEY;
// ===========================================================


export const maxTicketUsagePerHour = process.env.maxTicketUsagePerHour;

export const WS_PORT = process.env.WS_PORT;

/**
 * ------------------ Cookies  -------------------------
 */
 export const cookie_token_maxAge_in_Hours = process.env.cookie_token_maxAge_in_Hours;
export const cookie_maxAge_in_Min = process.env.cookie_maxAge_in_Min;
export const cookie_temp_maxAge_in_Min = process.env.cookie_temp_maxAge_in_Min;
// ===========================================================




/**
 * ------------------ Email -------------------------
 */
export const User_Email = process.env.User_Email;
export const User_Password = process.env.User_Password;
export const SMTP_SERVICE = process.env.SMTP_SERVICE;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CLIENT_ID = process.env.CLIENT_ID;