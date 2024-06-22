document.addEventListener('DOMContentLoaded', () => {
    const btnCart = document.querySelector('.container-cart-icon');
    const containerCartProducts = document.querySelector('.container-cart-products');
    const purchaseButton = document.createElement('button');
    purchaseButton.textContent = 'Comprar';
    purchaseButton.classList.add('purchase-button');
    containerCartProducts.appendChild(purchaseButton);

    btnCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
    });

    const rowProduct = document.querySelector('.row-product');
    const productsList = document.querySelector('.container-items');

    let allProducts = JSON.parse(localStorage.getItem("AddedToCart")) || [];

    const valorTotal = document.querySelector('.total-pagar');
    const countProducts = document.querySelector('#contador-productos');

    const cartEmpty = document.querySelector('.cart-empty');
    const cartTotal = document.querySelector('.cart-total');

    productsList.addEventListener('click', e => {
        if (e.target.classList.contains('btn-add-cart')) {
            const product = e.target.parentElement;

            const infoProduct = {
                quantity: 1,
                title: product.querySelector('h2').textContent,
                price: product.querySelector('p').textContent,
            };

            const exists = allProducts.some(
                product => product.title === infoProduct.title
            );

            if (exists) {
                alert('Este artículo ya está en el carrito.');
            } else {
                allProducts = [...allProducts, infoProduct];
                saveLocal();
                showHTML();
            }
        }
    });

    rowProduct.addEventListener('click', e => {
        if (e.target.closest('.icon-close')) {
            const product = e.target.closest('.cart-product');
            const title = product.querySelector('.titulo-producto-carrito').textContent;

            allProducts = allProducts.filter(
                product => product.title !== title
            );

            saveLocal();
            showHTML();
        } else if (e.target.closest('.icon-add')) {
            const product = e.target.closest('.cart-product');
            const title = product.querySelector('.titulo-producto-carrito').textContent;

            allProducts = allProducts.map(product => {
                if (product.title === title) {
                    product.quantity++;
                }
                return product;
            });

            saveLocal();
            showHTML();
        } else if (e.target.closest('.icon-remove')) {
            const product = e.target.closest('.cart-product');
            const title = product.querySelector('.titulo-producto-carrito').textContent;

            allProducts = allProducts.map(product => {
                if (product.title === title && product.quantity > 1) {
                    product.quantity--;
                }
                return product;
            }).filter(product => product.quantity > 0);

            saveLocal();
            showHTML();
        }
    });

    // Modal
    const modal = document.getElementById("purchaseModal");
    const closeModalBtn = document.querySelector(".close");
    const finalizarCompraBtn = document.getElementById("finalizarCompra");
    // Abrir moda al hacer click en comprar
    purchaseButton.addEventListener('click', () => {
        if (allProducts.length === 0) {
            alert('El carrito está vacío!');
        } else {
            modal.style.display = "block";
        }
    });
    // Cerrar modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });
    // Cerrar modal cuando hay click afuera
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
    // Finalizar compra
    finalizarCompraBtn.addEventListener('click', () => {
        const form = document.getElementById('purchaseForm');
        if (form.checkValidity()) {
            modal.style.display = "none";
            allProducts = [];
            localStorage.removeItem("AddedToCart");
            showHTML();
            alert('Nuestro equipo de venta se contactará contigo en 24hs, ¡Gracias por tu compra!');
        } else {
            form.reportValidity();
        }
    });

    const showHTML = () => {
        if (!allProducts.length) {
            cartEmpty.classList.remove('hidden');
            rowProduct.classList.add('hidden');
            cartTotal.classList.add('hidden');
        } else {
            cartEmpty.classList.add('hidden');
            rowProduct.classList.remove('hidden');
            cartTotal.classList.remove('hidden');
        }

        rowProduct.innerHTML = '';

        let total = 0;
        let totalOfProducts = 0;

        allProducts.forEach(product => {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('cart-product');

            containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title}</p>
                    <span class="precio-producto-carrito">${product.price}</span>
                </div>
                <div class="icon-circle icon-close">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="icon-close"
                        width="16" height="16"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <div class="icon-circle icon-add">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="icon-add"
                        width="16" height="16"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </div>
                <div class="icon-circle icon-remove">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="icon-remove"
                        width="16" height="16"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12H9"
                        />
                    </svg>
                </div>
            `;

            rowProduct.append(containerProduct);

            total = total + parseInt(product.quantity * product.price.slice(1));
            totalOfProducts = totalOfProducts + product.quantity;
        });

        valorTotal.innerText = `$${total}`;
        countProducts.innerText = totalOfProducts;
    };

    const saveLocal = () => {
        localStorage.setItem("AddedToCart", JSON.stringify(allProducts));
    };

    // Llama a showHTML al cargar la página para mostrar los productos guardados en localStorage
    showHTML();
});
