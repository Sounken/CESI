class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async fetchAllVins() {
        try {
            const response = await fetch(`${this.baseUrl}/vins`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Erreur HTTP: ${response.status} - ${errorData.message || 'Erreur inconnue lors de la récupération des vins.'}`);
            }
            return await response.json();
        } catch (error) {
            console.error("🚨 Erreur API - Récupération des vins:", error);
            throw error;
        }
    }

    async addVin(vinData) {
        try {
            console.log("➡️ Envoi des données du vin à l'API:", vinData);

            const response = await fetch(`${this.baseUrl}/vins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vinData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `Erreur HTTP: ${response.status} lors de l'ajout du vin.`);
            }
            return await response.json();
        } catch (error) {
            console.error("🚨 Erreur API - Ajout du vin:", error);
            throw error;
        }
    }
}

class VinDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`❌ Erreur: Conteneur HTML avec l'ID "${containerId}" non trouvé pour VinDisplay.`);
        }
    }

    createVinCardHtml(vin, isWishlisted = false, index) {
        let masonryClass = '';
        if (window.innerWidth >= 1024) {
            if (index % 3 === 1) {
                masonryClass = 'lg:mt-12';
            } else if (index % 3 === 2) {
                masonryClass = 'lg:mt-24';
            }
        }

        return `
            <div class="group relative ${masonryClass}" data-vin-id="${vin.id}">
                <div class="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-amber-500"></div>
                    
                    <div class="relative overflow-hidden">
                        <img
                            src="${vin.imageURL || 'https://via.placeholder.com/400x300?text=Vin+Inconnu'}" 
                            alt="${vin.nom || 'Vin sans nom'}"
                            class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        <div class="absolute top-6 right-6 bg-black/80 backdrop-blur-xl rounded-full px-4 py-2 border border-amber-400/30">
                            <span class="text-amber-400 font-bold text-lg">${vin.prix ? vin.prix.toFixed(2) : 'N/A'}€</span>
                        </div>
                        
                        <button class="absolute top-6 left-6 p-3 bg-black/80 backdrop-blur-xl rounded-full hover:bg-black/90 transition-all duration-300 border border-white/10 hover:border-red-400/50 wishlist-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 transition-all duration-300 ${isWishlisted ? 'text-red-400 fill-current scale-110' : 'text-white/70 hover:text-red-400'}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        </button>
                    </div>
                    
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="inline-block px-3 py-1 bg-gradient-to-r from-amber-400/20 to-red-500/20 text-amber-400 text-sm font-medium rounded-full mb-2 border border-amber-400/30">
                                    ${vin.annee || 'N/A'} • ${vin.cepage || 'Inconnu'}
                                </span>
                                <h3 class="text-2xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
                                    ${vin.nom || 'Vin sans nom'}
                                </h3>
                            </div>
                        </div>
                        
                        <p class="text-white/70 text-sm mb-6 line-clamp-2 leading-relaxed">
                            ${vin.description || 'Pas de description disponible pour ce vin.'}
                        </p>
                        
                        <div class="flex space-x-3">
                            <button class="flex-1 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-amber-400/50 transition-all duration-300 font-medium group flex items-center justify-center space-x-2 btn-details">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                <span>Détails</span>
                            </button>
                            <button class="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-red-500 text-black rounded-xl hover:from-red-500 hover:to-amber-400 transition-all duration-300 font-bold hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 btn-add-to-cart">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displayVins(wines, wishlist) {
        if (!this.container) return;

        this.container.innerHTML = '';

        if (wines.length === 0) {
            this.container.innerHTML = '<p class="text-white/70 text-center py-4">🍷 Aucun vin trouvé. Essayez d\'ajuster vos filtres ou ajoutez-en un nouveau !</p>';
            return;
        }

        const vinsHtml = wines.map((vin, index) => {
            const isWishlisted = wishlist.includes(vin.id);
            return this.createVinCardHtml(vin, isWishlisted, index);
        }).join('');
        
        this.container.innerHTML = vinsHtml;
    }

    displayError(message) {
        if (!this.container) return;
        this.container.innerHTML = `<p class="text-red-500 text-center py-4">⚠️ Erreur : ${message}</p>`;
    }

    displayLoading(message = 'Chargement des vins...') {
        if (!this.container) return;
        this.container.innerHTML = `<p class="text-white/70 text-center py-4">⏳ ${message}</p>`;
    }
}

class CartDisplay {
    constructor(itemsContainerId, totalElementId, countTextId, sidebarId, summaryId) {
        this.itemsContainer = document.getElementById(itemsContainerId);
        this.totalElement = document.getElementById(totalElementId);
        this.countTextElement = document.getElementById(countTextId);
        this.sidebar = document.getElementById(sidebarId);
        this.summaryElement = document.getElementById(summaryId);

        if (!this.itemsContainer || !this.totalElement || !this.countTextElement || !this.sidebar || !this.summaryElement) {
            console.error("❌ Erreur: Un ou plusieurs éléments DOM du panier sont introuvables. Vérifiez les IDs.");
        }
    }

    openCart() {
        if (this.sidebar) {
            this.sidebar.classList.remove('translate-x-full');
            this.sidebar.classList.add('translate-x-0');
        }
    }

    closeCart() {
        if (this.sidebar) {
            this.sidebar.classList.remove('translate-x-0');
            this.sidebar.classList.add('translate-x-full');
        }
    }

    renderCart(cartItems) {
        if (!this.itemsContainer || !this.totalElement || !this.countTextElement || !this.summaryElement) return;

        let cartTotal = 0;
        let cartItemsCount = 0;

        this.itemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            this.itemsContainer.innerHTML = `
                <div class="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-white/30 mx-auto mb-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <p class="text-white/50 text-lg">Votre panier est vide</p>
                </div>
            `;
            this.summaryElement.classList.add('hidden');
        } else {
            this.summaryElement.classList.remove('hidden');
            cartItems.forEach(item => {
                cartTotal += item.wine.prix * item.quantity;
                cartItemsCount += item.quantity;

                const cartItemHtml = `
                    <div class="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cart-item-card" data-item-id="${item.wine.id}">
                        <div class="flex items-center space-x-4">
                            <img src="${item.wine.imageURL || 'https://via.placeholder.com/80x80?text=Vin'}" alt="${item.wine.nom}" class="w-20 h-20 object-cover rounded-xl" />
                            <div class="flex-1">
                                <h3 class="font-bold text-white text-lg">${item.wine.nom}</h3>
                                <p class="text-white/60 text-sm">${item.wine.annee} • ${item.wine.cepage}</p>
                                <p class="font-bold text-amber-400 text-lg">${item.wine.prix.toFixed(2)}€</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between mt-4">
                            <div class="flex items-center space-x-3 bg-white/10 rounded-full p-1">
                                <button class="p-2 hover:bg-white/20 rounded-full transition-all duration-300 quantity-button minus" aria-label="Diminuer la quantité">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-white"><path d="M5 12h14"/></svg>
                                </button>
                                <span class="w-8 text-center text-white font-bold quantity-display">${item.quantity}</span>
                                <button class="p-2 hover:bg-white/20 rounded-full transition-all duration-300 quantity-button plus" aria-label="Augmenter la quantité">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-white"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                                </button>
                            </div>
                            <span class="text-white font-bold text-lg">
                                ${(item.wine.prix * item.quantity).toFixed(2)}€
                            </span>
                        </div>
                    </div>
                `;
                this.itemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
            });
        }

        this.totalElement.textContent = `${cartTotal.toFixed(2)}€`;
        this.countTextElement.textContent = `${cartItemsCount} article${cartItemsCount > 1 ? 's' : ''}`;
        
        const cartButtonCount = document.getElementById('cart-items-count');
        if (cartButtonCount) {
            if (cartItemsCount > 0) {
                cartButtonCount.textContent = cartItemsCount.toString();
                cartButtonCount.classList.remove('hidden');
            } else {
                cartButtonCount.classList.add('hidden');
            }
        }
    }
}

class ModalDisplay {
    constructor(modalId, contentId) {
        this.modal = document.getElementById(modalId);
        this.contentContainer = document.getElementById(contentId);

        if (!this.modal || !this.contentContainer) {
            console.error("❌ Erreur: Élément(s) de la modale introuvable(s). Vérifiez les IDs.");
        }

        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    openModal(wine) {
        if (!this.modal || !this.contentContainer) return;
        
        const modalHtml = `
            <div class="relative">
                <img
                    src="${wine.imageURL || 'https://via.placeholder.com/800x600?text=Vin+Inconnu'}"
                    alt="${wine.nom || 'Vin sans nom'}"
                    class="w-full h-80 object-cover rounded-t-3xl"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <button class="absolute top-6 right-6 p-3 bg-black/80 backdrop-blur-xl rounded-full hover:bg-black/90 transition-all duration-300 border border-white/20 modal-close-button" aria-label="Fermer la fenêtre des détails du vin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-white"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
            </div>
            
            <div class="p-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div class="mb-6">
                            <span class="inline-block px-4 py-2 bg-gradient-to-r from-amber-400/20 to-red-500/20 text-amber-400 text-sm font-medium rounded-full mb-4 border border-amber-400/30">
                                ${wine.annee || 'N/A'} • ${wine.cepage || 'Inconnu'}
                            </span>
                            <h2 class="text-4xl font-bold text-white mb-2">${wine.nom || 'Vin sans nom'}</h2>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-6 mb-8">
                            <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <span class="text-white/50 text-sm block mb-1">Quantité en Stock</span>
                                <p class="text-white font-bold text-xl">${wine.quantiteStock || 0} unités</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="mb-8">
                            <h3 class="text-xl font-bold text-white mb-4">Description</h3>
                            <p class="text-white/70 leading-relaxed">${wine.description || 'Pas de description détaillée disponible pour ce vin.'}</p>
                        </div>
                        
                        <div class="flex items-center justify-between mb-8">
                            <span class="text-4xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                                ${wine.prix ? wine.prix.toFixed(2) : 'N/A'}€
                            </span>
                        </div>
                        
                        <button class="w-full bg-gradient-to-r from-amber-400 to-red-500 text-black py-4 rounded-2xl hover:from-red-500 hover:to-amber-400 transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 modal-add-to-cart-button">
                            Ajouter au panier - ${wine.prix ? wine.prix.toFixed(2) : 'N/A'}€
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.contentContainer.innerHTML = modalHtml;
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');

        this.contentContainer.querySelector('.modal-close-button')?.addEventListener('click', () => this.closeModal());
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.modal.classList.remove('flex');
            this.contentContainer.innerHTML = '';
        }
    }
}

