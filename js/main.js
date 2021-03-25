"strict-mode";

var names = [];
var codes = [];
let selected_site_name = [];
let ES_site = [];
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
  let seperated_sites_arr = codesite.split(" ");
  ES_er(seperated_sites_arr);
  function ES_er(arraye) {
    for (let j = 0; j < arraye.length; j++) {
      ES_site[j] = `ES${arraye[j]}`;
    }
  }
  $.getJSON("data.json", function (json) {
    let jsonlen = Object.keys(json).length;
    for (let i = 0; i < jsonlen; i++) {
      names[i] = json[i].name;
      codes[i] = json[i].code;
      // if (ES_site == codes[i]) {
      //   selected_site_name = names[i];
      //   break;
      // }
      // }
      // if (!selected_site_name) {
      //   selected_site_name = "کد سایت اشتباه/ناموجود";
    }
    name_searcher(ES_site, names, codes);
    text_maker(ES_site, selected_site_name);
  });
});
function name_searcher(input_codesites, name_database, code_database) {
  for (let a = 0; a < input_codesites.length; a++) {
    //loop through input sites
    for (let b = 0; b < code_database.length; b++) {
      // console.log(input_codesites[a], code_database[b]);
      if (input_codesites[a] == code_database[b]) {
        selected_site_name[a] = name_database[b];
      }
    }
  }
}
function text_maker(cs, ssn) {
  alarm_name = document.getElementById("alarminput").value;
  //I need to save sites here in a template literal somehow...
  let str = "";
  site_list = `${(function fun() {
    for (let i = 0; i < ssn.length; i++) {
      str += `${ssn[i]}(${cs[i]})\n`;
    }
    return str;
  })()}`;
  let alarm_text = `${today}
${site_list}آلارم: ${alarm_name}
زمان: ${alarmtime}
گزارش به ${reportedto}
مانیتورینگ: ${monitoring}
`;
  document.getElementById("pre_modal").innerHTML = alarm_text;
  $("#myModal").modal();
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
