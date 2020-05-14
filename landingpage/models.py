from django.db import models

# Create your models here.


class AutoListing(models.Model):

    pealkiri = models.TextField()
    url = models.TextField()
    mark = models.TextField()
    voimsus = models.IntegerField()
    labisoit = models.IntegerField()
    kytus = models.TextField()
    pildi_url = models.TextField()
    hind = models.IntegerField()
    aasta = models.IntegerField()
    vedu = models.TextField()


class AutoSearch(models.Model):

    mark = models.TextField()
    mudel = models.TextField()
    hindFrom = models.IntegerField()
    hindTo = models.IntegerField()
    powerFrom = models.IntegerField()
    powerTo = models.IntegerField()
    odometerTo = models.IntegerField()
    odometerFrom = models.IntegerField()
    kytus = models.TextField()
    sortBy = models.TextField()
    pageNumber = models.IntegerField()


