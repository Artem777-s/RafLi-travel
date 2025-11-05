from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .forms import PetForm, ProductForm
from .models import Pet, Product
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'index.html')

def tips(request):
    return render(request, 'tips.html')

def events(request):
    return render(request, 'events.html')

def shop(request):
    products = Product.objects.all().order_by('-created_at')
    return render(request, 'shop.html', {'products': products})

def register_view(request):
    if request.method == 'POST' and 'register' in request.POST:
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('register_pet')
    elif request.method == 'POST' and 'login' in request.POST:
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('register_pet')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

@login_required
def register_pet(request):
    if request.method == 'POST':
        form = PetForm(request.POST)
        if form.is_valid():
            pet = form.save(commit=False)
            pet.user = request.user
            pet.save()
            return redirect('pet_detail', pk=pet.id)
    else:
        form = PetForm()
    return render(request, 'register_pet.html', {'form': form})

def pet_detail(request, pk):
    pet = get_object_or_404(Pet, pk=pk)
    return render(request, 'pet_detail.html', {'pet': pet})

@login_required
def admin_add_product(request):
    if not request.user.is_staff:
        return redirect('shop')
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('shop')
    else:
        form = ProductForm()
    return render(request, 'admin_add.html', {'form': form})
