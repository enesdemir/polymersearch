var express = require('express');
var router = express.Router();
const https = require("https");

const dataSources = [
    'https://pastebin.com/raw/xakN3d90',
    'https://pastebin.com/raw/4aQB0PfA',
    'https://pastebin.com/raw/aqyKgFk4',
    'https://pastebin.com/raw/aqRHtkAN',
    'https://pastebin.com/raw/GwE7q2gR',
    'https://pastebin.com/raw/E9nVzqSU',
    'https://pastebin.com/raw/V895E5bV',
    'https://pastebin.com/raw/hfz8HKBA',
    'https://pastebin.com/raw/EiMfxdb3',
    'https://pastebin.com/raw/QRmckcsw',
    'https://pastеbin.com/raw/z0mcx7dk'
];

function getData(callback) {
    const getSource = () => {
        const i = Math.floor(Math.random() * dataSources.length);
        return dataSources[i];
    }

    https.get(getSource(), res => {
        console.log('Response is ' + res.statusCode);
        res.setEncoding("utf8");
        let data = "";

        res.on("data", respData => {
            data += respData;
        });


        res.on("end", () => {
            const date = new Date();
            const minutes = 3;
            let resp = data;
            for (let i = 0; i < minutes; i++) {
                resp += data;
            }

            callback(resp);
        });

    }).on('error', (e) => {
        callback(false);
    });

}

function findDistinctChars(str) {
    var temp = {};
    for (var oindex = 0; oindex < str.length; oindex++) {
        temp[str.charAt(oindex)] = 0;
    }
    return Object.keys(temp).join("").length;
}

function findDistinctCharsList(str) {
    var temp = {};
    for (var oindex = 0; oindex < str.length; oindex++) {
        temp[str.charAt(oindex)] = temp[str.charAt(oindex)] ? temp[str.charAt(oindex)] + 1 : 1;
    }
    return temp;
}


/* GET home page. */
router.get('/', function (req, res, next) {
    var sendDate = (new Date()).getTime();

    let total_retry = 0;

    function repeat(result) {
        total_retry++;
        if (result !== false) {
            var line_list = result.split(/\r?\n/g);
            var longest_line = line_list[0];
            var longest_line_number = 0;
            for (var i = 0; i < line_list.length; i++) {
                if (longest_line.length < line_list[i].length) {
                    longest_line = line_list[i];
                    longest_line_number = i;
                }
            }

            result = {
                total_retry: total_retry,
                response_time: 0,
                string_length: result.length,
                distinct_char_amount: findDistinctChars(result),
                distinct_char_list: findDistinctCharsList(result),
                longest_line: longest_line,
                longest_line_number: longest_line_number,
            };

            var receiveDate = (new Date()).getTime();
            result.response_time = receiveDate - sendDate;
            res.json(result);
        } else {
            getData(repeat);
        }
    }

    getData(repeat);

});

module.exports = router;
