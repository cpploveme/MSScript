const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';
const C_CN = '250,213,149';

function retryytb() {
    const content = fetch('https://www.youtube.com/premium', {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"131.0.6778.86\", \"Chromium\";v=\"131.0.6778.86\", \"Not_A Brand\";v=\"24.0.0.0\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"10.0.0\"",
            "sec-ch-ua-wow64": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
        noRedir: false,
        retry: 0,
        timeout: 5000,
    });

    if (!content || !content.body) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (content.statusCode == 302) {
        return {
            text: `解锁(重定向)`,
            background: C_UNL,
        };
    } else {
        const body = content.body;

        if (/www.google.cn/.test(body)) {
            return {
                text: `送中(CN)`,
                background: C_CN,
            };
        }

        let region = '未知';
        if (/"countryCode":"(.*?)"/.test(body)) {
            region = body.match(/"countryCode":"(.*?)"/)[1];
            return {
                text: `解锁(${region.toUpperCase()})`,
                background: C_UNL,
            };
        }
        if (
            /YouTube and YouTube Music ad-free, offline, and in the background/.test(
                body
            )
        ) {
            return {
                text: `解锁(US)`,
                background: C_UNL,
            };
        }
        if (/Premium is not available in your country/.test(body)) {
            return {
                text: '失败',
                background: C_FAIL,
            };
        }
        if (/"INNERTUBE_CONTEXT_GL"\s{0,}:\s{0,}"\K[^"]+"/.test(body)) {
            region = body.match(/"INNERTUBE_CONTEXT_GL"\s{0,}:\s{0,}"\K[^"]+"/)[1];
            return {
                text: `解锁(${region.toUpperCase()})`,
                background: C_UNL,
            };
        }
        return {
            text: `解锁(${region.toUpperCase()})`,
            background: C_UNK,
        };
    }
}

function handler() {
    const content = fetch('https://www.youtube.com/premium', {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cookie": "YSC=BiCUU3-5Gdk; CONSENT=YES+cb.20220301-11-p0.en+FX+700; GPS=1; VISITOR_INFO1_LIVE=4VwPMkB7W5A; PREF=tz=Asia.Shanghai; _gcl_au=1.1.1809531354.1646633279",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"131.0.6778.86\", \"Chromium\";v=\"131.0.6778.86\", \"Not_A Brand\";v=\"24.0.0.0\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"10.0.0\"",
            "sec-ch-ua-wow64": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });

    if (!content || !content.body) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (content.statusCode == 302) {
        return {
            text: `解锁(重定向)`,
            background: C_UNL,
        };
    } else {
        const body = content.body;

        if (/www.google.cn/.test(body)) {
            return {
                text: `送中(CN)`,
                background: C_CN,
            };
        }

        let region = '未知';
        if (/"countryCode":"(.*?)"/.test(body)) {
            region = body.match(/"countryCode":"(.*?)"/)[1];
            return {
                text: `解锁(${region.toUpperCase()})`,
                background: C_UNL,
            };
        }
        if (
            /YouTube and YouTube Music ad-free, offline, and in the background/.test(
                body
            )
        ) {
            return {
                text: `解锁(US)`,
                background: C_UNL,
            };
        }
        if (/Premium is not available in your country/.test(body)) {
            return {
                text: '失败',
                background: C_FAIL,
            };
        }
        if (/"INNERTUBE_CONTEXT_GL"\s{0,}:\s{0,}"\K[^"]+"/.test(body)) {
            region = body.match(/"INNERTUBE_CONTEXT_GL"\s{0,}:\s{0,}"\K[^"]+"/)[1];
            return {
                text: `解锁(${region.toUpperCase()})`,
                background: C_UNL,
            };
        }
        return retryytb();
    }
}
