const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

function handler() {
    const content1 = fetch('https://copilot.microsoft.com/c/api/user', {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
        },
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });
    if (!content1) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    }
    let region = get(safeParse(get(content1, "body")), "regionCode", null);
    if (!region) {
        const content2 = fetch('https://copilot.microsoft.com/?toWww=1&showconv=1', { // https://www.bing.com/chat?toWww=1
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            },
            noRedir: false,
            retry: 3,
            timeout: 5000,
        });
        if (!content2) {
            return {
                text: 'N/A',
                background: C_NA,
            };
        }
        region = content2.body.slice(content2.body.indexOf('{Region:\"') + 9, content2.body.indexOf('\",Lang:\"'));
    }

    if (content1.body.indexOf('DOCTYPE') === -1 && content1.statusCode === 200) {
        if (region.length > 2) {
            return {
                text: '解锁',
                background: C_UNL,
            };
        }
        return {
            text: '解锁(' + region + ')',
            background: C_UNL,
        };
    } else {
        if (region.length > 2) {
            return {
                text: '失败',
                background: C_FAIL,
            };
        }
        return {
            text: '失败(' + region + ')',
            background: C_FAIL,
        };
    }
}