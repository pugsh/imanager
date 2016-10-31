//Dependencies
var PDFDocument = require('pdfkit'),
	fs = require('fs'),
	path = require('path');

var printer = {};
printer.print = function(content, fileName, onFinish) {
	try {

		var xpos = 20,
			ypos = 30,
			xmax = 550,
			ymax = 800;

		var title = content.title;
		var body = content.body;
		var basicTextStyle = {
				width: 175,
				align: 'justify'
			},
			docStyle = {
				size: 'A4',
				margin: 20
			};
		var file = path.join(__dirname, fileName);
		var writeStream = fs.createWriteStream(file);

		// create a document
		var doc = new PDFDocument(docStyle);
		doc.pipe(writeStream);

		// add title of the report
		doc.text(content.title, 20, 10)
			.font('Times-Roman', 8)
			.text('', basicTextStyle);
		//line gap is set to 1 for the entire document
		doc.lineGap(1);

		for (var i = 0; i < body.length; i++) {
			if (ymax - ypos <= doc.heightOfString(body[i].header, basicTextStyle)) {
				xpos += 185;
				ypos = 30;

				if (xmax - xpos <= 150) {
					doc = doc.addPage();
					xpos = 20;
				}
			}
			doc = doc.fillColor('red')
				.text(body[i].header, xpos, ypos, basicTextStyle);
			ypos += doc.heightOfString(body[i].header, basicTextStyle);

			doc = doc.fillColor('black');
			for (var j = 0; j < body[i].paragraph.length; j++) {
				doc = doc.text(body[i].paragraph[j], xpos, ypos, basicTextStyle);
				ypos += doc.heightOfString(body[i].paragraph[j], basicTextStyle);
			}
			// adds space after end of each supplier
			ypos += 5;
		}
		doc.end();
		writeStream.on('finish', function() {
			onFinish(null, file);
		});
	} catch (err) {
		onFinish(err);
	}
};

module.exports = printer;