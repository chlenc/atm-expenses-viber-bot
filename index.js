const authToken = '47d1539701e7d33e-e4f86ae392270ad6-e151fcba7984f526';
// const ngrok = require('./get_public_url');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const bot = new ViberBot({
    authToken: authToken,
    name: "Irina Narchemashvili",
    avatar: "http://www.icosky.com/icon/png/Movie%20%26%20TV/Futurama%20Vol.%201/Bender.png"
});
const port = process.env.PORT || 8080;
const TextMessage = require('viber-bot').Message.Text;
// const KeyboardMessage = require('viber-bot').Message.Keyboard;


const frases = require('./frases');
const kb = require('./keyboards');
const DIR = "expenses";
const database = require('./database')
//
bot.onSubscribe(response => {
    bot.sendMessage(response.userProfile, frases.start);
});

//
function sendState(response, thisState, nextState, about) {
    console.log(thisState)
    database.updateData(`${DIR}/users/${response.userProfile.id}`, {state: nextState});
    frases[thisState](response.userProfile.id, function (msg) {
        bot.sendMessage(response.userProfile, msg);
    });
    if (about) {
        setTimeout(function () {
            console.log("about")
            bot.sendMessage(response.userProfile, frases.homeTrigger);
        }, 1000)//900000)
    }
}

function sendTimeoutState(response, thisState, nextState, timeout, about) {
    console.log(thisState + " timeout " + (timeout / 1000))
    return setTimeout(function () {
        database.getData(DIR + "/" + `users/${response.userProfile.id}/state`, function (state, error) {
            if (!error && state === thisState) {
                sendState(response, thisState, nextState, about);
            }
        })
        return true
    }, timeout)
}

function postMux(id, text) {
    var ans = true;
    switch (text) {
        case 'pay1':
            bot.sendMessage({id: id}, frases.video5);
            break;
        case 'pay2':
            bot.sendMessage({id: id}, frases.video6);
            break;
        case 'watch1':
            sendState({userProfile: {id: id}}, 'video6_pay', 'video3_1');
            sendTimeoutState({userProfile: {id: id}}, "video3_1", "video3_2", 5000, true)//172800000
            break;
        case 'watch2':
            bot.sendMessage({id: id}, frases.video7_about);
            break;
        default:
            ans = false;
            break;
    }
    return ans
}

bot.on(BotEvents.MESSAGE_RECEIVED, function (message, response) {

    console.log(message.salesjet_request)
    console.log('=======' + response.userProfile.id + '=======')
    if (message.text.substring(0, 4) === "http") {
        return
    } else if (message.text.substring(0, 5) === "call ") {
        if (message.text.split("call ")[1]) {
            var date = new Date()
            bot.sendMessage(response.userProfile, new TextMessage("Вам перезвонят!"));
            database.pushData('backCalls/', {
                url: `https://vk.com/id${response.userProfile.id}`,
                time: date.getTime(),
                phone: (message.text.split("call ")[1] || "-")
            })
        } else {
            bot.sendMessage(response.userProfile, new TextMessage("Попробуйте еще раз :c"));
        }
        return
    }


    switch (message.text) {
        //==============================================================================================================================

        case 'start':
        case 'Start':
        case 'Начать':
            sendState(response, 'video2_1', 'video5_pay', true);
            break;

        case "7am":
            database.getData(DIR + "/" + `users/${response.userProfile.id}`, function (data, error) {
                if (!error && data.state !== undefined) {
                    if (data.state === 'video5_pay') {
                        sendState(response, 'video5_pay', 'video4_1');
                        sendTimeoutState(response, "video4_1", "video4_2", 5000, true)//129600000
                    } else if (data.state === 'video4_2') {
                        sendState(response, 'video4_2', 'video4_3');
                    } else if (data.state === 'video4_3') {
                        sendState(response, 'video4_3', 'video5_1_pay');
                    } else if (data.state === 'video5_1_pay') {
                        sendState(response, 'video5_1_pay', 'watch1');
                    } else if (data.state === 'video3_2') {
                        sendState(response, 'video3_2', 'video6_1_pay');
                    } else if (data.state === 'video6_1_pay') {
                        sendState(response, 'video6_1_pay', 'video1_1');
                        sendTimeoutState(response, "video1_1", "video1_2", 5000, true)//3600000

                    } else if (data.state === 'video1_2') {
                        sendState(response, 'video1_2', 'video6_2_pay');
                        sendTimeoutState(response, "video6_2_pay", "watch2", 5000)//25200000

                    }

                } else {
                    console.log(error)
                }
            })
            break

//==============================================================================================================================
        case "Stop":
        case "stop":
            bot.sendMessage(response.userProfile, new TextMessage('Бот был остановлен'));
            database.updateData(`${DIR}/users/${response.userProfile.id}`, {state: 'none'});
            break;

        case "author":
            bot.sendMessage(response.userProfile, frases.aboutAuthor)
            break
        case "company":
            bot.sendMessage(response.userProfile, frases.aboutCompany)
            break
        case '3':
            bot.sendMessage(response.userProfile, new TextMessage('Напишите команду call и свой номер телефона в формате (call 89001112233)'));
            break;
        default:
            if (postMux(response.userProfile.id, message.text) !== true) {
                bot.sendMessage(response.userProfile, frases.error);
            }
            break;
    }
})


const http = require('http');
var webhookUrl = "https://17a38628.ngrok.io"
console.log('Set the new webhook to"', webhookUrl);
http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(webhookUrl));


// bot.setWebhook(webhookUrl)
// const bodyParser = require('body-parser');
// const express = require('express');
// const app = express();
// app.use(bodyParser.json());
// app.use("/viber/webhook", bot.middleware());
// app.listen(port);
//
// app.post("/", function (req, res) {
//     try {
//         console.log(req.body);
//         if (!req.body || req.body === {}) return res.sendStatus(400);
//         else if (req.body.salesjet_request) {
//             var ctx = req.body.data;
//             console.log(ctx)
//             //     ctx.user_id = +ctx.user_id;
//             //     switch (req.body.data.event) {
//             //         case 'pay1':
//             //             bot.reply(ctx.user_id, frases.video5);
//             //             break;
//             //         case 'pay2':
//             //             bot.reply(ctx.user_id, frases.video6);
//             //             break;
//             //         case 'watch1':
//             //             sendState(ctx, 'video6_pay', 'video3_1');
//             //             sendTimeoutState(ctx, "video3_1", "video3_2", 5000, true)//172800000
//             //             break;
//             //         case 'watch2':
//             //             bot.reply(ctx.user_id, frases.video7_about);
//             //             break;
//             //     }
//             return res.sendStatus(200)
//         }
//         else {
//             bot.setWebhook(webhookUrl)
//             app.use("/viber/webhook", bot.middleware());
//             // bot.listen(req, res)
//             // bot.setWebhook(webhookUrl)
//         }
//
//     }
//     catch (e) {
//         console.log(e.toString())
//     }
//
// });


console.log("bot has been started")
