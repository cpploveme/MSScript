const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

function handler() {
    const content = fetch('https://www.iq.com/?lang=en_us', {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
        },
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });
    if (!content) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    }
    else if (get(get(content, "headers"), "X-Custom-Client-Ip", []).length !== 0) {
        return {
            text: '解锁(' + get(get(content, "headers"), "X-Custom-Client-Ip", [])[0].split(':')[1].replace('ntw', 'tw').replace('intl', '国际').toUpperCase() + ')',
            background: C_UNL,
        };
    }
    else if (get(content, "body").indexOf("mod\": \"") !== -1) {
        return {
            text: '解锁(' + get(content, "body").split("mod\": \"")[1].split("\"")[0].replace('ntw', 'tw').replace('intl', '国际').toUpperCase() + ')',
            background: C_UNL,
        };
    }
    else {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
}