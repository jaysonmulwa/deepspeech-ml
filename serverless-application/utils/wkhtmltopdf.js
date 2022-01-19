const { spawn } = require("child_process");

module.exports = function (html, options = []) {
    return new Promise(((resolve, reject) => {
        const bufs = [];
        const proc = spawn("/bin/sh", ["-o", "pipefail", "-c", `lib/wkhtmltopdf --page-size A4 --orientation landscape --page-offset 0 --encoding utf-8 --no-debug-javascript --enable-javascript --enable-local-file-access --margin-top 8 --margin-bottom 8 --footer-right [page] ${options.join(" ")} - - | cat`]);

        proc.on("error", error => {
            reject(error);
        }).on("exit", code => {
            if (code) {
                reject(new Error(`wkhtmltopdf process exited with code ${code}`));
            } else {
                resolve(Buffer.concat(bufs));
            }
        });
        proc.stdin.end(html);
        proc.stdout.on("data", data => {
            bufs.push(data);
        }).on("error", error => {
            reject(error);
        });

    }));
};