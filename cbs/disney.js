const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';
const C_WAIT = '250,213,149';

const UA_SEC_CH_UA = '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"'
const UA_BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

const Auth_Bear = 'Bearer ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84'
const Media_Cookie = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Atoken-exchange&latitude=0&longitude=0&platform=browser&subject_token=DISNEYASSERTION&subject_token_type=urn%3Abamtech%3Aparams%3Aoauth%3Atoken-type%3Adevice';
const Fake_Content = '{"query":"mutation refreshToken($input: RefreshTokenInput!) {refreshToken(refreshToken: $input) {activeSession {sessionId}}}","variables":{"input":{"refreshToken":"ILOVEDISNEY"}}}';

function handler() {
    const assertionToken = fetch('https://disney.api.edge.bamgrid.com/devices', {
        method: 'POST',
        headers: {
            'Authorization': Auth_Bear,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': UA_BROWSER
        },
        body: JSON.stringify({
            deviceFamily: 'browser',
            applicationRuntime: 'chrome',
            deviceProfile: 'windows',
            attributes: {}
        }),
        noRedir: true,
        retry: 3,
        timeout: 5000,
    });
    if (!assertionToken) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (assertionToken.statusCode === 403 || assertionToken.body.indexOf('403 ERROR') !== -1) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }

    const tokenContent = fetch('https://disney.api.edge.bamgrid.com/token', {
        method: 'POST',
        headers: {
            'Authorization': Auth_Bear,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': UA_BROWSER
        },
        body: Media_Cookie.replace('DISNEYASSERTION', get(safeParse(get(assertionToken, "body")), "assertion", "")),
        noRedir: true,
        retry: 3,
        timeout: 5000,
    });
    if (!tokenContent) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (tokenContent.body.indexOf('forbidden-location') !== -1 || tokenContent.body.indexOf('403 ERROR') !== -1) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
    const content = fetch('https://disney.api.edge.bamgrid.com/graph/v1/device/graphql', {
        method: 'POST',
        headers: {
            'Authorization': Auth_Bear,
            'User-Agent': UA_BROWSER
        },
        body: Fake_Content.replace('ILOVEDISNEY', get(safeParse(get(tokenContent, "body")), "refresh_token", "")),
        noRedir: true,
        retry: 3,
        timeout: 5000,
    });
    if (!content) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    }

    const previewcheck = fetch('https://disneyplus.com', {
        headers: {
            'User-Agent': UA_BROWSER
        },
        noRedir: true,
        retry: 3,
        timeout: 5000,
    });
    if (!previewcheck) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    }

    const region = get(safeParse(get(content, "body")), "extensions.sdk.session.location.countryCode", "").toLocaleUpperCase();
    const inSupportedLocation = get(safeParse(get(content, "body")), "extensions.sdk.session.inSupportedLocation");
    const isUnavailable = previewcheck.body.includes('preview') || previewcheck.body.includes('unavailable');

    if (!region) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    } else if (region == 'JP') {
        return {
            text: '解锁(JP)',
            background: C_UNL,
        };
    } else if (isUnavailable) {
        return {
            text: '失败(' + region + ')',
            background: C_FAIL,
        };
    } else if (inSupportedLocation === false) {
        return {
            text: '待解锁(' + region + ')',
            background: C_WAIT,
        };
    } else if (inSupportedLocation === true) {
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
}
