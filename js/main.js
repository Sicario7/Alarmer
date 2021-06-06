"strict-mode";
var names = [];
var codes = [];
let selected_site_name = [];
let ES_site = [];
let alarmtime = document.getElementById("timesel").value;
let reportedto = document.getElementById("rep_to").value;
let monitoring = document.getElementById("monitoring").value;
let more_inf = document.getElementById("more").value;

// convert persian digits [۰۱۲۳۴۵۶۷۸۹]
// var persianNumbers = [
//   /۰/g,
//   /۱/g,
//   /۲/g,
//   /۳/g,
//   /۴/g,
//   /۵/g,
//   /۶/g,
//   /۷/g,
//   /۸/g,
//   /۹/g,
// ];
// function fixNumbers(str) {
//   if (typeof str === "string") {
//     for (var i = 0; i < 10; i++) {
//       str = str.replace(persianNumbers[i], i);
//     }
//   }
//   return str;
// }
//auto-complete of alarms field
$(function () {
  var alarmtags = [
    "Ac Fail",
    "قطعی سایت",
    "ریست سایت",
    "Ac Fail - Module Fail",
    "Module Fail",
    "Module Fail>2",
    "Ac Fail - Module Fail - Module Fail>2",
    "RF Unit Maintenance Link Failure",
    "High Temperature",
    "NE Is Disconnected",
    "Power supply DC Output Out Of Range",
    "Low Battery",
    "Door Open",
    "Battery Low Voltage",
    "ریست GSM",
    "ریست LTE",
    "Cell Logical Channel Failure",
    "VSWR - BAND:XXXX - SECTOR:Y - MAIN/DIVER - Value: X.Y",
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
    "آقای ایزدی",
  ];
  var moretags = [
    "قطعی برق منطقه",
    "PM-SITE",
    "در حال پیگیری",
    "ناپایداری لینک انتقال",
    "اعزام کارشناس",
    "CR#Number - موضوع - از ساعت XX الی YY - انجام دهنده: XXXX",
  ];
  $("#alarminput").autocomplete({
    source: alarmtags,
  });
  $("#rep_to").autocomplete({
    source: nametags,
  });
  $("#more").autocomplete({
    source: moretags,
  });
});
let seperated_sites_arr = [];
document.getElementById("copybutton").addEventListener("click", function () {
  document.getElementById("copybutton").textContent = "کپی شد!";
});

document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("site_code").value = "";
  document.getElementById("alarminput").value = "";
  document.getElementById("timesel").value = "";
  document.getElementById("more").value = "";
  document.getElementById("rep_to").value = "";
  document.getElementById("monitoring").value = "";
});
// when clicking preview button:
document.getElementById("preview").addEventListener("click", function () {
  alarmtime = document.getElementById("timesel").value;
  codesite = document.getElementById("site_code").value;
  reportedto = document.getElementById("rep_to").value;
  monitoring = document.getElementById("monitoring").value;
  more_inf = document.getElementById("more").value;
  seperated_sites_arr = codesite.trim().split(/\s+/);
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
    }
    //Checks site codes and returns corresponding names
    name_searcher(ES_site, names, codes);
    text_maker(ES_site, selected_site_name);
  });
});
function name_searcher(input_codesites, name_database, code_database) {
  for (let a = 0; a < input_codesites.length; a++) {
    for (let b = 0; b < code_database.length; b++) {
      if (input_codesites[a] == code_database[b]) {
        selected_site_name[a] = name_database[b];
      } else {
        if (!selected_site_name[a]) {
          selected_site_name[a] = "کد سایت اشتباه/ناموجود⭐";
        }
      }
    }
  }
}

function text_maker(cs, ssn) {
  let today = new Date()
    .toLocaleDateString("fa-IR")
    .replace(/([۰-۹])/g, (token) =>
      String.fromCharCode(token.charCodeAt(0) - 1728)
    );
  seperator = today.split("/");
  today = `${seperator[0]}/${seperator[1].padStart(
    2,
    "0"
  )}/${seperator[2].padStart(2, "0")}`;

  alarm_name = document.getElementById("alarminput").value;
  let str = "";
  site_list = `${(function nametocode_appender() {
    for (let i = 0; i < ssn.length; i++) {
      str += `${ssn[i]} - ${seperated_sites_arr[i]}\n`;
    }
    return str;
  })()}`;
  //want inf?!
  info_list = `${(function info_visibility() {
    if (!more_inf) {
      //when no inf
      return "";
    } else {
      return `شرح: ${more_inf}\n`;
    }
  })()}`;
  reportedto = `${(function reportedto_visibility() {
    if (!reportedto) {
      //when no reporting
      return "";
    } else {
      return `گزارش به ${reportedto}\n`;
    }
  })()}`;
  //////////////////////////////////////////////////
  siteha = `${(function siteha() {
    printing_sites = seperated_sites_arr.length;
    if (printing_sites < 2) {
      return "";
    } else {
      return `سایت های:\n`;
    }
  })()}`;
  ////////////////////////////////////////////////
  if (!codesite.trim()) {
    site_list = "کدسایتی وارد نشده است !🤐\n";
  }
  let alarm_text = `${today}\n${siteha}${site_list}آلارم: ${alarm_name}
زمان: ${alarmtime}
${info_list}${reportedto}مانیتورینگ: ${monitoring}
`;
  document.getElementById("pre_modal").textContent = alarm_text;
  document.getElementById("copybutton").textContent = "کپی!";
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
  clear_cache();
  function clear_cache() {
    selected_site_name.length = 0;
    ES_site.length = 0;
  }
}
