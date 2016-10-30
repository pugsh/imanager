//Dependencies
var PDFDocument = require('pdfkit'),
	fs = require('fs'),
	path = require('path');

var printer = {};
printer.print = function(content, fileName, onFinish) {
	try {
		// Create a document
		var doc = new PDFDocument();
		var title = content.title;
		var body = content.body;
		var file = path.join(__dirname, fileName);
		var writeStream = fs.createWriteStream(file);

		//  Pipe its output somewhere, like to a file or HTTP response
		// See below for browser usage
		doc.pipe(writeStream);

		// and some justified text wrapped into columns
		doc.text(content.title, 10, 10)
			.font('Times-Roman', 8)
			.moveDown(0.5)
			.text('', {
				height: 100,
				width: 465,
				columns: 3,
				columnGap: 15,
				align: 'justify',
				ellipsis: true,
				continued: 'yes'
			});

		for (var i = 0; i < body.length; i++) {
			doc.fillColor('red')
				.text(body[i].header, {
					underline: true
				})
				.fillColor('black')
				.text(body[i].paragraph)
				.moveDown(0.5);
		}
		// Finalize PDF file
		doc.end();
		writeStream.on('finish', function() {
			onFinish(null, file);
		});
	} catch (err) {
		onFinish(err);
	}
};

module.exports = printer;