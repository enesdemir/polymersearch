const http = require("http");
let totals = {
    max: 0,
    min: null,
    avarage: 0,
    retry: 0,
    char_list: {},
    total_char: 0,
    longest_line: ""
};
let completed = 0;

function check() {
    completed++;
    if (completed === 50) {
        totals.avarage = totals.avarage / 50;
        console.log(totals);
    }
}

for (let i = 0; i < 50; i++) {
    http.get("http://localhost:3000", res => {
        res.setEncoding("utf8");
        let data = "";

        res.on("data", respData => {
            data += respData;
        });


        res.on("end", () => {
            let parsed = JSON.parse(data);
            if (totals.max < parsed.response_time) {
                totals.max = parsed.response_time;
            }
            if (totals.min === null) {
                totals.min = parsed.response_time;
            }
            if (totals.min > parsed.response_time) {
                totals.min = parsed.response_time;
            }
            totals.avarage += parsed.response_time;
            /*
            I only took more than one retry.
             */
            totals.retry += parsed.total_retry > 1 ? parsed.total_retry : 0;
            totals.total_char += parsed.distinct_char_amount;
            if (totals.longest_line.length < parsed.longest_line.length) {
                totals.longest_line = parsed.longest_line;
            }

            for (const [key, value] of Object.entries(parsed.distinct_char_list)) {
                totals.char_list[key] = totals.char_list[key] ? totals.char_list[key] + value : value;
            }
            check();
        });

    });
}
