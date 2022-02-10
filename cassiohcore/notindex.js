//Packages and shit
const dialogflow = require("@google-cloud/dialogflow");
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");

//Dialog flow Credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const PROJECTID = CREDENTIALS.project_id;

//Client
const CONFIG = {
    credentials: {
        private_key: CREDENTIALS['private_key'],
        client_email: CREDENTIALS['client_email']
    }
}
//Client 
const sessionClient = new dialogflow.SessionsClient(CONFIG);


//Detect Intent method
const detectIntent = async (languageCode, queryText, sessionId) =>{
    //Eu n faço a mínima ideia oq ta rolando aqui 
    let sessionPath = sessionClient.projectAgentSessionPath(PROJECTID, sessionId);

    //Text query
    let request = {
        session: sessionPath,
        queryInput: {
            text:{
                //The actual thing on text 
                text:queryText,
                //Type, like (en-US) --> pt-BR
                languageCode: languageCode
            }
        }
    };

    //Send request
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    //console.log(responses);
    console.log(result.fulfillmentText);
    return{
        response: result.fulfillmentText
    };
}

detectIntent('pt', 'Olá','sessionsomething');
//Start the app
/* const webApp = express();
webApp.use(express.urlencoded({
    extended:true
})) */