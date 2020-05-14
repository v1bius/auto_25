import bs4
from urllib.request import urlopen
import sqlite3
import time
from urllib.error import *
import django
import os

os.environ["DJANGO_SETTINGS_MODULE"] = "auto25.settings"

django.setup()

from landingpage.models import AutoListing


class Scraper:

    def __init__(self):

        self.baseUrl = "https://www.auto24.ee/used/{}"

        self.startFrom = 3254743

        self.connection = sqlite3.connect("autoAndmed.db")
        self.cursor = self.connection.cursor()

    def start(self):

        while self.startFrom < 5000000:
            try:
                self.startscraping()
            except HTTPError:
                pass
            self.startFrom += 1

    def startscraping(self, continuefrom=None):

        if continuefrom:

            i = continuefrom

        else:
            i = self.startFrom

        url = self.baseUrl.format(i)

        # print(url, "url")

        openedUrl = urlopen(url).read()

        bs4Object = bs4.BeautifulSoup(openedUrl, "lxml")

        pealkirjad = bs4Object.find_all("h1")
        pealkiri = ""

        for possiblePealkiri in pealkirjad:

            if len(possiblePealkiri['class']) != 0 and possiblePealkiri['class'][0] == "commonSubtitle":
                pealkiri = possiblePealkiri.text
                break
            else:
                pealkiri = ""

        pealkiri_jupid = pealkiri.split()

        if len(pealkiri_jupid) > 0:
            mark = pealkiri_jupid[0]
        else:
            mark = ""

        voimsused = bs4Object.find_all("tr", class_="field-mootorvoimsus")
        voimsus = 0

        for possiblevoimsus in voimsused:
            possiblevoimsus = possiblevoimsus.find("td", text="Mootor:").find_next_sibling("td").text

            if len(possiblevoimsus) > 5 and "kW" in possiblevoimsus:

                #voimsus = int(possiblevoimsus.split("(")[1].split(")")[0].split()[0])
                voimsus_1 = possiblevoimsus.split("(")[1]
                voimsus_2 = voimsus_1.split(")")[0]
                voimsus = voimsus_2.split()[0]

                if "cm³" in voimsus_2:
                    voimsus_2 = voimsus_2.split(",")
                    voimsus = int(voimsus_2[1].split()[0])
                break

            else:
                break

        labisoidud = bs4Object.find_all("tr", class_="field-labisoit")
        labisoit_int = 0

        for possiblelabisoit in labisoidud:
            possiblelabisoit = possiblelabisoit.find("td", text="Läbisõidumõõdiku näit:").find_next_sibling("td").text

            if len(possiblelabisoit) != 0:
                labisoit_list = possiblelabisoit.split()
                labisoit_str = ''.join(map(str, labisoit_list))
                labisoit_int1 = labisoit_str.split("km")[0]

                if labisoit_int1.isdigit():
                    labisoit_int = int(labisoit_str.split("km")[0])
                    break
                else:
                    break
            else:
                break

        kytused = bs4Object.find_all("tr", class_="field-kytus")
        kytus = "puudub"

        for possiblekytus in kytused:
            possiblekytus = possiblekytus.find("td", text="Kütus:").find_next_sibling("td").text

            if len(possiblekytus) != 0:
                kytus = possiblekytus
                break
            else:
                break

        img_url = bs4Object.find_all("img")


        #print("Pealkiri: {}\nMark: {}\nVõimsus: {}\nLäbisõit: {}\nKütusetüüp: {}\n"
              #.format(pealkiri, mark, voimsus, labisoit_int, kytus))


        auto = AutoListing(pealkiri=pealkiri, mark=mark, voimsus=voimsus, labisoit=labisoit_int, kytus=kytus, pildi_url="")

        auto.save()

scraper = Scraper()

scraper.start()
