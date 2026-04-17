const footerYear = function () {
  const span = document.getElementById("year");
  if (span) span.innerText = new Date().getFullYear();
};

const myEcommerceURL = "https://striveschool-api.herokuapp.com/api/product/";

const allTheParameters = new URLSearchParams(window.location.search);
const myEcommerceID = allTheParameters.get("id");

const getDetails = function () {
  fetch(myEcommerceURL + myEcommerceID, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZGY5MzczOWY4NzAwMTU3YWIwODUiLCJpYXQiOjE3NzY0MTA1MTUsImV4cCI6MTc3NzYyMDExNX0.lqS5N5fgyQeDZtZGj9410pzXNU75Ov-dmLkoLsueWTc",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error retrieving product details");
      }
    })
    .then((product) => {
      console.log("PRODUCT DETAILS:", product);

      const spinner = document.getElementById("spinner-section");
      if (spinner) spinner.classList.add("d-none");

      const container = document.getElementById("card-details");
      console.log("Il contenitore esiste?", container);
      if (container) {
        container.innerHTML = `
            <div class="card card-changing borderImg w-50">
              <img src="${product.imageUrl}" class="card-img-top borderImg img-fluid" alt="${product.name}" />
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text text-muted">${product.brand}</p>
                <p class="card-text">${product.description}</p>
                <p class="card-text h4"><strong>${product.price}€</strong></p>
                <div class="d-flex justify-content-center">
                <a href="./homepage.html" class="btn btn-secondary">Back to Home</a>
                </div>
              </div>
            </div>
            `;
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });
};

footerYear();
getDetails();