class AppState {
    constructor() {
        this.wines = [];
        this.cart = [];
        this.selectedWine = null;
        this.wishlist = [];
        this.filterType = 'Tous';
        this.searchTerm = '';

        this.apiService = new ApiService(window.location.origin + '/api');
        this.vinDisplay = new VinDisplay('vins-list');
        this.cartDisplay = new CartDisplay('cart-items-container', 'cart-total-price', 'cart-item-count-text', 'cart-sidebar', 'cart-summary');
        this.modalDisplay = new ModalDisplay('wine-detail-modal', 'wine-detail-content');

        this.addWineForm = document.getElementById('add-wine-form');
        this.addWineMessageElement = document.getElementById('add-wine-message');
        this.searchInputElement = document.getElementById('search-input');
        this.filterTypeSelectElement = document.getElementById('filter-type-select');
        this.cartButtonElement = document.getElementById('cart-button');
        this.closeCartButtonElement = document.getElementById('close-cart-button');
        this.discoverCollectionButtonElement = document.getElementById('discover-collection-button');
        this.catalogSectionElement = document.getElementById('catalog-section');

        if (!this.addWineForm) {
            console.error("❌ Erreur: Le formulaire d'ajout de vin (ID 'add-wine-form') est introuvable. Vérifiez votre HTML.");
        }
        if (!this.addWineMessageElement) {
            console.error("❌ Erreur: L'élément de message (ID 'add-wine-message') est introuvable. Vérifiez votre HTML.");
        }

        this.initEventListeners();
    }

