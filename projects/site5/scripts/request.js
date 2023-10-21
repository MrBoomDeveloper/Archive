function reqListener () {
  alert(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", "main.js", true);
oReq.send();