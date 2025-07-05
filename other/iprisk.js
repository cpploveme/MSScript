const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

function handler() {
    const ipcontent = fetch('http://ip-api.com/json', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
        },
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });
    const ip = get(safeParse(get(ipcontent, "body")), "query");
    if (!ip) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else {
        const content = fetch("https://scamalytics.com/ip/" + ip, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            },
            noRedir: false,
            retry: 3,
            timeout: 5000,
        });
        if (!content || content.statusCode != 200) {
            return {
                text: 'N/A',
                background: C_NA,
            };
        } else {
            let risk = content.body.slice(content.body.indexOf("\"risk\":\"") + 8, content.body.indexOf("\",\n      \"is_blacklisted_external\"")).toUpperCase();
            let score = content.body.slice(content.body.indexOf("\"score\":\"") + 9, content.body.indexOf("\",\n      \"risk\":\""));
            if (risk.length > 10) {
                risk = "无";
            }
            if (score.length > 3) {
                score = "无";
            }
            return {
                text: risk + '(' + score + ')',
                background: '255,255,255',
            };
        }
    }
}
