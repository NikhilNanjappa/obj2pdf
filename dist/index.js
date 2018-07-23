"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdfMake = require("pdfmake/src/printer");
function generatePDF(obj) {
    return new Promise(function (resolve) {
        var fontDescriptors = {
            'Roboto': {
                normal: 'dist/public/fonts/Roboto-Regular.ttf',
                bold: 'dist/public/fonts/Roboto-Bold.ttf',
                italics: 'dist/public/fonts/Roboto-Italic.ttf',
                bolditalics: 'dist/public/fonts/Roboto-BoldItalic.ttf'
            }
        };
        var printer = new pdfMake(fontDescriptors);
        var doc = printer.createPdfKitDocument(createDocDefinition(obj));
        var chunks = [];
        doc.on('data', function (chunk) {
            chunks.push(chunk);
        });
        doc.on('end', function () {
            var result = Buffer.concat(chunks);
            resolve('data:application/pdf;base64,' + result.toString('base64'));
        });
        doc.end();
    });
}
exports.generatePDF = generatePDF;
var createDocDefinition = function (obj) {
    try {
        var docDefinition = {
            content: [
                { text: obj.heading, fontSize: 15, alignment: "center", bold: true, margin: [0, 10] }
            ]
        };
        for (var prop in obj) {
            if (typeof (obj[prop]) === "object") {
                // Push the obj key as section heading 
                docDefinition.content.push({ text: prop, fontSize: 12, bold: true, margin: [0, 10] });
                // Push obj values as section contents
                for (var elem in obj[prop]) {
                    docDefinition.content.push({ text: elem, fontSize: 10, bold: true }, { text: obj[prop][elem], fontSize: 8, margin: [0, 0, 0, 10] });
                }
            }
            else if (typeof (obj[prop]) === "string" || typeof (obj[prop]) === "number") {
                if (prop !== "heading") {
                    docDefinition.content.push({ text: prop, fontSize: 10, bold: true, margin: [0, 10] }, { text: obj[prop], fontSize: 8, margin: [0, 0, 0, 10] });
                }
            }
        }
        return docDefinition;
    }
    catch (err) {
        console.log("createDocDefinition error : " + err);
    }
};
