const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

function handler() {
    const content = fetch('https://www.viu.com', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
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
    } else if (JSON.stringify(get(content, "history", {})).indexOf('no-service') !== -1 || JSON.stringify(get(content, "redirects", {})).indexOf('no-service') !== -1) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
    const content2 = fetch('https://d3o7oi00quuwqu.cloudfront.net', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
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
    } else if (content2.body.indexOf('block access') == -1) {
        return {
            text: '解锁(' + (JSON.stringify(get(content, "redirects", {})).substr(26, 2) || '未知').toLocaleUpperCase() + ')',
            background: C_UNL,
        };
    } else {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
}
