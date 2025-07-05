const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';
const C_WAIT = '250,213,149';

function handler()
{   const pre_content = fetch('https://chatgpt.com/favicon.ico',
    {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
        },
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });
    if (!pre_content)
    {
        return {
            text: 'N/A',
            background: C_NA,
        };
    }
    if (pre_content.body.includes("Unable to load site") || pre_content.body.includes("Sorry, you have been blocked") || pre_content.body.includes("You do not have access to ")) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
	const content = fetch('https://api.openai.com/compliance/cookie_requirements',
	{
        headers: {
            'authority': 'api.openai.com',
            'accept': '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'authorization': 'Bearer null',
            'content-type': 'application/json',
            'origin': 'https://platform.openai.com',
            'referer': 'https://platform.openai.com/',
            'sec-ch-ua': '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',

		},
		noRedir: false,
		retry: 3,
		timeout: 5000,
	});
	const content2 = fetch('https://ios.chat.openai.com/',
	{
		headers:
        {
            'authority': 'ios.chat.openai.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/' +
                      'signed-exchange;v=b3;q=0.7',
            'accept-language': 'zh-CN,zh;q=0.9',
            'sec-ch-ua': '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
        },
		noRedir: false,
		retry: 3,
		timeout: 5000,
	});
    const content3 = fetch('https://chat.openai.com/cdn-cgi/trace',
	{
		headers:
		{
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
		},
		noRedir: false,
		retry: 3,
		timeout: 5000,
	});
	if (!content || !content2 || !content3)
	{
		return {
			text: 'N/A',
			background: C_NA,
		};
	}
    text1 = content.body
    text2 = content2.body
    const result1 = text1.includes("unsupported_country");
    const result2 = text2.includes("VPN");
  
    if (!result2 && !result1 && text1 && text2) {
        return {
            text: '解锁(' + content3.body.slice(content3.body.indexOf('loc=') + 4, content3.body.indexOf('loc=') + 6) + ')',
            background: C_UNL,
        };
    } else if (result2 && result1) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    } else if (!result1 && result2 && text1) {
        return {
            text: '仅网页(' + content3.body.slice(content3.body.indexOf('loc=') + 4, content3.body.indexOf('loc=') + 6) + ')',
            background: C_WAIT,
        };
    } else if (result1 && !result2) {
        return {
            text: '仅应用(' + content3.body.slice(content3.body.indexOf('loc=') + 4, content3.body.indexOf('loc=') + 6) + ')',
            background: C_WAIT,
        };
    } else if (!text1 && result2) {
        return {
            text: '失败',
            background: C_FAIL,
        };
    } else {
		return {
			text: 'N/A',
			background: C_NA,
		};
    }
}