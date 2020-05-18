from bs4 import *
import urllib.request
import webbrowser
import os
import django
import string
os.environ["DJANGO_SETTINGS_MODULE"] = "auto25.settings"

django.setup()

from landingpage.models import AutoListing

I = 0
TEMPORARY = 1


def remove_characters_and_make_into_integer(word):
    # long function name like in the enterprise java meme
    ok = []
    for char in word:

        if char in string.digits or char in [""]:
            ok.append(char)
    try:
        return int("".join(ok))
    except ValueError:
        pass


def scraper(pages):

    pagenumber = pages * 50 - 50
    url = "http://www.auto24.ee/kasutatud/nimekiri.php?a=101&ak=" + str(pagenumber)
    request_url = urllib.request.urlopen(url).read()
    object = BeautifulSoup(request_url, "lxml")
    table = object.find("table", class_="section search-list")
    url = table.find_all("a", href=True, class_="small-image")
    for href in url:

        ok = href.get("href")
        if ok.startswith("/used") and ok.endswith("#loan=72") is False:
            car_url = "http://www.auto24.ee" + ok
            new_url = urllib.request.urlopen(car_url).read()
            car_deal = BeautifulSoup(new_url, "lxml")

            pealkiri = car_deal.find("h1", class_="commonSubtitle")

            try:
                pealkiri = pealkiri.text
            except:
                pealkiri = ""

            mark = car_deal.find("div", id="navi-links").find_all("a")
            marks = [x.text for x in mark]
            mark = marks[marks.index("Sõiduauto")+1]

            car_info_table = car_deal.find('table', class_='section main-data')

            tech_data = car_deal.find("div", class_="tech-data col-2")

            voimsus_table = tech_data.find("table", class_="group full")

            if voimsus_table:
                useless_info = voimsus_table.find_all("td")

                if useless_info:
                    voimsus = remove_characters_and_make_into_integer(useless_info[1].text)
                else:
                    voimsus = 0
            else:
                voimsus = 0

            table_type = car_info_table.find('tr', class_='field-labisoit')
            table_value = table_type.find('span', class_='value')
            if table_value:
                odometer_size = table_value.string
                nonBreakSpace = (
                    u"\xa0"  # Creating the breakspace so we could remove that
                )
                odometer_size_int = odometer_size.replace("km", "")
                odometer_size_int_new = odometer_size_int.replace(
                    nonBreakSpace, ""
                )  # Removing &nonbreakspace
            else:
                odometer_size_int_new = 0
                return

            gaas = car_info_table.find("tr", class_="field-kytus")
            if gaas:
                gaas = gaas.find("span", class_="value")
                if gaas:
                    gaas = gaas.text
                else:
                    gaas = "idk"
            else:
                gaas = "idk"
            pilt = car_deal.find("div", id="uvImgContainer")

            if pilt:

                pildid = pilt.find_all("a")
                try:
                    pilt = [x.find("img")['src'] for x in pildid][0]
                except:
                    pilt = ""

            else:
                pilt = ""
            price_table = car_info_table.find("tr", class_="field-hind")
            price = price_table.find("span", class_="value")
            discount_table_type = car_info_table.find(
                "tr", class_="field-soodushind"
            )

            if discount_table_type:

                discount_price = discount_table_type.find("span", class_="value")
                if discount_price:
                    price = remove_characters_and_make_into_integer(discount_price.text)

            else:
                if price:
                    price = remove_characters_and_make_into_integer(price.text)
                else:
                    price = 0

            aasta = car_info_table.find("tr", class_="field-month_and_year")
            if aasta:
                aasta = aasta.find("span", class_="value")
                if aasta:
                    aasta = aasta.text
                    aasta = aasta.split("/")
                    if len(aasta) == 1:
                        aasta = aasta[0]
                    else:
                        aasta = aasta[1:][0]
                else:
                    aasta = 2020
            else:
                aasta = 2020

        vedav_sild = car_info_table.find("tr", class_="field-vedavsild")

        if vedav_sild:
            vedav_sild = vedav_sild.find("span", class_="value")
            if vedav_sild:
                vedav_sild = vedav_sild.text
            else:
                vedav_sild = ""
        else:
            vedav_sild = ""

        if not voimsus:
            voimsus = 0

        url = ok.split("/")[-1]
        auto = AutoListing(
        pealkiri=pealkiri,
        mark=mark,
        voimsus=voimsus,
        labisoit=odometer_size_int_new,
        kytus=gaas,
        pildi_url=pilt,
        hind=price,
        aasta=aasta,
        vedu=vedav_sild,
        url=url
        )

        try:

            auto.save()

        except django.db.utils.IntegrityError:

             print(pealkiri)
             print(mark)
             print(voimsus)
             print(odometer_size_int_new)
             print(gaas)
             print(pilt)
             print(price)
             print(aasta)

             os._exit(69)


for i in range(325):
    scraper(i)
