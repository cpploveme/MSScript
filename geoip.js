// This script is modified from the official koipy script

const HEADER = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
};
const RETRY = 1;
const TIMEOUT = 3000;

let is_weiyi_ip_cache = null;

function remove_position(txt) {
    return txt.replace("县", "").replace("区", "").replace("市", "").replace("省", "").replace("中国", "").replace("亚洲", "").replace("亚太地区", "").replace("China", "").split('/')[0].split('(')[0].trim()
}

function is_weiyi(ip) {
    if (is_weiyi_ip_cache) {
        return is_weiyi_ip_cache;
    }
    const weiyi_prefix = ['45.114.40.', '43.255.192.', '103.53.248', '103.5.54.', '103.5.52.']
    const part_three = parseInt(ip.split('.')[2], 10);
    if (ip.startsWith('211.99.') && part_three >= 99 && part_three <= 127) {
        is_weiyi_ip_cache = true;
        return true;
    }
    if (ip.startsWith('42.157.') && part_three >= 128 && part_three <= 255) {
        is_weiyi_ip_cache = true;
        return true;
    }
    for (const temp_prefix of weiyi_prefix) {
        if (ip.startsWith(temp_prefix)) {
            is_weiyi_ip_cache = true;
            return true;
        }
    }
    is_weiyi_ip_cache = false;
    return false;
}

function ip_resolve_cf() {
    const endpoints = ["https://1.1.1.1/cdn-cgi/trace", "https://[2606:4700:4700::1111]/cdn-cgi/trace", "https://www.cloudflare.com/cdn-cgi/trace"];
    const ret = [];
    for (let i = 0; i < endpoints.length; i++) {
        const url = endpoints[i];
        const content = (get(fetch(url, {
            headers: HEADER,
            retry: 1,
            timeout: TIMEOUT,
        }), "body") || "").trim();

        const ip = (content.split('\n').filter(s => s.startsWith('ip='))[0] || 'ip=').substr(3);
        if (ip) ret.push(ip);
    }
    return ret;
}

// 支持 v4 + v6
function handler_ipsb(ip) {
    const content = fetch("https://api.ip.sb/geoip/" + ip, {
        headers: HEADER,
        retry: RETRY,
        timeout: TIMEOUT
    })
    return safeParse(get(content, "body"));
}

// 支持 v4 + v6
function handler_ipleak(ip) {
    const content = fetch(`https://ipleak.net/json/${ip}`, {
        headers: HEADER,
        retry: RETRY,
        timeout: TIMEOUT,
    });
    const ret = safeParse(get(content, "body"));
    return {
        "ip": get(ret, "ip", ip),
        "isp": get(ret, "isp_name", ""),
        "organization": get(ret, "isp_name", ""),
        "latitude": get(ret, "latitude", 0),
        "longitude": get(ret, "longitude", 0),
        "asn": parseInt(get(ret, "as_number", 0), 10) || 0,
        "asn_organization": get(ret, "isp_name", ""),
        "timezone": get(ret, "time_zone", ""),
        "region": get(ret, "region_code", ""),
        "city": get(ret, "city_name", ""),
        "continent_code": get(ret, "continent_code", ""),
        "country": get(ret, "country_name", ""),
        "country_code": get(ret, "country_code", ""),
    }
}

// 支持 v4 + v6
function handler_ipapi(ip) {
    const content = fetch(`http://ip-api.com/json/${ip}?lang=en-US`, {
        headers: HEADER,
        retry: 3,
        timeout: TIMEOUT,
    });
    const ret = safeParse(get(content, "body"));
    const asInfo = get(ret, "as", "").split(" ");
    const asn = (asInfo.shift() || "").substr(2);
    const asnorg = asInfo.join(" ");

    return {
        "ip": get(ret, "query", ip),
        "isp": get(ret, "isp", ""),
        "organization": get(ret, "org", ""),
        "latitude": get(ret, "lat", 0),
        "longitude": get(ret, "lon", 0),
        "asn": parseInt(asn, 10) || 0,
        "asn_organization": asnorg,
        "timezone": get(ret, "timezone", ""),
        "region": get(ret, "region", ""),
        "city": get(ret, "city", ""),
        "country": get(ret, "country", ""),
        "country_code": get(ret, "countryCode", ""),
    }
}

// 支持 详细地区
function geoip_cn_findmyip(ip) {
    const content = fetch('https://findmyip.net/api/ipinfo.php?ip=' + ip, {
        headers: HEADER,
        retry: RETRY,
        timeout: TIMEOUT,
    });
    if (!content) {
        return ''
    }
    if (content.statusCode !== 200) {
        return '';
    }
    const ipdata = safeParse(get(content, "body"));

    const API_1 = get(ipdata, "data.API_1", "");
    const API_2 = get(ipdata, "data.API_2", "");
    const api_info = Object.keys(API_1).length ? API_1 : API_2;

    const a1 = remove_position(get(api_info, "province", ""));
    const a2 = remove_position(get(api_info, "city", ""));
    const a3 = remove_position(get(api_info, "county", ""));
    const a4 = remove_position(get(api_info, "isp", ""));

    let region = a1;
    if (a1 != a2) {
        region += a2;
    }
    region += a3;
    if (a4) {
        region += ` ${a4.split('/')[0].split('&')[0]}`;
    }
    findmyip_cache = region;
    return region;
}

function geoip_cn_zeroteam(ip) {
    const resp = fetch('https://api.zeroteam.top/geo_ip?ip=' + ip, {
        headers: HEADER,
        retry: RETRY,
        timeout: TIMEOUT,
    });
    const ret = get(safeParse(get(resp, "body")), "Data", {});
    const region = remove_position((get(ret, "Area", "").includes('亚太') ? "" : get(ret, "Area", "") + " ") + get(ret, "ISP", ""));
    return region;
}

// Thanks to myself for providing the API
function geoip_cn_ipip(ip) {
    const resp = fetch('https://api.proxy.ipip.sh/ipv4?ip=' + ip, {
        headers: HEADER,
        retry: RETRY,
        timeout: TIMEOUT,
    });
    const ret = get(safeParse(get(resp, "body")), "ip_info", {});
    const a1 = remove_position(get(ret, "prov", ""))
    const a2 = remove_position(get(ret, "city", ""))
    const region = (a1 == a2 ? a1 : a1 + a2) + " " + remove_position(get(ret, "isp", ""));
    return region;
}

const geoip_handler_array = [handler_ipsb, handler_ipapi, handler_ipleak];
let geoip_cn_array = [geoip_cn_zeroteam, geoip_cn_findmyip, geoip_cn_ipip];

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // exchange shuffledArray[i] and shuffledArray[j]
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

function get_random_geoip() {
    const i = Math.floor(Math.random() * geoip_cn_array.length);
    const func = geoip_cn_array[i];
    return func
}

function handler(ip) {
    let ret = {};
    for (const handler_func of geoip_handler_array) {
        ret = handler_func(ip);
        if (ret && ret.ip && ret.asn_organization && get(ret, "asn", 0)) {
            break;
        }
    }

    if (ret) {
        if (ret.country_code && ret.country_code.trim().toUpperCase() !== "CN") {
            ret.country_code += "国际入口";
            return ret;
        }
        const randomized = shuffleArray(geoip_cn_array);
        for (const handler_func of randomized) {
            region2 = handler_func(ip);
            if (region2) {
                console.log(region2)
                region2 = remove_position(region2);
                ret.country_code += region2;
                if (is_weiyi(ret.ip)) {
                    ret.country_code = ret.country_code.split(' ')[0] + ' 唯一';
                }
                return ret;
            }
        }

    }
    return ret;
}