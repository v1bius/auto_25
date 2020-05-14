
const apartmentMarkerIcon = L.AwesomeMarkers.icon({
                    icon: 'building',
                    prefix: "fa",
                    iconColor: 'white'
});

const houseMarkerIcon = L.AwesomeMarkers.icon({
                    icon: 'home',
                    prefix: "fa",
                    iconColor: 'white'
});

window.mobilecheck = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
};

const mobile = window.mobilecheck();


const getParentAtCurrentZoom = (marker) => {
     let currentZoom = propertyMapVar.getZoom();
     while (marker.__parent && marker.__parent._zoom >= currentZoom) {
         marker = marker.__parent;
     }

     return marker;
};

const findOnMap = (element) => {

    let id = element["id"];
    let marker = propertyMarkers[id];
    let popup = markers[id];
    //propertyMapVar.openPopup(popup);
    //propertyMapVar.flyTo(popup.getLatLng(), 13);

    let parent = getParentAtCurrentZoom(marker);
    if (parent.spiderfy) {

        propertyMapVar.flyTo(popup.getLatLng(), 18, {"duration": 1.5});
        propertyMapVar.once('moveend', function () {
            parent.spiderfy();
            propertyMapVar.openPopup(popup);

        });


    } else {
        propertyMapVar.flyTo(popup.getLatLng(), 18);
        propertyMapVar.once('moveend', function () {
            propertyMapVar.openPopup(popup);
        });
    }

    if (mobile) {
        alert("aaaa");
        let clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        document.getElementById("helperButton").dispatchEvent(clickEvent);
    }
};

const filterApartments = () => {
    let startTime = new Date();
    let houseCombo = $("#houseCombo");
    let apartmentCombo = $("#apartmentCombo");
    let search = $("#otsing");

    let zipCode = search[0].innerHTML;
    let houseComboBoxState = houseCombo[0].checked;
    let apartmentComboBoxState = apartmentCombo[0].checked;

    let data = {
        "apartmentComboBoxState": apartmentComboBoxState,
        "houseComboBoxState": houseComboBoxState,
        "searchTerm": zipCode
    };
    $.ajax({
        url: '/apartmentFilter/',
        data: data,
        dataType: 'json',
        success: function(data) {
            showResults(data);

        }
    });
};

