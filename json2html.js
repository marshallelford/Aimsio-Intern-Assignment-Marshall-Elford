/*
 * This file acts as the script for the HTML file that is output by pdf2json.js, and automatically
 * generates the html required to display the data in the json file that is also output by PDF2jSON.js.
 *
 *
 * Assumptions:
 *
 * When printing using the browser, go to '+ More settings' and ensure 'Background graphics' is selected
 *
 * pdf2json has several limitations, including:
 *  1. Their style dictionary is very limited, with no support for the majority of font families. 
 *  2. Sizes and positioning are stored using EITHER pixel or predefined lengths and need to be adjusted on a case by case basis. I have input the adjustment specifically for my resume, but if this was a general application I would either allow for user input adjustments or create my own version of pdf2json and standardize the sizing.
 *  3. Italics are not being recognized.
 * 
 */

var kColors = [
          '#000000',		// 0
          '#ffffff',		// 1
          '#4c4c4c',		// 2
          '#808080',		// 3
          '#999999',		// 4
          '#c0c0c0',		// 5
          '#cccccc',		// 6
          '#e5e5e5',		// 7
          '#f2f2f2',		// 8
          '#008000',		// 9
          '#00ff00',		// 10
          '#bfffa0',		// 11
          '#ffd629',		// 12
          '#ff99cc',		// 13
          '#004080',		// 14
          '#9fc0e1',		// 15
          '#5580ff',		// 16
          '#a9c9fa',		// 17
          '#ff0080',		// 18
          '#800080',		// 19
          '#ffbfff',		// 20
          '#e45b21',		// 21
          '#ffbfaa',		// 22
          '#008080',		// 23
          '#ff0000',		// 24
          '#fdc59f',		// 25
          '#808000',		// 26
          '#bfbf00',		// 27
          '#824100',		// 28
          '#007256',		// 29
          '#008000',		// 30
          '#000080',		// Last + 1
          '#008080',		// Last + 2
          '#800080',		// Last + 3
          '#ff0000',		// Last + 4
          '#0000ff',		// Last + 5
          '#008000',		// Last + 6
          '#000000'		// Last + 7
      ];
var _kFontFaces = [
         "QuickType,Arial,Helvetica,sans-serif",							// 00 - QuickType - sans-serif variable font
         "QuickType Condensed,Arial Narrow,Arial,Helvetica,sans-serif",	// 01 - QuickType Condensed - thin sans-serif variable font
         "QuickTypePi",													// 02 - QuickType Pi
         "QuickType Mono,Courier New,Courier,monospace",					// 03 - QuickType Mono - san-serif fixed font
         "OCR-A,Courier New,Courier,monospace",							// 04 - OCR-A - OCR readable san-serif fixed font
         "OCR B MT,Courier New,Courier,monospace"							// 05 - OCR-B MT - OCR readable san-serif fixed font
      ];

$(document).ready(function(){
    $.getJSON("data.json", function(data) {
        var body = '';
        var width, height;
        
        // pdf2json outputs the pdf's data as the first element in an array
        $.each(data, function(key, value) {     
            var width = Number(value.Width);                // The width of the pdf
            var page = 0;                                   // Page number
            
            // Examine the data on each page
            $.each(value.Pages, function(pagesKey, pagesValue) {  
                var height = Number(pagesValue.Height);     // The height of the pdf
                var adj = 5;                                // pdf2json adjustment
                
                // Places the background colours
                $.each(pagesValue.Fills, function(fillsKey, fillsValue) {
                    var xPos = (Number(fillsValue.x) / width) * 888 - adj;
                    var yPos = ((Number(fillsValue.y) / height) * 1150) + (page * 1150) - adj;
                    
                    var fillWidth = (Number(fillsValue.w) / width) * 888;
                    var fillHeight = ((Number(fillsValue.h) / height) * 1150);
                    
                    var fillClr;
                    if (fillsValue.clr == '-1') fillClr = fillsValue.oc;
                    else fillClr = kColors[Number(fillsValue.clr)];
                    
                    var z;
                    if (fillClr == kColors[1]) z = 0;
                    else z = 1;
                    
                    body += '<div style="position:absolute;';
                    body += 'z-index:' + z.toString() + ';';
                    body += 'left:' + xPos.toString() + 'px;';
                    body += 'top:' + yPos.toString() + 'px;';
                    body += 'height:' + fillHeight + 'px;';
                    body += 'width:' + fillWidth + 'px;';
                    body += 'background-color:' + fillClr + '">';
                    body += '</div>';
                });
                
                // Places the images (Must be manually added to jSON)
                $.each(pagesValue.Images, function(imagesKey, imagesValue) {
                    var xPos = (Number(imagesValue.x) / width) * 888; 
                    var yPos = ((Number(imagesValue.y) / height) * 1150) + (page * 1150);  
                    
                    var imgWidth = (Number(imagesValue.w) / width) * 888;
                    var imgHeight = ((Number(imagesValue.h) / height) * 1150);
                    
                    var src = imagesValue.src;
                    
                    body += '<div>';
                    body += '<img src="' + src + '"';
                    body += 'style="position:absolute;z-index:10;';
                    body += 'height:' + imgHeight + 'px;';
                    body += 'weight:' + imgWidth + 'px;';
                    body += 'left:' + xPos.toString() + 'px;';
                    body += 'top:' + yPos.toString() + 'px">';
                    body += '</div>'
                    console.log(src);
                });
                
                // Places and stylizes the text
                $.each(pagesValue.Texts, function(textsKey, textsValue) {
                    var xPos = (Number(textsValue.x) / width) * 888; 
                    var yPos = ((Number(textsValue.y) / height) * 1150) + (page * 1150); 
                    
                    var clr;
                    if (textsValue.clr == '-1') clr = textsValue.oc;
                    else clr = kColors[Number(textsValue.clr)];
                    
                    var fontFamily = _kFontFaces[Number(textsValue.R[0].TS[0])];
                    
                    var fontSize = textsValue.R[0].TS[1] - adj/2; 
                    
                    var bold = '';
                    if (textsValue.R[0].TS[2] == '1') bold = 'font-weight:bold;';
                    
                    var italic = ''
                    if (textsValue.R[0].TS[3] == '1') italic = 'font-style:italic;';
                    
                    body += '<div style="position:absolute;z-index:99;';
                    body += 'left:' + xPos.toString() + 'px;';
                    body += 'top:' + yPos.toString() + 'px;';
                    body += bold;
                    body += italic;
                    body += 'font-size:' + fontSize + 'px;';
                    body += 'font-family:' + fontFamily + ';';
                    body += 'color:' + clr + '">';
                    body += decodeURIComponent(textsValue.R[0].T);
                    body += '</div>';
                });
                page++;
            });
        });
        $('#bdy').html(body);       
    });
});

