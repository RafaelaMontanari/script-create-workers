require("dotenv").config();
const csv = require('csvtojson');
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const workspace = process.env.workspace
const twilio = require('twilio')(accountSid, authToken)

const getWorker = async() => {
    const workers = await csv().fromFile('lista-workers.csv')

    for(let i in workers){
        const worker = workers[i]
        const email = worker.email
        const friendlyName = (email.split('@'))[0]
        const skills = worker.skills.split(';')
        const data = {
            "routing":{
                "skills": skills
            },
            "full_name": friendlyName,
            "roles": ["agent"],
            "email": email
        }
        const attributes = JSON.stringify(data)
        const response = await twilio.taskrouter.workspaces(workspace).workers.create({friendlyName,attributes})
    }
    return workers
}

getWorker().then(response => {
    console.log(response)
})