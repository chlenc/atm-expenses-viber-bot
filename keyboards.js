module.exports = {
    init: {
        "Type": "keyboard",
        "Revision": 1,
        "Buttons": [
            {
                "Columns": 6,
                "Rows": 1,
                "Text": white("Начать"),
                "TextSize": "medium",
                "TextHAlign": "center",
                "TextVAlign": "center",
                "ActionType": "reply",
                "ActionBody": "start",
                "BgColor": "#2ecc71"
            }
        ]
    },
    info: {
        "Type": "keyboard",
        "Revision": 1,
        "Buttons": [
            {
                "Columns": 6,
                "Rows": 1,
                "Text": white("Об авторе и спикере видео-уроков"),
                "TextSize": "medium",
                "TextHAlign": "center",
                "TextVAlign": "center",
                "ActionType": "reply",
                "ActionBody": "author",
                "BgColor": "#2ecc71"
            },
            {
                "Columns": 6,
                "Rows": 1,
                "Text": white("О компании ATManagement Group"),
                "TextSize": "medium",
                "TextHAlign": "center",
                "TextVAlign": "center",
                "ActionType": "reply",
                "ActionBody": "company",
                "BgColor": "#2ecc71"
            }
        ]
    },
    feedback: {
        "Type": "keyboard",
        "Revision": 1,
        "Buttons": [
            {
                "Columns": 6,
                "Rows": 1,
                "Text": white("Заказать звонок"),
                "TextSize": "medium",
                "TextHAlign": "center",
                "TextVAlign": "center",
                "ActionType": "reply",
                "ActionBody": "feedback",
                "BgColor": "#2ecc71"
            }
        ]
    },
    getLinkButton(data,feedback) {
        var buttons = []
        for(var temp in data){
            buttons.push({
                "ActionBody": data[temp].url,
                "ActionType": "open-url",
                "Text": white(data[temp].text),
                "Rows": 1,
                "Columns": 6,
                "BgColor": "#2ecc71"
            })
        }
        if(feedback){
            buttons.push({
                "Columns": 6,
                "Rows": 1,
                "Text": white("Заказать звонок"),
                "TextSize": "medium",
                "TextHAlign": "center",
                "TextVAlign": "center",
                "ActionType": "reply",
                "ActionBody": "3",
                "BgColor": "#2ecc71"
            })
        }
        return {
            "Type": "keyboard",
            "Revision": 1,
            "Buttons": buttons
        }
    }
}


function white(text) {
    return '<font color="#ffffff">'+text+'</font>'
}