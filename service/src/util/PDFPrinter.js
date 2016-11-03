//Dependencies
var PDFDocument = require('pdfkit'),
	fs = require('fs'),
	path = require('path');

const xMax = 550,
	yMax = 800;

var addReportHeader = function (content, doc) {
	var titleWidth = doc.widthOfString(content.title, {
		width: 200,
		align: 'justify'
	});
	var reportingPeriodWidth = doc.widthOfString(content.reportingPeriod, {
		width: 200,
		align: 'justify'
	});

	// add title of the report
	doc.text(content.title, (xMax - titleWidth) / 2, 10, {
		align: 'centre',
		underline: true
	});

	doc = doc.font('Times-Roman', 8);
	doc.text(content.reportingPeriod, 60, 25, {
		align: 'left'
	});

	doc.text(content.createdOn, (xMax - reportingPeriodWidth - 40), 25, {
		align: 'left'
	});

	doc.moveTo(20, 35)
		.lineTo(570, 35)
		.stroke();

	return doc;
};

var ensureTempDir = function () {
	var tempDir = path.join(global.appRootDir, 'temp');
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir);
	}
};

var printer = {};
printer.print = function (content, fileName, onFinish) {
	try {
		var xpos = 20,
			ypos = 45;

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
			
		ensureTempDir();
		var file = path.join(global.appRootDir, 'temp', fileName);
		var writeStream = fs.createWriteStream(file);

		// create a document
		var doc = new PDFDocument(docStyle);
		doc.pipe(writeStream);

		//line gap is set to 1 for the entire document
		doc.lineGap(1);
		// add report header
		doc = addReportHeader(content, doc);

		for (var i = 0; i < body.length; i++) {
			if (yMax - ypos <= doc.heightOfString(body[i].header, basicTextStyle)) {
				xpos += 185;
				ypos = 45;

				if (xMax - xpos <= 150) {
					doc = doc.addPage();
					xpos = 20;
				}
			}
			doc = doc.fillColor('red')
				.text(body[i].header, xpos, ypos, basicTextStyle);
			ypos += doc.heightOfString(body[i].header, basicTextStyle);

			doc = doc.fillColor('black');
			for (var j = 0; j < body[i].paragraph.length; j++) {
				if (yMax - ypos <= doc.heightOfString(body[i].paragraph[j], basicTextStyle)) {
					xpos += 185;
					ypos = 45;

					if (xMax - xpos <= 150) {
						doc = doc.addPage();
						xpos = 20;
					}
				}
				doc = doc.text(body[i].paragraph[j], xpos, ypos, basicTextStyle);
				ypos += doc.heightOfString(body[i].paragraph[j], basicTextStyle);
			}
			// adds space after end of each supplier
			ypos += 5;
		}
		doc.end();
		writeStream.on('finish', function () {
			onFinish(null, file);
		});
	} catch (err) {
		onFinish(err);
	}
};

module.exports = printer;