const showResults = (results) => {

    const initialResults = (length, offset, prefix, avgValu) => {
            let elements = [];
            let toolTips = {};
            for (let i = 0; i < length; i++) {
                let dataset = prefix[offset+i];

                let ourDivElement = "";

                let sihtnr = document.getElementById("sihtnr").innerText;
                let price = dataset[5];
                let priceSq = Number(dataset[15]).toFixed(2);
                let address = dataset[2];
                let url = dataset[6];
                let image = dataset[11];
                let unfilteredPropType = dataset[3];
                let avgVal = avgValu[unfilteredPropType];
                let propertyType = dataset[3].charAt(0).toUpperCase() + dataset[3].slice(1);
                let id = dataset[12];
                let modifiedId = id + "ToolTip";
                let aasta = dataset[16];
                let tubadeArv = Math.round(dataset[9]);
                let uldPind = dataset[7];
                let percentage = priceSq/avgVal * 100;
                let word;
                let color;
                if (["a", "e", "i", "o", "u"].indexOf(unfilteredPropType.slice(-1))) {
                    unfilteredPropType = unfilteredPropType + "i";
                    unfilteredPropType = unfilteredPropType.charAt(0).toUpperCase() + unfilteredPropType.slice(1);
                } else {
                    unfilteredPropType = unfilteredPropType.charAt(0).toUpperCase() + unfilteredPropType.slice(1);
                }
                if (percentage >= 100) {
                    word = "<i class=\"fas fa-arrow-up\"></i>";
                    color = "#dd1818";
                    percentage = percentage - 100;
                } else {
                    word = "<i class=\"fas fa-arrow-down\"></i>";
                    color = "#1E9600";
                    percentage = 100 - percentage;
                }
                percentage = parseFloat(percentage).toFixed(2);
                let width = 404;
                let height = 242;
                toolTips[modifiedId] = [unfilteredPropType, parseFloat(avgVal).toFixed(2)];
                let imgTag = "<img src=\"/static/img/france.svg\" data-src=\"${image}\" alt=\"${address}\" class=\"card-img-top lazyload\" height=\"150\" loading=\"lazy\"/>\n"
                ourDivElement = `
                                                    <div class="col-lg-6 col-md-4 pt-3 pb-3 container">
                                                            <div class="row">
                                                                <div class="col-lg-12">
                                                                    <img src=\"/static/img/france.svg\" data-src=\"${image}\" alt=\"${address}\" class=\"card-img-top lazyload\" height="${height}" width="${width}" loading=\"lazy\"/>
                                                                </div>  
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-lg-10 col-md-9 col-10"><span class="text-muted">${propertyType} • ${aasta}</span></div>
                                                                <div class="col-lg-2 col-md-3 col-2"><a href="${url}" target="_blank">kv.ee</a></div>
                                                            </div>
                                                            <div class="row pt-1">
                                                                <div class="col-lg-12">
                                                                <h5 class="color-gray" style="font-size: 19px;">${address.split(", ")[0]}</h5>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-lg-12 ">
                                                                    <span class="color-gray font-weight-bold" style="color: #0C6B58; font-size: 21px;">${price} &euro;</span>
                                                                </div>
                                                                <div class="col-lg-12">
                                                                    <span class="color-gray" style="font-size: 15px; color: #829AB1;">${priceSq} &euro;/m² <span style="color: ${color}; font-size: 13px;">${percentage}% ${word} <i class="fas icon-color fa-info-circle cursorPointy" id="${modifiedId}"></i></span></span>
                                                                </div>
                                                            </div>
        
                                                            <hr>
                                                            <div class="row">
                                                                <div class="col-lg-6 col-md-6 col-6 border-right">
                                                                    <span><i class="fas fa-bed icon-color"></i> <span class="">${tubadeArv}</span>&nbsp;tuba</span>
        
                                                                </div>
                                                                <div class="col-lg-6 col-md-6 col-6">
                                                                    <span class="before-apt-area-size icon-color"></span>&nbsp;<span>${uldPind} m²</span>
                                                                </div>
                                                            </div>
                                                            <hr>
                                                            <div class="row">
                                                                <div class="col-lg-6 col-md-6 col-6">
                                                                    <button class="cursorPointy primary-btn rounded theme-green-lighter" onclick="findOnMap(this)" id="${id}"><i class="fas fa-map-marked-alt"></i>&nbsp;kaardil</button>
                                                                </div>
                                                                <div class="col-lg-6 col-md-6 col-6">
                                                                    <a href="${url}" target="_blank"> <button class="primary-btn cursorPointy theme-green-lighter rounded float-right"><i class="fas fa-info"></i>&nbsp; info</button></a>
                                                                </div>
                                                            </div>
                                                    </div>
                                                          `;
                elements.push(ourDivElement);

                let lat = dataset[0];
                let lon = dataset[1];
                let loc = [lat, lon];
                let apartmentMarker;

                if (propertyType === "Korter") {
                    apartmentMarker = L.marker(loc, {icon: apartmentMarkerIcon});
                } else {
                    apartmentMarker = L.marker(loc, {icon: houseMarkerIcon});
                }

                let content = `
                        <div class="container">
                                <div class="row">
                                    <img src="${image}" width="210" height="120">
                                </div>
                                <div class="row ">
                                    <div class="col text-center"><a href="${url}" target="_blank"><b style="font-size: 20px;">${address.split(", ")[0]}</b></a></div>
                                </div>
                                <div class="row ">
                                    <div class="col text-center"><b style="font-size: 15px;">${price}&euro;</b></div>
                                </div>
                              </div>
                              `;

                let popup = L.popup().setLatLng(loc).setContent(content);

                apartmentMarker.bindPopup(popup);

                markers[id] = popup;
                clusterGroup.addLayer(apartmentMarker);
                propertyMarkers[id] = apartmentMarker;


            }
            return [elements, toolTips]

    };
    let resultsDiv = document.getElementById("veryImportantOrNot");
    resultsDiv.classList.add("dark-overlay");
    let elements;
    let toolTips;
    let prefix;
    let len;
    let averagePrefix;
    resultsDiv.innerHTML = "";
    try {
         len = results["results"]["Properties"].length;
         prefix = results["results"]["Properties"];
         averagePrefix = results["results"]["AverageForPropertyTypes"]
    } catch {
        prefix = results["Properties"];
        len = prefix.length;
        averagePrefix = results["AverageForPropertyTypes"];

    }
    let atFirst;
    if (len > 10) {
        atFirst = 10;
    } else {
        atFirst = len;
    }
    console.log(atFirst, "atFirst lmao");
    let a = initialResults(atFirst, 0, prefix, averagePrefix);
    elements = a[0];
    toolTips = a[1];
    //console.log(Object.keys(toolTips).length, "a");
    resultsDiv.innerHTML = elements.join("");
    propertyMapVar.addLayer(clusterGroup);
    console.log("atfisrt", atFirst);
    console.log("len", len);
    if (len !== atFirst) {
        let offset = atFirst;
        let b = initialResults(len-atFirst, offset, prefix, averagePrefix);
        elements = b[0];
        toolTips = {...toolTips, ...b[1]};
        resultsDiv.innerHTML += elements.join("");
    }

    propertyMapVar.addLayer(clusterGroup);

    $("#vasteCounter")[0].innerHTML = `<b>${len}</b>`;
    try {

        if ($("#totalListingsFound")[0].innerText === "") {
            $("#totalListingsFound")[0].innerHTML = `<b>${len}</b>`;
            $("#avgPriceKorter")[0].innerHTML = `${results["results"]["AverageApartmentPrice"].toFixed(2)}`;
            $("#avgPriceHouse")[0].innerHTML = `${results["results"]["AverageHousePrice"].toFixed(2)}`;
        }
    } catch (e) {
        console.log(e);
    }

    resultsDiv.classList.remove("dark-overlay");

    lazyload();

    return toolTips;

};

