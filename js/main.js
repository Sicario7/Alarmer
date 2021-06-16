"strict-mode";
const names = [],
  codes = [];
let selected_site_name = [];
let ES_site = [];
let alarm_text;
let codeNOES = [];
// Can I delete this part?
// let alarmtime = document.getElementById("timesel").value;
// let reportedto = document.getElementById("rep_to").value;
// let monitoring = document.getElementById("monitoring").value;
// let more_inf = document.getElementById("more").value;

// Is it possible to read data in here?!
$.getJSON("data.json", function (json) {
  for (let i = 0; i < Object.keys(json).length; i++) {
    names[i] = json[i].name;
    codes[i] = json[i].code;
  }
});
///////////////////////////////
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
    "VSWR - BAND:BBBB - SECTOR:Y - MAIN/DIVER - Value: X.Y",
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
///////////////////////////////
const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  console.log("Done");
};
document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("site_code").value = "";
  document.getElementById("alarminput").value = "";
  document.getElementById("timesel").value = "";
  document.getElementById("more").value = "";
  document.getElementById("rep_to").value = "";
});
// when clicking preview button:
document.getElementById("preview").addEventListener("click", function () {
  alarmtime = document.getElementById("timesel").value;
  codesite = document.getElementById("site_code").value;
  reportedto = document.getElementById("rep_to").value;
  monitoring = document.getElementById("monitoring").value;
  more_inf = document.getElementById("more").value;
  codeNOES = codesite.trim().split(/\s+/);
  ES_site = codeNOES.map((site) => `ES${site}`);

  //Checks site codes and returns corresponding names
  name_searcher(ES_site, names, codes);
  //creates text
  text_maker();
  // });
});
// Better solution:
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
function text_maker() {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  const today = Intl.DateTimeFormat("fa-IR", options).format(new Date());

  //second, more campatible implemention
  // let today = new Date()
  //   .toLocaleDateString("fa-IR", options)
  //   .replace(/([۰-۹])/g, (token) =>
  //     String.fromCharCode(token.charCodeAt(0) - 1728)
  //   );
  // seperator = today.split("/");
  // today = `${seperator[0]}/${seperator[1].padStart(
  //   2,
  //   "0"
  // )}/${seperator[2].padStart(2, "0")}`;
  ///////////////////////////////////////////////
  let str = "";
  site_list = `${(function nametocode_appender() {
    for (let i = 0; i < selected_site_name.length; i++) {
      str += `${selected_site_name[i]} - ${codeNOES[i]}\n`;
    }
    return str;
  })()}`;
  // Now preparing the final text
  //////////////////ALARM////////////////////////
  alarm_name = document.getElementById("alarminput").value;

  //want inf?!
  info_list = `${(function info_visibility() {
    if (!more_inf) {
      //when no inf
      return "";
    } else {
      return `شرح: ${more_inf}\n`;
    }
  })()}`;
  ///////////////////////////////////////////////
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
    if (codeNOES.length < 2) {
      return "سایت: ";
    } else {
      return `سایت های:\n`;
    }
  })()}`;
  ////////////////////////////////////////////////
  IsMonitorong = `${(function IsMonitorong() {
    if (document.getElementById("fixed_monitoring").checked === false) {
      return "";
    } else {
      return "مانیتورینگ: ";
    }
  })()}`;

  ////////////////////////////////////////////////
  if (!codesite.trim()) {
    site_list = "کدسایتی وارد نشده است !🤐\n";
  }
  alarm_text = `${today}\n${siteha}${site_list}آلارم: ${alarm_name}
زمان: ${alarmtime}
${info_list}${reportedto}${IsMonitorong}${monitoring}`;

  copyToClipboard(alarm_text);

  document.getElementById("pre_modal").textContent = alarm_text;
  document.getElementById("copybutton").textContent = "کپی!";
  $("#myModal").modal();
  clear_cache();
  function clear_cache() {
    selected_site_name.length = 0;
    ES_site.length = 0;
  }
}
$(".selector").tooltip({
  position: { my: "left+10 center", at: "left center" },
});

document.getElementById("copybutton").addEventListener("click", function () {
  // copyToClipboard(alarm_text);
  document.getElementById("copybutton").textContent = "کپی شد!";
});
