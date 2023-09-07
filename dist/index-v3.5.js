"use strict";(()=>{var L=(c=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(c,{get:(d,g)=>(typeof require<"u"?require:d)[g]}):c)(function(c){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+c+'" is not supported')});typeof window<"u"&&(window.require=function(c){switch(c){case"path":return{resolve:function(){return""}};case"os":return{};case"crypto":return{};default:throw new Error(`Dynamic require of "${c}" is not supported`)}});console.log("Shims.js is running");typeof global>"u"&&(window.global=window);typeof global.process>"u"&&(global.process={});typeof global.process.env>"u"&&(global.process.env={});global.process.cwd=global.process.cwd||(()=>"/");typeof global>"u"&&(window.global=window);global.process=global.process||{};global.process.env=global.process.env||{};global.Buffer=global.Buffer||{};var M,D,T;typeof process<"u"&&process.versions&&process.versions.node&&(M=L("path"),D=L("os"),T=L("crypto"));document.querySelector("[activity-data='image']").removeAttribute("srcset");document.querySelector("[activity-data='liked']").removeAttribute("srcset");var P={};console.log("Initial favoritesState:",JSON.stringify(P));var U={};console.log("Initial isManuallyChanged:",JSON.stringify(U));async function N(c,d,g){console.log("destination id",d),console.log("activityId",c),console.log("datastoreeeee",g),console.log("guide.id",g._guide_of_trips[0].id);let o=g._guide_of_trips.find(m=>String(m.id)===d);console.log("Target dest",o);let w=[];o&&o._guide_recommendations&&(w=o._guide_recommendations.filter(m=>m._place.place_id!==c)),console.log("Related Activities",w);let x=document.querySelector("[activity-data='related-activity']");x.innerHTML="",w.forEach(m=>{let _=document.createElement("div");_.className="mini-card_component is-related-activity",_.setAttribute("related-activity-id",m.place_id);let p=m._place,f=document.createElement("div");f.className="margin-bottom margin-xsmall";let q=document.createElement("img");q.src=p.oa_place_image.url,q.className="mini-card_image",f.appendChild(q),_.appendChild(f);let h=document.createElement("div");h.className="mini-card_content";let v=document.createElement("div");v.className="margin-bottom margin-xxsmall";let u=document.createElement("div");u.className="text-weight-bold",u.innerText=p.google_name,v.appendChild(u),h.appendChild(v);let r=document.createElement("div");r.className="margin-bottom margin-xxsmall";let l=document.createElement("div");l.className="mini-card_tag-wrapper",l.innerHTML=`<img src="${p._place_category.category_icon.url}" class="mini-card_tag-icon">
                              <div class="text-size-small text-color-grey">${p._place_category.category_name}</div>`,r.appendChild(l),h.appendChild(r);let e=document.createElement("div");e.className="rating-stars_component";let a=Math.floor(m._place.google_rating);for(let i=1;i<=5;i++){let t=document.createElement("img");t.className="activity-star",t.setAttribute("activity-data",`star-${i}`),i<=a?t.src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg":t.src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg",e.appendChild(t)}h.appendChild(e),_.appendChild(h),_.addEventListener("click",function(){let i=this.getAttribute("related-activity-id"),t=findActivityByIdInDataStore(g,i);t?flyToAndSetActive(t.coords):console.warn(`Activity with ID ${i} not found.`)}),x.appendChild(_)})}var A=[];function C(){let d=new URLSearchParams(window.location.search).get("activity_id");if(Object.values(A).forEach(g=>{g.style.border="2px solid grey",g.style.zIndex="100";let o=g.getAttribute("original-image-url")||"default_image_url_here";g.style.backgroundImage=`url("${o}")`}),d&&A[d]){A[d].style.border="2px solid #636BFF",A[d].style.zIndex="101";let g=A[d].getAttribute("active-image-url")||"active_image_url_here";A[d].style.backgroundImage=`url("${g}")`}}async function z(c,d){let o=d._guide_of_trips.find(u=>u._guide_recommendations.some(r=>r.place_id.toString()===c.toString()))?._guide_recommendations.find(u=>u.place_id.toString()===c.toString());if(!o){console.log("Activity data is missing");return}document.querySelector("[activity-data='activity_description']").textContent=o._place._place_category.category_name||"No description available.";let w=o._place._favorite_of_user_of_place.find(u=>u.place_id===o.place_id);document.querySelector("[wized='activity_like_button']").setAttribute("activity-data-place-id",o.place_id),w?document.querySelector("[wized='activity_like_button']").setAttribute("activity-data-id",w.id):document.querySelector("[wized='activity_like_button']").removeAttribute("activity-data-id"),document.querySelector("[activity-data='image']").src=o._place.oa_place_image.url,document.querySelector("[activity-data='title']").innerText=o._place.google_name,document.querySelector("[activity-data='category_icon']").src=o._place._place_category.category_icon_black.url,document.querySelector("[activity-data='address']").innerText=o._place.google_address_string,document.querySelector("[activity-data='phone_number']").innerText=o._place.google_phone_number,document.querySelector("[activity-data='instagram_name']").innerText=o._place.instagram_url,document.querySelector("[activity-data='place_url']").href=o._place.google_place_url,document.querySelector("[activity-data='place_url']").innerText=o._place.place_url,document.querySelector("[activity-data='sub_title']").innerText=o.note,document.querySelector("[activity-data='activity_category']").innerText=o._place.oa_category;function x(u){return u.split("_")[0].split("  ")[0]}let m=o._place._destination_activity.mobi_destination_name,_=x(m);document.querySelector("[activity-data='related-title']").innerText="Other "+_+" activities",document.querySelector("[activity-data='activity_details_title']").innerText=o._place.oa_category+" Details",document.querySelector("[activity-data='activity_description']").innerText=o._place.google_place_description,document.querySelector("[activity-data='instagram_url']").href=o._place.instagram_url,document.querySelector("[activity-data='place_url_link']").href=o._place.place_url,document.querySelector("[activity-data='directions']").href=o._place.google_place_url,document.querySelector("[activity-data='phone_number_link']").href=`tel:${o._place.google_phone_number}`,document.querySelector("[activity-data='google_rating']").textContent=o._place.google_rating,document.querySelector("[activity-data='oh_monday']").textContent=o._place.google_monday_hours?o._place.google_monday_hours:"Not added",document.querySelector("[activity-data='oh_tuesday']").textContent=o._place.google_tuesday_hours?o._place.google_tuesday_hours:"Not added",document.querySelector("[activity-data='oh_wednesday']").textContent=o._place.google_wednesday_hours?o._place.google_wednesday_hours:"Not added",document.querySelector("[activity-data='oh_thursday']").textContent=o._place.google_thursday_hours?o._place.google_thursday_hours:"Not added",document.querySelector("[activity-data='oh_friday']").textContent=o._place.google_friday_hours?o._place.google_friday_hours:"Not added",document.querySelector("[activity-data='oh_saturday']").textContent=o._place.google_saturday_hours?o._place.google_saturday_hours:"Not added",document.querySelector("[activity-data='oh_sunday']").textContent=o._place.google_sunday_hours?o._place.google_sunday_hours:"Not added";let p=JSON.parse(localStorage.getItem("favoritesState"))||{},f=JSON.parse(localStorage.getItem("isManuallyChanged"))||{};console.log("Initial favoritesState:",JSON.stringify(p)),console.log("Initial isManuallyChanged:",JSON.stringify(f));function q(){document.querySelectorAll('[wized="activity_like_button"]').forEach(r=>{let l=r.cloneNode(!0);r.parentNode.replaceChild(l,r)}),document.querySelectorAll('[wized="activity_like_button"]').forEach(r=>{let l=r.getAttribute("activity-data-place-id");console.log(`Processing element with parentPlaceId: ${l}`),f[l]?console.log(`State manually changed for parentPlaceId: ${l}`):(console.log(`State not manually changed for parentPlaceId: ${l}`),p[l]=r.getAttribute("activity-liked")==="true"),h(r,p[l]),r.addEventListener("click",function(){console.log(`activity_like_button clicked for parentPlaceId: ${l}`),console.log(`Current favorite state before toggle: ${p[l]}`);let e=!p[l];console.log(`New favorite state after toggle: ${e}`),p[l]=e,f[l]=!0,localStorage.setItem("favoritesState",JSON.stringify(p)),localStorage.setItem("isManuallyChanged",JSON.stringify(f)),h(r,e),console.log(`Updated favoritesState and isManuallyChanged for parentPlaceId ${l}`)})})}function h(u,r){let l=u.querySelector(".floating-round-button_icon");r?l.src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/646356c55116c668dfccf4ae_heart-filled.svg":l.src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643568f2cf264582be96a5ce_heart.svg",console.log(`Updating UI icon for favorite: ${r}`)}q();let v=Math.floor(o._place.google_rating);for(let u=1;u<=5;u++){let r=document.querySelector(`[activity-data='star-${u}']`);u<=v?(console.log(v),r.setAttribute("src","https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg")):r.setAttribute("src","https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg")}document.querySelector("[wized=activity_info_modal]").style.display="block"}window.onload=async()=>{mapboxgl.accessToken="pk.eyJ1Ijoiam9yZGFub25hcnJpdmFsIiwiYSI6ImNsbHY4bW0zaTFxZ3czZ256bjlqODZmNncifQ.1xHX4Xvmvz9KNYmrZdFybA",document.querySelector("[wized=activity_info_modal]").style.display="none",console.log("Window loaded"),Wized.request.awaitAllPageLoad(async()=>{Wized.request.await("Load Trip Page");let c=await Wized.data.get("r.18.d"),d=new URLSearchParams(window.location.search),g=d.get("destination_id"),o=d.get("activity_id"),w=document.querySelector('[wized="destination_nav"]');console.log("dataStore:",c),c._guide_of_trips.forEach(e=>{let a=document.createElement("a");a.setAttribute("wized","destination_nav_id"),a.setAttribute("href","#"),a.setAttribute("data-destination-id",e.id),a.classList.add("mab_tabs-wrapper","w-inline-block");let i=document.createElement("p");i.setAttribute("wized","destination_nav_name"),i.setAttribute("data-destination-id",e.id),i.textContent=e.place,i.classList.add("map_tabs-link"),a.appendChild(i),w.appendChild(a),N(o,g,c),a.addEventListener("click",function(){console.log(`Clicked on destination ID: ${e.id}, Place: ${e.place}`),d.delete("activity_id"),history.replaceState({},"",`${location.pathname}?${d}`);let t=v.filter(s=>s.destinationId===e.id);l(t,_)})}),g&&(document.querySelectorAll("[data-destination-id]").forEach(e=>{e.classList.remove("is-active"),e.getAttribute("data-destination-id")===g&&(console.log("tried adding class"),e.classList.add("is-active"))}),document.querySelectorAll("[data-destination-id]").forEach(e=>{e.addEventListener("click",function(a){document.querySelectorAll("[data-destination-id]").forEach(t=>t.classList.remove("is-active")),a.currentTarget.classList.add("is-active");let i=document.querySelector("[wized='activity_info_modal']");i&&(i.style.display="none")})}));let x=document.querySelectorAll('[wized="destination_nav"]');x.forEach(e=>{console.log(x),e.getAttribute("data-destination-id")===g?e.classList.add("is-active"):e.classList.remove("is-active")}),o&&z(o,c);let m=[0,0];if(g){for(let e of c._guide_of_trips)if(e.id.toString()===g){let a=e._destination&&e._destination[0];m=[a.mobi_lng,a.mobi_lat];break}}else{let e=c._guide_of_trips[0],a=e._destination&&e._destination[0];m=[a.mobi_lng,a.mobi_lat]}let _=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:m,zoom:17}),p=null;function f(e){console.log("Fly to place",e);let i=10*16;_.flyTo({center:[e.google_lng,e.google_lat],zoom:15,offset:[i,0]});let t=document.querySelector(`[marker_activity_id="${e.id}"]`),s=e._place_category.category_icon_active.url;t&&(t.style.border="2px solid #636BFF",t.style.backgroundImage=`url("${s}")`,p=t)}document.querySelectorAll("[data-destination-id]").forEach(e=>{e.addEventListener("click",function(){document.querySelectorAll("[data-destination-id]").forEach(t=>{t.classList.remove("is-active")}),this.classList.add("is-active");let a=this.getAttribute("data-destination-id");console.log(`Destination ID clicked: ${a}`);let i=c._guide_of_trips.find(t=>t.id.toString()===a);if(console.log(c._guide_of_trips),console.log(a),i&&i._destination&&i._destination[0]){let s=i._guide_recommendations.map(n=>[n._place.google_lng,n._place.google_lat]);l(s,_);let b=new URLSearchParams(window.location.search);b.set("destination_id",a),b.delete("activity_id"),history.replaceState({},"",`${location.pathname}?${b}`)}})});function q(e,a){let[i,t]=e,[s,b]=a;return Math.sqrt(Math.pow(s-i,2)+Math.pow(b-t,2))}_.on("moveend",()=>{let e=_.getCenter().toArray();console.log("Map moved, center is: ",e);let a=null,i=1/0;if(c._guide_of_trips.forEach(t=>{let s=t;if(s.id){let b=[s._destination[0].mobi_lng,s._destination[0].mobi_lat];console.log(b);let n=q(e,b);console.log("Calculated distance: ",n),n<i&&(i=n,a={id:s.id,mobi_lat:s._destination[0].mobi_lat,mobi_lng:s._destination[0].mobi_lng},console.log("Updated closest destination: ",a))}}),a){console.log("Closest destination is: ",a),document.querySelectorAll("[data-destination-id]").forEach(s=>{console.log("Removing is-active class from: ",s),s.classList.remove("is-active")});let t=document.querySelector(`[data-destination-id="${a.id}"]`);t?(console.log("Adding is-active class to: ",t),t.classList.add("is-active")):console.log(`No element found for destination_id: ${a}`)}else console.log("No closest destination found")}),_.addControl(new mapboxgl.NavigationControl);function h(e,a,i){let t=e._place;if(console.log("Marker added at:",t.google_lng,t.google_lat),!t)return null;let s=t._place_category.category_icon.url,b=t._place_category.category_icon_active.url,n=document.createElement("div");n.style.backgroundImage=`url("${s}")`,n.style.zIndex="100",n.setAttribute("original-image-url",s),n.setAttribute("active-image-url",b),n.setAttribute("marker_activity_id",e.place_id),n.style.backgroundRepeat="no-repeat",n.style.backgroundPosition="center",n.style.backgroundSize="18px 18px",n.style.width="41px",n.style.height="25px",n.style.borderRadius="12.5px",n.style.backgroundColor="var(--primary-white, #FFF)",n.style.boxShadow="0px 4px 4px 0px rgba(35, 16, 94, 0.10)",n.style.border="2px solid grey";let y=new mapboxgl.Marker(n).setLngLat([t.google_lng,t.google_lat]).addTo(a),I=`
        <div class="mini-card_component .is-popup">
        <img src="${t.oa_place_image.url}" alt="" class="mini-card_image">
        <div class="mini-card_content">
        <div class="margin-bottom margin-xxsmall">
        <div class="text-weight-bold">${t.google_name}</div>
        </div>
        <div class="margin-bottom margin-xsmall">
        <div class="mini-card_tag-wrapper">
        <img src="${t._place_category.category_icon.url}" loading="lazy" alt="" class="mini-card_tag-icon">
        <div class="text-size-small text-color-grey">${t._place_category.category_name||"No description available."}</div>
        </div>
        </div>
        <div class="rating-stars_component">
        <img id="popup-star-1" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-2" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-3" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-4" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-5" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        </div>
        </div>
        <img loading="lazy" alt="" class="popup-card_arrow">
        </div>
        `,$=new mapboxgl.Popup({offset:25,closeButton:!1}).setHTML(I);return $.on("open",()=>{let S=Math.floor(t.google_rating);for(let E=1;E<=5;E++){let k=$._content.querySelector(`#popup-star-${E}`);k&&(k.src=E<=S?"https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg":"https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg")}}),a.on("click",()=>{document.querySelector("[wized=activity_info_modal]").style.display="none",i=null,r=null,d.delete("activity_id");let S=new URL(window.location.href);S.search=d.toString(),history.replaceState(null,null,S.toString()),C()}),n.addEventListener("mouseenter",()=>{n.style.cursor="pointer",$.setLngLat(y.getLngLat()).addTo(a)}),n.addEventListener("mouseleave",()=>{n.style.cursor="default",$.remove()}),n.addEventListener("click",S=>{S.stopPropagation(),i=e.id,r=e.place_id,d.set("activity_id",e.place_id),history.replaceState({},"",`${location.pathname}?${d}`),console.log(`Marker clicked with activity ID: ${e.place_id}`),z(e.place_id,c),C(),f(t),N(o,g,c)}),document.querySelectorAll("[wized='activity_close_button']").forEach(function(S){S.addEventListener("click",function(E){console.log("Close clicked"),document.querySelector("[wized=activity_info_modal]").style.display="none",d.delete("activity_id");let k=new URL(window.location.href);k.search=d.toString(),history.replaceState(null,null,k.toString()),C()})}),n}let v=[],u=[];var r=null;_.on("load",function(){console.log("Map loaded");let e=new URLSearchParams(window.location.search),a=e.get("destination_id"),i=e.get("activity_id"),t=!1;c._guide_of_trips.forEach(s=>{console.log(`Processing guide ID: ${s.id}`),(s._guide_recommendations||[]).forEach(n=>{let y=n._place;if(!y)return;console.log(`Adding coordinates: [${y.google_lng}, ${y.google_lat}]`),v.push([y.google_lng,y.google_lat]),s.id.toString()===a&&u.push([y.google_lng,y.google_lat]);let I=h(n,_,p);I&&(p=I,A[y.id]=I),console.log("This is place",y),String(y.id)===i&&(t=!0,f(y))})}),C(),window.addEventListener("popstate",C),console.log(`Generated ${v.length} coordinates`),console.log("Coordinates:",v),i&&!t&&console.log(`No activity found for ID: ${i}`),a&&!t?(console.log(`Setting map bounds for destination_id: ${a}`),l(u,_)):t||console.log("No destination_id or activity_id found. Using default map settings.")});function l(e,a){if(!e.length)return;let i=e.reduce((t,s)=>t.extend(s),new mapboxgl.LngLatBounds(e[0],e[0]));a.fitBounds(i,{padding:60})}})};})();