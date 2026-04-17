const createApi = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZGY5MzczOWY4NzAwMTU3YWIwODUiLCJpYXQiOjE3NzY0MTA1MTUsImV4cCI6MTc3NzYyMDExNX0.lqS5N5fgyQeDZtZGj9410pzXNU75Ov-dmLkoLsueWTc";

// BootStrap Modal
const bootstrapModal = new bootstrap.Modal(
  document.getElementById("confirmModal"),
);
const confirmBtn = document.getElementById("confirmBtn");

const params = new URLSearchParams(window.location.search);
const myEcommerceID = params.get("id");

// --- Error Management Function ---
const showAlert = function (message, type = "danger") {
  const container = document.getElementById("error-container");
  if (!container) return;

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    <strong>${type === "danger" ? "Error" : "Success"}:</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  container.appendChild(alertDiv);

  // Auto-remove error after 10 seconds
  setTimeout(() => {
    alertDiv.classList.remove("show");
    setTimeout(() => alertDiv.remove(), 150);
  }, 10000);
};

// Create Product Api
class myEcommerce {
  constructor(_name, _description, _brand, _imageUrl, _price) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.imageUrl = _imageUrl;
    this.price = _price;
  }
}

// --- Load List ---
const getProducts = function () {
  fetch(createApi, {
    headers: { Authorization: apiKey },
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error("Failed to contact the server to load products.");
    })
    .then((products) => {
      const list = document.getElementById("load-product-loaded");
      list.innerHTML = "";
      products.forEach((p) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <span><strong>${p.name}</strong> - ${p.brand}</span>
          <div>
            <button class="btn btn-sm btn-outline-warning me-2" onclick="handleEdit('${p._id}')">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="askDelete('${p._id}')">Delete</button>
          </div>
        `;
        list.appendChild(li);
      });
    })
    .catch((err) => {
      console.log(err);
      showAlert(err.message); // Error display
    });
};

// --- Delete Product ---
const askDelete = function (id) {
  document.getElementById("modalBody").innerText =
    "Are you sure you want to DELETE this product?";
  bootstrapModal.show();

  confirmBtn.onclick = function () {
    fetch(createApi + id, {
      method: "DELETE",
      headers: { Authorization: apiKey },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Could not delete. The server rejected the request.");
        showAlert("Product deleted successfully!", "success");
        bootstrapModal.hide();
        getProducts();
      })
      .catch((err) => {
        console.log(err);
        showAlert(err.message); // Error display
      });
  };
};

// --- Edit Product ---
const handleEdit = function (id) {
  document.getElementById("modalBody").innerText =
    "Do you want to edit this product?";
  bootstrapModal.show();

  confirmBtn.onclick = function () {
    window.location.search = "?id=" + id;
  };
};

// --- Edit Form ---
if (myEcommerceID) {
  fetch(createApi + myEcommerceID, {
    headers: { Authorization: apiKey },
  })
    .then((res) => {
      if (!res.ok)
        throw new Error("The product you are trying to edit does not exist.");
      return res.json();
    })
    .then((p) => {
      document.getElementById("productName").value = p.name;
      document.getElementById("productDescription").value = p.description;
      document.getElementById("productBrand").value = p.brand;
      document.getElementById("productImg").value = p.imageUrl;
      document.getElementById("productPrice").value = p.price;
      document.querySelector("button[type='submit']").innerText =
        "Update Product";
    })
    .catch((err) => {
      console.log(err);
      showAlert(err.message); // Error display
    });
}

// --- Post or Put ---
const form = document.getElementById("ecommerceForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;

  // Manual validation
  if (!name || !price) {
    showAlert("Name and Price are required!", "warning");
    return;
  }

  const newProduct = new myEcommerce(
    name,
    document.getElementById("productDescription").value,
    document.getElementById("productBrand").value,
    document.getElementById("productImg").value,
    price,
  );

  let urlToUse = myEcommerceID ? createApi + myEcommerceID : createApi;
  let methodToUse = myEcommerceID ? "PUT" : "POST";

  fetch(urlToUse, {
    method: methodToUse,
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
  })
    .then((ress) => {
      if (!ress.ok)
        throw new Error("Server communication error. Code: " + ress.status);

      showAlert(
        myEcommerceID ? "Product Updated!" : "Product Saved!",
        "success",
      );

      if (myEcommerceID) {
        setTimeout(() => {
          window.location.search = "";
        }, 1500);
      } else {
        form.reset();
        getProducts();
      }
    })
    .catch((err) => {
      console.log("Error!", err);
      showAlert(err.message); // Error display
    });
});

// Footer
const footerYear = function () {
  const span = document.getElementById("year");
  if (span) span.innerText = new Date().getFullYear();
};

footerYear();
getProducts();
