export default async function (base64) {
  let token = await getQiniuToken();
  return new Promise((resolve, reject) => {
    let size = -1;
    let pic = base64;           //  填写你的base64后的字符串
    let url = "https://up.qiniup.com/putb64/" + size + '/key/' + window.btoa("0612_" + new Date().getTime()
      + "_" + parseInt(Math.random() * 10));
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        let back_json = JSON.parse(xhr.responseText);
        let qrUrl = `http://desrc.lljiankang.top/${back_json.key}`;
        resolve(qrUrl)
      }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Authorization", `UpToken ${token}`);
    xhr.send(pic);
  });
}

function getQiniuToken() {
  return new Promise((resolve, reject) => {
    _request({
      baseURL: Vue._GLOBAL.comApi,
      url: 'uploadToken'
    }).then(({data: {ret: token}}) => {
      resolve(token)
    });
  })
}
