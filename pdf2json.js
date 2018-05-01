/*
 * Uses the node.js module pdf2json to load a pdf titled "resume.pdf" and
 * output a jSON file called "data.json", as well as an html file called
 * "output.html" that will take the data from data.json and display it on 
 * a web browser.
 *
 */

var fs = require('fs');
var PDFParser = require('pdf2json');
var pdfParser = new PDFParser();

// Load PDF data
pdfParser.loadPDF("resume.pdf");

// Output jSON and HTML files
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFile("data.json", JSON.stringify(pdfData), function(err) {
        if(err) {
            return console.log(err);
        }
        var htmlData = '<!doctype html><html><head><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script><script src="json2html.js"></script></head><body><div id="bdy"></div></body></html>';
        fs.writeFile("output.html", htmlData, function(err) {
            if(err) {
                return console.log(err);
            }    
        });
    });;
});

