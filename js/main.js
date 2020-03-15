
var csInterFace = new CSInterface();

function init() {
    var csvInput = document.getElementById('send');
    csvInput.addEventListener('click', createSubtitles);
}

async function createSubtitles() {
    var file = document.getElementById('csv-input').files[0];
    if (!file) {
        alert('ファイルが選択されていません');
        return -1;
    }
    var csv = await readCsv(file);
    var subtitles = await convertCsvToJson(csv);
    if ((await csEvalScript('init()')) === "-1") return -1;
    var res = await Promise.all(subtitles.map((subtitle) => {
        var str = subtitle[0];
        var inPointFrame = parseTimeToSeconds(subtitle[1]);
        var endPointFrame = parseTimeToSeconds(subtitle[2]);
        return csEvalScript(`createSubtitle("${str}", ${inPointFrame}, ${endPointFrame})`);
    }));
    console.log(res);
    if (!res.every((r) => r === '0')) {
        alert('処理を失敗しました');
        return -1;
    } else alert('完了');
    return 0;
}

function readCsv(data) {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.readAsText(data);
    });
}

function convertCsvToJson(text) {
    return new Promise((resolve, reject) => {
        var csvtojson = require('csvtojson');
        csvtojson({noheader: true, output: "csv"})
            .fromString(text)
            .then(resolve)
            .catch(reject);
    });
}

function csEvalScript(str) {
    return new Promise((resolve, reject) => {
        try {
            console.log(str);
            csInterFace.evalScript(str, resolve);
        } catch (err) {
            reject(err);
        }
    });
}

function parseTimeToSeconds(str) {
    var frameRate = 30;
    var regex = new RegExp(/[0-9]+/g);
    var nums = str.match(regex);
    if (nums.length != 4) return 0; 
    var total = 0;
    total += parseInt(nums[0]) * 60 * 60; // h
    total += parseInt(nums[1]) * 60; // m
    total += parseInt(nums[2]); // s
    total += parseInt(nums[3]) / frameRate; // f
    console.log(total)
    return total;
}

init();
