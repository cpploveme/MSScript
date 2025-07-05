const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

const claudeSupportedRegions = [
    "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ",
    "BS", "BH", "BD", "BB", "BE", "BZ", "BJ", "BT", "BO", "BA",
    "BW", "BR", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV",
    "TD", "CL", "CO", "KM", "CG", "CR", "HR", "CZ", "DK", "DJ",
    "DM", "DO", "TL", "EC", "EG", "SV", "GQ", "EE", "SZ", "FJ",
    "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT",
    "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IQ",
    "IE", "IL", "IT", "CI", "JM", "JP", "JO", "KZ", "KE", "KI",
    "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LI", "LT", "LU",
    "MG", "MW", "MY", "MV", "MT", "MP", "MH", "MR", "MU", "MX",
    "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "NA", "NR", "NP",
    "NL", "NZ", "NE", "NG", "NO", "OM", "PK", "PW", "PS", "PA",
    "PG", "PY", "PE", "PH", "PL", "PT", "QA", "CY", "RO", "RW",
    "KN", "LC", "VC", "AS", "SM", "ST", "SA", "SN", "RS", "SC",
    "SL", "SG", "SK", "SI", "SB", "ZA", "KR", "ES", "LK", "SR",
    "SE", "CH", "TW", "TJ", "TZ", "TH", "TG", "TO", "TT", "TN",
    "TR", "TM", "TV", "UG", "UA", "AE", "GB", "UM", "UY", "UZ",
    "US", "VU", "VA", "VN", "ZM", "ZW"
];

function handler() {
    const content = fetch('https://claude.ai/chats?utm_source=landing_page_linkedin', {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
        },
        ults: true,
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });
    if (!content) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (content.statusCode >= 300 && content.statusCode < 400) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    } else if (content.body.indexOf('Just a moment...') !== -1 || content.statusCode === 403) {
        const content2 = fetch('https://claude.ai/cdn-cgi/trace', {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
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
        let region = (content2.body.split('\n').filter(s => s.startsWith('loc='))[0] || 'loc=').substr(4);
        if (claudeSupportedRegions.includes(region)) {
            return {
                text: '解锁(' + region + ')',
                background: C_UNL,
            };
        } else {
            return {
                text: '失败(' + region + ')',
                background: C_FAIL,
            };
        }
    } else if (content.body.indexOf('App unavailable') === -1) {
        return {
            text: '解锁(' + content.body.slice(content.body.indexOf('\\"ipCountry\\":\\"') + 16, content.body.indexOf('\\"ipCountry\\":\\"') + 18) + ')',
            background: C_UNL,
        };
    } else {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
}