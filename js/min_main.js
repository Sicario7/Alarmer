var names=[],codes=[];let selected_site_name=[],ES_site=[],alarmtime=document.getElementById("timesel").value,reportedto=document.getElementById("rep_to").value,monitoring=document.getElementById("monitoring").value,more_inf=document.getElementById("more").value;$(".selector").tooltip({position:{my:"left+10 center",at:"left center"}}),$(function(){$("#alarminput").autocomplete({source:["Ac Fail","قطعی سایت","ریست سایت","Ac Fail - Module Fail","Module Fail","Module Fail>2","Ac Fail - Module Fail - Module Fail>2","Ac Fail - Module Fail - Module Fail>2 - High Temperature","RF Unit Maintenance Link Failure","High Temperature","NE Is Disconnected","Power supply DC Output Out Of Range","Low Battery","Door Open","Battery Low Voltage","ریست GSM","ریست LTE","Cell Logical Channel Failure","VSWR - BAND:BBBB - SECTOR:Y - MAIN/DIVER - Value: X.Y"]}),$("#rep_to").autocomplete({source:["آقای کاوه","آقای شاهمرادی","خانم خدابخشیان","آقای نیری","آقای یزدانپرست","آقای زیباکلام","آقای مصری پور","آقای سرائیان","آقای عرب","آقای قربانی","آقای نصیری","آقای جنگروی","آقای هدایتی","آقای فریدونی","آقای خوانساری","آقای علیزاده","آقای ایزدی"]}),$("#more").autocomplete({source:["قطعی برق منطقه","PM-SITE","در حال پیگیری","ناپایداری لینک انتقال","اعزام کارشناس","CR#Number - موضوع - از ساعت XX الی YY - انجام دهنده: XXXX"]})});let seperated_sites_arr=[];function name_searcher(e,t,n){for(let o=0;o<e.length;o++)for(let l=0;l<n.length;l++)e[o]==n[l]?selected_site_name[o]=t[l]:selected_site_name[o]||(selected_site_name[o]="کد سایت اشتباه/ناموجود⭐")}function text_maker(e,t){let n=(new Date).toLocaleDateString("fa-IR").replace(/([۰-۹])/g,e=>String.fromCharCode(e.charCodeAt(0)-1728));seperator=n.split("/"),n=`${seperator[0]}/${seperator[1].padStart(2,"0")}/${seperator[2].padStart(2,"0")}`,alarm_name=document.getElementById("alarminput").value;let o="";site_list=`${function(){for(let e=0;e<t.length;e++)o+=`${t[e]} - ${seperated_sites_arr[e]}\n`;return o}()}`,info_list=`${more_inf?`شرح: ${more_inf}\n`:""}`,reportedto=`${reportedto?`گزارش به ${reportedto}\n`:""}`,siteha=`${seperated_sites_arr.length<2?"سایت: ":"سایت های:\n"}`,IsMonitorong=`${!1===document.getElementById("fixed_monitoring").checked?"":"مانیتورینگ: "}`,codesite.trim()||(site_list="کدسایتی وارد نشده است !🤐\n");let l=`${n}\n${siteha}${site_list}آلارم: ${alarm_name}\nزمان: ${alarmtime}\n${info_list}${reportedto}${IsMonitorong}${monitoring}\n`;document.getElementById("pre_modal").textContent=l,document.getElementById("copybutton").textContent="کپی!",$("#myModal").modal();(e=>{const t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)})(l),selected_site_name.length=0,ES_site.length=0}document.getElementById("copybutton").addEventListener("click",function(){document.getElementById("copybutton").textContent="کپی شد!"}),document.getElementById("clear").addEventListener("click",function(){document.getElementById("site_code").value="",document.getElementById("alarminput").value="",document.getElementById("timesel").value="",document.getElementById("more").value="",document.getElementById("rep_to").value="",document.getElementById("monitoring").value=""}),document.getElementById("preview").addEventListener("click",function(){alarmtime=document.getElementById("timesel").value,codesite=document.getElementById("site_code").value,reportedto=document.getElementById("rep_to").value,monitoring=document.getElementById("monitoring").value,more_inf=document.getElementById("more").value,function(e){for(let t=0;t<e.length;t++)ES_site[t]=`ES${e[t]}`}(seperated_sites_arr=codesite.trim().split(/\s+/)),$.getJSON("data.json",function(e){let t=Object.keys(e).length;for(let n=0;n<t;n++)names[n]=e[n].name,codes[n]=e[n].code;name_searcher(ES_site,names,codes),text_maker(ES_site,selected_site_name)})});