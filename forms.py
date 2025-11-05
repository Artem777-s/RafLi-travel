from django import forms
from .models import Pet, Product
class PetForm(forms.ModelForm):
    class Meta:
        model = Pet
        fields = ['name','breed','dob','chip','owner_name','contacts','city','vet','food','notes']

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['title','description','image']