const showPrice = (price, parent) => {
    console.log("Price", price);
    console.log("Parent", parent);

};

const getSearchParameters = () => {
    let currency;
    let ret;
    let koguPindFrom;
    let koguPindTo;

    let apartmentCombo = document.getElementById("type_0");
    if (apartmentCombo) {
        apartmentCombo = apartmentCombo.checked;
    } else {
        apartmentCombo = "";
    }
    let houseCombo = document.getElementById("type_1");

    if (houseCombo) {
        houseCombo = houseCombo.checked;
    } else {
        houseCombo = "";
    }

    let priceFrom = document.getElementById("prFrom").value;
    let priceTo = document.getElementById("prTo").value;

    let numberOfRooms = document.getElementById("nrRoom").value;

    let currency1 = document.getElementById("prEur");

    if (currency1.classList["2"] !== "primary-btn") {
        currency = "prEurMSquared";
    } else {
        currency = "prEur";
    }

    let uldPindFrom = document.getElementById("uldPindFrom").value;
    let uldPindTo = document.getElementById("uldPindTo").value;
    let sihtnumber = document.getElementById("sihtnr");
    if (sihtnumber) {
        sihtnumber = sihtnumber.innerText;
    }

    if (houseCombo) {
        koguPindFrom = document.getElementById("koguPindFrom").value;
        koguPindTo = document.getElementById("koguPindTo").value;

    } else {
        koguPindFrom = "";
        koguPindTo = "";
    }

    ret = {
            "apartments": apartmentCombo,
            "houses": houseCombo,
            "priceFrom": priceFrom,
            "priceTo": priceTo,
            "uldPindFrom": uldPindFrom,
            "uldPindTo": uldPindTo,
            "yhik": currency,
            "tubadeArv": numberOfRooms,
            "koguPindFrom": koguPindFrom,
            "koguPindTo": koguPindTo,
            "sihtnumber": sihtnumber

        };

    return ret;
};

