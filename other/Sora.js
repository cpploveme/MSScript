const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

function handler() {
    const content = fetch('https://sora.com', {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "max-age=0",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
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
    } else if (content.body.indexOf('Sorry, you have been blocked') != -1) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    } else {
        const temp_content = fetch('https://sora.com/cdn-cgi/trace', {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
            },
            noRedir: false,
            retry: 3,
            timeout: 5000,
        });
        if (!temp_content) {
            return {
                text: 'N/A',
                background: C_NA,
            };
        } 
        return {
            text: '解锁(' + ((get(temp_content, "body") || "").trim().split('\n').filter(s => s.startsWith('loc='))[0] || 'loc=').substr(4) + ')',
            background: C_UNL,
        };
    }
}
