process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");

exports.handler = function handler(event, context, callback) {
    // Assign API gateway param to event.html
    //event.html = event.queryStringParameters.html; //   Could also be a POST using the body param;
    let _body = JSON.parse(event.body)
    event.html = _body.html; //   Could also be a POST using the body param;
    
    if (!event.html) {
        const errorResponse = errorUtil.createErrorResponse(400, "Validation error: Missing field 'html'.");
        callback(errorResponse);
        return;
    }

    // wkhtmltopdf options
    /*const wkhtmltopdf_options = {
        pageSize: 'A4',
        orientation: 'Landscape',
        pageOffset: 0,
        encoding: 'utf-8',
        debug: false,
        enableJavascript: true,
        enableLocalFileAccess: true,
        marginBottom: "8",
        marginTop: '8'
    };*/

    wkhtmltopdf(event.html)
        .then(buffer => {
            callback(null, {
                //data: buffer.toString("base64")
                body: buffer.toString("base64"),
                headers: {},
                statusCode: 200
            });
        }).catch(error => {
            callback(errorUtil.createErrorResponse(500, "Internal server error", error));
        });
};