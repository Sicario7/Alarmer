"strict-mode";

var names = [];
var codes = [];
let selected_site_name;
let ES_site;
let today = new Date()
  .toLocaleDateString("fa-IR")
  .replace(/([۰-۹])/g, (token) =>
    String.fromCharCode(token.charCodeAt(0) - 1728)
  );
let alarmtime = document.getElementById("timesel").value;
let codesite = document.getElementById("site_code").value;
let reportedto = document.getElementById("rep_to").value;
let monitoring = document.getElementById("monitoring").value;
// document.getElementById("submitb").addEventListener("click", function () {});
// End of btn click actions
//auto-complete of alarms field
$(function () {
  var alarmtags = [
    "Ac Fail",
    "قطعی سایت",
    "ریست سایت",
    "Module Fail",
    "Module Fail>2",
    "Ac Fail - Module Fail - Module Fail>2",
    "Rf Unit Maintenance Link Failure",
    "High Tempereture",
    "NE Is Disconnected",
    "Power supply DC Output Out Of Range",
    "Low Battery",
    "Door Open",
  ];
  var nametags = [
    "آقای کاوه",
    "آقای شاهمرادی",
    "خانم خدابخشیان",
    "آقای نیری",
    "آقای یزدانپرست",
    "آقای زیباکلام",
    "آقای مصری پور",
    "آقای سرائیان",
    "آقای عرب",
    "آقای قربانی",
    "آقای نصیری",
    "آقای جنگروی",
    "آقای هدایتی",
    "آقای فریدونی",
    "آقای خوانساری",
    "آقای علیزاده",
  ];
  $("#alarminput").autocomplete({
    source: alarmtags,
  });
  $("#rep_to").autocomplete({
    source: nametags,
  });
});
// when clicking preview button:
document.getElementById("preview").addEventListener("click", function () {
  alarmtime = document.getElementById("timesel").value;
  codesite = document.getElementById("site_code").value;
  reportedto = document.getElementById("rep_to").value;
  monitoring = document.getElementById("monitoring").value;
  ES_site = `ES${codesite}`;
  $.getJSON("data.json", function (json) {
    let jsonlen = Object.keys(json).length;
    for (let i = 0; i < jsonlen; i++) {
      names[i] = json[i].name;
      codes[i] = json[i].code;
      if (ES_site == codes[i]) {
        selected_site_name = names[i];
        break;
      }
    }
    if (!selected_site_name) {
      selected_site_name = "کد سایت اشتباه/ناموجود";
    }
    text_maker(codesite, selected_site_name);
  });
});
function text_maker(cs, ssn) {
  alarm_name = document.getElementById("alarminput").value;
  let alarm_text = `${today}
نام سایت: ${ssn}
کدسایت: ${cs}
آلارم: ${alarm_name}
زمان: ${alarmtime}
گزارش به ${reportedto}
مانیتورینگ: ${monitoring}
`;
  console.log(alarm_text);
  document.getElementById("pre_modal").innerHTML = alarm_text;
  $("#myModal").modal();
  console.log(alarm_text);
  const copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  copyToClipboard(alarm_text);
}