const searchProperties = (parent) => {
    let currency;
    let ret;
    let koguPindFrom;
    let koguPindTo;

    //collapseDiv[0].classList['2'] === "show"
    //collapseDiv.collapse('hide');
    //$("#searchButtonForFiltering")[0].innerText = "Ava otsing";
    //$("#suvandid")[0].innerHTML = "<p>Otsingu suvandid&nbsp;&nbsp;&nbsp;<i class=\"fas fa-angle-double-up\"></i></p>";

    let apartmentCombo = document.getElementById("type_0");
    if (apartmentCombo) {
        apartmentCombo = apartmentCombo.checked;
    } else {
        apartmentCombo = "";
    }
    let houseCombo = document.getElementById("type_1");

    if (houseCombo) {
        houseCombo = houseCombo.checked;
    } else {
        houseCombo = "";
    }

    let priceFrom = document.getElementById("prFrom").value;
    let priceTo = document.getElementById("prTo").value;

    let numberOfRooms = document.getElementById("nrRoom").value;

    let currency1 = document.getElementById("prEur");

    if (currency1.classList["2"] !== "primary-btn") {
        currency = "prEurMSquared";
    } else {
        currency = "prEur";
    }

    let uldPindFrom = document.getElementById("uldPindFrom").value;
    let uldPindTo = document.getElementById("uldPindTo").value;
    let sihtnumber = document.getElementById("sihtnr");
    if (sihtnumber) {
        sihtnumber = sihtnumber.innerText;
    }

    if (houseCombo) {
        koguPindFrom = document.getElementById("koguPindFrom").value;
        koguPindTo = document.getElementById("koguPindTo").value;

    } else {
        koguPindFrom = "";
        koguPindTo = "";
    }

    if (parent['id'] === "closeSearchy") {
        let radius = document.getElementById("rad");

        if (radius) {
            radius = radius.value;
        } else {
            radius = "1km";
        }
        console.log(apartmentCombo);
        console.log(houseCombo);
        console.log(lat, lon, "wa");
        ret = {
            "apartments": apartmentCombo,
            "houses": houseCombo,
            "priceFrom": priceFrom,
            "priceTo": priceTo,
            "uldPindFrom": uldPindFrom,
            "uldPindTo": uldPindTo,
            "yhik": currency,
            "tubadeArv": numberOfRooms,
            "sihtnumber": sihtnumber,
            "radius": radius,
            "latitude": lat,
            "longitude": lon,
        }
        /*ret = getSearchParameters();

        ret["radius"] = radius;
        ret["latitude"] = lat;
        ret["longitude"] = lon;*/
    } else {
        ret = {
            "apartments": apartmentCombo,
            "houses": houseCombo,
            "priceFrom": priceFrom,
            "priceTo": priceTo,
            "uldPindFrom": uldPindFrom,
            "uldPindTo": uldPindTo,
            "yhik": currency,
            "tubadeArv": numberOfRooms,
            "koguPindFrom": koguPindFrom,
            "koguPindTo": koguPindTo,
            "sihtnumber": sihtnumber

        };
    }

    $.ajax({
        url: '/apartmentFilter/',
        data: ret,
        dataType: 'json',
        success: (data) => {

            clusterGroup.clearLayers();

            if (parent['id'] === "closeSearchy") {
                circleGroup.clearLayers();
                let lat = data["results"]["Lat"];
                let lng = data["results"]["Lng"];
                let radius = data["results"]["Radius"];
                L.circle([lat, lng], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: radius * 1000
                }).addTo(circleGroup);
            }

            //let divList = document.getElementById("veryImportantOrNot");
            showResults(data, "apartmentFilter");

        }
    });

    $("#moreFilters").collapse("hide");
    $("#suvandid")[0].innerHTML = "<p>Otsingu suvandid&nbsp;&nbsp;&nbsp;<i class=\"fas fa-angle-double-up\"></i></p>";

    let button = document.getElementById("sulgeOtsing");
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");

    button.innerText = "Ava otsing";
};

