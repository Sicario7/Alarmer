"strict-mode";
const names = [],
  codesDB = [];
let selected_site_names = [];
let selected_site_coords = [];
let ES_site = [];
let alarm_text;
let codeNOES = [];
let coords = [];
var inf_state = "شرح";

$.getJSON("data.json", function (json) {
  for (let i = 0; i < Object.keys(json).length; i++) {
    names[i] = json[i].name;
    codesDB[i] = json[i].code;
    coords.push([json[i].lat, json[i].long]);
  }
});
$('[data-toggle="tooltip"]').tooltip();

////////////////////////////////////////////////////////////
//auto-complete of alarms field
$(function () {
  var alarmtags = [
    "AC Fail",
    "قطعی سایت",
    "ریست سایت",
    "AC Fail - Module Fail",
    "Module Fail",
    "Module Fail>2",
    "AC Fail - Module Fail - Module Fail>2",
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
    "Battery Disconnect",
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
    "آقای یزدانی بخش",
    "آقای شیرانی",
    "آقای عرب",
    "آقای قربانی",
    "آقای نصیری",
    "آقای جنگروی",
    "آقای هدایتی",
    "آقای فریدونی",
    "آقای حسینی",
    "آقای علیزاده",
    "آقای ایزدی",
    "آقای مرادی",
    "آقای جودکی",
    "آقای اعرابی",
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
};
////////////////////////////////////////////////////////////////
function preview_Maker() {
  // codesite = document.getElementById("site_code").value;
  reportedto = document.getElementById("rep_to").value;
  monitoring = document.getElementById("monitoring").value;
  more_inf = document.getElementById("more").value;
  time = document.getElementById("time").value;

  DatabaseMaker();
  //creates text
  text_maker();
}
////////////////////////////////////////////////////////////////
function DatabaseMaker() {
  codesite = document.getElementById("site_code").value;
  codeNOES = codesite.trim().split(/\s+/);
  codeNOES = [...new Set(codeNOES)];
  ES_site = codeNOES.map((site) => `ES${site}`);

  //Checks site codesDB and returns corresponding names and coords
  if (ES_site != "ES") {
    for (let a = 0; a < ES_site.length; a++) {
      for (let b = 0; b < codesDB.length; b++) {
        if (ES_site[a] == codesDB[b]) {
          // selected_site_codes[a] = ES_site[b];
          selected_site_names[a] = names[b];
          selected_site_coords[a] = coords[b];
        } else {
          if (!selected_site_names[a]) {
            selected_site_names[a] = "کد سایت اشتباه/ناموجود⭐";
            selected_site_coords[a] = [null,null];
          }
        }
      }
    }
  }
}
document.getElementById("clear").addEventListener("click", function () {
  // document.getElementById("site_code").value = "";
  textfield_ClearEffect("site_code") ;
  textfield_ClearEffect("alarminput") ;
  textfield_ClearEffect("more") ;
  textfield_ClearEffect("rep_to") ;
  textfield_ClearEffect("time") ;
});

function textfield_ClearEffect(str) {
  document.getElementById(`${str}`).style.backgroundColor = "#e6babd"; 

  setTimeout(() => {
    //Run after specified time has passed
    document.getElementById(`${str}`).style.backgroundColor = "white"; 
  }, 500);
  document.getElementById(`${str}`).value = "";
  document.getElementById(`${str}`).classList.remove("clearAnimation");  

}

// when clicking preview button:
document.getElementById("preview").addEventListener("click", function () {
  preview_Maker();
});

// document.getElementById("rep_to").addEventListener("keyup", function (e) {
//   if (e.keyCode === 13) {
//     e.preventDefault();
//     document.getElementById("preview").click();
//   }
// });
var input = document.getElementById("sharh");
input.addEventListener("change", function () {
  if (this.checked) {
    inf_state = "شرح";
  } else {
    inf_state = "علت";
  }
});

function text_maker() {
  // const options = {
  //   month: "2-digit",
  //   day: "2-digit",
  //   year: "numeric",
  // };
  // const today = Intl.DateTimeFormat("fa-IR", options).format(new Date());

  //second, more campatible implemention
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
  ///////////////////////////////////////////////
  let str = "";
  site_list = `${(function nametocode_appender() {
    for (let i = 0; i < selected_site_names.length; i++) {
      str += `${selected_site_names[i]} - ${codeNOES[i]}\n`;
    }
    return str;
  })()}`;
  // Now preparing the final text
  //////////////////ALARM////////////////////////
  alarm_name = document.getElementById("alarminput").value;
  ///////////////////////////////////////////////
  info_list = `${(function info_visibility() {
    if (!more_inf) {
      //when no inf
      return "";
    } else {
      return `${inf_state}: ${more_inf}\n`;
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
  time_stamp = `${(function time_stamper() {
    return `${time}`;
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
    site_list = "کدسایتی وارد نشده است.\n";
  }
  alarm_text = `${today}\n${siteha}${site_list}آلارم: ${alarm_name}
زمان آلارم: ${time_stamp}
${info_list}${reportedto}${IsMonitorong}${monitoring}`;

  copyToClipboard(alarm_text);

  document.getElementById("pre_modal").textContent = alarm_text;
  document.getElementById("copybutton").textContent = "کپی!";
  $("#myModal").modal();
  clearCache();
}
function clearLocalStorage() {
  window.localStorage.clear();
  // window.localStorage.removeItem("codesites");
  // window.localStorage.removeItem("coords");
}
function writeLocalStorage() {
  // clearLocalStorage();
  localStorage.setItem("codesites", ES_site);
  localStorage.setItem("coords", selected_site_coords);
  localStorage.setItem("names", selected_site_names);
}
function clearCache() {
  selected_site_names.length = 0;
  selected_site_coords.length = 0;
  ES_site.length = 0;
}
document.getElementById("copybutton").addEventListener("click", function () {
  document.getElementById("copybutton").textContent = "کپی شد!";
});
// Map
document.getElementById("showonmap").addEventListener("click", function () {
  DatabaseMaker();
  clearLocalStorage();
  writeLocalStorage();
  clearCache();
  window.open("Map.html");
});

// fetch("https://inspiration.goprogram.ai")
//   .then(function (responce) {
//     return responce.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });
