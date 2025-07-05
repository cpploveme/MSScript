const C_NA = '142,140,142';
const C_UNL = '186,230,126';
const C_FAIL = '239,107,115';
const C_UNK = '92,207,230';
const C_WAIT = '255,213,128';

function handler() {
    const randomSession = randomString(32)
    const bilibiliTaiwanContent = fetch('https://api.bilibili.com/pgc/player/web/playurl?avid=50762638&cid=100279344&qn=0&type=&otype=json&ep_id=268176&fourk=1&fnver=0&fnval=16&session=' + randomSession + '&module=bangumi', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
        },
        noRedir: false,
        retry: 3,
        timeout: 5000,
    });

    if (!bilibiliTaiwanContent) {
        return {
            text: 'N/A',
            background: C_NA,
        };
    } else if (bilibiliTaiwanContent.statusCode == 200) {
        const bilibiliTaiwanContentData = safeParse(get(bilibiliTaiwanContent, "body", "{}"))
        if (bilibiliTaiwanContentData.code == 0) {
            return {
                text: '解锁(台湾地区)',
                background: C_UNL,
            };
        } else {
            const bilibiliHMTContent = fetch('https://api.bilibili.com/pgc/player/web/playurl?avid=18281381&cid=29892777&qn=0&type=&otype=json&ep_id=183799&fourk=1&fnver=0&fnval=16&session='+randomSession+'&module=bangumi', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
                },
                noRedir: false,
                retry: 3,
                timeout: 5000,
            });

            if (!bilibiliHMTContent) {
                return {
                    text: 'N/A',
                    background: C_NA,
                };
            } else {
                const bilibiliHMTContentData = safeParse(get(bilibiliHMTContent, "body", "{}"))
                if (bilibiliHMTContentData.code == 0) {
                    return {
                        text: '解锁(港澳台地区)',
                        background: C_UNL,
                    };
                } else {
                    return {
                        text: '失败',
                        background: C_FAIL,
                    };
                }
            }
        }
    } else {
        return {
            text: '失败',
            background: C_FAIL,
        };
    }
}


function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}
