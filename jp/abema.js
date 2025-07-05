const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';
const C_WAIT = '255,213,128';

function handler() {
    const content = fetch('https://api.abema.io/v1/ip/check?device=android', {
        headers: {
            'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; ALP-AL00 Build/HUAWEIALP-AL00)',
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
        let res = JSON.parse(content.body)
        if (res.isoCountryCode == 'JP') {
            return {
                text: '本土解锁(JP)',
                background: C_UNL,
            };
        } else {
            return {
                text: '海外解锁(' + res.isoCountryCode + ')',
                background: C_WAIT,
            };
        }
    } else {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
}