    async init() {
        this.vinDisplay.displayLoading('Chargement des vins...');
        try {
            this.wines = await this.apiService.fetchAllVins();
            if (this.wines.length < 1) {
                console.error("Aucun vin récupéré dans la base de donnée.");
            }
            this.renderFilteredWines();
        } catch (error) {
            this.vinDisplay.displayError(`Impossible de charger les vins: ${error.message}`);
        }
    }

    initEventListeners() {
        this.cartButtonElement?.addEventListener('click', () => this.cartDisplay.openCart());
        this.closeCartButtonElement?.addEventListener('click', () => this.cartDisplay.closeCart());
        this.discoverCollectionButtonElement?.addEventListener('click', () => {
            this.catalogSectionElement?.scrollIntoView({ behavior: 'smooth' });
        });

        this.searchInputElement?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderFilteredWines();
        });
        this.filterTypeSelectElement?.addEventListener('change', (e) => {
            this.filterType = e.target.value;
            this.renderFilteredWines();
        });

        this.vinDisplay.container?.addEventListener('click', (event) => {
            const target = event.target;

            const detailsButton = target.closest('.btn-details');
            if (detailsButton) {
                const vinCard = detailsButton.closest('.group');
                const vinId = vinCard?.dataset.vinId;
                if (vinId) {
                    this.setSelectedWine(vinId);
                }
                return;
            }

            const addToCartButton = target.closest('.btn-add-to-cart');
            if (addToCartButton) {
                const vinCard = addToCartButton.closest('.group');
                const vinId = vinCard?.dataset.vinId;
                if (vinId) {
                    const wineToAdd = this.wines.find(w => w.id === vinId);
                    if (wineToAdd) {
                        this.addToCart(wineToAdd);
                    }
                }
                return;
            }

            const wishlistButton = target.closest('.wishlist-button');
            if (wishlistButton) {
                const vinCard = wishlistButton.closest('.group');
                const vinId = vinCard?.dataset.vinId;
                if (vinId) {
                    this.toggleWishlist(vinId);
                }
                return;
            }
        });

        this.modalDisplay.contentContainer?.addEventListener('click', (event) => {
            const target = event.target;
            const modalAddToCartButton = target.closest('.modal-add-to-cart-button');
            if (modalAddToCartButton && this.selectedWine) {
                this.addToCart(this.selectedWine);
                this.setSelectedWine(null);
            }
        });

        this.cartDisplay.itemsContainer?.addEventListener('click', (event) => {
            const target = event.target;
            const itemCard = target.closest('.cart-item-card');
            if (!itemCard) return;

            const itemId = itemCard.dataset.itemId;
            if (!itemId) return;

            const currentItem = this.cart.find(item => item.wine.id === itemId);
            if (!currentItem) return;

            if (target.closest('.quantity-button.minus')) {
                this.updateCartQuantity(itemId, currentItem.quantity - 1);
            } else if (target.closest('.quantity-button.plus')) {
                this.updateCartQuantity(itemId, currentItem.quantity + 1);
            }
        });

        this.addWineForm?.addEventListener('submit', this.handleAddWineSubmit.bind(this));
    }

    async handleAddWineSubmit(e) {
        e.preventDefault();
        this.addWineMessageElement.textContent = '';
        this.addWineMessageElement.className = 'mt-4 text-sm font-bold';

        const form = e.target;
        const formData = new FormData(form);
        const vinData = {};

        for (const [key, value] of formData.entries()) {
            vinData[key] = value;
        }

        console.log("🛠️ Tentative d'ajout de vin avec les données:", vinData);

        if (!vinData.nom || vinData.nom.trim() === '') {
            this.displayFormError("Le nom du vin est requis.");
            return;
        }
        if (!vinData.cepage || vinData.cepage.trim() === '') {
            this.displayFormError("Le cépage est requis.");
            return;
        }

        vinData.annee = parseInt(vinData.annee);
        vinData.prix = parseFloat(vinData.prix);
        vinData.quantiteStock = parseInt(vinData.quantiteStock);

        if (isNaN(vinData.annee) || vinData.annee < 1900 || vinData.annee > new Date().getFullYear() + 5) {
            this.displayFormError("Veuillez saisir une année valide.");
            return;
        }
        if (isNaN(vinData.prix) || vinData.prix <= 0) {
            this.displayFormError("Le prix doit être un nombre positif.");
            return;
        }
        if (isNaN(vinData.quantiteStock) || vinData.quantiteStock < 0) {
            this.displayFormError("La quantité en stock doit être un nombre positif ou nul.");
            return;
        }
        
        let genericImageURL = "https://images.pexels.com/photos/1407847/pexels-photo-1407847.jpeg";
        const imageType = vinData.imageType;

        if (imageType === 'rouge') {
            genericImageURL = "https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg";
        } else if (imageType === 'blanc') {
            genericImageURL = "https://images.pexels.com/photos/1407848/pexels-photo-1407848.jpeg";
        } else if (imageType === 'effervescent') {
            genericImageURL = "https://images.pexels.com/photos/1407849/pexels-photo-1407849.jpeg";
        }
        vinData.imageURL = genericImageURL;
        
        delete vinData.imageType; 

        try {
            const newVin = await this.apiService.addVin(vinData);
            console.log("✅ Vin ajouté avec succès:", newVin);
            
            this.wines.push(newVin);
            this.renderFilteredWines();

            this.displayFormSuccess(`Vin "${newVin.nom}" ajouté avec succès ! 🎉`);
            form.reset();
        } catch (error) {
            console.error("Erreur lors de l'ajout du vin via le formulaire:", error);
            this.displayFormError(`Erreur lors de l'ajout du vin: ${error.message}`);
        }
    }

    displayFormError(message) {
        if (this.addWineMessageElement) {
            this.addWineMessageElement.textContent = `${message}`;
            this.addWineMessageElement.className = 'mt-4 text-sm font-bold text-red-500';
        }
    }

    displayFormSuccess(message) {
        if (this.addWineMessageElement) {
            this.addWineMessageElement.textContent = message;
            this.addWineMessageElement.className = 'mt-4 text-sm font-bold text-green-400';
        }
    }

    renderFilteredWines() {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();

        const filteredWines = this.wines.filter(wine => {
            const matchesType = this.filterType === 'Tous' || 
                                (wine.cepage && wine.cepage.toLowerCase().includes(this.filterType.toLowerCase()));
            
            const matchesSearch = (wine.nom && wine.nom.toLowerCase().includes(lowerCaseSearchTerm)) ||
                                (wine.cepage && wine.cepage.toLowerCase().includes(lowerCaseSearchTerm)) ||
                                (String(wine.annee).includes(lowerCaseSearchTerm));
            
            return matchesType && matchesSearch;
        });
        this.vinDisplay.displayVins(filteredWines, this.wishlist);
    }

    addToCart(wine) {
        const existingItem = this.cart.find(item => item.wine.id === wine.id);
        if (existingItem) {
            existingItem.quantity += 1;
            console.log(`🛒 Quantité de "${wine.nom}" augmentée à ${existingItem.quantity}.`);
        } else {
            this.cart.push({ wine: wine, quantity: 1 });
            console.log(`🛒 "${wine.nom}" ajouté au panier.`);
        }
        this.cartDisplay.renderCart(this.cart);
    }

    updateCartQuantity(wineId, newQuantity) {
        if (newQuantity <= 0) {
            this.cart = this.cart.filter(item => item.wine.id !== wineId);
            console.log(`🗑️ Vin avec ID ${wineId} retiré du panier.`);
        } else {
            const item = this.cart.find(item => item.wine.id === wineId);
            if (item) {
                item.quantity = newQuantity;
                console.log(`🛒 Quantité de vin ID ${wineId} mise à jour à ${newQuantity}.`);
            }
        }
        this.cartDisplay.renderCart(this.cart);
    }

    setSelectedWine(wineId) {
        this.selectedWine = this.wines.find(w => w.id === wineId) || null;
        if (this.selectedWine) {
            this.modalDisplay.openModal(this.selectedWine);
            console.log(`🔍 Ouverture des détails pour "${this.selectedWine.nom}".`);
        } else {
            this.modalDisplay.closeModal();
            console.log("Modale des détails fermée.");
        }
    }

    toggleWishlist(wineId) {
        if (this.wishlist.includes(wineId)) {
            this.wishlist = this.wishlist.filter(id => id !== wineId);
            console.log(`💔 Vin ID ${wineId} retiré de la liste de souhaits.`);
        } else {
            this.wishlist.push(wineId);
            console.log(`❤️ Vin ID ${wineId} ajouté à la liste de souhaits.`);
        }
        this.renderFilteredWines();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 Le DOM est chargé, initialisation de l'application...");
    const app = new AppState();
    await app.init();

    const floatingElementsContainer = document.getElementById('floating-elements-container');
    if (floatingElementsContainer) {
        for (let i = 0; i < 20; i++) {
            const div = document.createElement('div');
            div.className = 'absolute w-2 h-2 bg-amber-400/30 rounded-full animate-pulse opacity-0';
            div.style.left = `${Math.random() * 100}%`;
            div.style.top = `${Math.random() * 100}%`;
            div.style.animationDelay = `${Math.random() * 3}s`;
            div.style.animationDuration = `${2 + Math.random() * 3}s`;
            div.style.transition = 'opacity 0.5s ease-in';
            floatingElementsContainer.appendChild(div);

            setTimeout(() => {
                div.classList.remove('opacity-0');
            }, 50);
        }
        console.log("✨ Bulles flottantes générées dans la section hero.");
    }
});
