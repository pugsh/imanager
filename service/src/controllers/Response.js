const STATUS = {
	"SUCCESS": "success",
	"FAILURE": "failure"
};
const OPERATION_SUCCESS_MSG = 'Operation successfull.';
const OPERATION_FAIL_MSG = 'Operation successfull.';

exports.buildSuccessResponse = function (obj) {
	this.status = STATUS.SUCCESS;
	this.data = (obj === undefined ? OPERATION_SUCCESS_MSG : obj);
};

exports.buildErrorResponse = function (err) {
	this.status = STATUS.FAILURE;
	this.data = (err === undefined ? OPERATION_FAIL_MSG : err);
};