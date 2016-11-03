$(document).ready(function () {
	// 'use strict';
	var getDate = function () {
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

	var viewReport = function () {
		debugger;
		var service = '/imanager/report/order/view';
		var url = service + '?date=' + getDate();
		// $('#report-viewer-obj').attr('data', url);
		var objEL = document.getElementById('report-viewer-obj');
		objEL.setAttribute('data', url);
		objEL.setAttribute('type', 'application/pdf');
	};

	var downloadReport = function () {
		debugger;
		var service = '/imanager/report/order/download';
		var urlSuffix = '?date=' + getDate();
		var a = document.createElement('a');
		a.href = service + urlSuffix;
		a.setAttribute('style', 'display:none');
		a.click();
	};

	$('#report-orders-view').click(viewReport);
	$('#report-orders-download').click(downloadReport);
});