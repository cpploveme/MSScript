const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';

const customHeader = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    "Priority": "u=0, i",
    "Sec-Ch-Ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Model": '""',
    "Sec-Ch-Ua-Platform": "Windows",
    "Sec-Ch-Ua-Platform-Version": "10.0.0",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
};

function handler() {
    const content = fetch('https://www.netflix.com/title/81280792', {
        headers: customHeader,
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });

    if (!content) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (content.statusCode == 403) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
    const netflixJson = safeParse(get(content, "body").slice(get(content, "body").indexOf('netflix.reactContext = ') + 23, get(content, "body").indexOf(';</script><script>window.__public_path__')).replace(/\\x/g, '').replace(/\\u/g, ''));
    const isAvailable = get(netflixJson, 'models.nmTitleGQL.data.metaData.isAvailable', null);
    let region = get(netflixJson, 'models.geo.data.requestCountry.id', (get(content, "redirects", [])[0] || "").substr(24, 2) || 'us').toLocaleUpperCase();

    if (isAvailable === true) {
        return {
            text: '解锁(' + region + ')',
            background: C_UNL,
        };
    } else if (isAvailable === false) {
        return {
            text: '自制(' + region + ')',
        };
    } else if ((get(content, "redirects", [])[0] || "").indexOf("netflix") !== -1) {
        const content3 = fetch((get(content, "redirects", [])[0] || ""), {
            headers: customHeader,
            noRedir: false,
            retry: 3,
            timeout: 5000,
        });

        if (!content3) {
            return {
                text: 'N/A',
                background: C_NA,
            };
        } else if (content3.statusCode == 403) {
            return {
                text: '失败',
                background: C_FAIL,
            };
        }
        const netflixJson3 = safeParse(get(content3, "body").slice(get(content3, "body").indexOf('netflix.reactContext = ') + 23, get(content3, "body").indexOf(';</script><script>window.__public_path__')).replace(/\\x/g, ''));
        const isAvailable3 = get(netflixJson3, 'models.nmTitleGQL.data.metaData.isAvailable', null);
        region = get(netflixJson3, 'models.geo.data.requestCountry.id', (get(content, "redirects", [])[0] || "").substr(24, 2) || 'us').toLocaleUpperCase();
        if (isAvailable3 === true) {
            return {
                text: '解锁(' + region + ')',
                background: C_UNL,
            };
        } else if (isAvailable3 === false) {
            return {
                text: '自制(' + region + ')',
            };
        }
    }

    const content2 = fetch('https://www.netflix.com/title/70143836', {
        headers: customHeader,
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });

    if (!content2) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (content2.statusCode == 403) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
    const netflixJson2 = safeParse(get(content2, "body").slice(get(content2, "body").indexOf('netflix.reactContext = ') + 23, get(content2, "body").indexOf(';</script><script>window.__public_path__')).replace(/\\x/g, ''));
    const isAvailable2 = get(netflixJson2, 'models.nmTitleGQL.data.metaData.isAvailable', null);
    region = get(netflixJson2, 'models.geo.data.requestCountry.id', (get(content2, "redirects", [])[0] || "").substr(24, 2) || 'us').toLocaleUpperCase();
    if (isAvailable2 === true) {
        return {
            text: '解锁(' + region + ')',
            background: C_UNL,
        };
    } else if (isAvailable2 === false) {
        return {
            text: '自制(' + region + ')',
        };
    } else if ((get(content2, "redirects", [])[0] || "").indexOf("netflix") !== -1) {
        const content4 = fetch((get(content2, "redirects", [])[0] || ""), {
            headers: customHeader,
            noRedir: false,
            retry: 3,
            timeout: 5000,
        });

        if (!content4) {
            return {
                text: 'N/A',
                background: C_NA,
            };
        } else if (content4.statusCode == 403) {
            return {
                text: '失败',
                background: C_FAIL,
            };
        }
        const netflixJson4 = safeParse(get(content4, "body").slice(get(content4, "body").indexOf('netflix.reactContext = ') + 23, get(content4, "body").indexOf(';</script><script>window.__public_path__')).replace(/\\x/g, ''));
        const isAvailable4 = get(netflixJson4, 'models.nmTitleGQL.data.metaData.isAvailable', null);
        region = get(netflixJson4, 'models.geo.data.requestCountry.id', (get(content2, "redirects", [])[0] || "").substr(24, 2) || 'us').toLocaleUpperCase();
        if (isAvailable4 === true) {
            return {
                text: '解锁(' + region + ')',
                background: C_UNL,
            };
        } else if (isAvailable4 === false) {
            return {
                text: '自制(' + region + ')',
            };
        } else if (content.statusCode == 404 || content2.statusCode == 404) {
            return {
                text: '自制(' + region + ')',
            };
        } else if (get(content, "body").include("Oh no!") && get(content2, "body").include("Oh no!")) {
            return {
                text: '自制(' + region + ')',
            };
        } else {
            return {
                text: '未知',
                background: C_UNK,
            };
        }
    } else if (content.statusCode == 404 || content2.statusCode == 404) {
        return {
            text: '自制(' + region + ')',
        };
    } else if (get(content, "body").include("Oh no!") && get(content2, "body").include("Oh no!")) {
        return {
            text: '自制(' + region + ')',
        };
    } else {
        return {
            text: '未知',
            background: C_UNK,
        };
    }
}