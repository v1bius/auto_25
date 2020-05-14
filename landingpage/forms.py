from django import forms

from .models import AutoSearch


class AutoSearchForm(forms.ModelForm):

    class Meta:

        model = AutoSearch

        fields = [
            "mark",
            "mudel",
            "hindFrom",
            "hindTo",
            "powerFrom",
            "powerTo",
            "odometerTo",
            "odometerFrom",
            "kytus",
            "sortBy",
            "pageNumber"
        ]