const changeOption = (parent) => {
    let id = parent.id;

    if (id === "prEur") {

        if (parent.classList['3'] === "primary-btn") {
            // do nothing lmaoaoaao
        } else {
            parent.classList.add("primary-btn");
            let theOtherButton = document.getElementById("prEurMSquared");
            theOtherButton.classList.remove("primary-btn");
        }
    } else if (id === "prEurMSquared") {

        if (parent.classList['3'] === "primary-btn") {
            // do nothing lmaoaoaao
        } else {
            parent.classList.add("primary-btn");
            let theOtherButton = document.getElementById("prEur");
            theOtherButton.classList.remove("primary-btn");
        }
    }
};

const moreOptions = (parent) => {
    // show more options
    let checked = parent.checked;

    let htmlToAdd = `
    <label class="form-label">Kogupind</label>
    <div class="row">
        <div class="col-5">
            <input type="text" class="form-control" placeholder="Min m²" aria-label="Username" aria-describedby="basic-addon1" id="koguPindFrom">
        </div>
        <div class="col-2 text-center p-0 align-middle align-self-center">kuni</div>
        <div class="col-5">
            <input type="text" class="form-control" placeholder="Max m²" aria-label="Username" aria-describedby="basic-addon1" id="koguPindTo">
        </div>
    </div>`;

    if (checked) {
        let div = document.getElementById("moreOptions");
        let node = document.createElement("div");
        node.innerHTML = htmlToAdd;
        node.setAttribute("id", "rem");
        div.insertBefore(node, div.childNodes[4]);
    } else {
        let remove = document.getElementById("rem");
        remove.parentNode.removeChild(remove);
    }

};

const closeSearch = (parent) => {
    let collapseDiv = $("#moreFilters");

    let button = document.getElementById("sulgeOtsing");

    if (parent['id'] === "foundResultsDiv" && !mobile) {
        collapseDiv.collapse("hide");
        button.innerText = "Ava otsing";
        button.classList.remove("danger-btn-b");
        button.classList.add("success-btn");
        $("#suvandid")[0].innerHTML = "<p>Otsingu suvandid&nbsp;&nbsp;&nbsp;<i class=\"fas fa-angle-double-up\"></i></p>"
    } else if (parent['id'] === "foundResultsDiv" && mobile) {

    }
    else if (collapseDiv[0].classList['1'] === "show") {
        collapseDiv.collapse("hide");
        button.innerText = "Ava otsing";
        button.classList.remove("danger-btn-b");
        button.classList.add("success-btn");
        $("#suvandid")[0].innerHTML = "<p>Otsingu suvandid&nbsp;&nbsp;&nbsp;<i class=\"fas fa-angle-double-up\"></i></p>"

    } else {
        collapseDiv.collapse("show");
        button.innerText = "Sulge otsing";
        button.classList.remove("success-btn");
        button.classList.add("danger-btn-b");
        $("#suvandid")[0].innerHTML = "<p>Otsingu suvandid&nbsp;&nbsp;&nbsp;<i class=\"fas fa-angle-double-down\"></i></p>"

    }
};

const handleFormSort = () => {
    let parent = document.getElementById("form_sort");
    let elements = document.getElementById("veryImportantOrNot");
    console.log(elements, "elements");
    console.log("Data", parent.value);

    let meme = getSearchParameters();

    console.log(meme, "meme is meme");

    if (parent) {
       $.ajax({
        url: '/apartmentFilter/',
        data: parent.value,
        dataType: 'json',
        success: function(data) {
            showResults(data);
        }
    });
    }
};



const scrollToMap = () => {

    let element = document.getElementById("categorySideMap");
    let up = document.getElementById("sihtnr");
    let helper = document.getElementById("helper");
    if (helper.classList["1"] === "fa-angle-double-down") {
        element.scrollIntoView();
        helper.classList.replace("fa-angle-double-down", "fa-angle-double-up");
    } else if (helper.classList["1"] === "fa-angle-double-up") {
        up.scrollIntoView();
        helper.classList.replace("fa-angle-double-up", "fa-angle-double-down");
    }
};


const addToCompare = () => {

    let sihtnr = document.getElementById("sihtnr").innerText;

    window.location.assign(`/compare/${sihtnr}&`);

};