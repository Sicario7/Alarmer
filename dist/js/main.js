"strict-mode";
function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}
$(document).ready(function () {
  // $("#prev-modal").modal(); // modal test

  const names = [],
    codesDB = [];
  let selected_site_names = [];
  let selected_site_coords = [];
  let ES_site = [];
  let alarm_text;
  let codeNOES = [];
  let coords = [];

  $.getJSON("data.json", function (json) {
    for (let i = 0; i < Object.keys(json).length; i++) {
      names[i] = json[i].name;
      codesDB[i] = json[i].code;
      coords.push([json[i].lat, json[i].long]);
    }
  });
  ////////////////////////////////////////////////////////////
  document.getElementsByClassName("alarm-form")[0].style.top = "0";
  document.getElementsByClassName("contact-form")[0].style.top = "-1000px";
  // document.getElementsByClassName("setting-form")[0].style.top = "-1000px";
  $(".nav-item").click(function () {
    selectedID = this.id;
    if (!$(this).hasClass("active")) {
      $(".nav-item").removeClass("active");
      $(this).addClass("active");
      ///////////////
      // $(".nav-item").each(function () {
      //   if (this.id === selectedID) {
      //     animToggler(this.parent);
      //   }
      // });
      ///////////////
      if (this.id == "main-page") {
        animToggler($(".alarm-form")[0], true);
        animToggler($(".contact-form")[0], false);
      }
      if (this.id == "contact-us") {
        animToggler($(".alarm-form")[0], false);
        animToggler($(".contact-form")[0], true);
      }
    }
  });
  function animToggler(item, visibility) {
    // item.style.top = item.style.top == "-1000px" ? 0 : "-1000px";
    if (visibility == true) {
      item.style.top = "0";
    } else {
      item.style.top = "-1000px";
    }
  }
  /////////////////////////////////////////////////////////
  document.getElementById("fullscreen").addEventListener("click", function () {
    if (document.getElementById("title").style.display == "none") {
      document.getElementById("title").style.display = "block";
      document.getElementById("footer").style.display = "block";
      document.getElementById("side-menu").style.display = "block";
      document
        .getElementById("main-grid")
        .style.setProperty(
          "grid-template-areas",
          '"main main main main main main header" "main main main main main main menu" "main main main main main main menu" "main main main main main main footer"',
          "important"
        );
      this.textContent = "➡";
    } else {
      document.getElementById("main-grid").style.gridTemplateAreas = '"main"';
      document.getElementById("title").style.display = "none";
      document.getElementById("footer").style.display = "none";
      document.getElementById("side-menu").style.display = "none";
      this.textContent = "⬅";
    }
  });
  /////////////////////////////////////////////////////////
  function auto_grow(element) {
    console.log(element.style.height);
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }
  ////////////////////////////////////////////////////////////
  //auto-complete of alarms field
  $(function () {
    const alarmtags = [
      "AC Fail",
      "قطعی سایت",
      "قطعی Uplink",
      "ریست سایت",
      "AC Fail - Module Fail",
      "Module Fail",
      "Module Fail>2",
      "AC Fail - Module Fail - Module Fail>2",
      "AC Phase Loss",
      "AC Undervoltage",
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
      "Battery Fan Failure",
    ];

    const nametags = [
      "آقای جودکی",
      "آقای کاوه",
      "آقای نیری",
      "آقای یزدانی بخش",
      "آقای یزدانپرست",
      "آقای زیباکلام",
      "آقای مصری پور",
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
      "آقای اعرابی",
      "خانم خدابخشیان",
      "آقای شاهمرادی",
      "آقای کیماسی",
      "آقای گورتانیان",
      "آقای جلال کاوه",
    ];
    const moretags = [
      "قطعی برق منطقه",
      "مشکل تردد",
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
  function copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    navigator.clipboard.writeText(el.value);
    document.body.removeChild(el);
  }
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
    let found;
    ES_site.forEach(function (site) {
      found = codesDB.findIndex((el) => el == site);
      if (found != -1) {
        selected_site_names.push(names[found]);
        selected_site_coords.push(coords[found]);
      } else {
        selected_site_coords.push([null, null]);
        selected_site_names.push("کد سایت اشتباه/ناموجود⭐");
      }
    });
  }
  document.getElementById("clear").addEventListener("click", function () {
    // document.getElementById("site_code").value = "";
    textfield_ClearEffect("site_code");
    textfield_ClearEffect("alarminput");
    textfield_ClearEffect("more");
    textfield_ClearEffect("rep_to");
    textfield_ClearEffect("time");
  });

  function textfield_ClearEffect(str) {
    document.getElementById(`${str}`).style.backgroundColor = "red";
    setTimeout(() => {
      //Run after specified time has passed
      document.getElementById(`${str}`).style.backgroundColor = "#e4ebf5";
    }, 500);
    document.getElementById(`${str}`).value = "";
  }

  // when clicking preview button:
  document.getElementById("preview").addEventListener("click", function () {
    preview_Maker();
  });

  function text_maker() {
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
        return `${more_inf}\n`;
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
      return `${monitoring}`;
    })()}`;

    ////////////////////////////////////////////////
    if (!codesite.trim()) {
      site_list = "کدسایتی وارد نشده است.\n";
    }
    alarm_text = `${today}\n${siteha}${site_list}آلارم: ${alarm_name}
زمان آلارم: ${time_stamp}
${info_list}${reportedto}${monitoring}`;

    document.getElementById("pre_modal").textContent = alarm_text;
    document.getElementById("copybutton").textContent = "کپی پیام";
    $("#prev-modal").modal();
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
    copyToClipboard(alarm_text);
    document.getElementById("copybutton").textContent = "کپی شد";
    document.getElementById("copybutton").style.color = "green";
    document.getElementById("copybutton").classList.add("btn-pressed");
    setTimeout(() => {
      $("#prev-modal").modal("toggle");
    }, 1000);
  });
  $("#prev-modal").on("hidden.bs.modal", function () {
    document.getElementById("copybutton").classList.remove("btn-pressed");
  });
  // Map
  document.getElementById("showonmap").addEventListener("click", function () {
    DatabaseMaker();
    clearLocalStorage();
    writeLocalStorage();
    clearCache();
    window.open("Map.html");
  });

  // Ideas:

  async function QuoteFetch() {
    try {
      const fetchedData = await fetch("https://api.quotable.io/random");
      const quote = fetchedData.json().then(function (data) {
        document.getElementById(
          "quote-text"
        ).textContent = `${data.content}(${data.author})`;
        // document.getElementById("quote-author").textContent = data.author;
      });
    } catch (err) {
      console.log(err);
    }
  }
  QuoteFetch();
});
