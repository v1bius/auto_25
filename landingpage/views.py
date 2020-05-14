from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from .models import AutoListing
from .forms import AutoSearchForm
import random
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
# Create your views here.

SORT_DICT = {
    "2": "hind",
    "3": "aasta"
}


class SearchView(TemplateView):

    template_name = "pages/index.html"

    def get(self, request, bn, a, mark, mudel, hindFrom, hindTo, powerFrom, powerTo, odometerFrom, odometerTo):
        return self.template_name


class IndexView(TemplateView):

    template_name = "pages/auto25.html"

    def post(self, request):
        """form = ElukohaKontrollForm(request.POST or None)
        if form.is_valid():
            return redirect("naitaOtsinguid", asukoht=form.data.get("asukoht"))
        context = {"form": form}
        return render(request, "pages/index-et.html", context)"""
        pass

    def get(self, request):
        requestDict = dict(request.GET)
        form = AutoSearchForm()
        if len(requestDict.keys()) > 1:
            hindFrom = int(requestDict.get("hindFrom")[0]) if requestDict.get("hindFrom")[0] else 0
            hindTo = int(requestDict.get("hindTo")[0]) if requestDict.get("hindTo")[0] else 9999999
            powerFrom = int(requestDict.get("powerFrom")[0]) if requestDict.get("powerFrom")[0] else 0
            powerTo = int(requestDict.get("powerTo")[0]) if requestDict.get("powerTo")[0] else 9999999
            odometerFrom = int(requestDict.get("odometerFrom")[0]) if requestDict.get("odometerFrom")[0] else 0
            odometerTo = int(requestDict.get("odometerTo")[0]) if requestDict.get("odometerTo")[0] else 9999999
            kytus = requestDict.get("gasType")[0]
            mark = requestDict.get("mark")[0]
            pageNr = requestDict.get("pageNumber")[0]
            sortBy = requestDict.get("sortBy")[0]
            if mark == "kõik":
                cars = AutoListing.objects.filter(
                    hind__gte=hindFrom,
                    hind__lte=hindTo,
                    voimsus__gte=powerFrom,
                    voimsus__lte=powerTo,
                    labisoit__gte=odometerFrom,
                    labisoit__lte=odometerTo
                ).order_by(SORT_DICT.get(sortBy))

                if kytus == "kõik":
                    cars = AutoListing.objects.filter(
                        hind__gte=hindFrom,
                        hind__lte=hindTo,
                        voimsus__gte=powerFrom,
                        voimsus__lte=powerTo,
                        labisoit__gte=odometerFrom,
                        labisoit__lte=odometerTo
                    ).order_by(SORT_DICT.get(sortBy))

                else:
                    cars = AutoListing.objects.filter(
                        kytus=kytus,
                        hind__gte=hindFrom,
                        hind__lte=hindTo,
                        voimsus__gte=powerFrom,
                        voimsus__lte=powerTo,
                        labisoit__gte=odometerFrom,
                        labisoit__lte=odometerTo
                    ).order_by(SORT_DICT.get(sortBy))

            else:

                if kytus == "kõik":
                    cars = AutoListing.objects.filter(
                        mark=mark,
                        hind__gte=hindFrom,
                        hind__lte=hindTo,
                        voimsus__gte=powerFrom,
                        voimsus__lte=powerTo,
                        labisoit__gte=odometerFrom,
                        labisoit__lte=odometerTo
                    ).order_by(SORT_DICT.get(sortBy))
                else:
                    cars = AutoListing.objects.filter(
                        mark=mark,
                        kytus=kytus,
                        hind__gte=hindFrom,
                        hind__lte=hindTo,
                        voimsus__gte=powerFrom,
                        voimsus__lte=powerTo,
                        labisoit__gte=odometerFrom,
                        labisoit__lte=odometerTo
                    ).order_by(SORT_DICT.get(sortBy))

        else:
            hindFrom = ""
            powerFrom = ""
            odometerFrom = ""
            kytus = "kõik"
            mark = "kõik"
            sortBy = "2"
            pageNr = 1
            cars = AutoListing.objects.all().order_by(SORT_DICT.get(sortBy))

        paginator = Paginator(cars, 50)
        meme = ["M", "A"]
        lol = random.choice(meme)

        options = AutoListing.objects.all().distinct("mark")
        try:
            cars = paginator.page(pageNr)
        except PageNotAnInteger:
            cars = paginator.page(1)
        except EmptyPage:
            cars = paginator.page(paginator.num_pages)

        if hindFrom == 0:
            hindFrom = ""
        if powerFrom == 0:
            powerFrom = ""
        if odometerFrom == 0:
            odometerFrom = ""

        powerTo = ""
        hindTo = ""
        odometerTo = ""

        return render(request, self.template_name, {
            "cars": cars, "transmission": lol,
            "form": form, "options": [x.mark for x in options],
            "hindFrom": hindFrom,
            "hindTo": hindTo,
            "powerFrom": powerFrom,
            "powerTo": powerTo,
            "odometerFrom": odometerFrom,
            "odometerTo": odometerTo,
            "kytus": kytus,
            "mark": mark,
            "pageNr": pageNr
            })