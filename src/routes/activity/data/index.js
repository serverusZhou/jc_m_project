var imgUrls = {
    '100017': {
        '韦杰': '../../public/annualMeeting/img_wj.png',
        '金诚集团': '../../public/annualMeeting/img_jcjt.png',
        '金诚新城镇': '../../public/annualMeeting/img_jcxcz.png',
        '金诚财富': '../../public/annualMeeting/img_jccf.png',
        '有象视频': '../../public/annualMeeting/img_yxsp.png',
        '金诚酒店集团': '../../public/annualMeeting/img_jcty.png',
        '金诚教育': '../../public/annualMeeting/img_jcjy.png',
        '金诚慈善': '../../public/annualMeeting/img_jccs.png',
        '仿佛': '../../public/annualMeeting/img_ff.png',
    },
};
let IMG_TITLE = function imgTitle(id, str) {
    let idx = str.indexOf('：');
    let tit = str.slice(0, idx);
    let nId = id.toString();
    return imgUrls[nId][tit];
};
export { IMG_TITLE };