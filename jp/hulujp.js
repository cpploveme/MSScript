const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

function handler() {
    const content = fetch('https://id.hulu.jp', {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
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
    } else if (content.statusCode == 200) {
        if (content.redirects[0].indexOf('restrict') > 0) {
            return {
                text: '失败',
                background: C_FAIL,
            };
        } else {
            return {
                text: '解锁',
                background: C_UNL,
            };
        }

    } else {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
}
