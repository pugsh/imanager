$(document).ready(function() {
	// 'use strict';
	var getDate = function() {
		debugger;
		var reportId = $('#report-selector').val();
		var date, DDMMYYYY = 'DD-MM-YYYY',
			MMYYYY = 'MM-YYYY',
			YYYY = 'YYYY';
		switch (reportId) {
			case '0':
				date = moment().format(DDMMYYYY);
				break;
			case '-1':
				date = moment().subtract(1, 'days').format(DDMMYYYY);
				break;
			case '-2':
				date = moment().subtract(2, 'days').format(DDMMYYYY);
				break;
			case 'm':
				date = moment().format(MMYYYY);
				break;
			case '-1m':
				date = moment().subtract(1, 'months').format(MMYYYY);
				break;
			case 'y':
				date = moment().format(YYYY);
				break;
			default:
				date = moment().format(format);
		}
		return date;
	};

	var showReport = function() {
		debugger;
		var service = '/imanager/report/order';
		var url = service + '?date=' + getDate();
		$('#report-viewer-obj').attr('data', url);
	};

	var downloadReport = function() {
		debugger;
		var downloadFileName = 'Orders2-' + moment().format('YYYYMMDDHmmss') + '.pdf';
		var service = '/imanager/report/order/download';
		var url = service + '?date=' + getDate();
		var a = document.createElement('a');
		a.href = url;
		a.download = downloadFileName;
		a.setAttribute('style', 'display:none');

		$('#report-download').empty();
		$('#report-download').append(a);
		a.click();
	};

	$('#report-orders').click(showReport);
	$('#report-orders-download').click(downloadReport);
});