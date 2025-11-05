from django.db import models
from django.contrib.auth.models import User
class Pet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    breed = models.CharField(max_length=200, blank=True)
    dob = models.CharField(max_length=100, blank=True)
    chip = models.CharField(max_length=200, blank=True)
    owner_name = models.CharField(max_length=200, blank=True)
    contacts = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=200, blank=True)
    vet = models.TextField(blank=True)
    food = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name} ({self.user})"

class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title
